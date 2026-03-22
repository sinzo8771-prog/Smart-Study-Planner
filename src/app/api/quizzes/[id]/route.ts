import { NextRequest, NextResponse } from 'next/server';
import { getQuizById, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';

// GET: Get a single quiz by ID with questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quiz = await getQuizById(id);

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// PUT: Update a quiz (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, courseId, duration, passingScore, isPublished, category, difficulty, questions } = body;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const mockQuiz = {
        id,
        title: title || 'Updated Quiz',
        description: description || null,
        courseId: courseId || null,
        duration: duration || 15,
        passingScore: passingScore || 60,
        isPublished: isPublished ?? true,
        category: category || 'General',
        difficulty: difficulty || 'beginner',
        updatedAt: new Date(),
        _count: { questions: questions?.length || 0, quizAttempts: 0 },
      };
      return NextResponse.json({ success: true, quiz: mockQuiz });
    }

    // Check if quiz exists
    const existingQuiz = await db.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = sanitizeString(title.trim());
    if (description !== undefined) updateData.description = description ? sanitizeString(description.trim()) : null;
    if (courseId !== undefined) updateData.courseId = courseId || null;
    if (duration !== undefined) updateData.duration = duration;
    if (passingScore !== undefined) updateData.passingScore = passingScore;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;

    // Update quiz with questions if provided
    const quiz = await db.quiz.update({
      where: { id },
      data: {
        ...updateData,
        ...(questions && {
          questions: {
            deleteMany: {},
            create: questions.map((q: Record<string, unknown>, index: number) => ({
              question: sanitizeString(String(q.question)),
              optionA: sanitizeString(String(q.optionA)),
              optionB: sanitizeString(String(q.optionB)),
              optionC: sanitizeString(String(q.optionC)),
              optionD: sanitizeString(String(q.optionD)),
              correctAnswer: String(q.correctAnswer).toUpperCase(),
              explanation: q.explanation ? sanitizeString(String(q.explanation)) : null,
              points: (q.points as number) || 1,
              order: index,
            })),
          },
        }),
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { questions: true, quizAttempts: true } },
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}

// DELETE: Delete a quiz (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      return NextResponse.json({ success: true, message: 'Quiz deleted successfully' });
    }

    // Check if quiz exists
    const existingQuiz = await db.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Delete quiz (cascade will handle questions and attempts)
    await db.quiz.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
  }
}
