// Formateadores de moneda y números. El ticket es alto: abreviamos con criterio.

export function usdShort(n: number | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `US$ ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `US$ ${Math.round(n / 1_000)}K`;
  return `US$ ${n}`;
}

// Monto completo con separador de miles — para documentos formales (PDF).
export function usdFull(n: number | null): string {
  if (n == null) return "—";
  return `US$ ${n.toLocaleString("en-US")}`;
}

export function penShort(n: number): string {
  if (n >= 1_000_000) return `S/ ${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `S/ ${Math.round(n / 1_000)}K`;
  return `S/ ${n}`;
}

export function pct(n: number, signed = false): string {
  const v = Math.round(n * 100);
  return `${signed && v > 0 ? "+" : ""}${v}%`;
}

export function initials(nombre: string): string {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d <= 0) {
    const h = Math.floor(diff / 3_600_000);
    return h <= 0 ? "hace un momento" : `hace ${h} h`;
  }
  if (d === 1) return "ayer";
  if (d < 30) return `hace ${d} días`;
  const m = Math.floor(d / 30);
  return `hace ${m} mes${m > 1 ? "es" : ""}`;
}

export function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

// Avatar determinista: el color sale del nombre, así cada persona es reconocible.
const AVATAR_HUES = ["#5B8EF0", "#3EC898", "#E8C547", "#E86060", "#A78BFA", "#F0883E"];
export function avatarColor(nombre: string): string {
  let h = 0;
  for (let i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) % 997;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}
