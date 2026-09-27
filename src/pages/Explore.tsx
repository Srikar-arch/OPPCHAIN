import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import OpportunityCard from '../components/OpportunityCard';
import { useProfile } from '../hooks/useProfile';
import { useBookmarks } from '../hooks/useBookmarks';
import { opportunities } from '../data/demo';
import {
  calculateOpportunityMatch,
  filterOpportunities,
  sortOpportunities,
} from '../utils/matching';
import type { SortMode } from '../utils/matching';
import type { OpportunityCategory } from '../types';

const categories: (OpportunityCategory | 'All')[] = [
  'All',
  'Internship',
  'Hackathon',
  'Competition',
  'Scholarship',
  'Course',
  'Workshop',
  'Certification',
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const { profile } = useProfile();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState<OpportunityCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortMode>('match');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  /* ── Compute matches, then filter & sort ──────────── */
  const results = useMemo(() => {
    const withMatch = opportunities.map((opp) => ({
      ...opp,
      match: calculateOpportunityMatch(profile, opp),
    }));

    const filtered = filterOpportunities(withMatch, {
      search,
      category: activeCategory,
    });

    return sortOpportunities(filtered, sortBy);
  }, [profile, search, activeCategory, sortBy]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* ── Header ───────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Explore Opportunities
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Discover opportunities matched to your profile and goals.
          </p>
        </motion.div>

        {/* ── Search + Sort ─────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities, skills or organizations..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/[0.05]"
              aria-label="Search opportunities"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-gray-300 outline-none focus:border-indigo-500/50"
              aria-label="Sort by"
            >
              <option value="match">Best Match</option>
              <option value="deadline">Deadline Soon</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </motion.div>

        {/* ── Category filters ─────────────────────────────── */}
        <motion.div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {cat === 'All' ? 'All' : cat + 's'}
            </button>
          ))}
        </motion.div>

        {/* ── Result count ─────────────────────────────────── */}
        <p className="text-sm text-gray-500">
          {results.length} {results.length === 1 ? 'opportunity' : 'opportunities'} found
        </p>

        {/* ── Results ──────────────────────────────────────── */}
        {results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((opp, i) => (
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
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] py-16 text-center">
            <p className="text-gray-400">
              No opportunities found matching your search.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
