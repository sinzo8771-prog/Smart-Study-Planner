import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

// AI Chat endpoint using z-ai-web-dev-sdk
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('AI Chat: Unauthorized - no user found');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Please log in to use the AI assistant.' 
      }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      console.log('AI Chat: Invalid JSON body');
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

    // Enhanced system prompt for comprehensive study assistance
    const systemPrompt = `You are an expert AI Study Assistant for the StudyPlanner learning management system. You can help with ANY study-related question.

YOUR CAPABILITIES:
You are knowledgeable in ALL academic subjects including but not limited to:
• Mathematics (algebra, calculus, geometry, statistics, trigonometry, etc.)
• Sciences (physics, chemistry, biology, earth science, astronomy)
• Languages (English, literature, writing, grammar, foreign languages)
• Social Sciences (history, geography, economics, psychology, sociology)
• Computer Science (programming, algorithms, data structures, web development)
• Arts & Humanities (philosophy, art history, music theory)
• Test Prep (SAT, ACT, GRE, MCAT, IELTS, TOEFL, etc.)

HOW TO HELP STUDENTS:
1. **Explain Concepts**: Break down complex topics into simple, understandable parts
2. **Solve Problems**: Walk through step-by-step solutions for math and science problems
3. **Provide Examples**: Use real-world examples to illustrate concepts
4. **Study Strategies**: Recommend effective study techniques for different subjects
5. **Homework Help**: Guide students through difficult assignments without doing the work for them
6. **Essay Writing**: Help with essay structure, thesis statements, and writing tips
7. **Exam Prep**: Provide test-taking strategies and practice questions
8. **Memory Techniques**: Suggest mnemonics and memory aids
9. **Motivation**: Encourage struggling students and celebrate progress
10. **Resource Recommendations**: Suggest study materials and resources when appropriate

RESPONSE GUIDELINES:
• Be friendly, patient, and encouraging
• Start with a clear, direct answer when possible
• Use markdown formatting: **bold** for key terms, *italic* for emphasis
• Use bullet points or numbered lists for steps and multiple items
• Include examples to clarify concepts
• Keep responses focused but thorough (not too long, not too short)
• If a question is unclear, ask for clarification
• If you don't know something, admit it honestly and suggest where to find help
• Use code blocks (\`\`\`) for code, formulas, or equations
• For math, show your work step-by-step
• Always explain WHY something is the answer, not just WHAT the answer is

SPECIAL FORMATTING:
• For equations/math: Use clear notation, show steps
• For definitions: Bold the term, then explain
• For processes: Use numbered steps
• For comparisons: Use tables or bullet points
• For code: Use proper syntax with code blocks

The student's name is ${user.name || 'Student'}. Be personal and engaging!`;

    // Build messages array with proper format
    const messages: Array<{ role: 'assistant' | 'user'; content: string }> = [
      { role: 'assistant', content: systemPrompt }
    ];

    // Add conversation history if provided (filter and validate)
    // Limit history to last 10 messages to avoid token limits
    const recentHistory = history.slice(-10);
    if (recentHistory.length > 0) {
      for (const msg of recentHistory) {
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

    // Create a fresh ZAI instance for each request to avoid stale connections
    const zai = await ZAI.create();

    // Make request with timeout handling
    const response = await Promise.race([
      zai.chat.completions.create({
        messages,
        thinking: { type: 'disabled' },
        stream: false
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - AI took too long to respond')), 30000)
      )
    ]);

    const aiMessage = response.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.log('AI Chat: Empty response from AI');
      return NextResponse.json({
        success: true,
        message: getFallbackResponse()
      });
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    
    // Return fallback response with success=true so UI shows it
    return NextResponse.json({ 
      success: true, 
      message: getFallbackResponse()
    });
  }
}

function getFallbackResponse(): string {
  const fallbacks = [
    `## I'm having trouble connecting right now 🔄

But I can still help! Here are some quick study tips while I reconnect:

**For Math Problems:**
• Write down what you know and what you need to find
• Draw diagrams or graphs if applicable
• Work through similar examples first

**For Memorization:**
• Use spaced repetition - review at increasing intervals
• Create mnemonics (like "PEMDAS" for order of operations)
• Teach the concept to someone else

**For Understanding Concepts:**
• Break complex ideas into smaller parts
• Look for real-world examples
• Connect new information to what you already know

Please try your question again in a moment!`,

    `## Temporary Connection Issue ⚡

I'll be back shortly! In the meantime, try these study strategies:

**Active Learning Techniques:**
1. **Summarize** - Rewrite notes in your own words
2. **Question** - Turn headings into questions and answer them
3. **Connect** - Link new concepts to things you already know
4. **Apply** - Practice with problems or real-world examples

**Time Management:**
• Use the Pomodoro Technique (25 min study + 5 min break)
• Tackle difficult subjects when you're most alert
• Take short breaks to stay focused

Try your question again!`,

    `## Quick Study Hacks While I Reconnect 💡

**Effective Study Methods:**

• **Feynman Technique**: Explain a concept as if teaching a beginner
• **Interleaving**: Mix different topics during study sessions
• **Retrieval Practice**: Quiz yourself without looking at notes
• **Elaboration**: Ask "why" and "how" about each concept

**For Different Subjects:**
- *Math/Science*: Practice problems regularly
- *Languages*: Read, write, and speak daily
- *History/Social Studies*: Create timelines and connections
- *Writing*: Outline first, then draft

I'll be ready to answer your specific questions in just a moment!`
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
