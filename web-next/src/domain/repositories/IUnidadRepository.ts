import type { Unidad } from "../entities/Unidad";
import type { Proyecto } from "../entities/Proyecto";

export interface IUnidadRepository {
  listarPorProyecto(proyectoId: string): Promise<Unidad[]>;
}

export interface IProyectoRepository {
  listar(): Promise<Proyecto[]>;
}
