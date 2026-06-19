// Tipos compartidos con el backend (Prisma). Solo lo que consume el frontend.

export type EtapaPipeline =
  | "NUEVO"
  | "CONTACTADO"
  | "CALIFICADO"
  | "VISITA_AGENDADA"
  | "PROPUESTA"
  | "NEGOCIACION"
  | "RESERVA"
  | "CERRADO_GANADO"
  | "CERRADO_PERDIDO";

export type TipoCompra = "VIVIENDA" | "INVERSION";
export type TipoInteraccion = "WHATSAPP" | "EMAIL" | "VISITA" | "LLAMADA";
export type FuenteProspecto =
  | "INSTAGRAM"
  | "URBANIA"
  | "WHATSAPP"
  | "REFERIDO"
  | "FERIA"
  | "WEB";

export interface AsesorRef {
  id: string;
  nombre: string;
}

export interface ProyectoRef {
  id: string;
  nombre: string;
  distrito?: string;
}

/** Tarjeta de deal en el pipeline. */
export interface Oportunidad {
  id: string;
  etapa: EtapaPipeline;
  score: number;
  valorEstimado: number | null;
  ultimaActividad: string; // ISO
  prospecto: { id: string; nombre: string; telefono: string; tipoCompra?: TipoCompra };
  proyecto: ProyectoRef;
  asesor?: AsesorRef | null;
  // Derivados / enriquecidos por la API o el cliente:
  diasEnEtapa: number;
  siguienteAccion: string;
}

/** Métricas del encabezado del dashboard. */
export interface DashboardMetrics {
  pipelineTotal: number; // S/ (suma de valorEstimado de deals vivos)
  pipelineDeltaPct: number; // variación vs período anterior
  tasaCierre: number; // 0..1
  tasaCierreDeltaPct: number;
  tiempoPromedioDias: number; // ciclo promedio de cierre
  tiempoPromedioDeltaDias: number;
  enRiesgo: number; // # de deals en riesgo
}

export type TipoAlerta = "CHURN" | "RENOVACION" | "SENAL_CIERRE";

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  prospectoId: string;
  titulo: string;
  detalle: string;
  score: number;
  proyecto: string;
  hace: string; // texto relativo, ej. "hace 3 días"
}

/** Briefing diario generado por Claude. */
export interface DailyBriefing {
  fecha: string; // ISO date
  saludo: string;
  resumen: string;
  prioridades: { titulo: string; razon: string; prospectoId?: string }[];
}

export interface ScoreEvento {
  id: string;
  accion: string;
  puntos: number;
  scoreResultante: number;
  explicacion: string;
  createdAt: string;
}

export type Urgencia = "ALTA" | "MEDIA" | "BAJA";
export type EstadoUnidad =
  | "DISPONIBLE"
  | "NEGOCIACION"
  | "BLOQUEADO"
  | "ENTREGA"
  | "VENDIDA";
export type VistaUnidad = "MAR" | "PARQUE" | "CIUDAD" | "INTERIOR";
export type TipoContacto = "CONYUGE" | "SOCIO" | "FAMILIAR" | "OTRO";
export type EstadoProyecto = "EN_VENTA" | "EN_CONSTRUCCION" | "ENTREGADO";

/** Fila de la lista de prospectos. */
export interface ProspectoListItem {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  fuente: FuenteProspecto;
  tipoCompra: TipoCompra;
  etapa: EtapaPipeline;
  score: number;
  proyecto: string;
  asesor: string;
  valorEstimado: number | null;
  ultimaActividad: string;
}

export interface ContactoAdicional {
  id: string;
  nombre: string;
  relacion: TipoContacto;
  telefono?: string;
  email?: string;
}

export interface InteraccionItem {
  id: string;
  tipo: TipoInteraccion;
  fecha: string;
  resumen: string;
  asesor: string;
  senalCierre?: boolean; // resaltada en amarillo
}

export interface UnidadInteres {
  id: string;
  numero: string;
  piso: number;
  area: number;
  precio: number;
  estado: EstadoUnidad;
  vista: VistaUnidad;
}

export interface Calificacion {
  tipoCompra: TipoCompra;
  presupuesto: number | null;
  hipotecaPreAprobada: boolean;
  hipotecaVenceEl?: string | null;
  urgencia: Urgencia;
  fechaMudanzaEst?: string | null;
}

/** Perfil 360° de un prospecto. */
export interface ProspectoDetalle {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  fuente: FuenteProspecto;
  oportunidadId: string;
  etapa: EtapaPipeline;
  proyecto: ProyectoRef;
  asesor: AsesorRef;
  score: number;
  scoreExplicacion: string;
  scoreHistorial: number[]; // sparkline
  calificacion: Calificacion;
  contactos: ContactoAdicional[];
  unidadesInteres: UnidadInteres[];
  interacciones: InteraccionItem[];
}

/** Proyecto en la grilla de proyectos. */
export interface Proyecto {
  id: string;
  nombre: string;
  distrito: string;
  estado: EstadoProyecto;
  avanceObra: number;
  fechaEntrega: string | null;
  totalUnidades: number;
  disponibles: number;
  reservadas: number;
  vendidas: number;
  ticketDesde: number; // USD
}

/** Unidad en el inventario / planta del edificio. */
export interface Unidad {
  id: string;
  piso: number;
  numero: string;
  area: number;
  dormitorios: number;
  banos: number;
  precio: number; // USD
  estado: EstadoUnidad;
  vista: VistaUnidad;
  tieneTerraza: boolean;
  estacionamientos: number;
  interesados: number;
  tipologia: string;
  tienePlano: boolean;
  propietario?: string; // visible solo para backoffice
}
