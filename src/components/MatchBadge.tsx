interface MatchBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export default function MatchBadge({ score, size = 'sm' }: MatchBadgeProps) {
  const color =
    score >= 90
      ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25'
      : score >= 80
        ? 'text-indigo-400 bg-indigo-500/15 border-indigo-500/25'
        : score >= 70
          ? 'text-amber-400 bg-amber-500/15 border-amber-500/25'
          : 'text-gray-400 bg-gray-500/15 border-gray-500/25';

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-semibold ${color} ${sizeClass}`}
    >
      {score}% Profile Match
    </span>
  );
}
