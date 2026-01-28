
import { MessageSquarePlus } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  status: 'Win' | 'Loss';
  date: string;
}

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory = ({ trades }: TradeHistoryProps) => {
  return (
    <div className="w-full">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0A0A0A]">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Trades</h3>
          <p className="text-zinc-500 text-sm">History of your past 50 positions</p>
        </div>
        <button className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All History →
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-400">
          <thead className="text-xs uppercase bg-white/5 text-zinc-300">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Symbol</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Entry</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Exit</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Size</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider">PnL</th>
              <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Journal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0A0A0A]">
            {trades.slice(0, 10).map((trade) => (
              <tr key={trade.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    {trade.symbol}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    trade.type === 'Long' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-zinc-300">${trade.entryPrice.toLocaleString('en-US')}</td>
                <td className="px-6 py-4 font-mono text-zinc-300">${trade.exitPrice.toLocaleString('en-US')}</td>
                <td className="px-6 py-4 font-mono text-zinc-300">${trade.size.toLocaleString('en-US')}</td>
                <td className={`px-6 py-4 font-bold font-mono ${
                  trade.pnl > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="text-zinc-600 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                    <MessageSquarePlus size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
