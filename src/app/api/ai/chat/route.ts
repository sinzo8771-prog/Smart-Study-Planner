import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// Store ZAI instance for reuse
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const message = body.message;
    const history = Array.isArray(body.history) ? body.history : [];

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // System prompt for the AI Study Assistant
    const systemPrompt = `You are a helpful AI study assistant for the StudyPlanner learning management system. 

Your role is to help students with:
- Study tips and techniques (Pomodoro, spaced repetition, active recall, etc.)
- Explaining complex concepts in simple terms
- Creating personalized study schedules and plans
- Motivation and encouragement when students feel overwhelmed
- Answering academic questions across various subjects
- Test preparation strategies
- Time management advice
- Note-taking and organization tips

Guidelines:
- Be encouraging, supportive, and patient
- Keep responses concise but helpful (aim for 2-4 paragraphs max, use bullet points for lists)
- Use markdown formatting when appropriate (bold, italic, lists, code blocks)
- If you don't know something, admit it honestly
- Provide actionable advice that students can implement immediately
- Celebrate small wins and progress

The student's name is ${user.name || 'Student'}.`;

    // Build messages array with proper format
    // Use 'assistant' role for system prompt as per z-ai-web-dev-sdk docs
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: systemPrompt }
    ];

    // Add conversation history if provided (filter and validate)
    if (history.length > 0) {
      for (const msg of history) {
        // Only include valid user/assistant messages
        if (msg && typeof msg === 'object') {
          const role = msg.role;
          const content = String(msg.content || '');
          
          if ((role === 'user' || role === 'assistant') && content.trim()) {
            messages.push({
              role: role as 'user' | 'assistant',
              content: content.trim()
            });
          }
        }
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Get ZAI instance
    const zai = await getZAI();

    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' }
    });

    const aiMessage = response.choices?.[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('Empty response from AI');
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide helpful fallback based on common queries
    const fallbackMessage = getFallbackResponse();
    
    return NextResponse.json({ 
      success: true, 
      message: fallbackMessage 
    });
  }
}

function getFallbackResponse(): string {
  const fallbacks = [
    `## Study Tips 📚

I'm having trouble connecting right now, but here are some helpful study tips:

• **Pomodoro Technique**: Study for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.

• **Active Recall**: Test yourself frequently instead of just re-reading notes. This strengthens memory retention.

• **Spaced Repetition**: Review material at increasing intervals (1 day, 3 days, 1 week, 2 weeks, etc.)

• **Sleep Well**: Get 7-8 hours of sleep - your brain consolidates memories during sleep.

• **Stay Hydrated**: Drink water to maintain focus and concentration.

Please try asking your question again!`,

    `## Need Help Studying? 🎯

I'm temporarily unavailable, but try these quick tips:

1. **Break it down**: Divide large topics into smaller, manageable chunks
2. **Teach someone**: Explaining concepts helps you understand them better
3. **Use multiple senses**: Read, write, speak, and visualize the material
4. **Set specific goals**: "Study Chapter 3" is better than just "study"
5. **Eliminate distractions**: Find a quiet place and put your phone away

Try your question again in a moment!`,

    `## Quick Study Hacks 💡

Connection issue detected. Here are some quick study hacks:

- **Study before sleep**: Review important material right before bed
- **Exercise before studying**: Light exercise improves focus and memory
- **Change locations**: Studying in different places improves retention
- **Use mnemonics**: Create memorable acronyms or associations
- **Practice tests**: Take practice tests to prepare for real exams

Please retry your question!`
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
