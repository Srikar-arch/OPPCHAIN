import { motion } from 'framer-motion';
import { User, Target, Lock, CheckCircle2 } from 'lucide-react';
import type { OpportunityNode as NodeType } from '../types';

interface OpportunityNodeProps {
  node: NodeType;
  isActive?: boolean;
  onClick?: (id: string) => void;
  index?: number;
}

export default function OpportunityNodeComponent({
  node,
  isActive = false,
  onClick,
  index = 0,
}: OpportunityNodeProps) {
  const statusStyles: Record<string, string> = {
    completed:
      'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    active:
      'border-indigo-500/60 bg-indigo-500/15 text-indigo-300 shadow-lg shadow-indigo-500/10',
    locked: 'border-white/[0.08] bg-white/[0.03] text-gray-500',
  };

  const StatusIcon =
    node.status === 'completed'
      ? CheckCircle2
      : node.type === 'current'
        ? User
        : node.type === 'goal'
          ? Target
          : node.status === 'locked'
            ? Lock
            : null;

  return (
    <motion.button
      className={`relative flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
        statusStyles[node.status ?? 'locked']
      } ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-surface-900' : ''} ${
        onClick ? 'cursor-pointer hover:bg-white/[0.06]' : 'cursor-default'
      }`}
      onClick={() => onClick?.(node.id)}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      aria-label={`${node.label} — ${node.status ?? 'locked'}`}
    >
      {StatusIcon && <StatusIcon size={16} className="shrink-0" />}
      <span className="text-sm font-medium">{node.label}</span>
      {node.type === 'goal' && (
        <span className="ml-auto text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
          Goal
        </span>
      )}
      {node.type === 'current' && (
        <span className="ml-auto text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
          You
        </span>
      )}
    </motion.button>
  );
}
