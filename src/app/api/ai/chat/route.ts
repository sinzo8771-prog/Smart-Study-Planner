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
• Show work for math problems`;

// AI Chat endpoint
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[AI Chat] ========== New Request ==========');
    
    // Auth check
    const user = await getCurrentUser();
    if (!user) {
      console.log('[AI Chat] No user found');
      return NextResponse.json({ 
        success: false, 
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    // Parse body safely
    let body;
    try {
      body = await request.json();
    } catch {
      console.log('[AI Chat] Failed to parse request body');
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid request body.' 
      }, { status: 400 });
    }
    
    const userMessage = body?.message;
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userMessage?.trim()) {
      console.log('[AI Chat] Empty message');
      return NextResponse.json({ 
        success: false, 
        message: 'Please enter a question.' 
      }, { status: 400 });
    }

    console.log('[AI Chat] User:', user.email);
    console.log('[AI Chat] Message:', userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''));

    // Create ZAI instance
    console.log('[AI Chat] Creating ZAI...');
    const zai = await ZAI.create();
    console.log('[AI Chat] ZAI created');

    // Build messages array
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { 
        role: 'assistant', 
        content: SYSTEM_PROMPT 
      }
    ];

    // Add history (max 6 messages for context)
    for (const msg of history.slice(-6)) {
      if (msg?.role === 'user' || msg?.role === 'assistant') {
        if (msg?.content?.trim()) {
          messages.push({
            role: msg.role,
            content: msg.content.trim()
          });
        }
      }
    }

    // Add current message
    messages.push({ role: 'user', content: userMessage.trim() });

    console.log('[AI Chat] Calling AI with', messages.length, 'messages...');

    // Call AI
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    const elapsed = Date.now() - startTime;
    console.log('[AI Chat] Response received in', elapsed, 'ms');
    console.log('[AI Chat] Response type:', typeof response);
    console.log('[AI Chat] Response keys:', Object.keys(response || {}));

    // Debug: log the response structure
    if (response?.choices) {
      console.log('[AI Chat] choices length:', response.choices.length);
      console.log('[AI Chat] first choice:', JSON.stringify(response.choices[0], null, 2).substring(0, 200));
    }

    // Extract content - try multiple paths
    let reply: string | null = null;

    // Path 1: Standard path
    if (response?.choices?.[0]?.message?.content) {
      reply = response.choices[0].message.content;
      console.log('[AI Chat] Got content from choices[0].message.content');
    }
    // Path 2: Direct content on response
    else if ((response as unknown as Record<string, unknown>)?.content) {
      reply = String((response as unknown as Record<string, unknown>).content);
      console.log('[AI Chat] Got content from response.content');
    }
    // Path 3: Check if choices exist but in different format
    else if (response?.choices?.[0]) {
      const choice = response.choices[0] as unknown as Record<string, unknown>;
      if (typeof choice === 'string') {
        reply = choice;
        console.log('[AI Chat] Got content from choices[0] as string');
      } else if (choice?.text) {
        reply = String(choice.text);
        console.log('[AI Chat] Got content from choices[0].text');
      }
    }

    if (reply && typeof reply === 'string' && reply.trim()) {
      console.log('[AI Chat] ✅ SUCCESS! Reply length:', reply.length);
      return NextResponse.json({ 
        success: true, 
        message: reply.trim() 
      });
    }

    // If we get here, log the full response for debugging
    console.error('[AI Chat] ❌ Could not extract content');
    console.log('[AI Chat] Full response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json({ 
      success: false, 
      message: `## 🤔 Empty Response

I received your question but couldn't generate a response. 

**Debug info:** 
• Response had choices: ${!!response?.choices}
• Response keys: ${Object.keys(response || {}).join(', ')}

**Please try:**
• Rephrasing your question
• Breaking it into smaller parts
• Asking one specific thing`
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    const errMsg = error instanceof Error ? error.message : String(error);
    const errStack = error instanceof Error ? error.stack : '';
    
    console.error('[AI Chat] ❌ ERROR after', elapsed, 'ms');
    console.error('[AI Chat] Error message:', errMsg);
    console.error('[AI Chat] Error stack:', errStack);
    
    return NextResponse.json({ 
      success: false, 
      message: `## ⚠️ Something went wrong

**Error:** \`${errMsg}\`

**What to try:**
• Refresh the page and try again
• Ask a simpler question
• Wait a moment and retry

I'm here to help! 🎓`
    });
  }
}
