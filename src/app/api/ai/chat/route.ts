import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build the prompt
    const systemPrompt = `You are a helpful AI study assistant for the StudyPlanner learning management system. 
Your role is to help students with:
- Study tips and techniques
- Explaining concepts
- Creating study schedules
- Motivation and encouragement
- Answering academic questions

Keep responses concise, helpful, and encouraging. Use markdown formatting when appropriate.
${context ? `\nContext: ${context}` : ''}`;

    const userMessage = `${systemPrompt}\n\nUser Question: ${message}`;

    // Create ZAI instance
    const zai = await ZAI.create();
    
    const response = await zai.chat.completions.create({
      messages: [
        { role: 'user', content: userMessage }
      ],
    });

    const aiMessage = response.choices?.[0]?.message?.content || response.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide helpful fallback
    return NextResponse.json({ 
      success: true, 
      message: `## Study Assistant Tips\n\nHere are some helpful study tips:\n\n• **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break\n• **Active Recall**: Test yourself frequently instead of just re-reading\n• **Spaced Repetition**: Review material at increasing intervals\n• **Sleep Well**: Get 7-8 hours of sleep for better memory consolidation\n• **Stay Hydrated**: Drink water to maintain focus and concentration\n• **Set Clear Goals**: Define what you want to achieve each study session\n• **Eliminate Distractions**: Find a quiet place to study` 
    });
  }
}
