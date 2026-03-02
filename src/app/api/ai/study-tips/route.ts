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

// AI Study Tips based on user's progress
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's stats from request context
    const { searchParams } = new URL(request.url);
    const subjectsParam = searchParams.get('subjects');
    const tasksParam = searchParams.get('tasks');
    const avgScoreParam = searchParams.get('avgScore');

    const subjects = subjectsParam ? parseInt(subjectsParam) : 0;
    const completedTasks = tasksParam ? parseInt(tasksParam.split('/')[0]) : 0;
    const totalTasks = tasksParam ? parseInt(tasksParam.split('/')[1]) : 0;
    const avgScore = avgScoreParam ? parseFloat(avgScoreParam) : 0;

    const systemPrompt = `You are an expert study coach who provides personalized advice to students.
Analyze the student's progress and give actionable, encouraging recommendations.`;

    const userPrompt = `Based on this student's progress, provide 3-5 personalized study tips and recommendations.

Student Stats:
- Subjects: ${subjects}
- Tasks completed: ${completedTasks} out of ${totalTasks}
- Average quiz score: ${Math.round(avgScore)}%

Student Name: ${user.name || 'Student'}

Provide actionable, encouraging study tips formatted with markdown. Use bullet points and make it easy to read.
Include specific recommendations based on their progress (if quiz score is low, suggest improvement tips; if task completion is low, suggest productivity tips).`;

    // Get ZAI instance
    const zai = await getZAI();

    const response = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });

    const tips = response.choices?.[0]?.message?.content || getDefaultTips(avgScore);

    return NextResponse.json({
      success: true,
      tips,
    });
  } catch (error) {
    console.error('Study tips error:', error);
    return NextResponse.json({ 
      success: true, 
      tips: getDefaultTips(0) 
    });
  }
}

function getDefaultTips(avgScore: number): string {
  const baseScore = Math.round(avgScore);
  
  return `## 📚 Personalized Study Tips

### Based on Your Progress

• **Set Clear Goals**: Define what you want to achieve each study session. Use the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound).

• **Break It Down**: Divide large topics into smaller, manageable chunks. This makes learning less overwhelming and more effective.

• **Use Active Learning**: Engage with the material through practice problems, teaching others, or creating flashcards instead of just reading passively.

${baseScore < 70 ? `• **Focus on Weak Areas**: Your average score is ${baseScore}%. Spend extra time reviewing topics where you scored lower and practice more quiz questions.` : `• **Maintain Your Momentum**: Your average score is ${baseScore}% - great job! Keep up the consistent effort and challenge yourself with harder topics.`}

• **Take Regular Breaks**: Use the Pomodoro technique - 25 minutes study, 5 minutes break. This helps maintain focus and prevents burnout.

• **Review Regularly**: Spaced repetition helps move information to long-term memory. Review material after 1 day, 3 days, 1 week, and 2 weeks.

### 💡 Quick Tip
Consistency beats intensity. Studying a little every day is more effective than cramming once a week!`;
}
