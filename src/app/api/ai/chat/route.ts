import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/validation';
import ZAI from 'z-ai-web-dev-sdk';

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    // Check authentication - allow guest access with stricter rate limiting
    const user = await getCurrentUser();
    
    // Rate limiting - more strict for guests
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimit = user 
      ? checkRateLimit(`ai-chat:${ip}`, 30, 60000) // 30 per minute for logged-in users
      : checkRateLimit(`ai-chat-guest:${ip}`, 5, 60000); // 5 per minute for guests
    
    if (!rateLimit.allowed) {
      return NextResponse.json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      }, { status: 429 });
    }

    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build the system prompt
    const systemPrompt = `You are a helpful AI study assistant for the StudyPlanner learning management system. 
Your role is to help students with:
- Study tips and techniques
- Explaining concepts and answering academic questions
- Creating study schedules and time management advice
- Motivation and encouragement
- Quiz preparation and learning strategies

Keep responses concise, helpful, and encouraging. Use markdown formatting when appropriate.
${context ? `\nContext: ${context}` : ''}`;

    // Create ZAI instance
    const zai = await ZAI.create();
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      thinking: { type: 'enabled' }
    });

    const aiMessage = completion.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('Empty response from AI');
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
      isAuthenticated: !!user,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide helpful fallback
    return NextResponse.json({ 
      success: true, 
      message: `## Study Assistant Tips\n\nHere are some helpful study tips:\n\n• **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break\n• **Active Recall**: Test yourself frequently instead of just re-reading\n• **Spaced Repetition**: Review material at increasing intervals\n• **Sleep Well**: Get 7-8 hours of sleep for better memory consolidation\n• **Stay Hydrated**: Drink water to maintain focus and concentration\n• **Set Clear Goals**: Define what you want to achieve each study session\n• **Eliminate Distractions**: Find a quiet place to study\n\nWould you like more specific advice? Feel free to ask about any subject or study challenge!` 
    });
  }
}
