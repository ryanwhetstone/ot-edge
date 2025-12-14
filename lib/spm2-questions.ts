// SPM-2 Home Form (Ages 2-5) - 80 Questions
// Replace placeholder text with actual questions from your purchased SPM-2 materials

export type SPM2Section = {
  id: string;
  title: string;
  description: string;
  questions: SPM2Question[];
};

export type SPM2Question = {
  id: string;
  text: string;
  options: SPM2Option[];
};

export type SPM2Option = {
  value: number;
  label: string;
};

const responseOptions: SPM2Option[] = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Occasionally' },
  { value: 3, label: 'Frequently' },
  { value: 4, label: 'Always' },
];

// Helper function to create question placeholders
const createQuestion = (id: string, num: number): SPM2Question => ({
  id,
  text: `[Question ${num}] - Rep (SOC)',
    description: 'Social interactions and participation in activities',
    questions: [
      createQuestion('soc1', 1),
      createQuestion('soc2', 2),
      createQuestion('soc3', 3),
      createQuestion('soc4', 4),
      createQuestion('soc5', 5),
      createQuestion('soc6', 6),
      createQuestion('soc7', 7),
      createQuestion('soc8', 8),
      createQuestion('soc9', 9),
      createQuestion('soc10', 10),
    ],
  },
  {
    id: 'vision',
    title: 'Vision (VIS)',
    description: 'Visual processing and visual-motor integration',
    questions: [
      createQuestion('vis1', 11),
      createQuestion('vis2', 12),
      createQuestion('vis3', 13),
      createQuestion('vis4', 14),
      createQuestion('vis5', 15),
      createQuestion('vis6', 16),
      createQuestion('vis7', 17),
      createQuestion('vis8', 18),
      createQuestion('vis9', 19),
      createQuestion('vis10', 20),
    ],
  },
  {
    id: 'hearing',
    title: 'Hearing (HEA)',
    description: 'Auditory processing and responses to sounds',
    questions: [
      createQuestion('hea1', 21),
      createQuestion('hea2', 22),
      createQuestion('hea3', 23),
      createQuestion('hea4', 24),
      createQuestion('hea5', 25),
      createQuestion('hea6', 26),
      createQuestion('hea7', 27),
      createQuestion('hea8', 28),
      createQuestion('hea9', 29),
      createQuestion('hea10', 30),
    ],
  },
  {
    id: 'touch',
    title: 'Touch (TOU)',
    description: 'Tactile processing and responses to touch',
    questions: [
      createQuestion('tou1', 31),
      createQuestion('tou2', 32),
      createQuestion('tou3', 33),
      createQuestion('tou4', 34),
      createQuestion('tou5', 35),
      createQuestion('tou6', 36),
      createQuestion('tou7', 37),
      createQuestion('tou8', 38),
      createQuestion('tou9', 39),
      createQuestion('tou10', 40),
    ],
  },
  {
    id: 'body-awareness',
    title: 'Body Awareness (BOD)',
    description: 'Proprioception and body position awareness',
    questions: [
      createQuestion('bod1', 41),
      createQuestion('bod2', 42),
      createQuestion('bod3', 43),
      createQuestion('bod4', 44),
      createQuestion('bod5', 45),
      createQuestion('bod6', 46),
      createQuestion('bod7', 47),
      createQuestion('bod8', 48),
      createQuestion('bod9', 49),
      createQuestion('bod10', 50),
    ],
  },
  {
    id: 'balance-motion',
    title: 'Balance and Motion (BAL)',
    description: 'Vestibular processing, balance, and responses to movement',
    questions: [
      createQuestion('bal1', 51),
      createQuestion('bal2', 52),
      createQuestion('bal3', 53),
      createQuestion('bal4', 54),
      createQuestion('bal5', 55),
      createQuestion('bal6', 56),
      createQuestion('bal7', 57),
      createQuestion('bal8', 58),
      createQuestion('bal9', 59),
      createQuestion('bal10', 60),
    ],
  },
  {
    id: 'planning-ideas',
    title: 'Planning and Ideas (PLA)',
    description: 'Praxis, motor planning, and generating new ideas',
    questions: [
      createQuestion('pla1', 61),
      createQuestion('pla2', 62),
      createQuestion('pla3', 63),
      createQuestion('pla4', 64),
      createQuestion('pla5', 65),
      createQuestion('pla6', 66),
      createQuestion('pla7', 67),
      createQuestion('pla8', 68),
      createQuestion('pla9', 69),
      createQuestion('pla10', 70),
    ],
  },
  {
    id: 'total-sensory-systems',
    title: 'Total Sensory Systems (TOT)',
    description: 'Overall sensory processing functioning',
    questions: [
      createQuestion('tot1', 71),
      createQuestion('tot2', 72),
      createQuestion('tot3', 73),
      createQuestion('tot4', 74),
      createQuestion('tot5', 75),
      createQuestion('tot6', 76),
      createQuestion('tot7', 77),
      createQuestion('tot8', 78),
      createQuestion('tot9', 79),
      createQuestion('tot10', 80) text: 'Has trouble with tasks requiring multiple steps',
        options: responseOptions,
      },
      {
        id: 'pi5',
        text: 'Difficulty imitating actions or gestures',
        options: responseOptions,
      },
    ],
  },
];

export const getTotalQuestions = (): number => {
  return spm2Sections.reduce((total, section) => total + section.questions.length, 0);
};

export const getQuestionById = (questionId: string): SPM2Question | undefined => {
  for (const section of spm2Sections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) return question;
  }
  return undefined;
};
