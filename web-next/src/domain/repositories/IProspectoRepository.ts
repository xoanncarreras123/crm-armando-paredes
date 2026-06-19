import type { ProspectoListItem, ProspectoDetalle } from "../entities/Prospecto";
import type { Oportunidad, DashboardMetrics } from "../entities/Oportunidad";

export interface IProspectoRepository {
  listar(): Promise<ProspectoListItem[]>;
  obtener(id: string): Promise<ProspectoDetalle>;
}

export interface IOportunidadRepository {
  listar(): Promise<Oportunidad[]>;
  metricas(): Promise<DashboardMetrics>;
  actualizarEtapa(id: string, etapa: string): Promise<void>;
}
