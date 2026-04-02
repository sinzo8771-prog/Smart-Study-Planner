import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get single attempt with detailed results
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get the attempt
    const attempt = await db.quizAttempt.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            passingScore: true,
            duration: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    // Only the user who took the attempt or admin can view it
    if (user.role !== 'admin' && attempt.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get the questions with correct answers for detailed review
    const questions = await db.question.findMany({
      where: { quizId: attempt.quizId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        question: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
        explanation: true,
        points: true,
        order: true,
      },
    });

    // Parse answers from the attempt
    let gradedAnswers: Record<string, unknown> = {};
    try {
      gradedAnswers = JSON.parse(attempt.answers);
    } catch {
      gradedAnswers = {};
    }

    // Build detailed results
    const detailedResults = questions.map(q => {
      const answer = gradedAnswers[q.id] as Record<string, unknown> | undefined;
      return {
        questionId: q.id,
        question: q.question,
        options: {
          A: q.optionA,
          B: q.optionB,
          C: q.optionC,
          D: q.optionD,
        },
        correctAnswer: q.correctAnswer,
        userAnswer: answer?.userAnswer || '',
        isCorrect: answer?.isCorrect as boolean || false,
        points: q.points,
        earnedPoints: answer?.earnedPoints as number || 0,
        explanation: q.explanation,
      };
    });

    // Calculate statistics
    const correctCount = detailedResults.filter(r => r.isCorrect).length;
    const totalQuestions = questions.length;

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        score: attempt.score,
        totalPoints: attempt.totalPoints,
        earnedPoints: attempt.earnedPoints,
        timeTaken: attempt.timeTaken,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        passed: attempt.score >= attempt.quiz.passingScore,
        quiz: attempt.quiz,
        user: attempt.user,
        statistics: {
          correctCount,
          incorrectCount: totalQuestions - correctCount,
          totalQuestions,
          accuracy: totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
        },
        results: detailedResults,
      },
    });
  } catch (error) {
    console.error('Get quiz attempt error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt' },
      { status: 500 }
    );
  }
}
