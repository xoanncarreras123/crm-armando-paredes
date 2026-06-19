import type {
  EstadoUnidad,
  ProspectoDetalle,
  ProspectoListItem,
  Proyecto,
  Unidad,
} from "./types";

const dias = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const enDias = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

export const mockProspectos: ProspectoListItem[] = [
  { id: "p1", nombre: "Gonzalo Ferreyros", telefono: "+51991234567", email: "gferreyros@gmail.com", fuente: "INSTAGRAM", tipoCompra: "VIVIENDA", etapa: "RESERVA", score: 87, proyecto: "Torre Basadre", asesor: "Camila Rebaza", valorEstimado: 685_000, ultimaActividad: dias(1) },
  { id: "p2", nombre: "Patricia Zegarra", telefono: "+51956778990", email: "pzegarra@outlook.com", fuente: "URBANIA", tipoCompra: "INVERSION", etapa: "NEGOCIACION", score: 64, proyecto: "Malecón 28", asesor: "Camila Rebaza", valorEstimado: 540_000, ultimaActividad: dias(30) },
  { id: "p3", nombre: "Andrés Cáceres", telefono: "+51944556677", email: "acaceres@gmail.com", fuente: "REFERIDO", tipoCompra: "VIVIENDA", etapa: "CALIFICADO", score: 41, proyecto: "Torre Basadre", asesor: "Rodrigo Velarde", valorEstimado: 268_000, ultimaActividad: dias(2) },
  { id: "p4", nombre: "Lucía Mendiola", telefono: "+51987001122", email: "lmendiola@gmail.com", fuente: "FERIA", tipoCompra: "VIVIENDA", etapa: "PROPUESTA", score: 72, proyecto: "Torre Basadre", asesor: "Camila Rebaza", valorEstimado: 420_000, ultimaActividad: dias(3) },
  { id: "p5", nombre: "Diego Salcedo", telefono: "+51999887766", fuente: "WEB", tipoCompra: "INVERSION", etapa: "NUEVO", score: 18, proyecto: "Pardo Business Center", asesor: "Rodrigo Velarde", valorEstimado: 312_000, ultimaActividad: dias(0) },
  { id: "p6", nombre: "Valeria Contreras", telefono: "+51955443322", email: "vcontreras@gmail.com", fuente: "WHATSAPP", tipoCompra: "VIVIENDA", etapa: "NUEVO", score: 33, proyecto: "Malecón 28", asesor: "Camila Rebaza", valorEstimado: 295_000, ultimaActividad: dias(1) },
  { id: "p7", nombre: "Martín Higa", telefono: "+51961224488", email: "mhiga@gmail.com", fuente: "INSTAGRAM", tipoCompra: "VIVIENDA", etapa: "PROPUESTA", score: 58, proyecto: "Malecón 28", asesor: "Camila Rebaza", valorEstimado: 798_000, ultimaActividad: dias(5) },
];

