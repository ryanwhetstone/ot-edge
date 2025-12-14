// SPM-2 Home Form questions
// This is a representative sample of the SPM-2 assessment structure

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

export const spm2Sections: SPM2Section[] = [
  {
    id: 'social-participation',
    title: 'Social Participation',
    description: 'Questions about social interactions and participation',
    questions: [
      {
        id: 'sp1',
        text: 'Avoids or dislikes being touched by others',
        options: responseOptions,
      },
      {
        id: 'sp2',
        text: 'Has difficulty playing with other children',
        options: responseOptions,
      },
      {
        id: 'sp3',
        text: 'Avoids group activities',
        options: responseOptions,
      },
      {
        id: 'sp4',
        text: 'Seems overwhelmed in crowded or noisy environments',
        options: responseOptions,
      },
      {
        id: 'sp5',
        text: 'Has trouble making friends',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'vision',
    title: 'Vision',
    description: 'Questions about visual processing',
    questions: [
      {
        id: 'v1',
        text: 'Has difficulty finding objects among other objects',
        options: responseOptions,
      },
      {
        id: 'v2',
        text: 'Loses place when copying from the board',
        options: responseOptions,
      },
      {
        id: 'v3',
        text: 'Has trouble with visual tracking (following moving objects)',
        options: responseOptions,
      },
      {
        id: 'v4',
        text: 'Squints or rubs eyes frequently',
        options: responseOptions,
      },
      {
        id: 'v5',
        text: 'Has difficulty with tasks requiring hand-eye coordination',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'hearing',
    title: 'Hearing',
    description: 'Questions about auditory processing',
    questions: [
      {
        id: 'h1',
        text: 'Has difficulty following verbal directions',
        options: responseOptions,
      },
      {
        id: 'h2',
        text: 'Covers ears with hands to block out sounds',
        options: responseOptions,
      },
      {
        id: 'h3',
        text: 'Is distracted by sounds not noticed by others',
        options: responseOptions,
      },
      {
        id: 'h4',
        text: 'Has trouble distinguishing one sound from another',
        options: responseOptions,
      },
      {
        id: 'h5',
        text: 'Seems to not hear what is said',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'touch',
    title: 'Touch',
    description: 'Questions about tactile processing',
    questions: [
      {
        id: 't1',
        text: 'Avoids getting hands messy',
        options: responseOptions,
      },
      {
        id: 't2',
        text: 'Dislikes having hair, face, or nails groomed',
        options: responseOptions,
      },
      {
        id: 't3',
        text: 'Is bothered by certain clothing textures',
        options: responseOptions,
      },
      {
        id: 't4',
        text: 'Avoids going barefoot, especially in grass or sand',
        options: responseOptions,
      },
      {
        id: 't5',
        text: 'Seems unaware of being touched unless touch is very intense',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'body-awareness',
    title: 'Body Awareness',
    description: 'Questions about proprioceptive and body awareness',
    questions: [
      {
        id: 'ba1',
        text: 'Has difficulty knowing where body parts are without looking',
        options: responseOptions,
      },
      {
        id: 'ba2',
        text: 'Bumps into things or people',
        options: responseOptions,
      },
      {
        id: 'ba3',
        text: 'Uses too much or too little force when handling objects',
        options: responseOptions,
      },
      {
        id: 'ba4',
        text: 'Has difficulty with motor planning (figuring out how to move body)',
        options: responseOptions,
      },
      {
        id: 'ba5',
        text: 'Appears clumsy or accident-prone',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'balance-motion',
    title: 'Balance and Motion',
    description: 'Questions about vestibular processing and balance',
    questions: [
      {
        id: 'bm1',
        text: 'Avoids playground equipment (swings, slides)',
        options: responseOptions,
      },
      {
        id: 'bm2',
        text: 'Becomes anxious when feet leave the ground',
        options: responseOptions,
      },
      {
        id: 'bm3',
        text: 'Seeks out spinning or swinging activities',
        options: responseOptions,
      },
      {
        id: 'bm4',
        text: 'Has difficulty with balance activities',
        options: responseOptions,
      },
      {
        id: 'bm5',
        text: 'Gets motion sickness easily',
        options: responseOptions,
      },
    ],
  },
  {
    id: 'planning-ideas',
    title: 'Planning and Ideas',
    description: 'Questions about praxis and ideation',
    questions: [
      {
        id: 'pi1',
        text: 'Has trouble coming up with new ideas for play',
        options: responseOptions,
      },
      {
        id: 'pi2',
        text: 'Has difficulty learning new motor tasks',
        options: responseOptions,
      },
      {
        id: 'pi3',
        text: 'Needs extra time to complete motor tasks',
        options: responseOptions,
      },
      {
        id: 'pi4',
        text: 'Has trouble with tasks requiring multiple steps',
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
