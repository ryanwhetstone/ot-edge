// SPM-2 Home Form (Ages 2-5) Score Interpretation
// Raw score ranges for each section to determine clinical categories

export type ScoreCategory = 'Typical' | 'Moderate Difficulties' | 'Severe Difficulties';

type SectionScoreRanges = {
  typical: { min: number; max: number };
  moderate: { min: number; max: number };
  severe: { min: number; max: number };
};

// Score ranges for each section (10 questions each, scored 1-4)
// Lower scores = better (fewer difficulties)
// Higher scores = more concerning (more difficulties)
export const sectionScoreRanges: Record<string, SectionScoreRanges> = {
  vision: {
    typical: { min: 10, max: 19 },
    moderate: { min: 20, max: 27 },
    severe: { min: 28, max: 40 },
  },
  hearing: {
    typical: { min: 10, max: 19 },
    moderate: { min: 20, max: 29 },
    severe: { min: 30, max: 40 },
  },
  touch: {
    typical: { min: 10, max: 17 },
    moderate: { min: 18, max: 25 },
    severe: { min: 26, max: 40 },
  },
  'taste-smell': {
    typical: { min: 10, max: 16 },
    moderate: { min: 17, max: 23 },
    severe: { min: 24, max: 40 },
  },
  'body-awareness': {
    typical: { min: 10, max: 19 },
    moderate: { min: 20, max: 28 },
    severe: { min: 29, max: 40 },
  },
  'balance-motion': {
    typical: { min: 10, max: 15 },
    moderate: { min: 16, max: 20 },
    severe: { min: 21, max: 40 },
  },
  'planning-ideas': {
    typical: { min: 10, max: 18 },
    moderate: { min: 19, max: 27 },
    severe: { min: 28, max: 40 },
  },
  'social-participation': {
    typical: { min: 10, max: 24 },
    moderate: { min: 25, max: 31 },
    severe: { min: 32, max: 40 },
  },
  'sensory-total': {
    typical: { min: 60, max: 105 },
    moderate: { min: 106, max: 142 },
    severe: { min: 143, max: 240 },
  },
};

export function getScoreCategory(sectionId: string, rawScore: number): ScoreCategory {
  const ranges = sectionScoreRanges[sectionId];
  
  if (!ranges) {
    return 'Typical'; // Default fallback
  }

  if (rawScore >= ranges.severe.min && rawScore <= ranges.severe.max) {
    return 'Severe Difficulties';
  } else if (rawScore >= ranges.moderate.min && rawScore <= ranges.moderate.max) {
    return 'Moderate Difficulties';
  } else {
    return 'Typical';
  }
}

export function getCategoryColor(category: ScoreCategory): string {
  switch (category) {
    case 'Typical':
      return 'bg-green-100 text-green-800';
    case 'Moderate Difficulties':
      return 'bg-yellow-100 text-yellow-800';
    case 'Severe Difficulties':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
