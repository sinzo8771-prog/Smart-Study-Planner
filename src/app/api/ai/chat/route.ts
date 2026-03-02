import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Global ZAI instance - reuse across requests for better performance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Comprehensive system prompt for study assistance
const SYSTEM_PROMPT = `You are an expert AI Study Assistant named "StudyBuddy". You help students with ANY study-related question across ALL subjects and topics.

## Your Capabilities
You can help with:
- 📐 **Mathematics**: Algebra, calculus, geometry, trigonometry, statistics, linear algebra, discrete math
- 🔬 **Sciences**: Physics, chemistry, biology, astronomy, earth science
- 📖 **Languages**: English, writing, grammar, literature analysis, essays
- 🌍 **Social Studies**: History, geography, economics, civics, psychology
- 💻 **Computer Science**: Programming, algorithms, data structures, web development
- 🎨 **Arts & Humanities**: Music theory, art history, philosophy
- 📝 **Test Prep**: SAT, ACT, GRE, GMAT, TOEFL, IELTS, AP exams
- 📚 **Study Skills**: Time management, note-taking, memorization techniques, exam strategies

## How You Respond
1. **Be clear and educational**: Explain concepts step-by-step, like a patient tutor
2. **Use formatting**: 
   - Use **bold** for key terms and formulas
   - Use bullet points (•) for lists
   - Use numbered lists for step-by-step solutions
   - Use code blocks for code or equations
3. **Show your work**: When solving problems, explain each step
4. **Give examples**: Provide practical examples to illustrate concepts
5. **Be encouraging**: Motivate students and celebrate their progress
6. **Ask clarifying questions**: If a question is unclear, ask for clarification
7. **Adapt to level**: Adjust explanations based on the student's level

## Problem-Solving Approach
For math/science problems:
1. Identify what's given and what's needed
2. Show the relevant formula or concept
3. Walk through the solution step-by-step
4. Verify the answer makes sense
5. Offer practice problems if helpful

## Writing & Essays
For writing help:
- Help with outlines and structure
- Suggest improvements to clarity and flow
- Explain grammar rules when correcting
- Provide examples of good writing

## Study Tips & Strategies
Always be ready to suggest:
- Active recall techniques
- Spaced repetition schedules
- Pomodoro technique
- Mind mapping
- Feynman technique
- Memory palace

## Important Rules
- Never give incorrect information. If unsure, admit it.
- Don't do homework FOR students - guide them to find answers
- Be patient and supportive
- Use the student's name if provided: {userName}
- Keep responses focused but thorough
- If asked about something outside study topics, politely redirect to study matters

Remember: Your goal is to help students LEARN, not just give answers. Empower them to become better learners!`;

// Retry helper with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[AI Chat] Attempt ${attempt}/${retries} failed:`, lastError.message);
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
}

// AI Chat endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('[AI Chat] Request received at:', new Date().toISOString());
    
    const user = await getCurrentUser();
    if (!user) {
      console.log('[AI Chat] Unauthorized - no user');
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

    console.log('[AI Chat] User:', user.email, '| Message length:', userMessage.length);

    // Get ZAI instance
    const zai = await getZAI();

    // Build messages array
    // Note: Using 'assistant' role for system prompt as per SDK docs
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { 
        role: 'assistant', 
        content: SYSTEM_PROMPT.replace('{userName}', user.name || 'Student')
      }
    ];

    // Add conversation history (last 10 messages to maintain context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      if ((msg.role === 'user' || msg.role === 'assistant') && msg.content?.trim()) {
        messages.push({ 
          role: msg.role, 
          content: msg.content.trim() 
        });
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage.trim() });

    console.log('[AI Chat] Sending to AI with', messages.length, 'messages');

    // Call AI with retry logic
    const response = await withRetry(async () => {
      const completion = await zai.chat.completions.create({
        messages,
        thinking: { type: 'disabled' }
      });
      return completion;
    }, 3, 1500);

    const reply = response.choices?.[0]?.message?.content;
    
    console.log('[AI Chat] AI response received, length:', reply?.length || 0);

    if (reply && typeof reply === 'string' && reply.trim()) {
      return NextResponse.json({ 
        success: true, 
        message: reply.trim() 
      });
    }

    // If we get here, the response was empty
    console.error('[AI Chat] Empty response from AI');
    return NextResponse.json({ 
      success: false, 
      message: getErrorMessage('empty')
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[AI Chat] Error:', errorMessage);
    
    // Check for specific error types
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json({ 
        success: false, 
        message: getErrorMessage('rate_limit')
      });
    }
    
    if (errorMessage.includes('timeout')) {
      return NextResponse.json({ 
        success: false, 
        message: getErrorMessage('timeout')
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: getErrorMessage('general')
    });
  }
}

// Helpful error messages that still provide value
function getErrorMessage(type: 'empty' | 'rate_limit' | 'timeout' | 'general'): string {
  const messages = {
    empty: `## 🤔 Hmm, I'm having trouble formulating a response

Let me try to help anyway! Here are some study tips:

**While I recover:**
• Try rephrasing your question
• Break complex questions into smaller parts
• Check if your question is about a specific subject

**Quick Study Tips:**
• Use the **Pomodoro Technique**: 25 min focus + 5 min break
• **Active Recall**: Quiz yourself instead of re-reading
• **Spaced Repetition**: Review material at increasing intervals

Please try again in a moment!`,

    rate_limit: `## ⏳ I'm a bit overwhelmed right now

Many students are asking questions! Please wait a moment and try again.

**While you wait:**
• Review your notes
• Try the **Feynman Technique**: Explain the concept to yourself simply
• Take a short break - sometimes stepping away helps!`,

    timeout: `## ⏰ Request timed out

Your question might be complex! Try:
• Breaking it into smaller questions
• Being more specific
• Asking one thing at a time

**Example:**
Instead of: "Explain calculus"
Try: "What is a derivative and how do I find it?"`,

    general: `## 🔧 Temporary technical issue

I'm having trouble connecting right now. Here's what you can do:

**Immediate help:**
• Refresh the page and try again
• Check your internet connection
• Try a simpler question first

**Study while waiting:**
• Review flashcards
• Practice problems from your textbook
• Summarize what you've learned today`
  };
  
  return messages[type];
}
