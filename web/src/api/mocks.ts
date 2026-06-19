import type {
  Alerta,
  DailyBriefing,
  DashboardMetrics,
  Oportunidad,
} from "./types";

// Data de desarrollo: realista, peruana, para renderizar sin backend.
// Se activa con VITE_USE_MOCKS=true (default en dev).

export const mockMetrics: DashboardMetrics = {
  pipelineTotal: 4_820_000,
  pipelineDeltaPct: 0.12,
  tasaCierre: 0.24,
  tasaCierreDeltaPct: 0.03,
  tiempoPromedioDias: 38,
  tiempoPromedioDeltaDias: -4,
  enRiesgo: 3,
};

export const mockBriefing: DailyBriefing = {
  fecha: new Date().toISOString(),
  saludo: "Buenos días, Camila",
  resumen:
    "Tienes 3 deals que mueven aguja hoy. Gonzalo está listo para cerrar Torre Basadre — la separación vence el jueves. Patricia se enfrió: 30 días sin contacto sobre un deal de US$540K. Y hay una señal de cierre fresca de Andrés.",
  prioridades: [
    {
      titulo: "Cerrar a Gonzalo Ferreyros — Torre Basadre 1201",
      razon: "Score 87, hipoteca aprobada y separación por vencer. Llamar antes de mediodía.",
      prospectoId: "p1",
    },
    {
      titulo: "Rescatar a Patricia Zegarra — Malecón 28",
      razon: "Deal de US$540K en negociación, 30 días sin actividad. Riesgo alto de fuga.",
      prospectoId: "p2",
    },
    {
      titulo: "Atender señal de cierre de Andrés Cáceres",
      razon: "Preguntó por formas de pago y escrituras ayer por WhatsApp. Está listo para avanzar.",
      prospectoId: "p3",
    },
  ],
};

const dias = (n: number) =>
  new Date(Date.now() - n * 86_400_000).toISOString();

export const mockPipeline: Oportunidad[] = [
  {
    id: "o1",
    etapa: "RESERVA",
    score: 87,
    valorEstimado: 685_000,
    ultimaActividad: dias(1),
    prospecto: { id: "p1", nombre: "Gonzalo Ferreyros", telefono: "+51991234567", tipoCompra: "VIVIENDA" },
    proyecto: { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    diasEnEtapa: 4,
    siguienteAccion: "Confirmar firma de separación",
  },
  {
    id: "o2",
    etapa: "NEGOCIACION",
    score: 64,
    valorEstimado: 540_000,
    ultimaActividad: dias(30),
    prospecto: { id: "p2", nombre: "Patricia Zegarra", telefono: "+51956778990", tipoCompra: "INVERSION" },
    proyecto: { id: "pr2", nombre: "Malecón 28", distrito: "Barranco" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    diasEnEtapa: 30,
    siguienteAccion: "Reactivar — 30 días sin contacto",
  },
  {
    id: "o3",
    etapa: "CALIFICADO",
    score: 41,
    valorEstimado: 268_000,
    ultimaActividad: dias(2),
    prospecto: { id: "p3", nombre: "Andrés Cáceres", telefono: "+51944556677", tipoCompra: "VIVIENDA" },
    proyecto: { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro" },
    asesor: { id: "a2", nombre: "Rodrigo Velarde" },
    diasEnEtapa: 6,
    siguienteAccion: "Enviar cotización del 301",
  },
  {
    id: "o4",
    etapa: "PROPUESTA",
    score: 72,
    valorEstimado: 420_000,
    ultimaActividad: dias(3),
    prospecto: { id: "p4", nombre: "Lucía Mendiola", telefono: "+51987001122", tipoCompra: "VIVIENDA" },
    proyecto: { id: "pr1", nombre: "Torre Basadre", distrito: "San Isidro" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    diasEnEtapa: 9,
    siguienteAccion: "Agendar 2da visita con la pareja",
  },
  {
    id: "o5",
    etapa: "NUEVO",
    score: 18,
    valorEstimado: 312_000,
    ultimaActividad: dias(0),
    prospecto: { id: "p5", nombre: "Diego Salcedo", telefono: "+51999887766", tipoCompra: "INVERSION" },
    proyecto: { id: "pr3", nombre: "Pardo Business Center", distrito: "Miraflores" },
    asesor: { id: "a2", nombre: "Rodrigo Velarde" },
    diasEnEtapa: 1,
    siguienteAccion: "Primer contacto por WhatsApp",
  },
  {
    id: "o6",
    etapa: "NUEVO",
    score: 33,
    valorEstimado: 295_000,
    ultimaActividad: dias(1),
    prospecto: { id: "p6", nombre: "Valeria Contreras", telefono: "+51955443322", tipoCompra: "VIVIENDA" },
    proyecto: { id: "pr2", nombre: "Malecón 28", distrito: "Barranco" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    diasEnEtapa: 2,
    siguienteAccion: "Calificar presupuesto y plazo",
  },
  {
    id: "o7",
    etapa: "PROPUESTA",
    score: 58,
    valorEstimado: 798_000,
    ultimaActividad: dias(5),
    prospecto: { id: "p7", nombre: "Martín Higa", telefono: "+51961224488", tipoCompra: "VIVIENDA" },
    proyecto: { id: "pr2", nombre: "Malecón 28", distrito: "Barranco" },
    asesor: { id: "a1", nombre: "Camila Rebaza" },
    diasEnEtapa: 12,
    siguienteAccion: "Seguimiento a propuesta del PH",
  },
];

export const mockAlertas: Alerta[] = [
  {
    id: "al1",
    tipo: "SENAL_CIERRE",
    prospectoId: "p3",
    titulo: "Andrés Cáceres preguntó por escrituras",
    detalle: '"¿Qué documentos necesito para firmar?" — vía WhatsApp',
    score: 41,
    proyecto: "Torre Basadre",
    hace: "hace 14 h",
  },
  {
    id: "al2",
    tipo: "CHURN",
    prospectoId: "p2",
    titulo: "Patricia Zegarra en riesgo de fuga",
    detalle: "30 días sin actividad en un deal de US$540K",
    score: 64,
    proyecto: "Malecón 28",
    hace: "hace 30 días",
  },
  {
    id: "al3",
    tipo: "RENOVACION",
    prospectoId: "p1",
    titulo: "Separación de Gonzalo por vencer",
    detalle: "La hipoteca pre-aprobada vence el jueves",
    score: 87,
    proyecto: "Torre Basadre",
    hace: "vence en 2 días",
  },
];
