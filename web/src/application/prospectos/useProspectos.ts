"use client";
import { useState, useEffect } from "react";
import { container } from "@/infrastructure/container";
import type { ProspectoListItem, ProspectoDetalle } from "@/domain/entities/Prospecto";

export function useProspectos() {
  const [prospectos, setProspectos] = useState<ProspectoListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    container.prospectos.listar().then((data) => {
      setProspectos(data);
      setLoading(false);
    });
  }, []);

  return { prospectos, loading };
}

export function useProspecto(id: string) {
  const [prospecto, setProspecto] = useState<ProspectoDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    container.prospectos.obtener(id).then((data) => {
      setProspecto(data);
      setLoading(false);
    });
  }, [id]);

  return { prospecto, loading };
}
