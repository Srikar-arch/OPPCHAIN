import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import OpportunityCard from '../components/OpportunityCard';
import Button from '../components/Button';
import { useProfile } from '../hooks/useProfile';
import { useBookmarks } from '../hooks/useBookmarks';
import { opportunities } from '../data/demo';
import { calculateOpportunityMatch } from '../utils/matching';

export default function Saved() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { savedIds, toggleBookmark, isBookmarked } = useBookmarks();

  const savedOpportunities = useMemo(() => {
    return opportunities
      .filter((o) => savedIds.includes(o.id))
      .map((opp) => ({
        ...opp,
        match: calculateOpportunityMatch(profile, opp),
      }));
  }, [savedIds, profile]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Saved Opportunities
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            {savedOpportunities.length > 0
              ? `You have ${savedOpportunities.length} saved ${savedOpportunities.length === 1 ? 'opportunity' : 'opportunities'}.`
              : 'Opportunities you save will appear here.'}
          </p>
        </motion.div>

        {/* Content */}
        {savedOpportunities.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedOpportunities.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                index={i}
                isBookmarked={isBookmarked(opp.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] py-20 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4 inline-flex rounded-2xl bg-white/[0.04] p-4 text-gray-500">
              <Bookmark size={28} />
            </div>
            <h2 className="text-lg font-semibold text-white">
              No saved opportunities yet
            </h2>
            <p className="mt-2 max-w-xs text-sm text-gray-400">
              Explore opportunities and bookmark the ones you're interested in to find them quickly later.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/explore')}>
                Explore Opportunities <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
