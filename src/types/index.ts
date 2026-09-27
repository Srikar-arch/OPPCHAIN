/* ─── Student Profile ────────────────────────────────────────────── */

export interface StudentProfile {
  id: string;
  name: string;
  college: string;
  degree: string;
  year: string;
  location: string;
  skills: string[];
  interests: string[];
  categories: string[];
  careerGoal: string;
}

/* ─── Opportunity ────────────────────────────────────────────────── */

export type OpportunityCategory =
  | 'Internship'
  | 'Hackathon'
  | 'Competition'
  | 'Scholarship'
  | 'Course'
  | 'Workshop'
  | 'Certification';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  description: string;
  skills: string[];
  interests: string[];
  eligibility: string[];
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  deadline: string;
  daysRemaining: number;
  stipendOrPrize: string;
  externalUrl: string;
  featured: boolean;
  tags: string[];
}

/* ─── Match Result ───────────────────────────────────────────────── */

export interface SkillGapItem {
  skill: string;
  recommendedTitle: string;
  recommendedType: string;
  opportunityId?: string;
}

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedInterests: string[];
  categoryMatch: boolean;
  educationMatch: boolean;
  gapRecommendations: SkillGapItem[];
  whyMatches: string[];
}

/* ─── Opportunity with Match ─────────────────────────────────────── */

export interface OpportunityWithMatch extends Opportunity {
  match: MatchResult;
}

/* ─── Opportunity Path ───────────────────────────────────────────── */

export interface OpportunityNode {
  id: string;
  label: string;
  type: 'current' | 'step' | 'goal';
  category?: OpportunityCategory;
  status?: 'completed' | 'active' | 'locked' | 'target';
  badge?: 'COMPLETED' | 'NEXT' | 'LOCKED' | 'TARGET';
  icon?: string;
  description?: string;
  unlocks?: string;
  skillsGained?: string[];
  opportunityId?: string;
}

export interface OpportunityPathData {
  nodes: OpportunityNode[];
  edges: { from: string; to: string }[];
}

/* ─── Dashboard Stats ────────────────────────────────────────────── */

export interface DashboardStats {
  opportunitiesMatched: number;
  highMatch: number;
  savedCount: number;
  closingSoon: number;
}

/* ─── Deadline Status ────────────────────────────────────────────── */

export type DeadlineCategory =
  | 'closing-today'
  | 'closing-3-days'
  | 'this-week'
  | 'upcoming';

/* ─── Legacy compat — kept for Phase 1 components that still use it */
export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CareerGoal {
  id: string;
  title: string;
  description?: string;
  readiness: number;
  stepsRemaining: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  year: string;
  location: string;
  skills: Skill[];
  interests: string[];
  careerGoal: CareerGoal;
  avatarUrl?: string;
}
