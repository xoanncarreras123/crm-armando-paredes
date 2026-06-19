import type { IOportunidadRepository } from "@/domain/repositories/IProspectoRepository";
import type { Oportunidad, DashboardMetrics } from "@/domain/entities/Oportunidad";
import type { EtapaPipeline } from "@/domain/entities/Prospecto";
import { MOCK_PIPELINE, MOCK_METRICS } from "./data/pipeline";

const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

export class MockOportunidadRepository implements IOportunidadRepository {
  private pipeline: Oportunidad[] = [...MOCK_PIPELINE];

  async listar(): Promise<Oportunidad[]> {
    await delay();
    return this.pipeline;
  }

  async metricas(): Promise<DashboardMetrics> {
    await delay(300);
    return MOCK_METRICS;
  }

  async actualizarEtapa(id: string, etapa: string): Promise<void> {
    await delay(200);
    this.pipeline = this.pipeline.map((o) =>
      o.id === id ? { ...o, etapa: etapa as EtapaPipeline } : o,
    );
  }
}
