
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatsCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const StatsCard = ({ title, value, subValue, icon: Icon, trend, className, variant = 'default' }: StatsCardProps) => {
  return (
    <div className={twMerge(
      "relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-2px]",
      "bg-[#0A0A0A] border border-white/5",
      "hover:shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:border-white/10",
      className
    )}>
      {/* Background Gradients based on variant */}
      {variant === 'primary' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-[50px] rounded-full -mr-10 -mt-10 pointer-events-none" />
      )}
      {variant === 'secondary' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full -mr-10 -mt-10 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={clsx(
            "p-2.5 rounded-xl transition-colors",
            variant === 'primary' ? "bg-violet-500/10 text-violet-400" :
            variant === 'secondary' ? "bg-blue-500/10 text-blue-400" :
            "bg-zinc-800/50 text-zinc-400"
          )}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className={clsx(
              "text-xs font-medium px-2 py-1 rounded-full border",
              trend === 'up' 
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
                : "text-rose-400 bg-rose-500/10 border-rose-500/20"
            )}>
              {trend === 'up' ? '↗' : '↘'} 2.5%
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-zinc-500 text-sm font-medium tracking-wide uppercase">{title}</h3>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {subValue && (
            <p className="text-xs text-zinc-500 font-medium">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );
};
