
import { subDays, format } from 'date-fns';

export interface Trade {
  id: string;
  symbol: string;
  type: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  fee: number;
  status: 'Win' | 'Loss';
  timestamp: string;
  date: string;
  duration: number; // in seconds
  orderType: 'Market' | 'Limit';
}

// Simple seeded random generator for consistent mock data
let seed = 56789;
const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export const generateMockTrades = (count: number = 50): Trade[] => {
  seed = 56789; // Reset seed for consistency
  const trades: Trade[] = [];
  let balance = 10000;
  
  for (let i = 0; i < count; i++) {
    const isWin = random() > 0.45; // 55% win rate
    const type = random() > 0.5 ? 'Long' : 'Short';
    const symbol = random() > 0.5 ? 'SOL-PERP' : 'BTC-PERP';
    const size = Math.floor(random() * 5000) + 1000; // Position size $1000 - $6000
    
    const orderType = random() > 0.4 ? 'Limit' : 'Market'; // 60% Limit, 40% Market
    // Fee calculation based on order type (Maker 0.02%, Taker 0.05%)
    const feeRate = orderType === 'Limit' ? 0.0002 : 0.0005;
    const fee = size * feeRate;

    let pnl = 0;
    if (isWin) {
      pnl = size * (random() * 0.05 + 0.01); // 1-6% profit
    } else {
      pnl = -size * (random() * 0.03 + 0.01); // 1-4% loss
    }
    
    pnl -= fee; // Net PnL

    balance += pnl;
    
    const date = subDays(new Date(), count - i);
    const duration = Math.floor(random() * 3600 * 4) + 60; // 1 min to 4 hours

    trades.push({
      id: `trade-${i}`,
      symbol,
      type,
      entryPrice: symbol === 'SOL-PERP' ? 140 + random() * 10 : 65000 + random() * 2000,
      exitPrice: symbol === 'SOL-PERP' ? 140 + random() * 10 : 65000 + random() * 2000,
      size,
      pnl: parseFloat(pnl.toFixed(2)),
      fee: parseFloat(fee.toFixed(2)),
      status: pnl > 0 ? 'Win' : 'Loss',
      timestamp: date.toISOString(),
      date: format(date, 'yyyy-MM-dd'),
      duration,
      orderType,
    });
  }
  return trades.reverse(); // Newest first
};

export const MOCK_TRADES = generateMockTrades(50);

export const METRICS = {
  totalPnL: MOCK_TRADES.reduce((acc, t) => acc + t.pnl, 0),
  winRate: (MOCK_TRADES.filter(t => t.status === 'Win').length / MOCK_TRADES.length) * 100,
  totalVolume: MOCK_TRADES.reduce((acc, t) => acc + t.size, 0),
  totalFees: MOCK_TRADES.reduce((acc, t) => acc + t.fee, 0),
  totalTrades: MOCK_TRADES.length,
  avgWin: MOCK_TRADES.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0) / MOCK_TRADES.filter(t => t.pnl > 0).length || 0,
  avgLoss: MOCK_TRADES.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0) / MOCK_TRADES.filter(t => t.pnl < 0).length || 0,
  longs: {
    count: MOCK_TRADES.filter(t => t.type === 'Long').length,
    wins: MOCK_TRADES.filter(t => t.type === 'Long' && t.status === 'Win').length,
  },
  shorts: {
    count: MOCK_TRADES.filter(t => t.type === 'Short').length,
    wins: MOCK_TRADES.filter(t => t.type === 'Short' && t.status === 'Win').length,
  },
  avgDuration: MOCK_TRADES.reduce((acc, t) => acc + t.duration, 0) / MOCK_TRADES.length,
  maxWin: Math.max(...MOCK_TRADES.map(t => t.pnl)),
  maxLoss: Math.min(...MOCK_TRADES.map(t => t.pnl)),
};
