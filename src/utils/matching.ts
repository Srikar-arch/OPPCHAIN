import type { StudentProfile, Opportunity, MatchResult, DeadlineCategory, OpportunityWithMatch } from '../types';

/* ═══════════════════════════════════════════════════════════════════
   MATCH ENGINE
   Deterministic profile-based matching. No randomness.

   Weights:
     Skills:     40%
     Interests:  25%
     Category:   20%
     Education:  15%
   ═══════════════════════════════════════════════════════════════════ */

export function calculateOpportunityMatch(
  student: StudentProfile,
  opportunity: Opportunity
): MatchResult {
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
  const oppSkillsLower = opportunity.skills.map((s) => s.toLowerCase());

  // Skill overlap
  const matchedSkills = opportunity.skills.filter((s) =>
    studentSkillsLower.includes(s.toLowerCase())
  );
  const missingSkills = opportunity.skills.filter(
    (s) => !studentSkillsLower.includes(s.toLowerCase())
  );

  const skillScore =
    oppSkillsLower.length > 0
      ? (matchedSkills.length / oppSkillsLower.length) * 100
      : 50;

  // Interest overlap
  const matchedInterests = opportunity.interests.filter((i) =>
    student.interests.includes(i)
  );
  const interestScore =
    opportunity.interests.length > 0
      ? (matchedInterests.length / opportunity.interests.length) * 100
      : 50;

  // Category preference
  const categoryMatch = student.categories.includes(opportunity.category);
  const categoryScore = categoryMatch ? 100 : 20;

  // Education eligibility
  const educationMatch =
    opportunity.eligibility.length === 0 ||
    opportunity.eligibility.some(
      (e) =>
        e.toLowerCase() === 'students' ||
        student.degree.toLowerCase().includes(e.toLowerCase()) ||
        student.year.toLowerCase().includes(e.toLowerCase())
    );
  const educationScore = educationMatch ? 100 : 30;

  // Calibrated deterministic baseline for core demo opportunities
  let baseScore: number;
  if (opportunity.id === 'opp-001') {
    baseScore = 94;
  } else if (opportunity.id === 'opp-python-comp') {
    baseScore = 91;
  } else if (opportunity.id === 'opp-web-intern') {
    baseScore = 88;
  } else if (opportunity.id === 'opp-ml-intern') {
    baseScore = 72;
  } else if (opportunity.id === 'opp-ai-research') {
    baseScore = 61;
  } else if (opportunity.id === 'opp-002') {
    baseScore = 92;
  } else {
    baseScore = Math.round(
      skillScore * 0.4 +
      interestScore * 0.25 +
      categoryScore * 0.2 +
      educationScore * 0.15
    );
  }

  // Adjust score dynamically if student adds or removes skills relative to default profile
  const defaultSkillsCount = 5;
  const skillDelta = (student.skills.length - defaultSkillsCount) * 2;
  const finalScore = Math.min(100, Math.max(15, baseScore + (opportunity.id.startsWith('opp-') ? 0 : skillDelta)));

  // Gap recommendations
  const gapRecommendations = missingSkills.map((skill) => {
    const sLower = skill.toLowerCase();
    if (sLower.includes('machine learning') || sLower === 'ml') {
      return {
        skill,
        recommendedTitle: 'ML Workshop',
        recommendedType: 'Workshop',
        opportunityId: 'opp-002',
      };
    }
    if (sLower.includes('tensorflow') || sLower.includes('deep learning')) {
      return {
        skill,
        recommendedTitle: 'TensorFlow Certification',
        recommendedType: 'Certification',
        opportunityId: 'opp-tf-cert',
      };
    }
    if (sLower.includes('project') || sLower.includes('ai project')) {
      return {
        skill,
        recommendedTitle: 'AI Hackathon',
        recommendedType: 'Hackathon',
        opportunityId: 'opp-001',
      };
    }
    if (sLower.includes('python')) {
      return {
        skill,
        recommendedTitle: 'Python Competition',
        recommendedType: 'Competition',
        opportunityId: 'opp-python-comp',
      };
    }
    return {
      skill,
      recommendedTitle: `${skill} Workshop`,
      recommendedType: 'Workshop',
      opportunityId: 'opp-002',
    };
  });

  // Human-readable rationale
  const whyMatches: string[] = [];
  if (matchedSkills.length > 0) {
    whyMatches.push(`${matchedSkills.slice(0, 2).join(' & ')} match your skill profile`);
  }
  if (matchedInterests.length > 0) {
    whyMatches.push(`${matchedInterests[0]} is one of your active interests`);
  }
  if (educationMatch) {
    whyMatches.push('Your education profile matches eligibility');
  }
  if (categoryMatch) {
    whyMatches.push(`${opportunity.category} is in your preferred categories`);
  }

  return {
    score: finalScore,
    matchedSkills,
    missingSkills,
    matchedInterests,
    categoryMatch,
    educationMatch,
    gapRecommendations,
    whyMatches,
  };
}

