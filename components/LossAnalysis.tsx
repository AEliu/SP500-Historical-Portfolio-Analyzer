import React from 'react';
import { SimulationResult } from '../types';

interface LossAnalysisProps {
  results: SimulationResult[];
}

const LossAnalysis: React.FC<LossAnalysisProps> = ({ results }) => {
  const losses = results.filter(r => r.isLoss).sort((a, b) => a.totalReturn - b.totalReturn);

  if (losses.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-lg mt-8">
        <h3 className="text-emerald-800 font-bold mb-2">未发现亏损周期</h3>
        <p className="text-emerald-700 text-sm">在所有历史测试区间（{results.length}个周期）中，该投资策略均实现了正收益。</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <span className="w-2 h-6 bg-red-500 mr-3 rounded-sm"></span>
        负收益周期警示
      </h3>
      <p className="text-slate-500 mb-6 text-sm">
        在总共 {results.length} 个测试周期中，有 <span className="text-red-600 font-bold">{losses.length}</span> 个周期出现了本金亏损。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {losses.map((loss) => (
          <div key={loss.startYear} className="bg-white border border-red-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-bl-lg font-mono">
               {loss.startYear} - {loss.endYear}
            </div>
            
            <div className="mt-2">
               <div className="text-xs text-slate-400 uppercase">期末资产</div>
               <div className="text-lg font-mono font-medium text-slate-700">
                  {loss.finalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
               </div>
            </div>

            <div className="mt-3 pt-3 border-t border-red-50 flex justify-between items-end">
                <div>
                    <div className="text-xs text-slate-400">亏损幅度</div>
                    <div className="text-xl font-bold text-red-600 font-mono">
                    {(loss.totalReturn * 100).toFixed(2)}%
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">年化收益</div>
                    <div className="text-sm font-medium text-red-400 font-mono">
                    {(loss.cagr * 100).toFixed(2)}%
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LossAnalysis;