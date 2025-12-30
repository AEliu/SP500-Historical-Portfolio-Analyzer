import React, { useState, useMemo } from 'react';
import Controls from './components/Controls';
import SimulationChart from './components/SimulationChart';
import LossAnalysis from './components/LossAnalysis';
import { SimulationParams } from './types';
import { calculateSimulations } from './utils/calculator';
import { MARKET_DATA } from './constants';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    amount: 1000000,
    years: 5,
    stockRatio: 0.7,
  });

  const results = useMemo(() => calculateSimulations(params), [params]);

  // Summary Stats
  const maxReturn = Math.max(...results.map(r => r.totalReturn));
  const minReturn = Math.min(...results.map(r => r.totalReturn));
  const medianReturn = results.map(r => r.totalReturn).sort((a,b) => a-b)[Math.floor(results.length/2)];
  const winRate = results.filter(r => !r.isLoss).length / results.length;

  // Average Stats
  const averageReturn = results.reduce((acc, r) => acc + r.totalReturn, 0) / (results.length || 1);
  const averageCAGR = results.reduce((acc, r) => acc + r.cagr, 0) / (results.length || 1);

  return (
    <div className="min-h-screen font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 lg:px-12 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">一次性投资收益回测</h1>
            <p className="text-slate-500 text-sm mt-1">基于 1928 - 2024 历史数据 (标普500 + 国债动态平衡，含红利再投资)</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            数据来源: <a href="https://pages.stern.nyu.edu/~adamodar/pc/datasets/histretSP.xls">Aswath Damodaran</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-4 xl:col-span-3">
             <Controls params={params} onChange={setParams} />
             
             {/* Stats Cards */}
             <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">历史正收益概率</div>
                 <div className="text-2xl font-bold text-slate-700 font-mono">{(winRate * 100).toFixed(1)}%</div>
               </div>
               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">中位数总收益</div>
                 <div className="text-2xl font-bold text-slate-700 font-mono">{(medianReturn * 100).toFixed(1)}%</div>
               </div>

               {/* New Stats */}
               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">平均总收益</div>
                 <div className="text-xl font-bold text-slate-700 font-mono">{(averageReturn * 100).toFixed(1)}%</div>
               </div>
               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">平均年化收益</div>
                 <div className="text-xl font-bold text-slate-700 font-mono">{(averageCAGR * 100).toFixed(1)}%</div>
               </div>

               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">最佳周期回报</div>
                 <div className="text-xl font-bold text-emerald-600 font-mono">+{(maxReturn * 100).toFixed(1)}%</div>
               </div>
               <div className="bg-slate-100 p-4 rounded-lg">
                 <div className="text-xs text-slate-500 mb-1">最差周期回报</div>
                 <div className="text-xl font-bold text-red-600 font-mono">{(minReturn * 100).toFixed(1)}%</div>
               </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            
            {/* Main Chart Section */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
               <div className="flex justify-between items-end mb-2">
                 <div>
                    <h2 className="text-lg font-bold text-slate-800">收益分布可视化</h2>
                    <p className="text-sm text-slate-500">
                      每个柱状代表从该年开始，持有 {params.years} 年后的总收益率（已包含股息再投资）。
                    </p>
                 </div>
               </div>
               <SimulationChart results={results} />
            </div>

            {/* Negative Returns Analysis */}
            <LossAnalysis results={results} />

            {/* Data Availability Note */}
            <div className="text-xs text-slate-400 text-center py-8 border-t border-slate-200">
               注：计算假设初始投入全部资金，并在每年年初进行资产再平衡（恢复设定比例）。收益严格包含股息与债券利息再投资。不包含通胀调整与交易税费。
               <br/>
               数据覆盖范围: 1927 (作为基数) 至 {MARKET_DATA[MARKET_DATA.length -1].year}。
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;