import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Get user's quiz attempts
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    // Build filter
    const where: Record<string, unknown> = { userId: user.id };
    if (quizId) {
      where.quizId = quizId;
    }

    const attempts = await db.quizAttempt.findMany({
      where,
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    // Add passed status to each attempt
    const attemptsWithStatus = attempts.map(attempt => ({
      ...attempt,
      passed: attempt.score >= attempt.quiz.passingScore,
    }));

    return NextResponse.json({
      success: true,
      attempts: attemptsWithStatus,
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}

// POST: Submit quiz attempt
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quizId, answers, timeTaken } = body;

    // Validate required fields
    if (!quizId || !answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Quiz ID and answers are required' },
        { status: 400 }
      );
    }

    // Get quiz with questions (including correct answers for grading)
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Students can only attempt published quizzes
    if (user.role !== 'admin' && !quiz.isPublished) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let earnedPoints = 0;
    let totalPoints = 0;
    const gradedAnswers: Record<string, { 
      userAnswer: string; 
      correctAnswer: string; 
      isCorrect: boolean; 
      points: number; 
      earnedPoints: number;
      explanation?: string;
    }> = {};

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += pointsEarned;

      gradedAnswers[question.id] = {
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points,
        earnedPoints: pointsEarned,
        explanation: question.explanation || undefined,
      };
    }

    // Calculate score percentage
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    // Create quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        totalPoints,
        earnedPoints,
        answers: JSON.stringify(gradedAnswers),
        timeTaken: timeTaken || 0,
        completedAt: new Date(),
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
      },
    });

    // Check if passed
    const passed = score >= quiz.passingScore;

    return NextResponse.json({
      success: true,
      attempt: {
        ...attempt,
        passed,
        gradedAnswers,
      },
    });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    );
  }
}
