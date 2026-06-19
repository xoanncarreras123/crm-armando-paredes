export type EtapaPipeline =
  | "NUEVO" | "CONTACTADO" | "CALIFICADO" | "VISITA_AGENDADA"
  | "PROPUESTA" | "NEGOCIACION" | "RESERVA"
  | "CERRADO_GANADO" | "CERRADO_PERDIDO";

export type TipoCompra = "VIVIENDA" | "INVERSION";
export type TipoInteraccion = "WHATSAPP" | "EMAIL" | "VISITA" | "LLAMADA";
export type FuenteProspecto =
  | "INSTAGRAM" | "URBANIA" | "WHATSAPP" | "REFERIDO" | "FERIA" | "WEB";
export type Urgencia = "ALTA" | "MEDIA" | "BAJA";

export interface ProyectoRef { id: string; nombre: string; distrito?: string; }
export interface AsesorRef   { id: string; nombre: string; }

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
  ultimaActividad: string; // ISO
}

export interface Calificacion {
  tipoCompra: TipoCompra;
  presupuesto: number;
  hipotecaPreAprobada: boolean;
  hipotecaVenceEl?: string;
  urgencia: Urgencia;
  fechaMudanzaEst?: string;
}

export interface ContactoAdicional {
  id: string;
  nombre: string;
  relacion: "CONYUGE" | "SOCIO" | "FAMILIAR" | "OTRO";
  telefono?: string;
  email?: string;
}

export interface Interaccion {
  id: string;
  tipo: TipoInteraccion;
  fecha: string;
  resumen: string;
  asesor: string;
  senalCierre?: boolean;
}

export interface UnidadRef {
  id: string;
  numero: string;
  piso: number;
  area: number;
  precio: number;
  estado: string;
  vista?: string;
}

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
  scoreHistorial: number[];
  calificacion: Calificacion;
  contactos: ContactoAdicional[];
  unidadesInteres: UnidadRef[];
  interacciones: Interaccion[];
}
