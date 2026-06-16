"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  label: string;
  value: number;
  secondary?: number;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  showSecondary?: boolean;
  yLabel?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="glass rounded px-3 py-2 shadow-float text-xs border border-[#C5C6CF]/20"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <p className="font-semibold text-[#191C1D] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function BarChartComponent({
  data,
  height = 220,
  primaryColor = "#1A2B4B",
  secondaryColor = "#B6C6EF",
  showSecondary = false,
  yLabel,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data.map((d) => ({ name: d.label, Primary: d.value, Secondary: d.secondary }))}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="0"
          vertical={false}
          stroke="rgba(197, 198, 207, 0.3)"
          strokeWidth={1}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "#75777F", fontSize: 11, fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          tick={{ fill: "#75777F", fontSize: 11, fontFamily: "Inter, sans-serif" }}
          axisLine={false}
          tickLine={false}
          label={
            yLabel
              ? { value: yLabel, angle: -90, position: "insideLeft", fill: "#75777F", fontSize: 11 }
              : undefined
          }
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(26, 43, 75, 0.04)" }} />
        <Bar dataKey="Primary" fill={primaryColor} radius={[3, 3, 0, 0]} name="Volume" />
        {showSecondary && (
          <Bar dataKey="Secondary" fill={secondaryColor} radius={[3, 3, 0, 0]} name="Target" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
