import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target,
  Layers,
  Zap,
  Bookmark,
  CalendarClock,
  ArrowRight,
  UserPlus,
  Clock,
  AlertCircle,
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/StatCard';
import OpportunityCard from '../components/OpportunityCard';
import SkillChip from '../components/SkillChip';
import MatchBadge from '../components/MatchBadge';
import Button from '../components/Button';
import { useProfile } from '../hooks/useProfile';
import { useBookmarks } from '../hooks/useBookmarks';
import { opportunities } from '../data/demo';
import {
  calculateOpportunityMatch,
  calculateProfileCompletion,
  getDeadlineCategory,
  getDeadlineLabel,
} from '../utils/matching';
import type { DeadlineCategory } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { savedIds, toggleBookmark, isBookmarked } = useBookmarks();
  const completion = useMemo(() => calculateProfileCompletion(profile), [profile]);
  const hasProfile = completion > 20;

  /* ── Compute all matches ───────────────────────────── */
  const allMatched = useMemo(() => {
    return opportunities
      .map((opp) => ({
        ...opp,
        match: calculateOpportunityMatch(profile, opp),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [profile]);

  /* ── Targeted Opportunities for Core Demo ─────────── */
  const readyNow = useMemo(() => {
    // 1. AI Innovation Hackathon (94%)
    // 2. Python Competition (91%)
    // 3. Web Development Internship (88%)
    const keys = ['opp-001', 'opp-python-comp', 'opp-web-intern'];
    const selected = keys
      .map((k) => allMatched.find((o) => o.id === k))
      .filter((o): o is NonNullable<typeof o> => Boolean(o));

    if (selected.length === 3) return selected;
    // Fallback if custom filters
    return allMatched.filter((o) => o.match.score >= 85).slice(0, 3);
  }, [allMatched]);

  const workToward = useMemo(() => {
    // 1. Machine Learning Internship / AI / ML Internship (72%)
    // 2. AI Research Internship (61%)
    const keys = ['opp-ml-intern', 'opp-ai-research'];
    const selected = keys
      .map((k) => allMatched.find((o) => o.id === k))
      .filter((o): o is NonNullable<typeof o> => Boolean(o));

    if (selected.length >= 2) return selected;
    return allMatched.filter((o) => o.match.score < 85 && o.match.score >= 55).slice(0, 2);
  }, [allMatched]);

  /* ── Stats ─────────────────────────────────────────── */
  const stats = useMemo(() => {
    const matched = allMatched.filter((o) => o.match.score >= 50);
    const high = allMatched.filter((o) => o.match.score >= 80);
    const closing = allMatched.filter((o) => o.daysRemaining <= 7);
    return {
      opportunitiesMatched: matched.length,
      highMatch: high.length,
      savedCount: savedIds.length,
      closingSoon: closing.length,
    };
  }, [allMatched, savedIds]);

  /* ── Deadline groups ───────────────────────────────── */
  const deadlineGroups = useMemo(() => {
    const groups: Record<DeadlineCategory, typeof allMatched> = {
      'closing-today': [],
      'closing-3-days': [],
      'this-week': [],
      'upcoming': [],
    };
    allMatched.forEach((opp) => {
      const cat = getDeadlineCategory(opp.daysRemaining);
      groups[cat].push(opp);
    });
    return groups;
  }, [allMatched]);

  const statIcons = [
    { icon: Layers, accent: 'text-indigo-400', label: 'Opportunities matched', value: stats.opportunitiesMatched },
    { icon: Zap, accent: 'text-emerald-400', label: 'High profile matches', value: stats.highMatch },
    { icon: Bookmark, accent: 'text-violet-400', label: 'Saved opportunities', value: stats.savedCount },
    { icon: CalendarClock, accent: 'text-rose-400', label: 'Closing soon', value: stats.closingSoon },
  ];

  const skillGaps = [
    {
      skill: 'Machine Learning',
      neededFor: 'AI / ML Internship & Research',
      recommendedAction: 'Machine Learning Workshop',
      oppId: 'opp-002',
    },
    {
      skill: 'TensorFlow',
      neededFor: 'Deep Learning Model Prototyping',
      recommendedAction: 'TensorFlow Developer Certification',
      oppId: 'opp-tf-cert',
    },
    {
      skill: 'AI Project',
      neededFor: 'Portfolio Proof & Demonstration',
      recommendedAction: 'AI Innovation Hackathon',
      oppId: 'opp-001',
    },
  ];

  /* ── Empty state ───────────────────────────────────── */
  if (!hasProfile) {
    return (
      <PageTransition>
        <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center">
          <motion.div
            className="mb-6 inline-flex rounded-2xl bg-indigo-500/10 p-5 text-indigo-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <UserPlus size={32} />
          </motion.div>
          <motion.h1
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Build your opportunity profile
          </motion.h1>
          <motion.p
            className="mt-3 text-sm leading-relaxed text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tell OPPCHAIN about your skills, interests and goals to personalize
            your opportunities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Button onClick={() => navigate('/profile')}>
              Build My Profile <ArrowRight size={16} />
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* ── Greeting Header ─────────────────────────────────── */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              className="text-2xl font-bold text-white sm:text-3xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Good morning, {profile.name || 'Srikar'} 👋
            </motion.h1>
            <motion.p
              className="mt-1 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Here's what's happening across your opportunity journey.
            </motion.p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/path')}>
            <TrendingUp size={15} /> View Path
          </Button>
        </div>

        {/* ── Core Demo Header Cards: GOAL + READINESS ──────── */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* YOUR GOAL */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.03] p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-indigo-400 uppercase">
              <Target size={14} />
              YOUR GOAL
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white">
              {profile.careerGoal || 'AI / ML Engineer'}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              Primary target specialization · 3 milestone stages identified
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-300">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span>Foundation active: Python, Git & Core CS</span>
            </div>
          </motion.div>

          {/* PROFILE READINESS */}
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.03] p-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
                PROFILE READINESS
              </div>
              <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                Target Role Fit
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-white">72%</span>
              <span className="text-xs text-gray-400">
                Overall readiness toward AI / ML Internship
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              Profile readiness estimate based on matched skills & target criteria
            </p>
          </motion.div>
        </div>

        {/* ── YOUR NEXT MOVE (Signature Action Banner) ────────── */}
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-violet-950/30 to-surface-900/80 p-6 shadow-xl shadow-indigo-950/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                <Sparkles size={14} className="text-indigo-400" />
                YOUR NEXT MOVE
              </div>
              <p className="text-base font-semibold text-white sm:text-lg">
                Complete an ML workshop → unlock AI hackathon → build project → target internship
              </p>
              <p className="text-xs text-gray-400">
                OPPCHAIN calculated this 4-step sequence to bridge your active skill gaps with maximum efficiency.
              </p>
            </div>
            <Button
              size="md"
              onClick={() => navigate('/path')}
              className="shrink-0 shadow-lg shadow-indigo-600/30"
            >
              VIEW OPPORTUNITY PATH <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>

        {/* ── Main 2-Column: READY NOW & WORK TOWARD + SKILL GAPS */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: READY NOW + WORK TOWARD (2 cols) */}
          <div className="space-y-8 lg:col-span-2">
            {/* ── READY NOW ─────────────────────────────────── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                    READY NOW
                  </h2>
                  <p className="text-xs text-gray-400">
                    High profile match based on your verified skills & background
                  </p>
                </div>
                <button
                  onClick={() => navigate('/explore')}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {readyNow.map((opp, i) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    index={i}
                    isBookmarked={isBookmarked(opp.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))}
              </div>
            </section>

            {/* ── WORK TOWARD ───────────────────────────────── */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-amber-400" />
                    WORK TOWARD
                  </h2>
                  <p className="text-xs text-gray-400">
                    High-impact target opportunities you can unlock by bridging key skills
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {workToward.map((opp, i) => (
                  <motion.div
                    key={opp.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-indigo-500/30 hover:bg-white/[0.05]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="inline-block rounded-md border border-indigo-500/25 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 mb-1.5 uppercase">
                            {opp.category}
                          </span>
                          <h3 className="text-base font-bold text-white truncate">
                            {opp.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">{opp.organization}</p>
                        </div>
                        <MatchBadge score={opp.match.score} />
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                        {opp.description}
                      </p>

                      {/* Missing skills callout */}
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-3 mb-4">
                        <div className="text-[11px] font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                          <AlertCircle size={12} />
                          Missing to Unlock:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {opp.match.missingSkills.slice(0, 3).map((sk) => (
                            <span
                              key={sk}
                              className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-200"
                            >
                              ⚠ {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/opportunity/${opp.id}`)}
                        className="flex-1"
                      >
                        Inspect Opportunity
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/path')}
                        title="View Opportunity Path"
                      >
                        <TrendingUp size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: YOUR SKILL GAPS + RADAR + SKILLS */}
          <div className="space-y-6">
            {/* ── YOUR SKILL GAPS ──────────────────────────── */}
            <motion.div
              className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-400" />
                    YOUR SKILL GAPS
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Skills required to reach 100% readiness for your goal
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {skillGaps.map((gap) => (
                  <div
                    key={gap.skill}
                    className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{gap.skill}</span>
                      <span className="text-[10px] font-medium text-amber-400 uppercase tracking-wider">
                        Priority Gap
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Target: {gap.neededFor}
                    </p>
                    <button
                      onClick={() => navigate(`/opportunity/${gap.oppId}`)}
                      className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20"
                    >
                      <Search size={12} />
                      FIND OPPORTUNITIES
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── DEADLINE RADAR ───────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock size={16} className="text-rose-400" />
                <h3 className="text-sm font-bold text-white">Deadline Radar</h3>
              </div>
              <div className="space-y-3">
                {(['closing-today', 'closing-3-days', 'this-week', 'upcoming'] as const).map((cat) => {
                  const items = deadlineGroups[cat];
                  if (items.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        <span>{getDeadlineLabel(cat)}</span>
                        <span>{items.length}</span>
                      </div>
                      <div className="space-y-1.5">
                        {items.slice(0, 2).map((opp) => (
                          <button
                            key={opp.id}
                            onClick={() => navigate(`/opportunity/${opp.id}`)}
                            className="flex w-full items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.04]"
                          >
                            <span className="truncate text-gray-200 font-medium">{opp.title}</span>
                            <span className={`shrink-0 ml-2 font-bold ${
                              opp.daysRemaining <= 3 ? 'text-red-400' : 'text-amber-400'
                            }`}>
                              {opp.daysRemaining === 0 ? 'Today' : `${opp.daysRemaining}d`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SKILL SNAPSHOT ───────────────────────────── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <h3 className="mb-3 text-sm font-bold text-white">Skill Snapshot</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <SkillChip key={skill} label={skill} size="sm" variant="highlight" />
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                Your profile is getting stronger. Bridge 3 skill gaps to unlock full internship readiness.
              </p>
            </div>
          </div>
        </div>

        {/* ── Stat Bar ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statIcons.map((s, i) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              value={s.value}
              label={s.label}
              accent={s.accent}
              index={i}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
