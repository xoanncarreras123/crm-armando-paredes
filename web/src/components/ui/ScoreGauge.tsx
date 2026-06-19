import { scoreLabel, scoreTone, TONE_HEX } from "@/lib/score";

// Gauge circular 0–100. El arco se llena proporcional y toma el color del rango.
export function ScoreGauge({ score, size = 132 }: { score: number; size?: number }) {
  const hex = TONE_HEX[scoreTone(score)];
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-strong)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-extrabold tabular-nums" style={{ color: hex }}>
          {score}
        </span>
        <span className="text-2xs font-semibold uppercase" style={{ color: hex }}>
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
