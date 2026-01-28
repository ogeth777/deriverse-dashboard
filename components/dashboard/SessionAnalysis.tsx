
'use client';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trade {
  pnl: number;
}

interface SessionAnalysisProps {
  data: Trade[];
}

export const SessionAnalysis = ({ data }: SessionAnalysisProps) => {
  // Generate mock hourly data based on total trades
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    pnl: 0,
    count: 0
  }));

  // Distribute trades randomly across hours (since mock data doesn't have time)
  // In a real app, we would parse trade.date timestamp
  data.forEach(trade => {
    const hour = Math.floor(Math.random() * 24);
    hourlyData[hour].pnl += trade.pnl;
    hourlyData[hour].count += 1;
  });

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-600/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 mb-6">
        <h3 className="text-lg font-bold text-white">Session Performance</h3>
        <p className="text-sm text-zinc-500">Hourly PnL distribution</p>
      </div>
      
      <div className="h-[250px] relative z-10">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="hour" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'PnL']}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {hourlyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.pnl >= 0 ? '#10B981' : '#F43F5E'} 
                  fillOpacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
