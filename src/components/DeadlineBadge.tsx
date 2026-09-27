import { Clock } from 'lucide-react';

interface DeadlineBadgeProps {
  daysRemaining: number;
}

export default function DeadlineBadge({ daysRemaining }: DeadlineBadgeProps) {
  const label =
    daysRemaining <= 0
      ? 'Closing today'
      : daysRemaining === 1
        ? '1 day left'
        : `${daysRemaining} days left`;

  const urgency =
    daysRemaining <= 3
      ? 'text-red-400'
      : daysRemaining <= 7
        ? 'text-amber-400'
        : 'text-gray-400';

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${urgency}`}>
      <Clock size={13} />
      {label}
    </span>
  );
}
