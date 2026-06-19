import type { TipoCompra, Unidad } from "@/api/types";

// ============================================================================
// COTIZADOR — la matemática del dinero vive aquí (determinista, auditable).
// La IA elige la unidad y redacta el porqué; NUNCA calcula montos.
// ============================================================================

export interface ParamsFinanciamiento {
  cuotaInicialPct: number; // 0..1
  plazoAnios: number;
  tceaPct: number; // tasa efectiva anual, ej. 8.5
}

export const PARAMS_DEFAULT: ParamsFinanciamiento = {
  cuotaInicialPct: 0.2,
  plazoAnios: 20,
  tceaPct: 8.5,
};

const SEPARACION = 5000; // USD, parte de la cuota inicial

export interface Finanzas {
  precio: number;
  separacion: number;
  cuotaInicial: number;
  cuotaInicialPct: number;
  montoFinanciar: number;
  meses: number;
  cuotaMensual: number;
  tceaPct: number;
}

/** Cuota mensual por amortización francesa, con tasa mensual efectiva derivada de la TCEA. */
export function cuotaMensual(monto: number, tceaPct: number, meses: number): number {
  const r = Math.pow(1 + tceaPct / 100, 1 / 12) - 1; // tasa mensual efectiva
  if (r === 0) return monto / meses;
  return (monto * r) / (1 - Math.pow(1 + r, -meses));
}

export function calcularFinanzas(precio: number, p: ParamsFinanciamiento): Finanzas {
  const cuotaInicial = Math.round(precio * p.cuotaInicialPct);
  const montoFinanciar = precio - cuotaInicial;
  const meses = p.plazoAnios * 12;
  return {
    precio,
    separacion: SEPARACION,
    cuotaInicial,
    cuotaInicialPct: p.cuotaInicialPct,
    montoFinanciar,
    meses,
    cuotaMensual: Math.round(cuotaMensual(montoFinanciar, p.tceaPct, meses)),
    tceaPct: p.tceaPct,
  };
}

/**
 * Recomendación de unidad — el "match" que haría la IA leyendo el CRM:
 * cercanía al presupuesto + tipología acorde al tipo de compra.
 * Determinista para que sea reproducible; la IA solo agrega la narrativa.
 */
export function recomendar(
  presupuesto: number | null,
  tipoCompra: TipoCompra,
  unidades: Unidad[],
): { recomendada?: Unidad; alternativas: Unidad[] } {
  const disp = unidades.filter((u) => u.estado === "DISPONIBLE");
  if (disp.length === 0) return { alternativas: [] };

  const budget = presupuesto ?? disp.reduce((s, u) => s + u.precio, 0) / disp.length;

  const scored = disp
    .map((u) => {
      const cerca = 1 - Math.min(1, Math.abs(u.precio - budget) / budget);
      // Inversión: prioriza tipologías chicas (mejor renta/m²). Vivienda: más amplias.
      const dormPref = tipoCompra === "INVERSION" ? (4 - u.dormitorios) / 3 : u.dormitorios / 3;
      const penalizaSobrePresupuesto = u.precio > budget * 1.15 ? 0.5 : 0;
      return { u, score: cerca * 0.7 + dormPref * 0.3 - penalizaSobrePresupuesto };
    })
    .sort((a, b) => b.score - a.score);

  return { recomendada: scored[0]?.u, alternativas: scored.slice(1, 3).map((s) => s.u) };
}
