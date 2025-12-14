import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import OpenAI from 'openai';
import { spm2Sections } from '@/lib/spm2-questions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sectionId, responses, clientName } = body;

    if (!sectionId || !responses || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the section
    const section = spm2Sections.find(s => s.id === sectionId);
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Filter for Always (4) and Frequently (3) responses
    const alwaysItems: string[] = [];
    const frequentlyItems: string[] = [];

    section.questions.forEach((question) => {
      const response = responses[question.id];
      if (response === 4) {
        alwaysItems.push(question.text);
      } else if (response === 3) {
        frequentlyItems.push(question.text);
      }
    });

    // If no Always or Frequently responses, return a default message
    if (alwaysItems.length === 0 && frequentlyItems.length === 0) {
      return NextResponse.json({
        takeaway: `${clientName} shows typical responses in the ${section.title.split('(')[0].trim()} domain, with no concerning patterns identified.`,
      });
    }

    // Build the prompt for OpenAI
    const prompt = `You are an occupational therapist writing a clinical assessment summary. Based on the SPM-2 assessment responses for the ${section.title.split('(')[0].trim()} section, write a concise paragraph (3-5 sentences) summarizing the key observations.

Client Name: ${clientName}
Section: ${section.title} - ${section.description}

Responses marked as "Always" (most concerning):
${alwaysItems.length > 0 ? alwaysItems.map((item, i) => `${i + 1}. ${item}`).join('\n') : 'None'}

Responses marked as "Frequently" (concerning):
${frequentlyItems.length > 0 ? frequentlyItems.map((item, i) => `${i + 1}. ${item}`).join('\n') : 'None'}

Write a professional, compassionate narrative paragraph that:
1. Uses the client's first name naturally
2. Summarizes the patterns observed
3. Mentions the specific behaviors that occur "always" and "frequently"
4. Uses clear, parent-friendly language
5. Maintains a neutral, observational tone

Write only the paragraph, no headings or labels:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced occupational therapist writing clinical assessment summaries. Write clear, professional, and compassionate narratives about children\'s sensory processing patterns.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const takeaway = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ takeaway });
  } catch (error) {
    console.error('Error generating takeaway:', error);
    return NextResponse.json(
      { error: 'Failed to generate takeaway' },
      { status: 500 }
    );
  }
}
