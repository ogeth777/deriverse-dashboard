
'use client';

import { useState } from 'react';
import { MessageSquarePlus, X, Save } from 'lucide-react';

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
  note?: string;
}

interface TradeHistoryProps {
  trades: Trade[];
}

export const TradeHistory = ({ trades }: TradeHistoryProps) => {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [note, setNote] = useState('');
  // In a real app, this would be persisted to a backend or local storage
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});

  const handleOpenNote = (trade: Trade) => {
    setSelectedTrade(trade);
    setNote(localNotes[trade.id] || '');
  };

  const handleSaveNote = () => {
    if (selectedTrade) {
      setLocalNotes(prev => ({
        ...prev,
        [selectedTrade.id]: note
      }));
      setSelectedTrade(null);
    }
  };

  return (
    <div className="w-full relative">
      {/* Annotation Modal */}
      {selectedTrade && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 rounded-xl w-full max-w-md m-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Trade Note</h4>
              <button onClick={() => setSelectedTrade(null)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-zinc-400 mb-2">
                <span>{selectedTrade.symbol}</span>
                <span className={selectedTrade.pnl > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {selectedTrade.pnl > 0 ? '+' : ''}${selectedTrade.pnl.toFixed(2)}
                </span>
              </div>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your analysis here..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-violet-500/50 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedTrade(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveNote}
                className="px-4 py-2 text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save size={16} /> Save Note
              </button>
            </div>
          </div>
        </div>
      )}

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
