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

// Helper function to create questions
const createQuestion = (id: string, num: number, text: string): SPM2Question => ({
  id,
  text,
  options: responseOptions,
});

export const spm2Sections: SPM2Section[] = [
  {
    id: 'vision',
    title: 'Vision (VIS)',
    description: 'Visual processing and visual-motor integration',
    questions: [
      createQuestion('vis1', 1, '1. Question'),
      createQuestion('vis2', 2, '2. Question'),
      createQuestion('vis3', 3, '3. Question'),
      createQuestion('vis4', 4, '4. Question'),
      createQuestion('vis5', 5, '5. Question'),
      createQuestion('vis6', 6, '6. Question'),
      createQuestion('vis7', 7, '7. Question'),
      createQuestion('vis8', 8, '8. Question'),
      createQuestion('vis9', 9, '9. Question'),
      createQuestion('vis10', 10, '10. Question'),
    ],
  },
  {
    id: 'hearing',
    title: 'Hearing (HEA)',
    description: 'Auditory processing and responses to sounds',
    questions: [
      createQuestion('hea1', 11, '11. Question'),
      createQuestion('hea2', 12, '12. Question'),
      createQuestion('hea3', 13, '13. Question'),
      createQuestion('hea4', 14, '14. Question'),
      createQuestion('hea5', 15, '15. Question'),
      createQuestion('hea6', 16, '16. Question'),
      createQuestion('hea7', 17, '17. Question'),
      createQuestion('hea8', 18, '18. Question'),
      createQuestion('hea9', 19, '19. Question'),
      createQuestion('hea10', 20, '20. Question'),
    ],
  },
  {
    id: 'touch',
    title: 'Touch (TOU)',
    description: 'Tactile processing and responses to touch',
    questions: [
      createQuestion('tou1', 21, '21. Question'),
      createQuestion('tou2', 22, '22. Question'),
      createQuestion('tou3', 23, '23. Question'),
      createQuestion('tou4', 24, '24. Question'),
      createQuestion('tou5', 25, '25. Question'),
      createQuestion('tou6', 26, '26. Question'),
      createQuestion('tou7', 27, '27. Question'),
      createQuestion('tou8', 28, '28. Question'),
      createQuestion('tou9', 29, '29. Question'),
      createQuestion('tou10', 30, '30. Question'),
    ],
  },
  {
    id: 'taste-smell',
    title: 'Taste and Smell (T&S)',
    description: 'Gustatory and olfactory processing',
    questions: [
      createQuestion('ts1', 31, '31. Question'),
      createQuestion('ts2', 32, '32. Question'),
      createQuestion('ts3', 33, '33. Question'),
      createQuestion('ts4', 34, '34. Question'),
      createQuestion('ts5', 35, '35. Question'),
      createQuestion('ts6', 36, '36. Question'),
      createQuestion('ts7', 37, '37. Question'),
      createQuestion('ts8', 38, '38. Question'),
      createQuestion('ts9', 39, '39. Question'),
      createQuestion('ts10', 40, '40. Question'),
    ],
  },
  {
    id: 'body-awareness',
    title: 'Body Awareness (BOD)',
    description: 'Proprioception and body position awareness',
    questions: [
      createQuestion('bod1', 41, '41. Question'),
      createQuestion('bod2', 42, '42. Question'),
      createQuestion('bod3', 43, '43. Question'),
      createQuestion('bod4', 44, '44. Question'),
      createQuestion('bod5', 45, '45. Question'),
      createQuestion('bod6', 46, '46. Question'),
      createQuestion('bod7', 47, '47. Question'),
      createQuestion('bod8', 48, '48. Question'),
      createQuestion('bod9', 49, '49. Question'),
      createQuestion('bod10', 50, '50. Question'),
    ],
  },
  {
    id: 'balance-motion',
    title: 'Balance and Motion (BAL)',
    description: 'Vestibular processing, balance, and responses to movement',
    questions: [
      createQuestion('bal1', 51, '51. Question'),
      createQuestion('bal2', 52, '52. Question'),
      createQuestion('bal3', 53, '53. Question'),
      createQuestion('bal4', 54, '54. Question'),
      createQuestion('bal5', 55, '55. Question'),
      createQuestion('bal6', 56, '56. Question'),
      createQuestion('bal7', 57, '57. Question'),
      createQuestion('bal8', 58, '58. Question'),
      createQuestion('bal9', 59, '59. Question'),
      createQuestion('bal10', 60, '60. Question'),
    ],
  },
  {
    id: 'planning-ideas',
    title: 'Planning and Ideas (PLA)',
    description: 'Praxis, motor planning, and generating new ideas',
    questions: [
      createQuestion('pla1', 61, '61. Question'),
      createQuestion('pla2', 62, '62. Question'),
      createQuestion('pla3', 63, '63. Question'),
      createQuestion('pla4', 64, '64. Question'),
      createQuestion('pla5', 65, '65. Question'),
      createQuestion('pla6', 66, '66. Question'),
      createQuestion('pla7', 67, '67. Question'),
      createQuestion('pla8', 68, '68. Question'),
      createQuestion('pla9', 69, '69. Question'),
      createQuestion('pla10', 70, '70. Question'),
    ],
  },
  {
    id: 'social-participation',
    title: 'Social Participation (SOC)',
    description: 'Social interactions and participation in activities',
    questions: [
      createQuestion('soc1', 71, '71. Question'),
      createQuestion('soc2', 72, '72. Question'),
      createQuestion('soc3', 73, '73. Question'),
      createQuestion('soc4', 74, '74. Question'),
      createQuestion('soc5', 75, '75. Question'),
      createQuestion('soc6', 76, '76. Question'),
      createQuestion('soc7', 77, '77. Question'),
      createQuestion('soc8', 78, '78. Question'),
      createQuestion('soc9', 79, '79. Question'),
      createQuestion('soc10', 80, '80. Question'),
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
