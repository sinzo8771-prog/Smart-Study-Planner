import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get single quiz with questions
// - Students: without correct answers
// - Admin: with correct answers
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

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            points: true,
            order: true,
            // Only include correctAnswer and explanation for admin
            ...(user.role === 'admin' ? { correctAnswer: true, explanation: true } : {}),
          },
        },
        _count: {
          select: { questions: true, quizAttempts: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Students can only access published quizzes
    if (user.role !== 'admin' && !quiz.isPublished) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get user's previous attempts for this quiz
    const previousAttempts = await db.quizAttempt.findMany({
      where: {
        userId: user.id,
        quizId: id,
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        score: true,
        totalPoints: true,
        earnedPoints: true,
        completedAt: true,
        timeTaken: true,
      },
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return NextResponse.json({
      success: true,
      quiz: {
        ...quiz,
        totalPoints,
        questionCount: quiz._count.questions,
        attemptCount: quiz._count.quizAttempts,
        _count: undefined,
        previousAttempts,
      },
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// PUT: Update quiz (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      description, 
      courseId, 
      duration, 
      passingScore, 
      isPublished,
      questions 
    } = body;

    // Check if quiz exists
    const existingQuiz = await db.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (courseId !== undefined) updateData.courseId = courseId || null;
    if (duration !== undefined) updateData.duration = duration;
    if (passingScore !== undefined) updateData.passingScore = passingScore;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // If questions are provided, update them
    if (questions && Array.isArray(questions)) {
      // Validate questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer) {
          return NextResponse.json(
            { error: `Question ${i + 1} is missing required fields` },
            { status: 400 }
          );
        }
        if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          return NextResponse.json(
            { error: `Question ${i + 1} has invalid correctAnswer` },
            { status: 400 }
          );
        }
      }

      // Delete existing questions and create new ones
      await db.question.deleteMany({
        where: { quizId: id },
      });

      // Create new questions
      await db.question.createMany({
        data: questions.map((q: Record<string, unknown>, index: number) => ({
          quizId: id,
          question: q.question as string,
          optionA: q.optionA as string,
          optionB: q.optionB as string,
          optionC: q.optionC as string,
          optionD: q.optionD as string,
          correctAnswer: q.correctAnswer as string,
          explanation: q.explanation as string | undefined,
          points: (q.points as number) || 1,
          order: index,
        })),
      });
    }

    // Update quiz
    const quiz = await db.quiz.update({
      where: { id },
      data: updateData,
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

// DELETE: Delete quiz (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Check if quiz exists
    const existingQuiz = await db.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Delete quiz (cascade will delete questions and attempts)
    await db.quiz.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
}
