import React from 'react';
import { SimulationParams } from '../types';

interface ControlsProps {
  params: SimulationParams;
  onChange: (newParams: SimulationParams) => void;
}

const Controls: React.FC<ControlsProps> = ({ params, onChange }) => {
  const handleChange = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  const formatMoney = (val: number) => {
    if (val >= 10000) return `${val / 10000}万`;
    return val;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm sticky top-4">
      <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-6">配置组合</h2>
      
      <div className="space-y-8">
        {/* Amount Input */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-slate-700 font-medium">初始投入金额</label>
            <span className="text-slate-900 font-mono font-bold">{params.amount.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="10000"
            max="10000000"
            step="10000"
            value={params.amount}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1万</span>
            <span>1000万</span>
          </div>
        </div>

        {/* Years Input */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-slate-700 font-medium">持有年限</label>
            <span className="text-slate-900 font-mono font-bold">{params.years} 年</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={params.years}
            onChange={(e) => handleChange('years', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1年</span>
            <span>50年</span>
          </div>
        </div>

        {/* Ratio Input */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-slate-700 font-medium">资产配置 (标普500 / 债券)</label>
            <span className="text-slate-900 font-mono font-bold">
              {Math.round(params.stockRatio * 100)}% / {Math.round((1 - params.stockRatio) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={params.stockRatio}
            onChange={(e) => handleChange('stockRatio', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>纯债</span>
            <span>股债平衡</span>
            <span>纯股</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;