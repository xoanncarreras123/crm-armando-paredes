export type EstadoUnidad =
  | "DISPONIBLE" | "NEGOCIACION" | "BLOQUEADO" | "ENTREGA" | "VENDIDA";

export type VistaUnidad = "PARQUE" | "CIUDAD" | "INTERIOR" | "MAR";

export interface Unidad {
  id: string;
  piso: number;
  numero: string;
  area: number;
  dormitorios: number;
  banos: number;
  precio: number; // USD
  estado: EstadoUnidad;
  vista: VistaUnidad;
  tieneTerraza: boolean;
  estacionamientos: number;
  interesados: number;
  tipologia: string;
  tienePlano: boolean;
  propietario?: string;
}
