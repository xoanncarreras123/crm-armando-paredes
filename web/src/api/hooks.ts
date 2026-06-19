import { useQuery } from "@tanstack/react-query";
import { api, mock, USE_MOCKS } from "./client";
import { mockAlertas, mockBriefing, mockMetrics, mockPipeline } from "./mocks";
import {
  getProspectoDetalle,
  mockProspectos,
  mockProyectos,
  mockUnidades,
} from "./mocks-detail";
import type {
  Alerta,
  DailyBriefing,
  DashboardMetrics,
  Oportunidad,
  ProspectoDetalle,
  ProspectoListItem,
  Proyecto,
  Unidad,
} from "./types";

// Cada hook intenta la API real; con VITE_USE_MOCKS usa data local.
// Así la UI corre standalone y se conecta al backend cambiando una env var.

export function useMetrics() {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: () =>
      USE_MOCKS ? mock(mockMetrics) : api<DashboardMetrics>("/dashboard/metrics"),
  });
}

export function useBriefing() {
  return useQuery({
    queryKey: ["dashboard", "briefing"],
    queryFn: () =>
      USE_MOCKS ? mock(mockBriefing, 900) : api<DailyBriefing>("/dashboard/briefing"),
  });
}

export function usePipeline() {
  return useQuery({
    queryKey: ["dashboard", "pipeline"],
    queryFn: () =>
      USE_MOCKS ? mock(mockPipeline, 750) : api<Oportunidad[]>("/oportunidades?vivos=1"),
  });
}

export function useAlertas() {
  return useQuery({
    queryKey: ["dashboard", "alertas"],
    queryFn: () => (USE_MOCKS ? mock(mockAlertas, 500) : api<Alerta[]>("/alertas")),
  });
}

export function useProspectos() {
  return useQuery({
    queryKey: ["prospectos"],
    queryFn: () =>
      USE_MOCKS ? mock(mockProspectos, 600) : api<ProspectoListItem[]>("/prospectos"),
  });
}

export function useProspecto(id: string) {
  return useQuery({
    queryKey: ["prospecto", id],
    queryFn: () =>
      USE_MOCKS ? mock(getProspectoDetalle(id), 700) : api<ProspectoDetalle>(`/prospectos/${id}`),
  });
}

export function useProyectos() {
  return useQuery({
    queryKey: ["proyectos"],
    queryFn: () => (USE_MOCKS ? mock(mockProyectos, 500) : api<Proyecto[]>("/proyectos")),
  });
}

export function useUnidades(proyectoId: string) {
  return useQuery({
    queryKey: ["unidades", proyectoId],
    queryFn: () =>
      USE_MOCKS
        ? mock(mockUnidades[proyectoId] ?? [], 650)
        : api<Unidad[]>(`/proyectos/${proyectoId}/unidades`),
  });
}
