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
      id: 'hand-dominance',
      title: 'Hand Dominance',
      questions: [
        {
          id: 'hand-dom-1',
          text: 'Hand Dominance',
          type: 'multiple-choice',
          options: ['Appears to be right hand dominant', 'Appears to be left hand dominant', 'Not established'],
        },
      ],
    },
    {
      id: 'prewriting-strokes',
      title: 'Prewriting Strokes',
      questions: [
        {
          id: 'prewrite-1',
          text: 'Scribbles spontaneously',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-2',
          text: 'Imitated horizontal strokes',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-3',
          text: 'Imitated vertical strokes',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-4',
          text: 'Imitated circular strokes',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-5',
          text: 'Imitated intersecting lines',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-6',
          text: 'Imitated diagonals',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-7',
          text: 'Imitated shapes',
          type: 'yes-no-not-established',
        },
        {
          id: 'prewrite-8',
          text: 'Draws pictures',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'fine-motor-grasp',
      title: 'Fine Motor: Grasp',
      questions: [
        {
          id: 'grasp-1',
          text: 'Isolates finger to point',
          type: 'yes-no-not-established',
        },
        {
          id: 'grasp-2',
          text: 'Turns pages of a book',
          type: 'yes-no-not-established',
        },
        {
          id: 'grasp-3',
          text: 'Pincer grasp with both hands',
          type: 'yes-no-not-established',
        },
        {
          id: 'grasp-4',
          text: '3-jaw grasp with both hands',
          type: 'yes-no-not-established',
        },
        {
          id: 'grasp-5',
          text: 'Fisted/digital pronate/static fingertip on crayon',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'visual-motor',
      title: 'Visual Motor',
      questions: [
        {
          id: 'visual-1',
          text: 'Visually tracked bubbles',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-2',
          text: 'Visually scanned and selected toys',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-3',
          text: 'Marks on paper',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-4',
          text: 'Colors within boundaries',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-5',
          text: 'Does simple matching puzzles',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-6',
          text: 'Builds 10 block tower',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-7',
          text: 'Put bears into bottle',
          type: 'yes-no-not-established',
        },
        {
          id: 'visual-8',
          text: 'Named letters',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'bilateral-control',
      title: 'Bilateral Control',
      questions: [
        {
          id: 'bilateral-1',
          text: 'Opened small bottle',
          type: 'yes-no-not-established',
        },
        {
          id: 'bilateral-2',
          text: 'Stabilized paper during drawing',
          type: 'yes-no-not-established',
        },
        {
          id: 'bilateral-3',
          text: 'Needed assistance to cut',
          type: 'yes-no-not-established',
        },
        {
          id: 'bilateral-4',
          text: 'Did not rip paper',
          type: 'yes-no-not-established',
        },
        {
          id: 'bilateral-5',
          text: 'Opened packaging',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'grasp-scissors',
      title: 'Grasp on Scissors',
      questions: [
        {
          id: 'scissors-1',
          text: 'Scissors skill level',
          type: 'multiple-choice',
          options: [
            'No exposure at home',
            'Held standard scissors with 2 hands to open and shut them',
            'Accepted hand over hand to snip with adapted loop scissors',
            'Snips independently',
            'Cuts on a line'
          ],
        },
      ],
    },
    {
      id: 'postural-control',
      title: 'Postural Control, ROM, Strength',
      questions: [
        {
          id: 'postural-1',
          text: 'Able to climb in & out of adult sized chair and under the table',
          type: 'yes-no-not-established',
        },
        {
          id: 'postural-2',
          text: 'Climbed playground equipment',
          type: 'yes-no-not-established',
        },
        {
          id: 'postural-3',
          text: 'Demonstrated body awareness to crawl through tunnel',
          type: 'yes-no-not-established',
        },
        {
          id: 'postural-4',
          text: 'Played in a variety of positions',
          type: 'yes-no-not-established',
        },
        {
          id: 'postural-5',
          text: 'ROM appears to be within functional limits for age appropriate tasks',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'play',
      title: 'Play',
      questions: [
        {
          id: 'play-1',
          text: 'Play is primarily self directed',
          type: 'yes-no-not-established',
        },
        {
          id: 'play-2',
          text: 'Selected play items and used toys appropriately from beginning to end',
          type: 'yes-no-not-established',
        },
        {
          id: 'play-3',
          text: 'Cleaned up with cues',
          type: 'yes-no-not-established',
        },
        {
          id: 'play-4',
          text: 'Preferred academic concepts and/or close ended tasks',
          type: 'yes-no-not-established',
        },
        {
          id: 'play-5',
          text: 'Needed modeling for imaginary play and smiled during these interactions',
          type: 'yes-no-not-established',
        },
        {
          id: 'play-6',
          text: 'Used playground equipment appropriately',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'sensory-social-emotional',
      title: 'Sensory/Social Emotional',
      questions: [
        {
          id: 'sensory-1',
          text: 'Initiated praise with caregiver',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-2',
          text: 'Imitation of play with objects (bears kissed, fed bears, etc.)',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-3',
          text: 'Imitated clapping hands and high-5\'s',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-4',
          text: 'Imitated gestures to songs',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-5',
          text: 'Demonstrated motor planning (with toys and playground equipment)',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-6',
          text: 'Maintained eye contact',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-7',
          text: 'Responded to name',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-8',
          text: 'Peeked at peers through equipment - attempted to initiate play with peers or adults',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-9',
          text: 'Used a variety of equipment (was not repetitive or overactive)',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-10',
          text: 'Demonstrated ability to wait',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-11',
          text: 'Grabbed items from peers',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-12',
          text: 'Stimming or repetitive play observed',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-13',
          text: 'Oriented to loud noise',
          type: 'yes-no-not-established',
        },
        {
          id: 'sensory-14',
          text: 'Recognized caregiver upon returning from observation',
          type: 'yes-no-not-established',
        },
      ],
    },
    {
      id: 'self-help',
      title: 'Self Help',
      questions: [
        {
          id: 'selfhelp-1',
          text: 'Helped push arms through sleeves',
          type: 'yes-no-not-established',
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
