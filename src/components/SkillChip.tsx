interface SkillChipProps {
  label: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'highlight';
}

export default function SkillChip({
  label,
  size = 'sm',
  variant = 'default',
}: SkillChipProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5';
  const variantClass =
    variant === 'highlight'
      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
      : 'bg-white/5 text-gray-300 border-white/10';

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-medium ${sizeClass} ${variantClass}`}
    >
      {label}
    </span>
  );
}
