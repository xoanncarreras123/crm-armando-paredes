import type { TipoCompra, Unidad, Urgencia } from "@/api/types";
import {
  calcularFinanzas,
  recomendar,
  type Finanzas,
  type ParamsFinanciamiento,
} from "./cotizador";
import { usdShort } from "./format";

// El "motor IA": lee el contexto del prospecto + inventario y arma la cotización.
// En mock genera la narrativa localmente; en prod sería una llamada a Claude
// (opus-4-8, Structured Outputs) que recibe el mismo contexto.

export interface Cotizacion {
  unidad: Unidad;
  alternativas: Unidad[];
  finanzas: Finanzas;
  rationale: string; // por qué esta unidad (generado por IA)
  notas: string[]; // observaciones contextuales
  generadaEn: string;
}

export interface ContextoCotizacion {
  nombre: string;
  presupuesto: number | null;
  tipoCompra: TipoCompra;
  hipotecaPreAprobada: boolean;
  urgencia: Urgencia;
  proyecto: string;
  unidades: Unidad[];
  params: ParamsFinanciamiento;
}

const primer = (n: string) => n.split(" ")[0];

export function generarCotizacionIA(ctx: ContextoCotizacion): Promise<Cotizacion | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { recomendada, alternativas } = recomendar(
        ctx.presupuesto,
        ctx.tipoCompra,
        ctx.unidades,
      );
      if (!recomendada) return resolve(null);

      const finanzas = calcularFinanzas(recomendada.precio, ctx.params);
      const dentro = ctx.presupuesto == null || recomendada.precio <= ctx.presupuesto * 1.05;
      const usoTxt = ctx.tipoCompra === "INVERSION" ? "inversión" : "vivienda";

      const rationale =
        `${primer(ctx.nombre)}, para tu perfil de ${usoTxt} en ${ctx.proyecto} la mejor opción es la ` +
        `unidad ${recomendada.numero} (piso ${recomendada.piso}, ${recomendada.area} m², ${recomendada.dormitorios} dorm, ` +
        `vista ${recomendada.vista.toLowerCase()}). ` +
        (dentro
          ? `Calza con tu presupuesto de ${usdShort(ctx.presupuesto)} y deja margen para acabados.`
          : `Está algo por encima de tu presupuesto de ${usdShort(ctx.presupuesto)}; abajo te dejo alternativas más ajustadas.`);

      const notas: string[] = [];
      notas.push(
        ctx.hipotecaPreAprobada
          ? `Tu hipoteca pre-aprobada cubre el financiamiento del ${Math.round((1 - finanzas.cuotaInicialPct) * 100)}% del precio.`
          : `Aún sin pre-aprobación: gestionarla asegura la cuota de ${usdShort(finanzas.cuotaMensual)} mensuales.`,
      );
      if (ctx.urgencia === "ALTA")
        notas.push("Urgencia alta: conviene separar esta semana para fijar el precio de lista.");
      if (ctx.tipoCompra === "INVERSION")
        notas.push("Para inversión, esta tipología tiene mejor ratio de renta por m² del proyecto.");

      resolve({
        unidad: recomendada,
        alternativas,
        finanzas,
        rationale,
        notas,
        generadaEn: new Date().toISOString(),
      });
    }, 1100);
  });
}

/** Resumen en texto plano para copiar / enviar por WhatsApp. */
export function resumenTexto(c: Cotizacion, proyecto: string): string {
  const f = c.finanzas;
  return [
    `Cotización · ${proyecto} · Unidad ${c.unidad.numero}`,
    `Piso ${c.unidad.piso} · ${c.unidad.area} m² · ${c.unidad.dormitorios} dorm · vista ${c.unidad.vista.toLowerCase()}`,
    ``,
    `Precio: ${usdShort(f.precio)}`,
    `Separación: ${usdShort(f.separacion)}`,
    `Cuota inicial (${Math.round(f.cuotaInicialPct * 100)}%): ${usdShort(f.cuotaInicial)}`,
    `A financiar: ${usdShort(f.montoFinanciar)}`,
    `Cuota mensual: ${usdShort(f.cuotaMensual)} · ${f.meses / 12} años · TCEA ${f.tceaPct}%`,
  ].join("\n");
}
