import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Globe,
  CalendarClock,
  HelpCircle,
  UserPlus,
  Search,
  Zap,
  ArrowRight,
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import Logo from '../components/Logo';
import HeroGraph from '../components/HeroGraph';
import OpportunityPath from '../components/OpportunityPath';
import PageTransition from '../components/PageTransition';
import { demoOpportunityPath } from '../data/demo';

/* ─── Stagger helpers ────────────────────────────────────────────── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ─── Problem cards data ─────────────────────────────────────────── */
const problems = [
  {
    icon: Globe,
    title: 'Too many platforms',
    desc: 'Opportunities are scattered across dozens of websites and communities. Keeping track is overwhelming.',
  },
  {
    icon: CalendarClock,
    title: 'Scattered deadlines',
    desc: "Important deadlines slip by because there's no single place to see what's closing soon.",
  },
  {
    icon: HelpCircle,
    title: 'No clear next step',
    desc: "Even when you find opportunities, it's hard to know which ones you're ready for — and what could come next.",
  },
];

/* ─── Steps data ─────────────────────────────────────────────────── */
const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Build your profile',
    desc: 'Add your skills, interests, and career goals so OPPCHAIN understands where you are.',
  },
  {
    num: '02',
    icon: Search,
    title: 'Discover opportunities',
    desc: 'Get matched with internships, hackathons, workshops and more — ranked by your readiness.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Unlock your next move',
    desc: 'See how completing one opportunity can unlock the next step toward your goal.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />

        {/* ─── Navbar ──────────────────────────────────────────── */}
        <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="text-lg font-bold tracking-tight text-white">
              OPPCHAIN
            </span>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <button
              onClick={() => navigate('/explore')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Explore
            </button>
            <Button size="sm" onClick={() => navigate('/profile')}>
              Get Started
            </Button>
          </div>
        </nav>

        {/* ─── Hero ────────────────────────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-24 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.span
                variants={fadeUp}
                className="mb-4 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-indigo-400 uppercase"
              >
                Opportunity Intelligence for Students
              </motion.span>

              <motion.h1
                variants={fadeUp}
                className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                From where you are{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
                  → to where you want to be.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-lg text-base leading-relaxed text-gray-400 sm:text-lg"
              >
                OPPCHAIN connects your skills, goals and opportunities to help
                you discover what you can pursue now — and what can unlock what
                comes next.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button size="lg" onClick={() => navigate('/profile')}>
                  Build My Opportunity Profile
                  <ArrowRight size={18} />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Demo
                </Button>
              </motion.div>

              {/* Visual Journey Flow Pipeline */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-xs font-semibold backdrop-blur-md"
              >
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-400" /> YOU
                </span>
                <span className="text-gray-600">→</span>
                <span className="text-gray-300">SKILL</span>
                <span className="text-gray-600">→</span>
                <span className="text-violet-300">OPPORTUNITY</span>
                <span className="text-gray-600">→</span>
                <span className="text-indigo-300">NEXT OPPORTUNITY</span>
                <span className="text-gray-600">→</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  🎯 GOAL
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Hero Graph */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <HeroGraph />
            </motion.div>
          </div>
        </section>

        {/* ─── Section 1: The Problem ─────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          <SectionHeading
            title="The opportunity isn't the problem. Finding your next move is."
          />
          <motion.div
            className="grid gap-6 sm:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {problems.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                  <p.icon size={22} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── Section 2: How it works ────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          <SectionHeading
            eyebrow="How OPPCHAIN works"
            title="Three steps to your next opportunity"
          />
          <div className="relative mx-auto max-w-3xl">
            {/* Vertical progression line */}
            <motion.div
              className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-indigo-500/40 via-violet-500/30 to-transparent sm:block"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              style={{ transformOrigin: 'top' }}
            />
            <motion.div
              className="space-y-10"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {steps.map((s) => (
                <motion.div
                  key={s.num}
                  variants={fadeUp}
                  className="relative flex gap-6 sm:pl-16"
                >
                  {/* Step number circle */}
                  <div className="hidden sm:flex absolute left-0 top-0 h-12 w-12 items-center justify-center rounded-full border border-indigo-500/30 bg-surface-800 text-sm font-bold text-indigo-400">
                    {s.num}
                  </div>
                  <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="inline-flex rounded-lg bg-indigo-500/10 p-2 text-indigo-400 sm:hidden">
                        <s.icon size={18} />
                      </span>
                      <h3 className="text-base font-semibold text-white">
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── Section 3: Signature Feature ───────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
          <SectionHeading
            eyebrow="Signature feature"
            title="Opportunities are connected. Your journey should be too."
          />
          <div className="mx-auto max-w-sm">
            <OpportunityPath data={demoOpportunityPath} />
            <motion.p
              className="mt-8 text-center text-sm leading-relaxed text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              OPPCHAIN doesn't just tell you what exists. It helps you
              understand what could come next.
            </motion.p>
          </div>
        </section>

        {/* ─── Section 4: Final CTA ───────────────────────────── */}
        <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 text-center">
          <SectionHeading title="Your next opportunity is closer than you think." />
          <Button size="lg" onClick={() => navigate('/profile')}>
            Build My Profile
            <ArrowRight size={18} />
          </Button>
        </section>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center text-xs text-gray-600">
          OPPCHAIN v0.1 — Opportunity Intelligence for Students
        </footer>
      </div>
    </PageTransition>
  );
}
