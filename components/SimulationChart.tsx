import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { SimulationResult } from '../types';

interface SimulationChartProps {
  results: SimulationResult[];
}

const SimulationChart: React.FC<SimulationChartProps> = ({ results }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: SimulationResult = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-1">{data.startYear} - {data.endYear}</p>
          <div className="space-y-1">
            <p className="text-slate-600">
              期末总值: <span className="font-mono font-medium text-slate-900">{data.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
            <p className={`${data.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              总收益率: <span className="font-mono font-medium">{(data.totalReturn * 100).toFixed(2)}%</span>
            </p>
            <p className="text-slate-500 text-xs">
              年化: {(data.cagr * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full mt-6">
      <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wide">历史收益分布 (按开始年份)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={results}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis 
            dataKey="startYear" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <ReferenceLine y={0} stroke="#cbd5e1" />
          <Bar dataKey="totalReturn" radius={[2, 2, 0, 0]}>
            {results.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.totalReturn < 0 ? '#ef4444' : '#475569'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimulationChart;