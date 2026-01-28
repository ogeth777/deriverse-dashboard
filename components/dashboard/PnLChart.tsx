
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trade {
  date: string;
  pnl: number;
}

interface PnLChartProps {
  data: Trade[];
}

export const PnLChart = ({ data }: PnLChartProps) => {
  // Calculate cumulative PnL
  const chartData = data.reduce((acc: any[], trade) => {
    const lastPnL = acc.length > 0 ? acc[acc.length - 1].cumulativePnL : 0;
    return [...acc, {
      date: trade.date,
      pnl: trade.pnl,
      cumulativePnL: lastPnL + trade.pnl
    }];
  }, []);

  return (
    <div className="w-full h-[400px] p-4">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
          <p className="text-sm text-zinc-500">Cumulative PnL over time</p>
        </div>
        <div className="flex gap-2">
           <span className="flex items-center gap-1.5 text-xs text-zinc-400">
             <span className="w-2 h-2 rounded-full bg-violet-500"></span>
             Net Profit
           </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%" minWidth={0} minHeight={0}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.split('-').slice(1).join('/')}
            dy={10}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#09090b', 
              borderColor: '#27272a',
              borderRadius: '12px',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
            itemStyle={{ color: '#fff' }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cumulative PnL']}
            labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="cumulativePnL" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPnL)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
