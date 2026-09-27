import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookmarkCheck, MapPin } from 'lucide-react';
import type { OpportunityWithMatch } from '../types';
import SkillChip from './SkillChip';
import MatchBadge from './MatchBadge';
import DeadlineBadge from './DeadlineBadge';
import Button from './Button';

interface OpportunityCardProps {
  opportunity: OpportunityWithMatch;
  index?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Hackathon: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  Workshop: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  Internship: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Competition: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  Scholarship: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  Course: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  Certification: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
};

export default function OpportunityCard({
  opportunity,
  index = 0,
  isBookmarked = false,
  onToggleBookmark,
}: OpportunityCardProps) {
  const navigate = useNavigate();
  const BookmarkIcon = isBookmarked ? BookmarkCheck : Bookmark;

  return (
    <motion.article
      className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white truncate">
            {opportunity.title}
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">{opportunity.organization}</p>
        </div>
        <motion.button
          className={`shrink-0 rounded-lg p-1.5 transition-colors ${
            isBookmarked
              ? 'text-indigo-400 bg-indigo-500/10'
              : 'text-gray-500 hover:text-indigo-400 hover:bg-white/5'
          }`}
          onClick={() => onToggleBookmark?.(opportunity.id)}
          whileTap={{ scale: 0.85 }}
          aria-label={isBookmarked ? `Unsave ${opportunity.title}` : `Save ${opportunity.title}`}
        >
          <BookmarkIcon size={16} />
        </motion.button>
      </div>

      {/* Description */}
      <p className="mb-3 text-xs leading-relaxed text-gray-500 line-clamp-2">
        {opportunity.description}
      </p>

      {/* Meta row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
            categoryColors[opportunity.category] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/25'
          }`}
        >
          {opportunity.category}
        </span>
        <MatchBadge score={opportunity.match.score} />
        <DeadlineBadge daysRemaining={opportunity.daysRemaining} />
      </div>

      {/* Location + mode */}
      <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500">
        <MapPin size={13} />
        {opportunity.location}
        {opportunity.mode !== 'Offline' && opportunity.location !== 'Online' && (
          <span className="ml-1 text-gray-600">· {opportunity.mode}</span>
        )}
      </div>

      {/* Skills */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {opportunity.skills.slice(0, 4).map((skill) => (
          <SkillChip
            key={skill}
            label={skill}
            variant={
              opportunity.match.matchedSkills.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase()
              )
                ? 'highlight'
                : 'default'
            }
          />
        ))}
      </div>

      {/* Action */}
      <div className="mt-auto">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/opportunity/${opportunity.id}`)}
          className="w-full"
        >
          View Opportunity
        </Button>
      </div>
    </motion.article>
  );
}
