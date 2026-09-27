import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  accent?: string;
  index?: number;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  accent = 'text-indigo-400',
  index = 0,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className={`mb-3 ${accent}`}>
        <Icon size={22} />
      </div>
      <div className="text-3xl font-bold text-white">{count}</div>
      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}
