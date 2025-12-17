// Observation Templates for different observation types

export type ObservationQuestionType = 'yes-no-not-established' | 'multiple-choice';

export type ObservationQuestion = {
  id: string;
  text: string;
  type: ObservationQuestionType;
  options?: string[]; // For multiple-choice questions
};

export type ObservationSection = {
  id: string;
  title: string;
  description?: string;
  questions: ObservationQuestion[];
};

export type ObservationTemplate = {
  id: string;
  name: string;
  description: string;
  sections: ObservationSection[];
};

// ELC Observation of Skills Template
export const elcObservationOfSkills: ObservationTemplate = {
  id: 'elc-observation-of-skills',
  name: 'ELC Observation of Skills',
  description: 'Comprehensive observation of early learning center skills',
  sections: [
    {
      id: 'motor-skills',
      title: 'Motor Skills',
      description: 'Gross and fine motor development',
      questions: [
        {
          id: 'motor-1',
          text: 'Can the child walk independently?',
          type: 'yes-no-not-established',
        },
        {
          id: 'motor-2',
          text: 'Can the child run with coordination?',
          type: 'yes-no-not-established',
        },
        {
          id: 'motor-3',
          text: 'Can the child jump with both feet?',
          type: 'yes-no-not-established',
        },
        {
          id: 'motor-4',
          text: 'Preferred hand for activities:',
          type: 'multiple-choice',
          options: ['Left', 'Right', 'No preference', 'Alternating'],
        },
        {
          id: 'motor-5',
          text: 'Can the child grasp and manipulate small objects?',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'cognitive-skills',
      title: 'Cognitive Skills',
      description: 'Thinking and problem-solving abilities',
      questions: [
        {
          id: 'cognitive-1',
          text: 'Can the child sort objects by color?',
          type: 'yes-no-not-established',
        },
        {
          id: 'cognitive-2',
          text: 'Can the child sort objects by shape?',
          type: 'yes-no-not-established',
        },
        {
          id: 'cognitive-3',
          text: 'Can the child count to 10?',
          type: 'yes-no-not-established',
        },
        {
          id: 'cognitive-4',
          text: 'Attention span during activities:',
          type: 'multiple-choice',
          options: ['Less than 2 minutes', '2-5 minutes', '5-10 minutes', 'More than 10 minutes'],
        },
      ],
    },
    {
      id: 'social-emotional',
      title: 'Social-Emotional Skills',
      description: 'Social interaction and emotional regulation',
      questions: [
        {
          id: 'social-1',
          text: 'Does the child engage with peers during play?',
          type: 'yes-no-not-established',
        },
        {
          id: 'social-2',
          text: 'Does the child share toys with others?',
          type: 'yes-no-not-established',
        },
        {
          id: 'social-3',
          text: 'Can the child express emotions appropriately?',
          type: 'yes-no-not-established',
        },
        {
          id: 'social-4',
          text: 'Response to transitions:',
          type: 'multiple-choice',
          options: ['Difficult/resistant', 'Some difficulty', 'Adapts with support', 'Adapts easily'],
        },
      ],
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      description: 'Expressive and receptive language',
      questions: [
        {
          id: 'comm-1',
          text: 'Does the child use words to express needs?',
          type: 'yes-no-not-established',
        },
        {
          id: 'comm-2',
          text: 'Does the child follow simple directions?',
          type: 'yes-no-not-established',
        },
        {
          id: 'comm-3',
          text: 'Can the child engage in simple conversations?',
          type: 'yes-no-not-established',
        },
        {
          id: 'comm-4',
          text: 'Speech clarity:',
          type: 'multiple-choice',
          options: ['Difficult to understand', 'Sometimes unclear', 'Mostly clear', 'Very clear'],
        },
      ],
    },
  ],
};

// Export all observation templates
export const observationTemplates: ObservationTemplate[] = [
  elcObservationOfSkills,
];

// Helper function to get template by ID
export function getObservationTemplate(id: string): ObservationTemplate | undefined {
  return observationTemplates.find(template => template.id === id);
}

// Helper function to get all question IDs from a template
export function getTemplateQuestionIds(template: ObservationTemplate): string[] {
  return template.sections.flatMap(section => 
    section.questions.map(q => q.id)
  );
}

// Helper function to get total questions count
export function getTotalQuestions(template: ObservationTemplate): number {
  return template.sections.reduce((total, section) => 
    total + section.questions.length, 0
  );
}
