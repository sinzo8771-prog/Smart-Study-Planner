import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { shouldUseStaticData, getQuizById } from '@/lib/data-service';
import { db, runMigrations } from '@/lib/db';


const staticQuizAttempts: Map<string, Array<{
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  answers: string;
  startedAt: Date;
  completedAt: Date | null;
  timeTaken: number;
  passed: boolean;
}>> = new Map();


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

    
    if (shouldUseStaticData()) {
      const userAttempts = staticQuizAttempts.get(user.id) || [];
      
      let filteredAttempts = userAttempts;
      if (quizId) {
        filteredAttempts = userAttempts.filter(a => a.quizId === quizId);
      }

      return NextResponse.json({
        success: true,
        attempts: filteredAttempts.map(attempt => ({
          ...attempt,
          quiz: {
            id: attempt.quizId,
            title: `Quiz ${attempt.quizId}`,
            passingScore: 60,
          },
        })),
      });
    }

    
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

    
    if (!quizId || !answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Quiz ID and answers are required' },
        { status: 400 }
      );
    }

    
    if (shouldUseStaticData()) {
      const quiz = await getQuizById(quizId);
      if (!quiz) {
        return NextResponse.json(
          { error: 'Quiz not found' },
          { status: 404 }
        );
      }

      
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

      const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
      const passed = score >= quiz.passingScore;

      
      const attempt = {
        id: `attempt-${Date.now()}`,
        quizId,
        userId: user.id,
        score,
        totalPoints,
        earnedPoints,
        answers: JSON.stringify(gradedAnswers),
        startedAt: new Date(),
        completedAt: new Date(),
        timeTaken: timeTaken || 0,
        passed,
      };

      
      const userAttempts = staticQuizAttempts.get(user.id) || [];
      userAttempts.unshift(attempt);
      staticQuizAttempts.set(user.id, userAttempts);

      return NextResponse.json({
        success: true,
        attempt: {
          ...attempt,
          quiz: {
            id: quizId,
            title: quiz.title,
            passingScore: quiz.passingScore,
          },
          gradedAnswers,
        },
      });
    }

    
    await runMigrations();

    
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

    
    if (user.role !== 'admin' && !quiz.isPublished) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    
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

    
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

    
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
