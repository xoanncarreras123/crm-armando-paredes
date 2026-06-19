// Rampa de color del score. Un solo lugar de verdad para todo el CRM.
// <40 frío (rojo) · 40–69 templado (dorado) · ≥70 caliente (verde).

export type ScoreTone = "red" | "gold" | "green";

export function scoreTone(score: number): ScoreTone {
  if (score >= 70) return "green";
  if (score >= 40) return "gold";
  return "red";
}

export const TONE_HEX: Record<ScoreTone, string> = {
  red: "#E86060",
  gold: "#E8C547",
  green: "#3EC898",
};

export function scoreLabel(score: number): string {
  if (score >= 70) return "Caliente";
  if (score >= 40) return "Templado";
  return "Frío";
}
