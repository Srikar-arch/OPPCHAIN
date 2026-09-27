import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  GraduationCap,
  Calendar,
  Building2,
  Plus,
  X,
  Save,
  Check,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Button from '../components/Button';
import { useProfile } from '../hooks/useProfile';
import { calculateProfileCompletion } from '../utils/matching';
import { interestOptions, categoryOptions, careerGoalOptions } from '../data/demo';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const [skillInput, setSkillInput] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => calculateProfileCompletion(profile), [profile]);

  /* ── Add skill ───────────────────────────────────────── */
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !profile.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())) {
      updateProfile({ skills: [...profile.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skill) });
  };

  /* ── Toggle interest ────────────────────────────────── */
  const toggleInterest = (interest: string) => {
    const next = profile.interests.includes(interest)
      ? profile.interests.filter((i) => i !== interest)
      : [...profile.interests, interest];
    updateProfile({ interests: next });
  };

  /* ── Toggle category ────────────────────────────────── */
  const toggleCategory = (cat: string) => {
    const next = profile.categories.includes(cat)
      ? profile.categories.filter((c) => c !== cat)
      : [...profile.categories, cat];
    updateProfile({ categories: next });
  };

  /* ── Save handler ───────────────────────────────────── */
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-8 pb-8">
        {/* ── Header + Save ────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Your Opportunity Profile
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              This powers your opportunity matching and path recommendations.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Button size="sm" onClick={handleSave}>
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? 'Saved!' : 'Save Profile'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard <ArrowRight size={14} />
            </Button>
          </div>
        </motion.div>

        {/* ── Profile Completion ───────────────────────────── */}
        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Profile Completion
            </span>
            <span className="text-sm font-bold text-white">{completion}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {completion < 100
              ? 'Complete your profile to get better opportunity matches.'
              : 'Your profile is complete. Opportunities are fully personalized.'}
          </p>
        </motion.div>

        {/* ── Avatar + Name ────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shrink-0">
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="min-w-0 flex-1">
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-lg font-semibold text-white outline-none focus:border-indigo-500 transition-colors"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              placeholder="Your name"
              aria-label="Full name"
            />
          </div>
        </motion.div>

        {/* ── Personal Information ─────────────────────────── */}
        <motion.section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldInput
              icon={Building2}
              label="College"
              value={profile.college}
              onChange={(v) => updateProfile({ college: v })}
            />
            <FieldInput
              icon={GraduationCap}
              label="Degree"
              value={profile.degree}
              onChange={(v) => updateProfile({ degree: v })}
            />
            <FieldInput
              icon={Calendar}
              label="Year"
              value={profile.year}
              onChange={(v) => updateProfile({ year: v })}
            />
            <FieldInput
              icon={MapPin}
              label="Location"
              value={profile.location}
              onChange={(v) => updateProfile({ location: v })}
            />
          </div>
        </motion.section>

        {/* ── Skills ───────────────────────────────────────── */}
        <motion.section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Skills
          </h3>
          <div className="mb-4 flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <motion.span
                key={skill}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-3 py-1.5 text-sm font-medium text-indigo-300"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="rounded p-0.5 hover:bg-white/10 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={12} />
                </button>
              </motion.span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill..."
              aria-label="Add a skill"
            />
            <Button variant="secondary" size="sm" onClick={addSkill} aria-label="Add skill">
              <Plus size={14} />
            </Button>
          </div>
        </motion.section>

        {/* ── Interests ────────────────────────────────────── */}
        <motion.section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const active = profile.interests.includes(interest);
              return (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                      : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/[0.15] hover:text-gray-200'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Opportunity Categories ───────────────────────── */}
        <motion.section
          className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Opportunity Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((cat) => {
              const active = profile.categories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? 'border-violet-500/40 bg-violet-500/15 text-violet-300'
                      : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-white/[0.15] hover:text-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* ── Career Goal ──────────────────────────────────── */}
        <motion.section
          className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/[0.06] to-violet-500/[0.03] p-6"
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <h3 className="mb-4 text-sm font-semibold tracking-wider text-indigo-400 uppercase">
            Career Goal
          </h3>
          <div className="relative mb-3">
            <select
              value={
                careerGoalOptions.filter((g) => g !== 'Other').includes(profile.careerGoal)
                  ? profile.careerGoal
                  : (profile.careerGoal ? 'Other' : '')
              }
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'Other') {
                  updateProfile({ careerGoal: customGoal.trim() || 'Other' });
                } else {
                  updateProfile({ careerGoal: val });
                }
              }}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-base font-semibold text-white outline-none focus:border-indigo-500 transition-colors"
              aria-label="Career goal"
            >
              <option value="" className="bg-gray-900">Select your career goal</option>
              {careerGoalOptions.map((goal) => (
                <option key={goal} value={goal} className="bg-gray-900">
                  {goal}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
          {(profile.careerGoal === 'Other' ||
            (!careerGoalOptions.filter((g) => g !== 'Other').includes(profile.careerGoal) &&
              Boolean(profile.careerGoal))) && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
              value={
                !careerGoalOptions.includes(profile.careerGoal)
                  ? profile.careerGoal
                  : customGoal
              }
              onChange={(e) => {
                setCustomGoal(e.target.value);
                updateProfile({ careerGoal: e.target.value });
              }}
              placeholder="Describe your career goal..."
              aria-label="Custom career goal"
            />
          )}
        </motion.section>
      </div>
    </PageTransition>
  );
}

/* ─── Field input helper ─────────────────────────────────────────── */
interface FieldInputProps {
  icon: typeof MapPin;
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function FieldInput({ icon: Icon, label, value, onChange }: FieldInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-gray-500">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
      </div>
    </div>
  );
}
