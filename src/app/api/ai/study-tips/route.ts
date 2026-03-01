import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import ZAI from 'z-ai-web-dev-sdk';

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

    const prompt = `Based on this student's progress, provide 3-5 personalized study tips and recommendations.

Student Stats:
- Subjects: ${subjects}
- Tasks completed: ${completedTasks} out of ${totalTasks}
- Average quiz score: ${Math.round(avgScore)}%

Provide actionable, encouraging study tips formatted as markdown bullet points.`;

    // Create ZAI instance
    const zai = await ZAI.create();
    
    const response = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
    });

    const tips = response.choices?.[0]?.message?.content || response.content || getDefaultTips();

    return NextResponse.json({
      success: true,
      tips,
    });
  } catch (error) {
    console.error('Study tips error:', error);
    return NextResponse.json({ 
      success: true, 
      tips: getDefaultTips() 
    });
  }
}

function getDefaultTips(): string {
  return `## Study Tips

• **Set Clear Goals**: Define what you want to achieve each study session
• **Break It Down**: Divide large topics into smaller, manageable chunks
• **Use Active Learning**: Engage with the material through practice problems and teaching others
• **Take Regular Breaks**: Use the Pomodoro technique - 25 minutes study, 5 minutes break
• **Review Regularly**: Spaced repetition helps move information to long-term memory`;
}
