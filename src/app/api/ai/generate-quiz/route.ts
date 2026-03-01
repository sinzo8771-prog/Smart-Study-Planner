import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// AI Quiz Question Generator
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { topic, count = 5, difficulty = 'medium' } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const prompt = `Generate ${count} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level.

IMPORTANT: Return your response as a valid JSON array with this exact structure:
[
  {
    "question": "The question text here?",
    "optionA": "First option",
    "optionB": "Second option", 
    "optionC": "Third option",
    "optionD": "Fourth option",
    "correctAnswer": "A",
    "explanation": "Brief explanation"
  }
]

Requirements:
- Each question must have exactly 4 options (A, B, C, D)
- correctAnswer must be one of: A, B, C, or D
- Include a brief explanation for each answer
- Make options plausible but only one is correct
- Return ONLY the JSON array, no additional text`;

    // Create ZAI instance
    const zai = await ZAI.create();
    
    const response = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
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
    const { topic, count = 5 } = await request.json().catch(() => ({ topic: 'General', count: 5 }));
    return NextResponse.json({
      success: true,
      questions: generateFallbackQuestions(topic || 'General', count || 5),
    });
  }
}

// Generate fallback questions when AI fails
function generateFallbackQuestions(topic: string, count: number) {
  const templates = [
    {
      question: `What is a fundamental concept in ${topic}?`,
      optionA: 'Basic understanding',
      optionB: 'Advanced theory',
      optionC: 'Complex analysis',
      optionD: 'Simple observation',
      correctAnswer: 'A',
      explanation: 'Understanding fundamentals is key to mastering any topic.',
    },
    {
      question: `Which approach is most effective for learning ${topic}?`,
      optionA: 'Practice and repetition',
      optionB: 'Passive reading',
      optionC: 'Skipping difficult parts',
      optionD: 'Memorizing without understanding',
      correctAnswer: 'A',
      explanation: 'Active practice and repetition help reinforce learning.',
    },
    {
      question: `What should you do when you encounter difficulties in ${topic}?`,
      optionA: 'Seek help and clarify doubts',
      optionB: 'Give up',
      optionC: 'Ignore the problem',
      optionD: 'Skip to easier topics',
      correctAnswer: 'A',
      explanation: 'Seeking help and clarifying doubts is the best way to overcome learning challenges.',
    },
    {
      question: `How can you best apply knowledge of ${topic}?`,
      optionA: 'Through practical exercises',
      optionB: 'By avoiding application',
      optionC: 'Through theory only',
      optionD: 'By forgetting the basics',
      correctAnswer: 'A',
      explanation: 'Practical application helps solidify theoretical knowledge.',
    },
    {
      question: `What is the recommended study method for ${topic}?`,
      optionA: 'Consistent daily review',
      optionB: 'Cramming before exams',
      optionC: 'Studying once a month',
      optionD: 'Random studying',
      correctAnswer: 'A',
      explanation: 'Consistent daily review is the most effective study method.',
    },
  ];

  return templates.slice(0, Math.min(count, templates.length)).map((t, index) => ({
    ...t,
    question: t.question.replace('${topic}', topic),
    points: 1,
    order: index,
  }));
}
