import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Lock,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  BookOpen,
  Trophy,
  Wrench,
  Terminal,
  User,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { useProfile } from '../hooks/useProfile';
import { demoOpportunityPath } from '../data/demo';
import type { OpportunityNode } from '../types';

export interface PathPageProps {
  title?: string;
  subtitle?: string;
}

const nodeIcons: Record<string, typeof Target> = {
  User: User,
  Terminal: Terminal,
  BookOpen: BookOpen,
  Trophy: Trophy,
  Wrench: Wrench,
  Target: Target,
};

const statusConfig = {
  COMPLETED: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    label: 'COMPLETED',
  },
  NEXT: {
    bg: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-lg shadow-indigo-500/10',
    badge: 'bg-indigo-500/25 text-indigo-200 border-indigo-500/40',
    dot: 'bg-indigo-400 animate-ping',
    label: 'NEXT',
  },
  LOCKED: {
    bg: 'bg-white/[0.025] border-white/[0.08] text-gray-400',
    badge: 'bg-white/[0.06] text-gray-400 border-white/[0.08]',
    dot: 'bg-gray-600',
    label: 'LOCKED',
  },
  TARGET: {
    bg: 'bg-gradient-to-r from-indigo-950/60 to-violet-950/60 border-indigo-500/40 text-white shadow-xl shadow-indigo-500/20',
    badge: 'bg-indigo-500/30 text-indigo-200 border-indigo-500/50',
    dot: 'bg-indigo-400',
    label: 'TARGET',
  },
};

export default function PathPage({
  title = 'YOUR OPPORTUNITY PATH',
  subtitle = 'See how individual opportunities can connect toward your goal.',
}: PathPageProps = {}) {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // Nodes ordered from bottom (YOU ARE HERE) to top (TARGET INTERNSHIP)
  // Reversed for display so TARGET is at the top, or bottom-up
  // Let's display from top (TARGET) down to bottom (YOU ARE HERE), matching the visual pyramid:
  const rawNodes = demoOpportunityPath.nodes;
  const nodes = [...rawNodes].reverse(); // Target at top, You at bottom

  const [selectedNode, setSelectedNode] = useState<OpportunityNode>(
    rawNodes.find((n) => n.id === 'n-ml-workshop') || rawNodes[2]
  );

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl space-y-8 pb-16">
        {/* ── Top Header ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-indigo-400 uppercase">
              <TrendingUp size={14} />
              OPPORTUNITY INTELLIGENCE MAP
            </div>
            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl tracking-tight">
              {title}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-2 text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                Target Role
              </div>
              <div className="text-xs font-bold text-white">
                {profile.careerGoal || 'AI / ML Engineer'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Visual Journey + Inspector 2-Column Layout ─────── */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Visual Path (7 cols) */}
          <div className="relative space-y-4 lg:col-span-7">
            {/* Background glowing vertical axis */}
            <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-violet-500/60 to-emerald-500/40" />

            {nodes.map((node, i) => {
              const IconComp = nodeIcons[node.icon || 'Target'] || Target;
              const badgeKey = node.badge || (node.status === 'completed' ? 'COMPLETED' : node.status === 'active' ? 'NEXT' : node.status === 'target' ? 'TARGET' : 'LOCKED');
              const conf = statusConfig[badgeKey as keyof typeof statusConfig] || statusConfig.LOCKED;
              const isSelected = selectedNode?.id === node.id;
              const isNext = badgeKey === 'NEXT' && node.status === 'active';

              return (
                <motion.div
                  key={node.id}
                  className="relative flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {/* Node Anchor Icon */}
                  <button
                    onClick={() => setSelectedNode(node)}
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105'
                        : isNext
                          ? 'border-indigo-500/50 bg-indigo-500/20 text-indigo-300 animate-pulse'
                          : conf.bg
                    }`}
                    aria-label={`Select ${node.label}`}
                  >
                    <IconComp size={22} />
                    {isNext && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />
                      </span>
                    )}
                  </button>

                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`flex-1 cursor-pointer rounded-2xl border p-4.5 transition-all ${
                      isSelected
                        ? 'border-indigo-500/50 bg-indigo-950/30 shadow-xl shadow-indigo-950/40 -translate-y-0.5'
                        : isNext
                          ? 'border-indigo-500/30 bg-indigo-950/15 hover:border-indigo-500/40 hover:bg-white/[0.04]'
                          : 'border-white/[0.06] bg-white/[0.025] hover:border-white/[0.12] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {node.category && (
                          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-gray-400 uppercase">
                            {node.category}
                          </span>
                        )}
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${conf.badge}`}
                        >
                          {conf.label}
                        </span>
                      </div>

                      {node.status === 'completed' ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 size={13} /> Completed
                        </span>
                      ) : isNext ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400">
                          <Zap size={13} /> Recommended Step
                        </span>
                      ) : node.status === 'target' ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Target size={13} /> Destination Goal
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                          <Lock size={12} /> Locked
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {node.label}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {node.description}
                    </p>

                    {/* Quick skills pill */}
                    {node.skillsGained && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {node.skillsGained.map((sk) => (
                          <span
                            key={sk}
                            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-gray-300 font-medium border border-white/[0.06]"
                          >
                            +{sk}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Node Inspector Panel (5 cols sticky) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 via-surface-900/90 to-surface-900/95 p-6 shadow-2xl backdrop-blur-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedNode.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-md border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        {selectedNode.category || 'Milestone Node'}
                      </span>
                      <h2 className="mt-2 text-xl font-black text-white tracking-tight">
                        {selectedNode.label}
                      </h2>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-400">
                      <Sparkles size={20} />
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-300">
                    {selectedNode.description}
                  </p>

                  {/* What it unlocks */}
                  {selectedNode.unlocks && (
                    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.08] p-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-1">
                        <Zap size={13} className="text-indigo-400" />
                        What This Unlocks
                      </div>
                      <p className="text-xs text-white leading-relaxed font-medium">
                        {selectedNode.unlocks}
                      </p>
                    </div>
                  )}

                  {/* Skills Gained */}
                  {selectedNode.skillsGained && selectedNode.skillsGained.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Skills Added To Your Profile
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNode.skillsGained.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"
                          >
                            <CheckCircle2 size={12} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Link */}
                  {selectedNode.opportunityId ? (
                    <div className="pt-2">
                      <Button
                        size="md"
                        onClick={() => navigate(`/opportunity/${selectedNode.opportunityId}`)}
                        className="w-full justify-center shadow-lg shadow-indigo-600/30"
                      >
                        Inspect Opportunity <ArrowRight size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center text-xs text-gray-400 font-medium">
                      Foundational Stage Verified ✓
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
