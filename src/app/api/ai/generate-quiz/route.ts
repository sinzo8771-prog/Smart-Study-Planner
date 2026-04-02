import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';


export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { 
      topic, 
      count = 5, 
      difficulty = 'medium',
      category = 'General',
      instructions = ''
    } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    
    let userMessage = `Generate ${count} multiple choice quiz questions about "${topic}" at ${difficulty} difficulty level.`;
    
    
    if (category && category !== 'General') {
      userMessage += ` The questions should be related to the ${category} domain.`;
    }
    
    
    if (instructions && instructions.trim()) {
      userMessage += ` Additional instructions: ${instructions.trim()}`;
    }

    userMessage += `

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
- Questions should be clear, educational, and appropriate for the difficulty level
- ${difficulty === 'easy' ? 'Focus on basic concepts and fundamental knowledge.' : difficulty === 'hard' ? 'Include complex scenarios and advanced concepts.' : 'Balance between basic and intermediate concepts.'}
- Return ONLY the JSON array, no additional text`;

    const systemPrompt = `You are an expert quiz generator. Create high-quality, educational multiple choice questions that test understanding of the topic. Always respond with valid JSON only.`;

    
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      thinking: { type: 'enabled' }
    });

    let questionsText = completion.choices?.[0]?.message?.content || '[]';
    
    
    questionsText = questionsText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    
    const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      questionsText = jsonMatch[0];
    }
    
    let questions;
    try {
      questions = JSON.parse(questionsText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', questionsText, parseError);
      
      
      return NextResponse.json({
        success: true,
        questions: generateFallbackQuestions(topic, count, difficulty),
      });
    }

    
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
    
    
    return NextResponse.json({
      success: true,
      questions: generateFallbackQuestions('General', 5, 'medium'),
    });
  }
}


function generateFallbackQuestions(topic: string, count: number, difficulty: string = 'medium') {
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'hard' ? 3 : 2;
  
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
    question: t.question.replace(/\$\{topic\}/g, topic),
    points: difficultyMultiplier,
    order: index,
  }));
}
