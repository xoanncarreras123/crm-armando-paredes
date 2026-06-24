import type { EtapaPipeline, TipoCompra } from "./Prospecto";
import type { AsesorRef, ProyectoRef } from "./Prospecto";

export interface Oportunidad {
  id: string;
  etapa: EtapaPipeline;
  score: number;
  valorEstimado: number | null;
  ultimaActividad: string;
  diasEnEtapa: number;
  siguienteAccion: string;
  prospecto: { id: string; nombre: string; telefono: string; tipoCompra?: TipoCompra };
  proyecto: ProyectoRef;
  asesor?: AsesorRef | null;
}

export interface DashboardMetrics {
  pipelineTotal: number;
  pipelineDeltaPct: number;
  tasaCierre: number;
  tasaCierreDeltaPct: number;
  tiempoPromedioDias: number;
  tiempoPromedioDeltaDias: number;
  enRiesgo: number;
}
