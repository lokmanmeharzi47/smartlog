"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  height?: number;
  innerLabel?: string;
  innerValue?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded px-3 py-2 shadow-float text-xs border border-[#C5C6CF]/20">
        <p className="font-semibold text-[#191C1D]">{payload[0].name}</p>
        <p style={{ color: payload[0].payload.color }}>
          {payload[0].value} incidents
        </p>
      </div>
    );
  }
  return null;
};

export default function DonutChart({ data, height = 240, innerLabel, innerValue }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data.map((d) => ({ name: d.label, value: d.value, color: d.color }))}
          cx="40%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: 12, color: "#44474E", fontFamily: "Inter" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
