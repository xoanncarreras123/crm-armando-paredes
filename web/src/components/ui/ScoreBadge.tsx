import { scoreTone, TONE_HEX } from "@/lib/score";

// Badge de score: el número con el color del rango. Contexto inmediato.
export function ScoreBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const hex = TONE_HEX[scoreTone(score)];
  const lg = size === "lg";
  return (
    <span
      className={`inline-flex items-center justify-center font-display font-bold tabular-nums ${
        lg ? "h-9 min-w-9 px-2 text-lg" : "h-6 min-w-6 px-1.5 text-xs"
      } rounded-md`}
      style={{ color: hex, background: `${hex}1f`, border: `1px solid ${hex}38` }}
      title={`Score ${score}/100`}
    >
      {score}
    </span>
  );
}
