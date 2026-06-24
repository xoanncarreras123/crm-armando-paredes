import type { IUnidadRepository, IProyectoRepository } from "@/domain/repositories/IUnidadRepository";
import type { Unidad } from "@/domain/entities/Unidad";
import type { Proyecto } from "@/domain/entities/Proyecto";
import { MOCK_UNIDADES, MOCK_PROYECTOS } from "./data/inventario";

const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

export class MockUnidadRepository implements IUnidadRepository {
  async listarPorProyecto(proyectoId: string): Promise<Unidad[]> {
    await delay();
    return MOCK_UNIDADES[proyectoId] ?? [];
  }
}

export class MockProyectoRepository implements IProyectoRepository {
  async listar(): Promise<Proyecto[]> {
    await delay(300);
    return MOCK_PROYECTOS;
  }
}
