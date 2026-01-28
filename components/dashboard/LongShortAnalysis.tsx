
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Trade } from '@/lib/mockData';

interface LongShortAnalysisProps {
  data: Trade[];
}

export const LongShortAnalysis = ({ data }: LongShortAnalysisProps) => {
  const longs = data.filter(t => t.type === 'Long');
  const shorts = data.filter(t => t.type === 'Short');

  const longWinRate = longs.length > 0 ? (longs.filter(t => t.status === 'Win').length / longs.length) * 100 : 0;
  const shortWinRate = shorts.length > 0 ? (shorts.filter(t => t.status === 'Win').length / shorts.length) * 100 : 0;

  const chartData = [
    { name: 'Longs', value: longs.length, winRate: longWinRate },
    { name: 'Shorts', value: shorts.length, winRate: shortWinRate },
  ];

  const COLORS = ['#8B5CF6', '#3B82F6']; // Violet & Blue

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 h-[400px] flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/5 blur-[60px] rounded-full pointer-events-none" />
      
      <h3 className="text-lg font-bold text-white mb-6 relative z-10">Directional Bias</h3>
      
      <div className="flex-1 relative z-10">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any, name: any, props: any) => [
                `${value} trades (${props.payload.winRate.toFixed(1)}% WR)`, 
                name
              ]}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
        <div className="text-center p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
          <p className="text-xs text-violet-400 font-medium uppercase tracking-wider mb-1">Long WR</p>
          <p className="text-xl font-bold text-white">{longWinRate.toFixed(1)}%</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">Short WR</p>
          <p className="text-xl font-bold text-white">{shortWinRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};
