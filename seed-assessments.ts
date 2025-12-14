import { db } from './lib/drizzle';
import { spm2Assessments } from './lib/db/schema';

// Generate varied response patterns for 80 questions
const generateResponses = (pattern: string): Record<string, number> => {
  const responses: Record<string, number> = {};
  const sections = ['vis', 'hea', 'tou', 'ts', 'bod', 'bal', 'pla', 'soc'];
  
  sections.forEach((sectionId) => {
    for (let i = 1; i <= 10; i++) {
      const questionId = `${sectionId}${i}`;
      
      switch (pattern) {
        case 'mostly-typical':
          // Mostly 1s and 2s (typical behavior)
          responses[questionId] = Math.random() < 0.7 ? 1 : 2;
          break;
        case 'moderate-concerns':
          // Mix of 2s and 3s with occasional 1s
          const rand = Math.random();
          responses[questionId] = rand < 0.3 ? 1 : rand < 0.7 ? 2 : 3;
          break;
        case 'significant-concerns':
          // Mix of 3s and 4s with some 2s
          const r = Math.random();
          responses[questionId] = r < 0.2 ? 2 : r < 0.6 ? 3 : 4;
          break;
        case 'mixed-profile':
          // Varied across sections
          const sectionIndex = sections.indexOf(sectionId);
          if (sectionIndex < 3) {
            responses[questionId] = Math.random() < 0.5 ? 3 : 4; // High concerns
          } else if (sectionIndex < 6) {
            responses[questionId] = Math.random() < 0.5 ? 1 : 2; // Low concerns
          } else {
            responses[questionId] = Math.floor(Math.random() * 4) + 1; // Random
          }
          break;
        case 'improving-trend':
          // Gradually improving scores
          if (i <= 3) {
            responses[questionId] = Math.random() < 0.5 ? 3 : 4;
          } else if (i <= 7) {
            responses[questionId] = Math.random() < 0.5 ? 2 : 3;
          } else {
            responses[questionId] = Math.random() < 0.5 ? 1 : 2;
          }
          break;
      }
    }
  });
  
  return responses;
};

async function seedAssessments() {
  console.log('Seeding SPM-2 assessments...');
  
  const assessmentsData = [
    {
      clientId: 1,
      userId: 1,
      assessmentDate: new Date('2024-09-15'),
      responses: generateResponses('mostly-typical'),
      notes: 'Initial assessment. Child shows typical sensory processing patterns across most domains.',
    },
    {
      clientId: 1,
      userId: 1,
      assessmentDate: new Date('2024-10-20'),
      responses: generateResponses('moderate-concerns'),
      notes: 'Some sensory sensitivities emerging, particularly with auditory and tactile stimuli. Parent reports increased challenges at home.',
    },
    {
      clientId: 1,
      userId: 1,
      assessmentDate: new Date('2024-11-15'),
      responses: generateResponses('significant-concerns'),
      notes: 'More pronounced difficulties noted. Implementing sensory diet and environmental modifications.',
    },
    {
      clientId: 1,
      userId: 1,
      assessmentDate: new Date('2024-12-01'),
      responses: generateResponses('mixed-profile'),
      notes: 'Mixed results - strong improvements in vestibular and proprioceptive areas, ongoing challenges with auditory processing.',
    },
    {
      clientId: 1,
      userId: 1,
      assessmentDate: new Date('2024-12-13'),
      responses: generateResponses('improving-trend'),
      notes: 'Positive progress! Family reports better regulation and fewer sensory meltdowns. Continuing therapeutic strategies.',
    },
  ];

  try {
    for (const assessment of assessmentsData) {
      await db.insert(spm2Assessments).values(assessment);
      console.log(`✓ Created assessment for ${assessment.assessmentDate.toISOString().split('T')[0]}`);
    }
    
    console.log('\n✅ Successfully seeded 5 SPM-2 assessments!');
    console.log('All assessments are tied to client_id: 1 and user_id: 1');
  } catch (error) {
    console.error('Error seeding assessments:', error);
    throw error;
  }
}

seedAssessments()
  .then(() => {
    console.log('\nDone! You can now view these assessments in the app.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
