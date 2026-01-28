'use client';

import { useState, useMemo } from 'react';
import { MOCK_TRADES, METRICS } from '@/lib/mockData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PnLChart } from '@/components/dashboard/PnLChart';
import { TradeHistory } from '@/components/dashboard/TradeHistory';
import { LongShortAnalysis } from '@/components/dashboard/LongShortAnalysis';
import { SessionAnalysis } from '@/components/dashboard/SessionAnalysis';
import Image from 'next/image';
import { Wallet, TrendingUp, BarChart3, PieChart, Activity, Filter, ChevronDown, ExternalLink, LayoutDashboard, Trophy, Swords, BookOpen, Settings, HelpCircle, LogOut } from 'lucide-react';
import { subDays, isAfter, parseISO } from 'date-fns';

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('All Time');

  // Filter trades based on selection
  const filteredTrades = useMemo(() => {
    return MOCK_TRADES.filter(t => {
      // Symbol Filter
      if (selectedSymbol !== 'All' && t.symbol !== selectedSymbol) return false;
      
      // Time Range Filter
      if (timeRange !== 'All Time') {
        const date = parseISO(t.timestamp);
        let cutoffDate = new Date();
        
        if (timeRange === 'Last 30 Days') {
          cutoffDate = subDays(new Date(), 30);
        } else if (timeRange === 'Last 7 Days') {
          cutoffDate = subDays(new Date(), 7);
        }
        
        if (!isAfter(date, cutoffDate)) return false;
      }
      
      return true;
    });
  }, [selectedSymbol, timeRange]);

  // Recalculate metrics based on filtered trades
  const currentMetrics = useMemo(() => {
    const wins = filteredTrades.filter(t => t.status === 'Win');
    const losses = filteredTrades.filter(t => t.status === 'Loss');
    
    // Calculate Max Drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let currentPnL = 0;
    
    // Sort trades by date for correct PnL curve calculation
    const sortedTrades = [...filteredTrades].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    sortedTrades.forEach(t => {
      currentPnL += t.pnl;
      if (currentPnL > peak) peak = currentPnL;
      const drawdown = peak - currentPnL;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    // Calculate Profit Factor
    const grossProfit = wins.reduce((acc, t) => acc + t.pnl, 0);
    const grossLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 100 : 0;

    return {
      totalPnL: filteredTrades.reduce((acc, t) => acc + t.pnl, 0),
      winRate: (wins.length / filteredTrades.length) * 100 || 0,
      totalVolume: filteredTrades.reduce((acc, t) => acc + t.size, 0),
      totalFees: filteredTrades.reduce((acc, t) => acc + t.fee, 0),
      totalTrades: filteredTrades.length,
      avgWin: wins.reduce((acc, t) => acc + t.pnl, 0) / wins.length || 0,
      avgLoss: losses.reduce((acc, t) => acc + t.pnl, 0) / losses.length || 0,
      longs: {
         count: filteredTrades.filter(t => t.type === 'Long').length,
         wins: filteredTrades.filter(t => t.type === 'Long' && t.status === 'Win').length,
      },
      shorts: {
         count: filteredTrades.filter(t => t.type === 'Short').length,
         wins: filteredTrades.filter(t => t.type === 'Short' && t.status === 'Win').length,
      },
      avgDuration: filteredTrades.reduce((acc, t) => acc + t.duration, 0) / filteredTrades.length || 0,
      maxWin: Math.max(...filteredTrades.map(t => t.pnl), 0),
      maxLoss: Math.min(...filteredTrades.map(t => t.pnl), 0),
      avgSize: filteredTrades.reduce((acc, t) => acc + t.size, 0) / filteredTrades.length || 0,
      maxDrawdown,
      profitFactor,
      limitOrders: {
        count: filteredTrades.filter(t => t.orderType === 'Limit').length,
        winRate: (filteredTrades.filter(t => t.orderType === 'Limit' && t.status === 'Win').length / filteredTrades.filter(t => t.orderType === 'Limit').length) * 100 || 0
      },
      marketOrders: {
        count: filteredTrades.filter(t => t.orderType === 'Market').length,
        winRate: (filteredTrades.filter(t => t.orderType === 'Market' && t.status === 'Win').length / filteredTrades.filter(t => t.orderType === 'Market').length) * 100 || 0
      }
    };
  }, [filteredTrades, selectedSymbol]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="w-full px-6 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-white/10">
              <Image 
                src="/Deriverse.jpg" 
                alt="Deriverse Logo" 
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                deriverse
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">Analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
               <a href="#" className="hover:text-white transition-colors">Dashboard</a>
               <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
               <a href="#" className="hover:text-white transition-colors">Competitions</a>
             </nav>
             <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
             <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
               Docs <ExternalLink size={14} />
             </button>
             <button className="relative group bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] overflow-hidden">
               <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="relative z-10 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent group-hover:text-white transition-colors">Connect Wallet</span>
             </button>
          </div>
        </div>
      </header>

      <main className="w-full px-6 md:px-8 py-10 space-y-10 relative z-10">
        
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Trading Overview</h2>
            <p className="text-zinc-500 max-w-lg">
              Monitor your performance across all Deriverse markets with real-time analytics and advanced metrics.
            </p>
          </div>
          <div className="flex gap-3 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
             <div className="relative group">
               <Filter className="absolute left-3 top-2.5 text-zinc-500 group-hover:text-violet-400 transition-colors" size={16} />
               <select 
                 value={selectedSymbol}
                 onChange={(e) => setSelectedSymbol(e.target.value)}
                 className="pl-10 bg-transparent text-sm rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:text-white appearance-none min-w-[140px] cursor-pointer hover:bg-white/5 transition-colors"
               >
                 <option value="All">All Symbols</option>
                 <option value="SOL-PERP">SOL-PERP</option>
                 <option value="BTC-PERP">BTC-PERP</option>
               </select>
               <ChevronDown className="absolute right-3 top-3 text-zinc-600 pointer-events-none" size={14} />
             </div>
             <div className="w-[1px] bg-white/10 my-1"></div>
             <select 
               value={timeRange}
               onChange={(e) => setTimeRange(e.target.value)}
               className="bg-transparent text-sm rounded-lg px-4 py-2 text-zinc-300 focus:outline-none focus:text-white cursor-pointer hover:bg-white/5 transition-colors"
             >
               <option>All Time</option>
               <option>Last 30 Days</option>
               <option>Last 7 Days</option>
             </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard 
            title="Total PnL" 
            value={`$${currentMetrics.totalPnL.toFixed(2)}`} 
            subValue={selectedSymbol === 'All' ? "+12.5% vs last month" : "Filtered view"}
            icon={Wallet}
            trend={currentMetrics.totalPnL > 0 ? 'up' : 'down'}
            variant="primary"
          />
          <StatsCard 
            title="Win Rate" 
            value={`${currentMetrics.winRate.toFixed(1)}%`} 
            subValue={`${currentMetrics.totalTrades} trades`}
            icon={PieChart}
            trend="up"
            variant="secondary"
          />
          <StatsCard 
            title="Total Volume" 
            value={`$${(currentMetrics.totalVolume / 1000).toFixed(1)}k`} 
            subValue={`Avg. size $${((currentMetrics as any).avgSize / 1000).toFixed(1)}k`}
            icon={BarChart3}
          />
          <StatsCard 
            title="Fees Paid" 
            value={`$${currentMetrics.totalFees.toFixed(2)}`} 
            subValue={`${((currentMetrics.totalFees / currentMetrics.totalVolume) * 100).toFixed(3)}% avg rate`}
            icon={TrendingUp}
          />
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-1 shadow-xl">
              <PnLChart data={filteredTrades} />
            </div>
            
            {/* Additional Stats Row */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
                 <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider font-semibold">Average Win</p>
                 <p className="text-2xl font-bold text-emerald-400 group-hover:scale-105 transition-transform origin-left">+${(currentMetrics as any).avgWin?.toFixed(2) || '0.00'}</p>
                 <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
               </div>
               <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-rose-500 to-transparent opacity-50"></div>
                 <p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider font-semibold">Average Loss</p>
                 <p className="text-2xl font-bold text-rose-400 group-hover:scale-105 transition-transform origin-left">${(currentMetrics as any).avgLoss?.toFixed(2) || '0.00'}</p>
                 <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <LongShortAnalysis data={filteredTrades} />
            <SessionAnalysis data={filteredTrades} />
            
            <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Activity size={18} className="text-blue-500" />
                Performance & Risk
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-zinc-400 text-sm">Avg Duration</span>
                   <span className="text-white font-medium font-mono">{(currentMetrics as any).avgDuration ? formatDuration((currentMetrics as any).avgDuration) : '0h 0m'}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-zinc-400 text-sm">Best Trade</span>
                   <span className="text-emerald-400 font-medium font-mono">+${(currentMetrics as any).maxWin?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-zinc-400 text-sm">Worst Trade</span>
                   <span className="text-rose-400 font-medium font-mono">${(currentMetrics as any).maxLoss?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-zinc-400 text-sm">Max Drawdown</span>
                   <span className="text-rose-400 font-medium font-mono">-${(currentMetrics as any).maxDrawdown?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                   <span className="text-zinc-400 text-sm">Profit Factor</span>
                   <span className="text-blue-400 font-medium font-mono">{(currentMetrics as any).profitFactor?.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-3">Order Type Win Rate</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <span className="block text-xs text-zinc-400">Limit</span>
                      <span className="block text-emerald-400 font-mono font-medium">{(currentMetrics as any).limitOrders?.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <span className="block text-xs text-zinc-400">Market</span>
                      <span className="block text-emerald-400 font-mono font-medium">{(currentMetrics as any).marketOrders?.winRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Journal Table */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <TradeHistory trades={filteredTrades} />
        </div>

      </main>
    </div>
  );
}
