import { motion } from 'framer-motion';

/**
 * OPPCHAIN logo — a minimal abstract chain/path symbol
 * communicating connection, progression & journey.
 */
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="OPPCHAIN logo"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      {/* Bottom node */}
      <circle cx="20" cy="34" r="4" fill="url(#grad)" />
      {/* Middle node */}
      <circle cx="20" cy="20" r="4.5" fill="url(#grad)" />
      {/* Top node (goal) */}
      <circle cx="20" cy="6" r="5" fill="url(#grad)" />
      {/* Connecting lines */}
      <line
        x1="20"
        y1="30"
        x2="20"
        y2="24.5"
        stroke="url(#grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="15.5"
        x2="20"
        y2="11"
        stroke="url(#grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Branch lines */}
      <line
        x1="15"
        y1="27"
        x2="20"
        y2="24.5"
        stroke="url(#grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <line
        x1="25"
        y1="13"
        x2="20"
        y2="15.5"
        stroke="url(#grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Small branch nodes */}
      <circle cx="15" cy="27" r="2.5" fill="url(#grad)" opacity="0.4" />
      <circle cx="25" cy="13" r="2.5" fill="url(#grad)" opacity="0.4" />
      <defs>
        <linearGradient id="grad" x1="10" y1="0" x2="30" y2="40">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
