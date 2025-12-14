// Seed SPM-2 Assessments via API
// Run with: node seed-assessments-api.mjs

const API_URL = 'http://localhost:3000/api/spm2-assessments';

// Generate varied response patterns for 80 questions
const generateResponses = (pattern) => {
  const responses = {};
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

const assessmentsData = [
  {
    date: '2024-09-15',
    pattern: 'mostly-typical',
    notes: 'Initial assessment. Child shows typical sensory processing patterns across most domains.',
  },
  {
    date: '2024-10-20',
    pattern: 'moderate-concerns',
    notes: 'Some sensory sensitivities emerging, particularly with auditory and tactile stimuli. Parent reports increased challenges at home.',
  },
  {
    date: '2024-11-15',
    pattern: 'significant-concerns',
    notes: 'More pronounced difficulties noted. Implementing sensory diet and environmental modifications.',
  },
  {
    date: '2024-12-01',
    pattern: 'mixed-profile',
    notes: 'Mixed results - strong improvements in vestibular and proprioceptive areas, ongoing challenges with auditory processing.',
  },
  {
    date: '2024-12-13',
    pattern: 'improving-trend',
    notes: 'Positive progress! Family reports better regulation and fewer sensory meltdowns. Continuing therapeutic strategies.',
  },
];

console.log('⚠️  To seed assessments, you need to:');
console.log('1. Be logged in to the app at http://localhost:3000');
console.log('2. Have a client with ID (UUID) ready');
console.log('3. Paste the following code into your browser console while logged in:\n');

console.log('// ========== COPY BELOW THIS LINE ==========\n');

assessmentsData.forEach((assessment, index) => {
  const responses = generateResponses(assessment.pattern);
  
  console.log(`
// Assessment ${index + 1}: ${assessment.date}
fetch('/api/spm2-assessments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientId: 'YOUR_CLIENT_UUID_HERE', // Replace with actual client UUID
    responses: ${JSON.stringify(responses)},
    notes: '${assessment.notes}'
  })
}).then(r => r.json()).then(d => console.log('✓ Created assessment ${index + 1}:', d));
`);
});

console.log('\n// ========== COPY ABOVE THIS LINE ==========\n');
console.log('Remember to replace YOUR_CLIENT_UUID_HERE with your actual client UUID!');
