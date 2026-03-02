import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Store ZAI instance for reuse
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// AI Quiz Question Generator
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Note: Removing admin-only restriction for now to allow teachers to generate quizzes
    // if (user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    // }

    const { topic, count = 5, difficulty = 'medium' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert quiz question generator for educational purposes.
Generate high-quality multiple choice questions that test understanding, not just memorization.
Always respond with valid JSON only - no markdown, no explanations outside the JSON.`;

    const userPrompt = `Generate ${count} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level.

Return ONLY a valid JSON array with this exact structure (no markdown, no code blocks):
[
  {
    "question": "The question text here?",
    "optionA": "First option",
    "optionB": "Second option", 
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctAnswer": "A",
    "explanation": "Brief explanation of why this answer is correct"
  }
]

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- correctAnswer must be one of: A, B, C, or D
- Include a brief explanation for each answer
- Make options plausible but only one is correct
- Questions should be appropriate for ${difficulty} difficulty
- Return ONLY the JSON array, no additional text or markdown`;

    // Get ZAI instance
    const zai = await getZAI();

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    let questionsText = response.choices?.[0]?.message?.content || response.content || '[]';
    
    // Clean up the response - extract JSON if wrapped in markdown
    questionsText = questionsText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    // Find the JSON array
    const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questionsText = jsonMatch[0];
    }
    
    let questions;
    try {
      questions = JSON.parse(questionsText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', questionsText, parseError);
      
      // Return fallback questions if parsing fails
      return NextResponse.json({
        success: true,
        questions: generateFallbackQuestions(topic, count),
      });
    }

    // Validate and format questions
    const validatedQuestions = questions.map((q: Record<string, unknown>, index: number) => ({
      question: String(q.question || `Question ${index + 1} about ${topic}`),
      optionA: String(q.optionA || 'Option A'),
      optionB: String(q.optionB || 'Option B'),
      optionC: String(q.optionC || 'Option C'),
      optionD: String(q.optionD || 'Option D'),
      correctAnswer: ['A', 'B', 'C', 'D'].includes(String(q.correctAnswer)) ? String(q.correctAnswer) : 'A',
      explanation: String(q.explanation || ''),
      points: 1,
      order: index,
    }));

    return NextResponse.json({
      success: true,
      questions: validatedQuestions,
    });
  } catch (error) {
    console.error('Generate quiz error:', error);
    
    // Return fallback questions on error
    try {
      const body = await request.clone().json();
      const { topic, count = 5 } = body;
      return NextResponse.json({
        success: true,
        questions: generateFallbackQuestions(topic || 'General', count || 5),
      });
    } catch {
      return NextResponse.json({
        success: true,
        questions: generateFallbackQuestions('General', 5),
      });
    }
  }
}

// Generate fallback questions when AI fails
function generateFallbackQuestions(topic: string, count: number) {
  const templates = [
    {
      question: `What is a fundamental concept in ${topic}?`,
      optionA: 'Basic understanding of core principles',
      optionB: 'Advanced theoretical frameworks only',
      optionC: 'Complex mathematical analysis',
      optionD: 'Simple observation without context',
      correctAnswer: 'A',
      explanation: 'Understanding fundamental concepts and core principles is essential for mastering any topic.',
    },
    {
      question: `Which approach is most effective for learning ${topic}?`,
      optionA: 'Practice and repetition with feedback',
      optionB: 'Passive reading of materials',
      optionC: 'Skipping difficult sections',
      optionD: 'Memorizing without understanding',
      correctAnswer: 'A',
      explanation: 'Active practice with feedback is the most effective way to learn and retain information.',
    },
    {
      question: `What should you do when you encounter difficulties in ${topic}?`,
      optionA: 'Seek help and clarify doubts',
      optionB: 'Give up and move on',
      optionC: 'Ignore the problem',
      optionD: 'Skip to easier topics only',
      correctAnswer: 'A',
      explanation: 'Seeking help and clarifying doubts is the best approach to overcome learning challenges.',
    },
    {
      question: `How can you best apply knowledge of ${topic}?`,
      optionA: 'Through practical exercises and real-world applications',
      optionB: 'By avoiding any application',
      optionC: 'Through theory only',
      optionD: 'By forgetting the basics',
      correctAnswer: 'A',
      explanation: 'Practical application helps solidify theoretical knowledge and improves understanding.',
    },
    {
      question: `What is the recommended study method for ${topic}?`,
      optionA: 'Consistent daily review and practice',
      optionB: 'Cramming before exams only',
      optionC: 'Studying once a month',
      optionD: 'Random and unstructured studying',
      correctAnswer: 'A',
      explanation: 'Consistent daily review is the most effective study method for long-term retention.',
    },
    {
      question: `Which learning technique enhances memory retention for ${topic}?`,
      optionA: 'Spaced repetition over time',
      optionB: 'Reading once before the exam',
      optionC: 'Studying for long hours without breaks',
      optionD: 'Copying notes without thinking',
      correctAnswer: 'A',
      explanation: 'Spaced repetition helps move information from short-term to long-term memory.',
    },
    {
      question: `What helps improve understanding of complex ${topic} concepts?`,
      optionA: 'Breaking them into smaller parts',
      optionB: 'Avoiding difficult concepts',
      optionC: 'Memorizing definitions only',
      optionD: 'Skipping prerequisite knowledge',
      correctAnswer: 'A',
      explanation: 'Breaking complex concepts into smaller, manageable parts makes them easier to understand.',
    },
  ];

  return templates.slice(0, Math.min(count, templates.length)).map((t, index) => ({
    ...t,
    question: t.question.replace(/\$\{topic\}/g, topic),
    points: 1,
    order: index,
  }));
}
