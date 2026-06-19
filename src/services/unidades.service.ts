import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { NotFound, Conflict } from "../lib/errors.js";

// ============================================================================
// UNIDADES — inventario filtrable y reserva (separación) atómica
// ============================================================================

export type FiltrosInventario = {
  estado?: "DISPONIBLE" | "RESERVADA" | "VENDIDA";
  precioMin?: number;
  precioMax?: number;
  areaMin?: number;
  areaMax?: number;
  pisoMin?: number;
  dormitorios?: number;
};

export async function inventarioProyecto(proyectoId: string, f: FiltrosInventario) {
  const where: Prisma.UnidadWhereInput = {
    proyectoId,
    ...(f.estado ? { estado: f.estado } : {}),
    ...(f.dormitorios != null ? { dormitorios: f.dormitorios } : {}),
    ...(f.precioMin != null || f.precioMax != null
      ? { precio: { gte: f.precioMin, lte: f.precioMax } }
      : {}),
    ...(f.areaMin != null || f.areaMax != null
      ? { area: { gte: f.areaMin, lte: f.areaMax } }
      : {}),
    ...(f.pisoMin != null ? { piso: { gte: f.pisoMin } } : {}),
  };

  return prisma.unidad.findMany({ where, orderBy: [{ piso: "asc" }, { numero: "asc" }] });
}

/**
 * Reserva una unidad para una oportunidad.
 * Anti doble-booking: el flip DISPONIBLE→RESERVADA es un updateMany condicional;
 * si afecta 0 filas, otra reserva ganó la carrera => 409. Todo en transacción.
 */
export async function reservarUnidad(args: {
  unidadId: string;
  oportunidadId: string;
  montoSeparacion: number;
  vencimiento?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const unidad = await tx.unidad.findUnique({
      where: { id: args.unidadId },
      select: { id: true, estado: true, proyectoId: true },
    });
    if (!unidad) throw NotFound("Unidad");
    if (unidad.estado !== "DISPONIBLE")
      throw Conflict(`La unidad no está disponible (estado: ${unidad.estado})`);

    const opp = await tx.oportunidad.findUnique({
      where: { id: args.oportunidadId },
      select: { id: true, proyectoId: true },
    });
    if (!opp) throw NotFound("Oportunidad");
    if (opp.proyectoId !== unidad.proyectoId)
      throw Conflict("La unidad pertenece a otro proyecto que la oportunidad");

    // Flip atómico condicionado al estado actual.
    const flip = await tx.unidad.updateMany({
      where: { id: args.unidadId, estado: "DISPONIBLE" },
      data: { estado: "RESERVADA" },
    });
    if (flip.count === 0) throw Conflict("La unidad acaba de ser reservada por otro asesor");

    const reserva = await tx.reserva.create({
      data: {
        unidadId: args.unidadId,
        oportunidadId: args.oportunidadId,
        montoSeparacion: new Prisma.Decimal(args.montoSeparacion),
        vencimiento: args.vencimiento,
        estado: "ACTIVA",
      },
    });

    // Reservar mueve el deal a la etapa RESERVA y marca actividad.
    await tx.oportunidad.update({
      where: { id: args.oportunidadId },
      data: { etapa: "RESERVA", ultimaActividad: new Date() },
    });

    return reserva;
  });
}
