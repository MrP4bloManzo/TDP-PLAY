'use client';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function PerformanceChart({ data }: { data: { name: string; value: number }[] }) {
  return <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
    <XAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 11 }} axisLine={false} tickLine={false} />
    <YAxis tick={{ fill: '#ffffff55', fontSize: 11 }} axisLine={false} tickLine={false} />
    <Tooltip contentStyle={{ background: '#0d1b13', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12 }} />
    <Area type="monotone" dataKey="value" stroke="#22c55e" fill="rgba(34,197,94,.12)" strokeWidth={2} />
  </AreaChart></ResponsiveContainer></div>;
}
