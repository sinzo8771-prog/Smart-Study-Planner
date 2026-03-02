import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: List all quizzes
// - Students: only published quizzes
// - Admin: all quizzes
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
    const courseId = searchParams.get('courseId');

    // Build filter conditions
    const where: Record<string, unknown> = {};
    
    // Students can only see published quizzes
    if (user.role !== 'admin') {
      where.isPublished = true;
    }

    // Filter by course if provided
    if (courseId) {
      where.courseId = courseId;
    }

    const quizzes = await db.quiz.findMany({
      where,
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
            // Don't include correctAnswer for students
            ...(user.role === 'admin' ? { correctAnswer: true, explanation: true } : {}),
          },
        },
        _count: {
          select: { questions: true, quizAttempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform the response to include question count
    const transformedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      questionCount: quiz._count.questions,
      attemptCount: quiz._count.quizAttempts,
      _count: undefined,
    }));

    return NextResponse.json({
      success: true,
      quizzes: transformedQuizzes,
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// POST: Create a new quiz (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can create quizzes
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

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

    // Validate required fields
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one question are required' },
        { status: 400 }
      );
    }

    // Validate each question
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
          { error: `Question ${i + 1} has invalid correctAnswer. Must be A, B, C, or D` },
          { status: 400 }
        );
      }
    }

    // Create quiz with questions
    const quiz = await db.quiz.create({
      data: {
        title,
        description,
        courseId: courseId || null,
        duration: duration || 30,
        passingScore: passingScore || 60,
        isPublished: isPublished || false,
        createdBy: user.id,
        questions: {
          create: questions.map((q: Record<string, unknown>, index: number) => ({
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
        },
      },
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
    console.error('Create quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}
