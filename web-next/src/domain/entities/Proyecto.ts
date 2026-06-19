export type EstadoProyecto = "EN_VENTA" | "EN_CONSTRUCCION" | "ENTREGADO";

export interface Proyecto {
  id: string;
  nombre: string;
  distrito: string;
  estado: EstadoProyecto;
  avanceObra: number; // 0-100
  fechaEntrega: string; // ISO date
  totalUnidades: number;
  disponibles: number;
  reservadas: number;
  vendidas: number;
  ticketDesde: number; // USD
}
