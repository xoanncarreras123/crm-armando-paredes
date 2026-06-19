import type { Cotizacion } from "./cotizadorIA";
import { usdFull } from "./format";

// Genera un PDF formal de la cotización (claro, con marca) y lo descarga.
// jsPDF se carga por import dinámico → no pesa en el bundle principal.

export interface InfoCliente {
  nombre: string;
  telefono: string;
  proyecto: string;
  distrito?: string;
  asesor?: string;
}

// Paleta del documento (claro, no el dark del CRM).
const GOLD: [number, number, number] = [232, 197, 71];
const INK: [number, number, number] = [26, 30, 39];
const MUTED: [number, number, number] = [110, 116, 130];
const LINE: [number, number, number] = [226, 224, 214];

export async function descargarCotizacionPDF(cot: Cotizacion, info: InfoCliente): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const f = cot.finanzas;

  // ---- Banda superior dorada ----
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, W, 84, "F");
  doc.setTextColor(26, 30, 39);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ARMANDO PAREDES", M, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Desarrollos residenciales · Lima", M, 56);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("COTIZACIÓN", W - M, 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(new Date(cot.generadaEn).toLocaleDateString("es-PE"), W - M, 56, { align: "right" });

  let y = 120;

  // ---- Cliente / Proyecto ----
  const colGap = (W - 2 * M) / 2;
  label(doc, "CLIENTE", M, y);
  label(doc, "PROYECTO", M + colGap, y);
  y += 16;
  valueBold(doc, info.nombre, M, y);
  valueBold(doc, info.proyecto, M + colGap, y);
  y += 15;
  valueMuted(doc, info.telefono, M, y);
  valueMuted(doc, info.distrito ?? "—", M + colGap, y);
  y += 30;

  // ---- Unidad recomendada (caja) ----
  doc.setDrawColor(...LINE);
  doc.setLineWidth(1);
  doc.roundedRect(M, y, W - 2 * M, 64, 6, 6, "S");
  label(doc, "UNIDAD RECOMENDADA", M + 16, y + 20);
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`Unidad ${cot.unidad.numero}`, M + 16, y + 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    `Piso ${cot.unidad.piso}  ·  ${cot.unidad.area} m²  ·  ${cot.unidad.dormitorios} dorm  ·  vista ${cot.unidad.vista.toLowerCase()}`,
    M + 16,
    y + 56,
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text(usdFull(f.precio), W - M - 16, y + 40, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("precio de lista", W - M - 16, y + 52, { align: "right" });
  y += 90;

  // ---- Plan de pago ----
  label(doc, "PLAN DE PAGO", M, y);
  y += 10;
  const rows: [string, string, boolean][] = [
    ["Separación", usdFull(f.separacion), false],
    [`Cuota inicial (${Math.round(f.cuotaInicialPct * 100)}%)`, usdFull(f.cuotaInicial), false],
    ["Monto a financiar", usdFull(f.montoFinanciar), false],
    [`Cuota mensual · ${f.meses / 12} años · TCEA ${f.tceaPct}%`, usdFull(f.cuotaMensual), true],
  ];
  for (const [k, v, hi] of rows) {
    y += 22;
    doc.setDrawColor(...LINE);
    doc.line(M, y + 6, W - M, y + 6);
    doc.setFont("helvetica", hi ? "bold" : "normal");
    doc.setFontSize(hi ? 11 : 10);
    doc.setTextColor(...(hi ? INK : MUTED));
    doc.text(k, M, y);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.text(v, W - M, y, { align: "right" });
  }
  y += 34;

  // ---- Notas ----
  if (cot.notas.length) {
    label(doc, "NOTAS", M, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    for (const n of cot.notas) {
      const lines = doc.splitTextToSize(`•  ${n}`, W - 2 * M) as string[];
      doc.text(lines, M, y);
      y += lines.length * 13 + 4;
    }
  }

  // ---- Pie ----
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...LINE);
  doc.line(M, H - 56, W - M, H - 56);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Cotización referencial sujeta a disponibilidad y a la aprobación crediticia de la entidad financiera. Los montos no incluyen gastos notariales ni registrales.",
    M,
    H - 42,
    { maxWidth: W - 2 * M },
  );
  if (info.asesor) doc.text(`Atendido por ${info.asesor} · Armando Paredes`, M, H - 24);

  const safe = (s: string) => s.replace(/[^\w-]+/g, "_");
  doc.save(`Cotizacion_${safe(info.proyecto)}_${safe(cot.unidad.numero)}.pdf`);
}

/* helpers de texto */
function label(doc: import("jspdf").jsPDF, t: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GOLD);
  doc.text(t, x, y);
}
function valueBold(doc: import("jspdf").jsPDF, t: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(t, x, y);
}
function valueMuted(doc: import("jspdf").jsPDF, t: string, x: number, y: number) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text(t, x, y);
}
