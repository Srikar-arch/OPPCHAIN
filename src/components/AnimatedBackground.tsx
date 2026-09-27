import { motion } from 'framer-motion';

/**
 * Subtle animated background with radial gradients and floating ambient elements.
 * Used on the landing page and as a global atmospheric layer.
 */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Ambient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-600/[0.07] blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-violet-600/[0.05] blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/[0.04] blur-[80px]"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
