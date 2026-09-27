import { motion } from 'framer-motion';
import { User, BookOpen, Trophy, Briefcase } from 'lucide-react';

/**
 * Animated opportunity graph for the landing hero.
 * A visual node-and-edge diagram showing a progression path.
 */

interface GraphNode {
  id: string;
  label: string;
  icon: typeof User;
  x: number;
  y: number;
  status: 'you' | 'completed' | 'active' | 'locked' | 'goal';
}

const nodes: GraphNode[] = [
  { id: 'you', label: 'You', icon: User, x: 50, y: 88, status: 'you' },
  { id: 'python', label: 'Python', icon: BookOpen, x: 50, y: 70, status: 'completed' },
  { id: 'ml', label: 'ML Workshop', icon: BookOpen, x: 50, y: 52, status: 'active' },
  { id: 'hack', label: 'AI Hackathon', icon: Trophy, x: 50, y: 34, status: 'locked' },
  { id: 'intern', label: 'AI / ML Internship', icon: Briefcase, x: 50, y: 14, status: 'goal' },
];

const edges = [
  { from: 'you', to: 'python' },
  { from: 'python', to: 'ml' },
  { from: 'ml', to: 'hack' },
  { from: 'hack', to: 'intern' },
];

const statusColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  you: {
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.5)',
    text: '#34d399',
    glow: 'rgba(16,185,129,0.15)',
  },
  completed: {
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.3)',
    text: '#6ee7b7',
    glow: 'rgba(16,185,129,0.08)',
  },
  active: {
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.5)',
    text: '#a5b4fc',
    glow: 'rgba(99,102,241,0.15)',
  },
  locked: {
    bg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.08)',
    text: '#6b7280',
    glow: 'transparent',
  },
  goal: {
    bg: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.5)',
    text: '#c4b5fd',
    glow: 'rgba(124,58,237,0.15)',
  },
};

export default function HeroGraph() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        aria-label="Opportunity path visualization"
      >
        {/* Edges */}
        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)!;
          const to = nodes.find((n) => n.id === edge.to)!;
          const fromColors = statusColors[from.status];
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={fromColors.border}
              strokeWidth="0.4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          );
        })}

        {/* Node glow circles */}
        {nodes.map((node, i) => {
          const colors = statusColors[node.status];
          return (
            <motion.circle
              key={`glow-${node.id}`}
              cx={node.x}
              cy={node.y}
              r="6"
              fill={colors.glow}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
            />
          );
        })}

        {/* Node circles */}
        {nodes.map((node, i) => {
          const colors = statusColors[node.status];
          return (
            <motion.circle
              key={`circle-${node.id}`}
              cx={node.x}
              cy={node.y}
              r="3"
              fill={colors.bg}
              stroke={colors.border}
              strokeWidth="0.3"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.12 + 0.2,
                type: 'spring',
                stiffness: 300,
              }}
            />
          );
        })}
      </svg>

      {/* HTML labels overlaid on top */}
      {nodes.map((node, i) => {
        const colors = statusColors[node.status];
        const Icon = node.icon;
        return (
          <motion.div
            key={`label-${node.id}`}
            className="absolute flex items-center gap-2 pointer-events-none"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(20px, -50%)',
            }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.12 + 0.4 }}
          >
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 backdrop-blur-sm"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border,
              }}
            >
              <Icon size={14} style={{ color: colors.text }} />
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{ color: colors.text }}
              >
                {node.label}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Subtle floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute h-1 w-1 rounded-full bg-indigo-400/20"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -8, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