const detalle: Record<string, ProspectoDetalle> = {
  p1: {
    id: "p1",
    nombre: "Gonzalo Ferreyros",
    telefono: "+51991234567",
    email: "gferreyros@gmail.com",
    fuente: "INSTAGRAM",
    oportunidadId: "o1",
    etapa: "RESERVA",
    proyecto: { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    score: 87,
    scoreExplicacion:
      "Score muy alto: hipoteca pre-aprobada (+30), visita con su esposa (co-decisora, +25) y respuestas rápidas. El único riesgo es que la pre-aprobación vence en 2 días — cerrar esta semana.",
    scoreHistorial: [20, 28, 45, 52, 60, 60, 87],
    calificacion: {
      tipoCompra: "VIVIENDA",
      presupuesto: 700_000,
      hipotecaPreAprobada: true,
      hipotecaVenceEl: enDias(2),
      urgencia: "ALTA",
      fechaMudanzaEst: enDias(300),
    },
    contactos: [
      { id: "c1", nombre: "María José Ferreyros", relacion: "CONYUGE", telefono: "+51991234568", email: "mjferreyros@gmail.com" },
    ],
    unidadesInteres: [
      { id: "u1", numero: "1201", piso: 12, area: 142.5, precio: 685_000, estado: "BLOQUEADO", vista: "PARQUE" },
    ],
    interacciones: [
      { id: "i1", tipo: "WHATSAPP", fecha: dias(1), resumen: "Preguntó por el cronograma de pagos y la fecha de escritura.", asesor: "Camila Rebaza", senalCierre: true },
      { id: "i2", tipo: "VISITA", fecha: dias(8), resumen: "Visita al depto piloto con su esposa. Muy interesados en la terraza y la vista al parque.", asesor: "Camila Rebaza" },
      { id: "i3", tipo: "LLAMADA", fecha: dias(12), resumen: "Confirmó hipoteca pre-aprobada con el BCP por US$550K.", asesor: "Camila Rebaza" },
      { id: "i4", tipo: "WHATSAPP", fecha: dias(20), resumen: "Solicitó brochure y lista de precios del piso 12.", asesor: "Camila Rebaza" },
      { id: "i5", tipo: "EMAIL", fecha: dias(27), resumen: "Primer contacto desde campaña de Instagram. Pidió información general.", asesor: "Camila Rebaza" },
    ],
  },
  p3: {
    id: "p3",
    nombre: "Andrés Cáceres",
    telefono: "+51944556677",
    email: "acaceres@gmail.com",
    fuente: "REFERIDO",
    oportunidadId: "o3",
    etapa: "CALIFICADO",
    proyecto: { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro" },
    asesor: { id: "a2", nombre: "Rodrigo Velarde" },
    score: 41,
    scoreExplicacion:
      "Score templado en ascenso: ayer preguntó por formas de pago y escrituras (+15) — señal de cierre. Referido por Gonzalo Ferreyros. Aún no tiene financiamiento resuelto.",
    scoreHistorial: [10, 15, 22, 26, 30, 35, 41],
    calificacion: {
      tipoCompra: "VIVIENDA",
      presupuesto: 300_000,
      hipotecaPreAprobada: false,
      urgencia: "MEDIA",
      fechaMudanzaEst: enDias(380),
    },
    contactos: [],
    unidadesInteres: [
      { id: "u3", numero: "301", piso: 3, area: 76, precio: 268_000, estado: "DISPONIBLE", vista: "INTERIOR" },
    ],
    interacciones: [
      { id: "i6", tipo: "WHATSAPP", fecha: dias(1), resumen: "¿Qué documentos necesito para firmar? ¿Aceptan crédito hipotecario?", asesor: "Rodrigo Velarde", senalCierre: true },
      { id: "i7", tipo: "VISITA", fecha: dias(6), resumen: "Visitó el 301. Le preocupa el presupuesto pero le gustó la zona.", asesor: "Rodrigo Velarde" },
      { id: "i8", tipo: "WHATSAPP", fecha: dias(10), resumen: "Llegó referido por Gonzalo Ferreyros. Pidió ver opciones de 1 dormitorio.", asesor: "Rodrigo Velarde" },
    ],
  },
};

export function getProspectoDetalle(id: string): ProspectoDetalle {
  return detalle[id] ?? { ...detalle.p1, id, nombre: mockProspectos.find((p) => p.id === id)?.nombre ?? "Prospecto" };
}

export const mockProyectos: Proyecto[] = [
  { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro", estado: "EN_VENTA", avanceObra: 45, fechaEntrega: "2027-03-31", totalUnidades: 48, disponibles: 24, reservadas: 12, vendidas: 12, ticketDesde: 268_000 },
  { id: "pr2", nombre: "Malecón 28", distrito: "Barranco", estado: "EN_CONSTRUCCION", avanceObra: 20, fechaEntrega: "2027-12-15", totalUnidades: 24, disponibles: 12, reservadas: 6, vendidas: 6, ticketDesde: 540_000 },
  { id: "pr3", nombre: "Pardo Business Center", distrito: "Miraflores", estado: "ENTREGADO", avanceObra: 100, fechaEntrega: "2025-09-01", totalUnidades: 12, disponibles: 6, reservadas: 3, vendidas: 3, ticketDesde: 312_000 },
];

// ---- Generador de inventario por edificio (USD base) ----
const VISTAS = ["PARQUE", "CIUDAD", "INTERIOR", "MAR"] as const;
const TIPOLOGIA: Record<number, string> = {
  1: "Flat 1 dorm",
  2: "Flat 2 dorm",
  3: "Flat 3 dorm",
};
// Ciclo de estados determinista: mayoría disponible, con mezcla realista.
const CICLO_ESTADO: EstadoUnidad[] = [
  "DISPONIBLE", "DISPONIBLE", "VENDIDA", "DISPONIBLE", "NEGOCIACION",
  "DISPONIBLE", "VENDIDA", "BLOQUEADO", "DISPONIBLE", "ENTREGA",
  "DISPONIBLE", "VENDIDA",
];
const PROPIETARIOS = [
  "Inmobiliaria GP7 SAC", "Fondo Larcomar", "C. Ferreyros", "J. Manchego",
  "R. Castillo", "—",
];

interface GenOpts {
  prefix: string;
  pisoIni: number;
  pisos: number;
  perFloor: number;
  basePrecio: number; // USD para 1 dorm en el piso más bajo
}

function genEdificio({ prefix, pisoIni, pisos, perFloor, basePrecio }: GenOpts): Unidad[] {
  const out: Unidad[] = [];
  let idx = 0;
  for (let p = 0; p < pisos; p++) {
    const piso = pisoIni + p;
    for (let j = 0; j < perFloor; j++) {
      const suf = String(j + 1).padStart(2, "0");
      const dorm = j === 0 ? 3 : j === perFloor - 1 ? 1 : 2;
      const area = dorm === 3 ? 138 + (p % 3) * 4 : dorm === 2 ? 92 + (p % 3) * 3 : 58 + (p % 2) * 4;
      const estado = CICLO_ESTADO[idx % CICLO_ESTADO.length];
      const precio = Math.round(
        (basePrecio + (dorm - 1) * 110_000 + piso * 5_200) / 1000,
      ) * 1000;
      out.push({
        id: `${prefix}-${piso}${suf}`,
        piso,
        numero: `${piso}${suf}`,
        area,
        dormitorios: dorm,
        banos: dorm === 1 ? 1 : dorm === 2 ? 2 : 3,
        precio,
        estado,
        vista: VISTAS[(j + p) % VISTAS.length],
        tieneTerraza: j === 0 || p === pisos - 1,
        estacionamientos: dorm >= 2 ? 2 : 1,
        interesados: estado === "DISPONIBLE" ? (idx * 3) % 5 : 0,
        tipologia: p === pisos - 1 ? "Penthouse" : TIPOLOGIA[dorm],
        tienePlano: idx % 3 === 0,
        propietario: estado === "VENDIDA" ? PROPIETARIOS[idx % PROPIETARIOS.length] : undefined,
      });
      idx++;
    }
  }
  return out;
}

export const mockUnidades: Record<string, Unidad[]> = {
  pr1: genEdificio({ prefix: "pr1", pisoIni: 3, pisos: 12, perFloor: 4, basePrecio: 200_000 }),
  pr2: genEdificio({ prefix: "pr2", pisoIni: 2, pisos: 8, perFloor: 3, basePrecio: 320_000 }),
  pr3: genEdificio({ prefix: "pr3", pisoIni: 5, pisos: 6, perFloor: 2, basePrecio: 260_000 }),
};
