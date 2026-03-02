import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Simple system prompt
const SYSTEM_PROMPT = `You are StudyBuddy, a friendly AI tutor helping students learn ANY subject.

**Your expertise covers:**
• Math: Algebra, Calculus, Geometry, Statistics
• Science: Physics, Chemistry, Biology
• Writing: Essays, Grammar, Literature
• History, Geography, Economics
• Computer Science: Programming, Algorithms
• Study Skills: Memory techniques, Time management

**How to respond:**
• Be friendly and encouraging
• Explain concepts step-by-step
• Use **bold** for key terms
• Use bullet points for lists
• Give examples when helpful
• Show work for math problems

Student name: {userName}

Always be helpful and educational!`;

// AI Chat endpoint - simple and direct
export async function POST(request: NextRequest) {
  try {
    console.log('[AI Chat] === New Request ===');
    
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    // Parse body
    const body = await request.json().catch(() => ({}));
    const userMessage = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please enter a question.' 
      }, { status: 400 });
    }

    console.log('[AI Chat] User:', user.email);
    console.log('[AI Chat] Question:', userMessage.substring(0, 100));

    // Create fresh ZAI instance for each request (more reliable)
    console.log('[AI Chat] Creating ZAI instance...');
    const zai = await ZAI.create();
    console.log('[AI Chat] ZAI instance created');

    // Build messages
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [];
    
    // Add system prompt
    messages.push({
      role: 'assistant',
      content: SYSTEM_PROMPT.replace('{userName}', user.name || 'Student')
    });

    // Add recent history (max 6 messages for context)
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      if (msg?.role && msg?.content?.trim()) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content.trim()
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: userMessage.trim()
    });

    console.log('[AI Chat] Messages count:', messages.length);
    console.log('[AI Chat] Calling AI...');

    // Call AI - simple direct call
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    console.log('[AI Chat] AI call completed');

    // Extract response
    const reply = completion?.choices?.[0]?.message?.content;
    
    if (reply && typeof reply === 'string' && reply.trim()) {
      console.log('[AI Chat] Success! Response length:', reply.length);
      return NextResponse.json({ 
        success: true, 
        message: reply.trim() 
      });
    }

    // Empty response
    console.error('[AI Chat] Empty response from AI');
    console.log('[AI Chat] Completion object:', JSON.stringify(completion, null, 2));
    
    return NextResponse.json({ 
      success: false, 
      message: `## 🤔 I got an empty response

Please try asking your question again. Sometimes this happens when:
• The question is very long
• The servers are busy

**Try:**
• Rephrasing your question
• Breaking it into smaller parts
• Asking one thing at a time`
    });

  } catch (error) {
    console.error('[AI Chat] === ERROR ===');
    console.error('[AI Chat] Error type:', error?.constructor?.name);
    console.error('[AI Chat] Error message:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.stack) {
      console.error('[AI Chat] Stack:', error.stack);
    }

    // Return a helpful error message
    return NextResponse.json({ 
      success: false, 
      message: `## ⚠️ Oops, something went wrong

I encountered an error while processing your question.

**What to try:**
• **Refresh** the page and try again
• **Rephrase** your question differently
• **Simplify** - ask one thing at a time

**Error details:** \`${error instanceof Error ? error.message : 'Unknown error'}\`

Please try again! I'm here to help. 🎓`
    });
  }
}
