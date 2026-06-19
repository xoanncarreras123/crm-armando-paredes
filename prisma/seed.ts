import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 usa driver adapters en runtime.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Sembrando CRM Armando Paredes...");

  // Idempotencia para entornos de desarrollo (orden inverso por FKs).
  await prisma.venta.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.referido.deleteMany();
  await prisma.scoreEvento.deleteMany();
  await prisma.interaccion.deleteMany();
  await prisma.oportunidad.deleteMany();
  await prisma.contactoAdicional.deleteMany();
  await prisma.prospecto.deleteMany();
  await prisma.unidad.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.asesor.deleteMany();

  // ----------------------------------------------------------------------
  // ASESORES
  // ----------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("password123", 10); // demo — cambiar en prod

  const camila = await prisma.asesor.create({
    data: {
      nombre: "Camila Rebaza Higa",
      email: "camila.rebaza@armandoparedes.pe",
      telefono: "+51 987 654 321",
      passwordHash,
    },
  });

  const rodrigo = await prisma.asesor.create({
    data: {
      nombre: "Rodrigo Velarde Mendoza",
      email: "rodrigo.velarde@armandoparedes.pe",
      telefono: "+51 999 112 233",
      passwordHash,
    },
  });

  // ----------------------------------------------------------------------
  // SEED 1 — Proyecto de vivienda en San Isidro (EN_VENTA)
  // ----------------------------------------------------------------------
  const torreBasadre = await prisma.proyecto.create({
    data: {
      nombre: "Torre Basadre",
      linea: "VENTA_VIVIENDA",
      distrito: "San Isidro",
      direccion: "Av. Jorge Basadre 350, San Isidro",
      estado: "EN_VENTA",
      fechaEntrega: new Date("2027-03-31"),
      avanceObra: 45,
      asesores: { connect: [{ id: camila.id }, { id: rodrigo.id }] },
      unidades: {
        create: [
          {
            piso: 12,
            numero: "1201",
            area: 142.5,
            dormitorios: 3,
            banos: 3,
            precio: 685000,
            estado: "DISPONIBLE",
            vista: "PARQUE",
            tieneTerraza: true,
            estacionamientos: 2,
          },
          {
            piso: 8,
            numero: "801",
            area: 98.0,
            dormitorios: 2,
            banos: 2,
            precio: 420000,
            estado: "RESERVADA",
            vista: "CIUDAD",
            estacionamientos: 1,
          },
          {
            piso: 3,
            numero: "301",
            area: 76.0,
            dormitorios: 1,
            banos: 1,
            precio: 268000,
            estado: "DISPONIBLE",
            vista: "INTERIOR",
            estacionamientos: 1,
          },
        ],
      },
    },
    include: { unidades: true },
  });

  // ----------------------------------------------------------------------
  // SEED 2 — Proyecto frente al mar en Barranco (EN_CONSTRUCCION)
  // ----------------------------------------------------------------------
  const maleconBarranco = await prisma.proyecto.create({
    data: {
      nombre: "Malecón 28",
      linea: "VENTA_VIVIENDA",
      distrito: "Barranco",
      direccion: "Malecón Paul Harris 280, Barranco",
      estado: "EN_CONSTRUCCION",
      fechaEntrega: new Date("2027-12-15"),
      avanceObra: 20,
      asesores: { connect: [{ id: camila.id }] },
      unidades: {
        create: [
          {
            piso: 9,
            numero: "PH-A",
            area: 210.0,
            dormitorios: 4,
            banos: 4,
            precio: 798000,
            estado: "DISPONIBLE",
            vista: "MAR",
            tieneTerraza: true,
            estacionamientos: 3,
          },
          {
            piso: 5,
            numero: "502",
            area: 120.0,
            dormitorios: 3,
            banos: 2,
            precio: 540000,
            estado: "DISPONIBLE",
            vista: "MAR",
            tieneTerraza: true,
            estacionamientos: 2,
          },
        ],
      },
    },
    include: { unidades: true },
  });

  // ----------------------------------------------------------------------
  // SEED 3 — Edificio de oficinas en Miraflores (renta, ENTREGADO)
  // ----------------------------------------------------------------------
  await prisma.proyecto.create({
    data: {
      nombre: "Pardo Business Center",
      linea: "RENTA_INMOBILIARIA",
      distrito: "Miraflores",
      direccion: "Av. José Pardo 1200, Miraflores",
      estado: "ENTREGADO",
      fechaEntrega: new Date("2025-09-01"),
      avanceObra: 100,
      asesores: { connect: [{ id: rodrigo.id }] },
      unidades: {
        create: [
          {
            piso: 7,
            numero: "OF-701",
            area: 185.0,
            dormitorios: 0,
            banos: 2,
            precio: 312000,
            estado: "VENDIDA",
            vista: "CIUDAD",
            estacionamientos: 4,
          },
        ],
      },
    },
  });

  // ----------------------------------------------------------------------
  // PROSPECTOS + cadena comercial completa
  // ----------------------------------------------------------------------

  // Prospecto A — comprador de vivienda caliente (alto score)
  const prospectoA = await prisma.prospecto.create({
    data: {
      nombre: "Gonzalo Ferreyros Llosa",
      email: "gferreyros@gmail.com",
      telefono: "+51 991 234 567",
      fuente: "INSTAGRAM",
      tipoCompra: "VIVIENDA",
      presupuesto: 700000,
      hipotecaPreAprobada: true,
      hipotecaVenceEl: new Date("2026-06-25"), // vence pronto → dispara alerta
      fechaMudanzaEst: new Date("2027-04-30"),
      contactos: {
        create: [
          {
            nombre: "María José Ferreyros (esposa)",
            email: "mjferreyros@gmail.com",
            telefono: "+51 991 234 568",
            relacion: "CONYUGE",
          },
        ],
      },
    },
  });

  const oportunidadA = await prisma.oportunidad.create({
    data: {
      prospectoId: prospectoA.id,
      proyectoId: torreBasadre.id,
      asesorId: camila.id,
      etapa: "RESERVA",
      score: 87,
      valorEstimado: 685000,
      ultimaActividad: new Date(),
      unidadesInteres: { connect: [{ id: torreBasadre.unidades[0].id }] },
    },
  });

  await prisma.interaccion.createMany({
    data: [
      {
        prospectoId: prospectoA.id,
        oportunidadId: oportunidadA.id,
        asesorId: camila.id,
        tipo: "WHATSAPP",
        resumen: "Solicitó brochure y precios del piso 12 con vista al parque.",
        fecha: new Date("2026-05-20"),
      },
      {
        prospectoId: prospectoA.id,
        oportunidadId: oportunidadA.id,
        asesorId: camila.id,
        tipo: "VISITA",
        resumen: "Visita a depto piloto con la esposa. Muy interesados en la terraza.",
        fecha: new Date("2026-06-02"),
      },
    ],
  });

  await prisma.scoreEvento.createMany({
    data: [
      {
        prospectoId: prospectoA.id,
        oportunidadId: oportunidadA.id,
        accion: "Hipoteca pre-aprobada",
        puntos: 25,
        scoreResultante: 60,
        explicacion: "El cliente ya cuenta con financiamiento aprobado por el BCP; reduce fricción de cierre.",
      },
      {
        prospectoId: prospectoA.id,
        oportunidadId: oportunidadA.id,
        accion: "Asistió a visita con cónyuge",
        puntos: 27,
        scoreResultante: 87,
        explicacion: "Visita presencial con quien co-decide la compra: señal fuerte de intención real.",
      },
    ],
  });

  // Reserva + Venta sobre la unidad 801 (RESERVADA)
  const reservaA = await prisma.reserva.create({
    data: {
      oportunidadId: oportunidadA.id,
      unidadId: torreBasadre.unidades[1].id,
      montoSeparacion: 5000,
      vencimiento: new Date("2026-07-15"),
      estado: "CONVERTIDA",
    },
  });

  await prisma.venta.create({
    data: {
      reservaId: reservaA.id,
      precioFinal: 415000,
      formaPago: "CREDITO_HIPOTECARIO",
      fechaEscritura: new Date("2026-06-10"),
    },
  });

  // Prospecto B — inversionista, deal en riesgo (sin actividad reciente)
  const prospectoB = await prisma.prospecto.create({
    data: {
      nombre: "Patricia Zegarra Ríos",
      email: "pzegarra@outlook.com",
      telefono: "+51 956 778 990",
      fuente: "URBANIA",
      tipoCompra: "INVERSION",
      presupuesto: 550000,
      hipotecaPreAprobada: false,
      fechaMudanzaEst: null,
      oportunidades: {
        create: {
          proyectoId: maleconBarranco.id,
          asesorId: camila.id,
          etapa: "NEGOCIACION",
          score: 64,
          valorEstimado: 540000,
          ultimaActividad: new Date("2026-05-01"), // >30 días → en riesgo
          unidadesInteres: { connect: [{ id: maleconBarranco.unidades[1].id }] },
        },
      },
    },
  });

  await prisma.interaccion.create({
    data: {
      prospectoId: prospectoB.id,
      asesorId: camila.id,
      tipo: "LLAMADA",
      resumen: "Pidió tiempo para evaluar rentabilidad de alquiler vs. otro proyecto.",
      fecha: new Date("2026-05-01"),
    },
  });

  // Prospecto C — referido por el prospecto A
  const prospectoC = await prisma.prospecto.create({
    data: {
      nombre: "Andrés Cáceres Pinto",
      email: "acaceres@gmail.com",
      telefono: "+51 944 556 677",
      fuente: "REFERIDO",
      tipoCompra: "VIVIENDA",
      presupuesto: 300000,
      hipotecaPreAprobada: false,
      fechaMudanzaEst: new Date("2027-06-30"),
      oportunidades: {
        create: {
          proyectoId: torreBasadre.id,
          asesorId: rodrigo.id,
          etapa: "CALIFICADO",
          score: 35,
          valorEstimado: 268000,
          ultimaActividad: new Date("2026-06-11"),
          unidadesInteres: { connect: [{ id: torreBasadre.unidades[2].id }] },
        },
      },
    },
  });

  await prisma.referido.create({
    data: {
      referidoPorId: prospectoA.id,
      referidoNuevoId: prospectoC.id,
      proyectoId: torreBasadre.id,
      incentivo: 3000,
      estadoIncentivo: "PENDIENTE",
    },
  });

  console.log("✅ Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
