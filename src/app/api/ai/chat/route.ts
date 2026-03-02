import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Simple system prompt
const SYSTEM_PROMPT = `You are StudyBuddy, a friendly AI tutor. Help students learn ANY subject with clear explanations.

Subjects you know:
• Math: Algebra, Calculus, Geometry, Statistics
• Science: Physics, Chemistry, Biology
• Writing: Essays, Grammar, Literature
• History, Geography, Economics
• Coding: Programming, Algorithms
• Study Skills: Memory techniques, Time management

Response style:
• Be friendly and encouraging
• Explain step-by-step
• Use **bold** for key terms
• Use bullet points for lists
• Show work for math problems

Student: {userName}`;

// AI Chat endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('[AI Chat] Request started');
    
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const userMessage = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userMessage?.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Please enter a question.' 
      }, { status: 400 });
    }

    console.log('[AI Chat] User:', user.email, '| Message:', userMessage.substring(0, 50));

    // Create ZAI instance
    const zai = await ZAI.create();
    console.log('[AI Chat] ZAI created');

    // Build messages
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: SYSTEM_PROMPT.replace('{userName}', user.name || 'Student') }
    ];

    // Add history (last 6 messages)
    for (const msg of history.slice(-6)) {
      if ((msg.role === 'user' || msg.role === 'assistant') && msg.content?.trim()) {
        messages.push({ role: msg.role, content: msg.content.trim() });
      }
    }

    // Add current message
    messages.push({ role: 'user', content: userMessage.trim() });

    console.log('[AI Chat] Calling AI with', messages.length, 'messages');

    // Call AI
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    console.log('[AI Chat] Response received');

    // Try multiple ways to get the content (like generate-quiz does)
    let reply = response.choices?.[0]?.message?.content || 
                (response as unknown as Record<string, unknown>).content || 
                null;
    
    // Handle case where content might be in a different structure
    if (!reply && response.choices?.[0]) {
      const choice = response.choices[0] as unknown as Record<string, unknown>;
      reply = choice.message?.content || choice.content || null;
    }

    if (reply && typeof reply === 'string' && reply.trim()) {
      console.log('[AI Chat] Success! Length:', reply.length);
      return NextResponse.json({ 
        success: true, 
        message: reply.trim() 
      });
    }

    // Log what we got for debugging
    console.error('[AI Chat] No content found');
    console.log('[AI Chat] Response structure:', JSON.stringify(response, null, 2).substring(0, 500));
    
    return NextResponse.json({ 
      success: false, 
      message: `## 🤔 Empty response

I received your question but got an empty response. Please try:

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

Something went wrong: \`${errMsg}\`

**Try these:**
• Refresh the page
• Ask a simpler question
• Try again in a moment

I'm here to help! 🎓`
    });
  }
}
