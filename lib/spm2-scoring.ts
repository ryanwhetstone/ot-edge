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

// T-Score lookup tables (raw score to T-score mapping)
// Raw scores range from 10-40 for individual sections
// TODO: Fill in actual T-score values from SPM-2 manual
type TScoreLookup = Record<number, number>;

export const tScoreLookup: Record<string, TScoreLookup> = {
  vision: {
    10: 40, 11: 40, 12: 41, 13: 44, 14: 47, 15: 50, 16: 52, 17: 54, 18: 56, 19: 58,
    20: 60, 21: 61, 22: 63, 23: 64, 24: 66, 25: 67, 26: 68, 27: 69, 28: 70, 29: 71,
    30: 72, 31: 73, 32: 73, 33: 74, 34: 74, 35: 74, 36: 74, 37: 74, 38: 74, 39: 74, 40: 74,
  },
  hearing: {
    10: 40, 11: 40, 12: 43, 13: 46, 14: 49, 15: 51, 16: 54, 17: 56, 18: 57, 19: 59,
    20: 60, 21: 62, 22: 63, 23: 64, 24: 65, 25: 66, 26: 67, 27: 67, 28: 68, 29: 69,
    30: 70, 31: 70, 32: 70, 33: 71, 34: 72, 35: 72, 36: 72, 37: 73, 38: 73, 39: 73, 40: 73,
  },
  touch: {
    10: 40, 11: 40, 12: 44, 13: 48, 14: 51, 15: 54, 16: 56, 17: 58, 18: 60, 19: 62,
    20: 63, 21: 65, 22: 66, 23: 67, 24: 68, 25: 69, 26: 70, 27: 70, 28: 71, 29: 72,
    30: 73, 31: 73, 32: 73, 33: 73, 34: 73, 35: 73, 36: 73, 37: 73, 38: 73, 39: 73, 40: 73,
  },
  'taste-smell': {
    10: 40, 11: 41, 12: 46, 13: 50, 14: 53, 15: 56, 16: 58, 17: 60, 18: 62, 19: 64,
    20: 65, 21: 67, 22: 68, 23: 69, 24: 70, 25: 71, 26: 71, 27: 73, 28: 73, 29: 74,
    30: 75, 31: 75, 32: 75, 33: 75, 34: 75, 35: 75, 36: 75, 37: 75, 38: 75, 39: 75, 40: 75,
  },
  'body-awareness': {
    10: 40, 11: 40, 12: 41, 13: 44, 14: 47, 15: 50, 16: 52, 17: 54, 18: 56, 19: 58,
    20: 60, 21: 61, 22: 63, 23: 64, 24: 66, 25: 67, 26: 68, 27: 69, 28: 70, 29: 71,
    30: 72, 31: 73, 32: 73, 33: 74, 34: 74, 35: 74, 36: 74, 37: 74, 38: 74, 39: 74, 40: 74,
  },
  'balance-motion': {
    10: 40, 11: 40, 12: 41, 13: 44, 14: 47, 15: 50, 16: 52, 17: 54, 18: 56, 19: 58,
    20: 60, 21: 61, 22: 63, 23: 64, 24: 66, 25: 67, 26: 68, 27: 69, 28: 70, 29: 71,
    30: 72, 31: 73, 32: 73, 33: 74, 34: 74, 35: 74, 36: 74, 37: 74, 38: 74, 39: 74, 40: 74,
  },
  'planning-ideas': {
    10: 40, 11: 40, 12: 41, 13: 44, 14: 47, 15: 50, 16: 52, 17: 54, 18: 56, 19: 58,
    20: 60, 21: 61, 22: 63, 23: 64, 24: 66, 25: 67, 26: 68, 27: 69, 28: 70, 29: 71,
    30: 72, 31: 73, 32: 73, 33: 74, 34: 74, 35: 74, 36: 74, 37: 74, 38: 74, 39: 74, 40: 74,
  },
  'social-participation': {
    10: 40, 11: 40, 12: 41, 13: 44, 14: 47, 15: 50, 16: 52, 17: 54, 18: 56, 19: 58,
    20: 60, 21: 61, 22: 63, 23: 64, 24: 66, 25: 67, 26: 68, 27: 69, 28: 70, 29: 71,
    30: 72, 31: 73, 32: 73, 33: 74, 34: 74, 35: 74, 36: 74, 37: 74, 38: 74, 39: 74, 40: 74,
  },
  'sensory-total': {
    // Range 60-240 for sensory total (6 sections x 10 questions x 4 max)
    60: 0, 61: 0, 62: 0, 63: 0, 64: 0, 65: 0, 66: 0, 67: 0, 68: 0, 69: 0,
    70: 0, 71: 0, 72: 0, 73: 0, 74: 0, 75: 0, 76: 0, 77: 0, 78: 0, 79: 0,
    80: 0, 81: 0, 82: 0, 83: 0, 84: 0, 85: 0, 86: 0, 87: 0, 88: 0, 89: 0,
    90: 0, 91: 0, 92: 0, 93: 0, 94: 0, 95: 0, 96: 0, 97: 0, 98: 0, 99: 0,
    100: 0, 101: 0, 102: 0, 103: 0, 104: 0, 105: 0, 106: 0, 107: 0, 108: 0, 109: 0,
    110: 0, 111: 0, 112: 0, 113: 0, 114: 0, 115: 0, 116: 0, 117: 0, 118: 0, 119: 0,
    120: 0, 121: 0, 122: 0, 123: 0, 124: 0, 125: 0, 126: 0, 127: 0, 128: 0, 129: 0,
    130: 0, 131: 0, 132: 0, 133: 0, 134: 0, 135: 0, 136: 0, 137: 0, 138: 0, 139: 0,
    140: 0, 141: 0, 142: 0, 143: 0, 144: 0, 145: 0, 146: 0, 147: 0, 148: 0, 149: 0,
    150: 0, 151: 0, 152: 0, 153: 0, 154: 0, 155: 0, 156: 0, 157: 0, 158: 0, 159: 0,
    160: 0, 161: 0, 162: 0, 163: 0, 164: 0, 165: 0, 166: 0, 167: 0, 168: 0, 169: 0,
    170: 0, 171: 0, 172: 0, 173: 0, 174: 0, 175: 0, 176: 0, 177: 0, 178: 0, 179: 0,
    180: 0, 181: 0, 182: 0, 183: 0, 184: 0, 185: 0, 186: 0, 187: 0, 188: 0, 189: 0,
    190: 0, 191: 0, 192: 0, 193: 0, 194: 0, 195: 0, 196: 0, 197: 0, 198: 0, 199: 0,
    200: 0, 201: 0, 202: 0, 203: 0, 204: 0, 205: 0, 206: 0, 207: 0, 208: 0, 209: 0,
    210: 0, 211: 0, 212: 0, 213: 0, 214: 0, 215: 0, 216: 0, 217: 0, 218: 0, 219: 0,
    220: 0, 221: 0, 222: 0, 223: 0, 224: 0, 225: 0, 226: 0, 227: 0, 228: 0, 229: 0,
    230: 0, 231: 0, 232: 0, 233: 0, 234: 0, 235: 0, 236: 0, 237: 0, 238: 0, 239: 0, 240: 0,
  },
};

export function getTScore(sectionId: string, rawScore: number): number | null {
  const lookup = tScoreLookup[sectionId];
  
  if (!lookup) {
    return null;
  }

  return lookup[rawScore] ?? null;
}
