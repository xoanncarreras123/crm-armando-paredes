"use client";
import { useState, useEffect } from "react";
import { container } from "@/infrastructure/container";
import type { Unidad } from "@/domain/entities/Unidad";
import type { Proyecto } from "@/domain/entities/Proyecto";

export function useProyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    container.proyectos.listar().then((data) => {
      setProyectos(data);
      setLoading(false);
    });
  }, []);

  return { proyectos, loading };
}

export function useUnidades(proyectoId: string) {
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!proyectoId) return;
    setLoading(true);
    container.unidades.listarPorProyecto(proyectoId).then((data) => {
      setUnidades(data);
      setLoading(false);
    });
  }, [proyectoId]);

  return { unidades, loading };
}
