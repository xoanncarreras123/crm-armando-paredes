import type { IProspectoRepository } from "@/domain/repositories/IProspectoRepository";
import type { ProspectoListItem, ProspectoDetalle } from "@/domain/entities/Prospecto";
import { MOCK_PROSPECTOS, MOCK_DETALLE } from "./data/prospectos";

const delay = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

export class MockProspectoRepository implements IProspectoRepository {
  async listar(): Promise<ProspectoListItem[]> {
    await delay();
    return MOCK_PROSPECTOS;
  }

  async obtener(id: string): Promise<ProspectoDetalle> {
    await delay(300);
    const detalle = MOCK_DETALLE[id];
    const base = MOCK_PROSPECTOS.find((p) => p.id === id);
    return detalle ?? {
      ...MOCK_DETALLE.p1,
      id,
      nombre: base?.nombre ?? "Prospecto",
    };
  }
}
