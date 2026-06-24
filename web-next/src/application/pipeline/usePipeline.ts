"use client";
import { useState, useEffect, useCallback } from "react";
import { container } from "@/infrastructure/container";
import type { Oportunidad, DashboardMetrics } from "@/domain/entities/Oportunidad";

export function usePipeline() {
  const [deals, setDeals]     = useState<Oportunidad[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      container.oportunidades.listar(),
      container.oportunidades.metricas(),
    ]).then(([d, m]) => { setDeals(d); setMetrics(m); setLoading(false); });
  }, []);

  const moverDeal = useCallback(async (id: string, etapa: string) => {
    setDeals((prev) => prev.map((o) => o.id === id ? { ...o, etapa: etapa as Oportunidad["etapa"] } : o));
    await container.oportunidades.actualizarEtapa(id, etapa);
  }, []);

  return { deals, metrics, loading, moverDeal };
}
