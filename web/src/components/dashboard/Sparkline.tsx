import { Area, AreaChart, ResponsiveContainer } from "recharts";

// Sparkline minimalista: tendencia sin ejes. Da contexto al número grande.
export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const series = data.map((v, i) => ({ i, v }));
  const id = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={series} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.8}
          fill={`url(#${id})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
