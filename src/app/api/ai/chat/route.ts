import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    console.log('[AI Chat] Request received');
    
    const user = await getCurrentUser();
    if (!user) {
      console.log('[AI Chat] Unauthorized');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const userMessage = body.message;
    const history = Array.isArray(body.history) ? body.history : [];

    if (!userMessage || typeof userMessage !== 'string') {
      console.log('[AI Chat] No message provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 });
    }

    console.log('[AI Chat] User:', user.email);

    // Build messages
    const messages = [
      { 
        role: 'assistant', 
        content: `You are an expert AI Study Assistant. Help students with study questions.

Guidelines:
• Be helpful and friendly
• Use **bold** for key terms
• Use bullet points for lists
• Explain step-by-step
• Student name: ${user.name || 'Student'}`
      }
    ];

    // Add history (last 6)
    history.slice(-6).forEach((msg: { role?: string; content?: string }) => {
      if ((msg.role === 'user' || msg.role === 'assistant') && msg.content) {
        messages.push({ role: msg.role, content: msg.content });
      }
    });

    // Add user message
    messages.push({ role: 'user', content: userMessage });

    console.log('[AI Chat] Calling AI...');

    // Create ZAI and call - EXACTLY matching working test script
    const zai = await ZAI.create();
    
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    const reply = response.choices?.[0]?.message?.content;
    
    console.log('[AI Chat] Reply received:', reply ? 'yes' : 'no');

    if (reply && typeof reply === 'string' && reply.trim()) {
      return NextResponse.json({ success: true, message: reply });
    }

    return NextResponse.json({ success: true, message: getFallbackResponse() });

  } catch (error) {
    console.error('[AI Chat] Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ success: true, message: getFallbackResponse() });
  }
}

function getFallbackResponse(): string {
  return `## I'm having trouble connecting right now 🔄

Here are some quick study tips:

**For Math:**
• Write down what you know
• Draw diagrams
• Work through examples

**For Memorization:**
• Use spaced repetition
• Create mnemonics
• Teach someone else

**Study Techniques:**
• Pomodoro: 25 min study + 5 min break
• Active recall: Quiz yourself
• Feynman technique: Explain simply

Please try again!`;
}
