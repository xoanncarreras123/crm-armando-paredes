import {
  Prisma,
  type EtapaPipeline,
  type FuenteProspecto,
  type TipoCompra,
} from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { NotFound } from "../lib/errors.js";

// ============================================================================
// PROSPECTOS — alta, listado con filtros de pipeline, perfil 360°, etapa
// ============================================================================

export type CrearProspectoInput = {
  nombre: string;
  email?: string;
  telefono: string;
  fuente: FuenteProspecto;
  tipoCompra?: TipoCompra;
  presupuesto?: number;
  hipotecaPreAprobada?: boolean;
  hipotecaVenceEl?: Date;
  fechaMudanzaEst?: Date;
  // Si llega proyectoId, abrimos la oportunidad de una vez (lead → deal).
  proyectoId?: string;
  asesorId?: string;
};

export async function crearProspecto(input: CrearProspectoInput) {
  const { proyectoId, asesorId, ...datos } = input;

  return prisma.prospecto.create({
    data: {
      ...datos,
      presupuesto: datos.presupuesto != null ? new Prisma.Decimal(datos.presupuesto) : undefined,
      ...(proyectoId
        ? {
            oportunidades: {
              create: { proyectoId, asesorId, etapa: "NUEVO", ultimaActividad: new Date() },
            },
          }
        : {}),
    },
    include: { oportunidades: { select: { id: true, etapa: true, proyectoId: true } } },
  });
}

export type ListarFiltros = {
  etapa?: EtapaPipeline;
  scoreMin?: number;
  asesorId?: string;
  proyectoId?: string;
  fuente?: FuenteProspecto;
  page?: number;
  pageSize?: number;
};

/**
 * Lista prospectos que tengan al menos una oportunidad que cumpla los filtros
 * de pipeline (etapa/score/asesor/proyecto). Devuelve la oportunidad relevante.
 */
export async function listarProspectos(f: ListarFiltros) {
  const page = Math.max(1, f.page ?? 1);
  const pageSize = Math.min(100, f.pageSize ?? 20);

  // Condición sobre las oportunidades del prospecto.
  const oppWhere: Prisma.OportunidadWhereInput = {
    ...(f.etapa ? { etapa: f.etapa } : {}),
    ...(f.scoreMin != null ? { score: { gte: f.scoreMin } } : {}),
    ...(f.asesorId ? { asesorId: f.asesorId } : {}),
    ...(f.proyectoId ? { proyectoId: f.proyectoId } : {}),
  };
  const hayFiltroOpp = Object.keys(oppWhere).length > 0;

  const where: Prisma.ProspectoWhereInput = {
    ...(f.fuente ? { fuente: f.fuente } : {}),
    ...(hayFiltroOpp ? { oportunidades: { some: oppWhere } } : {}),
  };

  const [total, data] = await Promise.all([
    prisma.prospecto.count({ where }),
    prisma.prospecto.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        fuente: true,
        tipoCompra: true,
        oportunidades: {
          where: hayFiltroOpp ? oppWhere : undefined,
          orderBy: { score: "desc" },
          take: 1,
          select: {
            id: true,
            etapa: true,
            score: true,
            ultimaActividad: true,
            proyecto: { select: { id: true, nombre: true } },
            asesor: { select: { id: true, nombre: true } },
          },
        },
      },
    }),
  ]);

  return { page, pageSize, total, totalPages: Math.ceil(total / pageSize), data };
}

/** Perfil 360°: contactos, interacciones, historial de score, unidades de interés. */
export async function perfil360(id: string) {
  const prospecto = await prisma.prospecto.findUnique({
    where: { id },
    include: {
      contactos: true,
      interacciones: {
        orderBy: { fecha: "desc" },
        take: 50,
        include: { asesor: { select: { id: true, nombre: true } } },
      },
      scoreEventos: { orderBy: { createdAt: "desc" }, take: 50 },
      oportunidades: {
        include: {
          proyecto: { select: { id: true, nombre: true, distrito: true } },
          asesor: { select: { id: true, nombre: true } },
          unidadesInteres: {
            select: { id: true, numero: true, piso: true, precio: true, estado: true, vista: true },
          },
          reservas: { select: { id: true, estado: true, montoSeparacion: true, unidadId: true } },
        },
      },
      referidosHechos: { select: { id: true, referidoNuevoId: true, estadoIncentivo: true } },
    },
  });
  if (!prospecto) throw NotFound("Prospecto");
  return prospecto;
}

/** Mueve una oportunidad del prospecto a otra etapa del pipeline. */
export async function moverEtapa(
  prospectoId: string,
  args: { oportunidadId: string; etapa: EtapaPipeline; motivoPerdida?: string },
) {
  const opp = await prisma.oportunidad.findFirst({
    where: { id: args.oportunidadId, prospectoId },
    select: { id: true },
  });
  if (!opp) throw NotFound("Oportunidad del prospecto");

  return prisma.oportunidad.update({
    where: { id: opp.id },
    data: {
      etapa: args.etapa,
      ultimaActividad: new Date(),
      motivoPerdida: args.etapa === "CERRADO_PERDIDO" ? args.motivoPerdida ?? null : null,
    },
    include: { proyecto: { select: { nombre: true } } },
  });
}
