// SPM-2 Home Form (Ages 2-5) - 80 Questions
// Replace placeholder text with actual questions from your purchased SPM-2 materials

export type SPM2Section = {
  id: string;
  title: string;
  short_title: string;
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
    short_title: 'Vision',
    description: 'Visual processing and visual-motor integration',
    questions: [
      createQuestion('vis1', 1, 'Squints, covers eyes, or complains about bright lighting or sunlight.'),
      createQuestion('vis2', 2, 'Has trouble finding an object among other items.'),
      createQuestion('vis3', 3, 'Stares intently at lights or objects that spin or flash.'),
      createQuestion('vis4', 4, 'Stares intently at people or objects.'),
      createQuestion('vis5', 5, 'Walks into objects or people as if they were not there.'),
      createQuestion('vis6', 6, 'Flips lights on and off repeatedly.'),
      createQuestion('vis7', 7, 'Looks at objects out of the corner of his or her eye.'),
      createQuestion('vis8', 8, 'Is distracted by visible objects or people.'),
      createQuestion('vis9', 9, 'Is bothered by busy visual environments, such as a cluttered room or a store with a lot of items.'),
      createQuestion('vis10', 10, 'Becomes distracted by looking at things while walking.'),
    ],
  },
  {
    id: 'hearing',
    title: 'Hearing (HEA)',
    short_title: 'Hearing',
    description: 'Auditory processing and responses to sounds',
    questions: [
      createQuestion('hea1', 11, 'Is bothered by ordinary household sounds, such as the vacuum cleaner.'),
      createQuestion('hea2', 12, 'Responds to loud noises by running away, crying, or holding hands over ears.'),
      createQuestion('hea3', 13, 'Is distracted or bothered by background noises that others ignore, such as a lawn mower outside or an air conditioner.'),
      createQuestion('hea4', 14, 'Likes making certain sounds over and over again, such as humming or repeatedly flushing the toilet.'),
      createQuestion('hea5', 15, 'Is distressed by shrill sounds, such as whistles or party noisemakers.'),
      createQuestion('hea6', 16, 'Becomes distressed in noisy places, such as a party or a crowded room.'),
      createQuestion('hea7', 17, 'Startles easily at loud or unexpected sounds.'),
      createQuestion('hea8', 18, 'Fails to respond when name is called.'),
      createQuestion('hea9', 19, 'Has difficulty following verbal directions.'),
      createQuestion('hea10', 20, 'Has difficulty determining the location of sounds or voices.'),
    ],
  },
  {
    id: 'touch',
    title: 'Touch (TOU)',
    short_title: 'Touch',
    description: 'Tactile processing and responses to touch',
    questions: [
      createQuestion('tou1', 21, 'Pulls away when touched lightly or unexpectedly.'),
      createQuestion('tou2', 22, 'Becomes distressed when someone washes, wipes, or touches face.'),
      createQuestion('tou3', 23, 'Is distressed by having his or her hair cut or brushed.'),
      createQuestion('tou4', 24, 'Seems unaware of the need to use the toilet.'),
      createQuestion('tou5', 25, 'Enjoys sensations that would be painful to others, such as crashing into walls.'),
      createQuestion('tou6', 26, 'Rubs objects repetitively with hands or fingertips.'),
      createQuestion('tou7', 27, 'Gags or vomits in response to foods of certain textures.'),
      createQuestion('tou8', 28, 'Fails to clean saliva or food from face.'),
      createQuestion('tou9', 29, 'Likes to lie under heavy things, such as blankets, pillows, or couch cushions.'),
      createQuestion('tou10', 30, 'Rejects foods with mixed textures, such as yogurt with fruit.'),
    ],
  },
  {
    id: 'taste-smell',
    title: 'Taste and Smell (T&S)',
    short_title: 'Taste and Smell',
    description: 'Gustatory and olfactory processing',
    questions: [
      createQuestion('ts1', 31, 'Refuses to try new foods or snacks.'),
      createQuestion('ts2', 32, 'Fails to distinguish or indicate preference among flavors.'),
      createQuestion('ts3', 33, 'Insists on eating only certain foods or brands of food.'),
      createQuestion('ts4', 34, 'Is distressed by the tastes of foods that do not bother other children.'),
      createQuestion('ts5', 35, 'Smells new objects or items before using them.'),
      createQuestion('ts6', 36, 'Notices scents or odors that others do not.'),
      createQuestion('ts7', 37, 'Sniffs or smells people.'),
      createQuestion('ts8', 38, 'Gags or vomits at certain smells.'),
      createQuestion('ts9', 39, 'Seeks out certain scents or odors.'),
      createQuestion('ts10', 40, 'Avoids public restrooms because of the smell.'),
    ],
  },
  {
    id: 'body-awareness',
    title: 'Body Awareness (BOD)',
    short_title: 'Body Awareness',
    description: 'Proprioception and body position awareness',
    questions: [
      createQuestion('bod1', 41, 'Seeks out activities that involve pushing, pulling, or dragging.'),
      createQuestion('bod2', 42, 'Slams doors shut or pushes them open with excessive force.'),
      createQuestion('bod3', 43, 'Jumps down from heights with strong impact onto feet.'),
      createQuestion('bod4', 44, 'Pets animals with too much force.'),
      createQuestion('bod5', 45, 'Plays too roughly with peers.'),
      createQuestion('bod6', 46, 'Chews on toys, clothes, or other objects.'),
      createQuestion('bod7', 47, 'Throws ball with too much or too little force.'),
      createQuestion('bod8', 48, 'Puts too much food in mouth.'),
      createQuestion('bod9', 49, 'Spills or knocks over items at the table.'),
      createQuestion('bod10', 50, 'Breaks toys by handling them with too much force.'),
    ],
  },
  {
    id: 'balance-motion',
    title: 'Balance and Motion (BAL)',
    short_title: 'Balance and Motion',
    description: 'Vestibular processing, balance, and responses to movement',
    questions: [
      createQuestion('bal1', 51, 'Is fearful of movement, such as riding swings or slides.'),
      createQuestion('bal2', 52, 'Avoids walking on uneven surfaces that require balance, such as dirt or grass.'),
      createQuestion('bal3', 53, 'Falls out of a chair when changing position.'),
      createQuestion('bal4', 54, 'Fails to catch himself or herself when falling.'),
      createQuestion('bal5', 55, 'Twirls or spins excessively on playground equipment.'),
      createQuestion('bal6', 56, 'Shows poor coordination when using both sides of the body, such as jumping and landing on two feet at the same time.'),
      createQuestion('bal7', 57, 'Rocks, sways, or squirms when seated.'),
      createQuestion('bal8', 58, 'Is afraid to descend stairs or hills.'),
      createQuestion('bal9', 59, 'Slumps forward, leans back, or holds head up in hands while seated.'),
      createQuestion('bal10', 60, 'Has poor balance.'),
    ],
  },
  {
    id: 'planning-ideas',
    title: 'Planning and Ideas (PLA)',
    short_title: 'Planning and Ideas',
    description: 'Praxis, motor planning, and generating new ideas',
    questions: [
      createQuestion('pla1', 61, 'Has trouble figuring out how to carry several objects at the same time.'),
      createQuestion('pla2', 62, 'Becomes confused when trying to put away materials or belongings in their correct places.'),
      createQuestion('pla3', 63, 'Fails to complete tasks with multiple steps.'),
      createQuestion('pla4', 64, 'Has difficulty correctly imitating movements, sounds, or expressions.'),
      createQuestion('pla5', 65, 'Has difficulty copying an adult or another child when building with blocks.'),
      createQuestion('pla6', 66, 'Has trouble coming up with new ideas during play activities.'),
      createQuestion('pla7', 67, 'Does familiar activities over and over, rather than trying new activities.'),
      createQuestion('pla8', 68, 'Shows poor timing when kicking or catching a ball.'),
      createQuestion('pla9', 69, 'Has difficulty accurately copying a completed model to make an identical project.'),
      createQuestion('pla10', 70, 'Has difficulty with tasks that require coordination of both hands, such as opening a container.'),
    ],
  },
  {
    id: 'social-participation',
    title: 'Social Participation (SOC)',
    short_title: 'Social Participation',
    description: 'Social interactions and participation in activities',
    questions: [
      createQuestion('soc1', 71, 'Plays with friends cooperatively.'),
      createQuestion('soc2', 72, 'Shares things when asked.'),
      createQuestion('soc3', 73, 'Waits his or her turn.'),
      createQuestion('soc4', 74, 'Joins in play with others without disrupting the ongoing activity.'),
      createQuestion('soc5', 75, 'Participates appropriately in family gatherings and outings.'),
      createQuestion('soc6', 76, 'Cooperates while running errands with family members.'),
      createQuestion('soc7', 77, 'Maintains appropriate eye contact during conversation.'),
      createQuestion('soc8', 78, 'Transitions smoothly to new activities.'),
      createQuestion('soc9', 79, 'Is flexible when a routine is changed.'),
      createQuestion('soc10', 80, 'Works cooperatively toward a common goal, such as cleaning up.'),
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
