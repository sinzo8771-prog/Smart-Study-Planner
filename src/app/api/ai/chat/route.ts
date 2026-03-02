import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Store ZAI instance for reuse (like working study-tips API)
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// System prompt - keeping it simple
const SYSTEM_PROMPT = `You are StudyBuddy, a friendly AI tutor helping students learn ANY subject.

Your expertise:
- Math: Algebra, Calculus, Geometry, Statistics
- Science: Physics, Chemistry, Biology
- Writing: Essays, Grammar, Literature
- History, Geography, Economics
- Computer Science: Programming, Algorithms
- Study Skills: Memory techniques, Time management

How to respond:
- Be friendly and encouraging
- Explain concepts step-by-step
- Use **bold** for key terms
- Use bullet points for lists
- Show work for math problems
- Give examples when helpful`;

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    // Parse request
    const body = await request.json();
    const userMessage = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userMessage?.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please enter a question.' 
      }, { status: 400 });
    }

    console.log('[AI Chat] User:', user.email);
    console.log('[AI Chat] Message:', userMessage.substring(0, 100));

    // Get ZAI instance
    const zai = await getZAI();

    // Build messages array - SAME FORMAT as working study-tips API
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [];

    // Add system prompt as assistant message (like study-tips does)
    messages.push({
      role: 'assistant',
      content: SYSTEM_PROMPT
    });

    // Add history (last 6 messages for context)
    for (const msg of history.slice(-6)) {
      if (msg?.role && msg?.content?.trim()) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content.trim()
          });
        }
      }
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage.trim()
    });

    console.log('[AI Chat] Calling AI with', messages.length, 'messages');

    // Call AI - EXACT SAME WAY as working study-tips API
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    // Extract content - SAME WAY as working study-tips API
    const reply = response.choices?.[0]?.message?.content;

    if (reply && typeof reply === 'string' && reply.trim()) {
      console.log('[AI Chat] Success! Length:', reply.length);
      return NextResponse.json({ 
        success: true, 
        message: reply.trim() 
      });
    }

    console.error('[AI Chat] Empty response');
    return NextResponse.json({ 
      success: false, 
      message: `## 🤔 Empty response

Please try:
• Rephrasing your question
• Breaking it into smaller parts
• Asking one specific thing at a time`
    });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[AI Chat] Error:', errMsg);
    
    return NextResponse.json({ 
      success: false, 
      message: `## ⚠️ Error

**Details:** ${errMsg}

**Try these:**
• Refresh the page and try again
• Ask a simpler question
• Wait a moment and retry

I'm here to help! 🎓`
    });
  }
}
