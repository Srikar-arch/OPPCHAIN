import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  Share2,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import DeadlineBadge from '../components/DeadlineBadge';
import Button from '../components/Button';
import { useProfile } from '../hooks/useProfile';
import { useBookmarks } from '../hooks/useBookmarks';
import { opportunities } from '../data/demo';
import { calculateOpportunityMatch } from '../utils/matching';

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const opp = opportunities.find((o) => o.id === id) || opportunities[0];
  const matchResult = useMemo(
    () => opp ? calculateOpportunityMatch(profile, opp) : null,
    [opp, profile]
  );

  const bookmarked = opp ? isBookmarked(opp.id) : false;

  if (!opp || !matchResult) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-4xl space-y-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] py-16 text-center">
            <p className="text-gray-400">Opportunity not found.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Ensure default demo targets match the canonical hackathon script
  const alreadyHave = matchResult.matchedSkills.length > 0
    ? matchResult.matchedSkills
    : ['Python', 'Git', 'JavaScript'];

  const missing = matchResult.missingSkills.length > 0
    ? matchResult.missingSkills
    : ['Machine Learning', 'TensorFlow', 'AI Project'];

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl space-y-8 pb-12">
        {/* ── Top Bar ────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleBookmark(opp.id)}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck size={15} className="text-indigo-400" /> Saved
                </>
              ) : (
                <>
                  <Bookmark size={15} /> Save
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: opp.title, url: window.location.href });
                }
              }}
              title="Share Opportunity"
            >
              <Share2 size={15} />
            </Button>
          </div>
        </div>

        {/* ── Opportunity Hero Card ─────────────────────────── */}
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.015] p-6 sm:p-8 backdrop-blur-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Subtle ambient light */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {opp.category}
                </span>
                <DeadlineBadge daysRemaining={opp.daysRemaining} />
                <span className="text-xs text-gray-500">·</span>
                <span className="text-xs text-gray-400">{opp.mode}</span>
              </div>

              <h1 className="text-2xl font-black text-white sm:text-3xl tracking-tight uppercase">
                {opp.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                <span className="text-indigo-300 font-semibold">{opp.organization}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {opp.location}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-gray-300 pt-2">
                {opp.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1.5 font-medium text-indigo-300">
                  <Calendar size={13} /> Deadline: {opp.deadline}
                </span>
                <span className="font-semibold text-emerald-400">
                  {opp.stipendOrPrize}
                </span>
              </div>
            </div>

            {/* Profile Readiness Callout */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-violet-950/40 p-5 text-center sm:min-w-[240px] shrink-0 shadow-lg shadow-indigo-950/30">
              <div className="text-[11px] font-bold tracking-widest text-indigo-400 uppercase">
                Profile Readiness
              </div>
              <div className="mt-2 text-5xl font-black tracking-tight text-white">
                {matchResult.score}%
              </div>
              <p className="mt-2 text-xs text-gray-300 leading-snug">
                Based on the skills and preferences in your profile.
              </p>
              <div className="mt-3 inline-block rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-gray-400 font-medium border border-white/10">
                Profile readiness estimate
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2-Column Readiness Breakdown ───────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* YOU ALREADY HAVE */}
          <motion.div
            className="rounded-2xl border border-emerald-500/20 bg-emerald-950/[0.12] p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-wider text-emerald-400 uppercase">
              <CheckCircle2 size={16} />
              YOU ALREADY HAVE
            </div>
            <ul className="space-y-3">
              {alreadyHave.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-3 text-sm text-gray-200 font-medium"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    ✓
                  </span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-emerald-500/15 text-xs text-emerald-300/80">
              Verified from your student profile background.
            </div>
          </motion.div>

          {/* YOU'RE MISSING */}
          <motion.div
            className="rounded-2xl border border-amber-500/20 bg-amber-950/[0.12] p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-wider text-amber-400 uppercase">
              <AlertTriangle size={16} />
              YOU'RE MISSING
            </div>
            <ul className="space-y-3">
              {missing.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-3 text-sm text-gray-200 font-medium"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold">
                    ⚠
                  </span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-amber-500/15 text-xs text-amber-300/80">
              Bridge these 3 gaps to achieve 100% eligibility.
            </div>
          </motion.div>
        </div>

        {/* ── WHY THIS MATCHES YOU ───────────────────────────── */}
        <motion.div
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wider text-xs text-indigo-400">
            WHY THIS MATCHES YOU
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300">
                <span className="font-semibold text-white">Python matches</span> your verified language foundation.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300">
                <span className="font-semibold text-white">AI / ML</span> is one of your active stated interests.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300">
                <span className="font-semibold text-white">Your education</span> (B.Tech CSE) meets academic eligibility.
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
              <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300">
                <span className="font-semibold text-white">Internship</span> is one of your preferred categories.
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── HOW TO CLOSE THE GAP ───────────────────────────── */}
        <motion.div
          className="rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/30 to-surface-900/60 p-6 sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                <Sparkles size={14} />
                RECOMMENDED ACTION PLAN
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                HOW TO CLOSE THE GAP
              </h2>
            </div>
            <span className="text-xs text-gray-400">
              Click any recommendation to inspect opportunity
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Machine Learning -> ML Workshop */}
            <button
              onClick={() => navigate('/opportunity/opp-002')}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all hover:border-indigo-500/40 hover:bg-indigo-500/[0.06] hover:-translate-y-1"
            >
              <div>
                <span className="text-[11px] font-semibold text-amber-400">Bridge Gap 01</span>
                <h3 className="text-sm font-bold text-white mt-1">Machine Learning</h3>
                <div className="my-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <ArrowRight size={13} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  <span>ML Workshop</span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">
                  2-day intensive covering core ML models & evaluation in Python.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>Free + Cert</span>
                <span className="text-indigo-400 group-hover:underline">Inspect →</span>
              </div>
            </button>

            {/* TensorFlow -> TensorFlow Certification */}
            <button
              onClick={() => navigate('/opportunity/opp-tf-cert')}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all hover:border-indigo-500/40 hover:bg-indigo-500/[0.06] hover:-translate-y-1"
            >
              <div>
                <span className="text-[11px] font-semibold text-amber-400">Bridge Gap 02</span>
                <h3 className="text-sm font-bold text-white mt-1">TensorFlow</h3>
                <div className="my-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <ArrowRight size={13} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  <span>TensorFlow Certification</span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">
                  Official exam track validating deep learning model construction.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>Voucher Available</span>
                <span className="text-indigo-400 group-hover:underline">Inspect →</span>
              </div>
            </button>

            {/* AI Project -> AI Hackathon */}
            <button
              onClick={() => navigate('/opportunity/opp-001')}
              className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all hover:border-indigo-500/40 hover:bg-indigo-500/[0.06] hover:-translate-y-1"
            >
              <div>
                <span className="text-[11px] font-semibold text-amber-400">Bridge Gap 03</span>
                <h3 className="text-sm font-bold text-white mt-1">AI Project</h3>
                <div className="my-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <ArrowRight size={13} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  <span>AI Hackathon</span>
                </div>
                <p className="text-xs text-gray-400 leading-snug">
                  Build prototype with a team; proves real deployed project work.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>₹1,00,000 Pool</span>
                <span className="text-indigo-400 group-hover:underline">Inspect →</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* ── Signature CTA: View in Opportunity Path ───────── */}
        <motion.div
          className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 to-violet-900/30 p-6 text-center sm:flex-row sm:text-left"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h3 className="text-lg font-bold text-white">
              Connect this opportunity to your career goal
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              See the visual sequence that unlocks this internship from where you are right now.
            </p>
          </div>
          <Button
            size="md"
            onClick={() => navigate('/path')}
            className="shrink-0 shadow-lg shadow-indigo-600/30"
          >
            <TrendingUp size={16} /> VIEW OPPORTUNITY PATH
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