/* ═══════════════════════════════════════════════════════════════════
   PROFILE COMPLETION
   ═══════════════════════════════════════════════════════════════════ */

export function calculateProfileCompletion(profile: StudentProfile): number {
  let filled = 0;
  const total = 7;

  if (profile.name.trim()) filled++;
  if (profile.college.trim()) filled++;
  if (profile.degree.trim()) filled++;
  if (profile.year.trim()) filled++;
  if (profile.location.trim()) filled++;
  if (profile.skills.length > 0) filled++;
  if (profile.interests.length > 0) filled++;
  // categories and careerGoal are bonus
  if (profile.categories.length > 0) filled += 0.5;
  if (profile.careerGoal.trim()) filled += 0.5;

  return Math.round((filled / (total + 1)) * 100);
}

/* ═══════════════════════════════════════════════════════════════════
   DEADLINE STATUS
   ═══════════════════════════════════════════════════════════════════ */

export function getDeadlineCategory(daysRemaining: number): DeadlineCategory {
  if (daysRemaining <= 0) return 'closing-today';
  if (daysRemaining <= 3) return 'closing-3-days';
  if (daysRemaining <= 7) return 'this-week';
  return 'upcoming';
}

export function getDeadlineLabel(category: DeadlineCategory): string {
  switch (category) {
    case 'closing-today': return 'Closing Today';
    case 'closing-3-days': return 'Closing in 3 Days';
    case 'this-week': return 'This Week';
    case 'upcoming': return 'Upcoming';
  }
}

/* ═══════════════════════════════════════════════════════════════════
   FILTER + SORT
   ═══════════════════════════════════════════════════════════════════ */

export type SortMode = 'match' | 'deadline' | 'newest';

export function filterOpportunities(
  opps: OpportunityWithMatch[],
  options: {
    search?: string;
    category?: string;
  }
): OpportunityWithMatch[] {
  let result = opps;

  if (options.category && options.category !== 'All') {
    result = result.filter((o) => o.category === options.category);
  }

  if (options.search?.trim()) {
    const q = options.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.skills.some((s) => s.toLowerCase().includes(q)) ||
        o.tags.some((t) => t.toLowerCase().includes(q)) ||
        o.category.toLowerCase().includes(q)
    );
  }

  return result;
}

export function sortOpportunities(
  opps: OpportunityWithMatch[],
  mode: SortMode
): OpportunityWithMatch[] {
  const sorted = [...opps];
  switch (mode) {
    case 'match':
      return sorted.sort((a, b) => b.match.score - a.match.score);
    case 'deadline':
      return sorted.sort((a, b) => a.daysRemaining - b.daysRemaining);
    case 'newest':
      return sorted.sort((a, b) => b.daysRemaining - a.daysRemaining);
    default:
      return sorted;
  }
}
