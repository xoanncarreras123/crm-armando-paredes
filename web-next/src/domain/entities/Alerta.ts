export type TipoAlerta = "SENAL_CIERRE" | "CHURN" | "RENOVACION" | "INACTIVIDAD";

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  prospectoId: string;
  titulo: string;
  detalle: string;
  score: number;
  proyecto: string;
  hace: string;
}
