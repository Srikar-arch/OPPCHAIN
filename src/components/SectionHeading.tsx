import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={`mb-12 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <span className="mb-3 inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-gray-400 sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
