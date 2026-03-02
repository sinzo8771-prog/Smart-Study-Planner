import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    console.log('AI Chat: Request received');
    
    const user = await getCurrentUser();
    if (!user) {
      console.log('AI Chat: Unauthorized - no user found');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    console.log('AI Chat: User authenticated:', user.email);

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.log('AI Chat: Invalid JSON body', parseError);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid request body',
        message: 'Invalid request format.' 
      }, { status: 400 });
    }
    
    const message = body.message;
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message || typeof message !== 'string') {
      console.log('AI Chat: No message provided');
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required',
        message: 'Please enter a message.' 
      }, { status: 400 });
    }

    console.log('AI Chat: Message received:', message.substring(0, 50) + '...');

    // Enhanced system prompt for comprehensive study assistance
    const systemPrompt = `You are an expert AI Study Assistant. Help students with any study-related question.

Be friendly and helpful. Use markdown formatting with **bold** and bullet points.

The student's name is ${user.name || 'Student'}.`;

    // Build messages array
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: systemPrompt }
    ];

    // Add limited conversation history
    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      if (msg && typeof msg === 'object' && (msg.role === 'user' || msg.role === 'assistant')) {
        const content = String(msg.content || '').trim();
        if (content) {
          messages.push({ role: msg.role, content });
        }
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    console.log('AI Chat: Creating ZAI instance...');
    
    // Create ZAI instance
    const zai = await ZAI.create();
    
    console.log('AI Chat: Sending request to AI...');

    // Make request
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
      stream: false
    });

    console.log('AI Chat: Response received');

    const aiMessage = response.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.log('AI Chat: Empty response from AI, using fallback');
      return NextResponse.json({
        success: true,
        message: getFallbackResponse()
      });
    }

    console.log('AI Chat: Success! Returning AI response');
    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
    
  } catch (error) {
    console.error('AI Chat: Error occurred:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Return fallback response
    return NextResponse.json({ 
      success: true, 
      message: getFallbackResponse()
    });
  }
}

function getFallbackResponse(): string {
  return `## I'm having trouble connecting right now 🔄

But I can still help! Here are some quick study tips:

**For Math Problems:**
• Write down what you know and what you need to find
• Draw diagrams or graphs if applicable
• Work through similar examples first

**For Memorization:**
• Use spaced repetition - review at increasing intervals
• Create mnemonics (like "PEMDAS" for order of operations)

**For Understanding Concepts:**
• Break complex ideas into smaller parts
• Look for real-world examples

Please try your question again in a moment!`;
}
