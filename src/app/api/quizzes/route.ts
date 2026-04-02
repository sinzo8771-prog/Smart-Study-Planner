import { NextRequest, NextResponse } from 'next/server';
import { getQuizzes, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db, runMigrations } from '@/lib/db';
import { sanitizeString, isValidCourseLevel } from '@/lib/validation';
import { staticQuizzes } from '@/lib/static-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    
    if (shouldUseStaticData()) {
      const quizzes = staticQuizzes.filter(q => q.isPublished).map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        courseId: q.courseId,
        duration: q.duration,
        passingScore: q.passingScore,
        isPublished: q.isPublished,
        category: q.category || 'General',
        difficulty: q.difficulty || 'beginner',
        createdAt: q.createdAt,
        _count: { questions: q.questions.length, quizAttempts: 0 },
      }));
      
      return NextResponse.json({
        success: true,
        quizzes,
      });
    }

    const quizzes = await getQuizzes();

    return NextResponse.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    
    const quizzes = staticQuizzes.filter(q => q.isPublished).map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      courseId: q.courseId,
      duration: q.duration,
      passingScore: q.passingScore,
      isPublished: q.isPublished,
      category: q.category || 'General',
      difficulty: q.difficulty || 'beginner',
      createdAt: q.createdAt,
      _count: { questions: q.questions.length, quizAttempts: 0 },
    }));
    
    return NextResponse.json({
      success: true,
      quizzes,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, courseId, duration, passingScore, category, difficulty, questions } = body;

    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ error: 'Quiz title must be less than 200 characters' }, { status: 400 });
    }

    
    const quizDuration = duration || 15;
    if (typeof quizDuration !== 'number' || quizDuration < 1 || quizDuration > 120) {
      return NextResponse.json({ error: 'Duration must be between 1 and 120 minutes' }, { status: 400 });
    }

    
    const quizPassingScore = passingScore || 60;
    if (typeof quizPassingScore !== 'number' || quizPassingScore < 0 || quizPassingScore > 100) {
      return NextResponse.json({ error: 'Passing score must be between 0 and 100' }, { status: 400 });
    }

    
    const quizDifficulty = difficulty || 'beginner';
    if (!isValidCourseLevel(quizDifficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty. Must be: beginner, intermediate, or advanced' }, { status: 400 });
    }

    
    if (questions && Array.isArray(questions)) {
      if (questions.length === 0) {
        return NextResponse.json({ error: 'At least one question is required' }, { status: 400 });
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.correctAnswer) {
          return NextResponse.json({ 
            error: `Question ${i + 1} is missing required fields` 
          }, { status: 400 });
        }

        if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          return NextResponse.json({ 
            error: `Question ${i + 1} has invalid correct answer. Must be A, B, C, or D` 
          }, { status: 400 });
        }
      }
    }

    
    if (shouldUseStaticData()) {
      const mockQuiz = {
        id: `quiz-${Date.now()}`,
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        courseId: courseId || null,
        duration: quizDuration,
        passingScore: quizPassingScore,
        isPublished: true,
        category: category || 'General',
        difficulty: quizDifficulty,
        createdAt: new Date(),
        _count: { questions: questions?.length || 0, quizAttempts: 0 },
      };
      return NextResponse.json({ success: true, quiz: mockQuiz }, { status: 201 });
    }

    
    if (courseId) {
      const course = await db.course.findFirst({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    
    await runMigrations();

    
    const quiz = await db.quiz.create({
      data: {
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        courseId: courseId || null,
        duration: quizDuration,
        passingScore: quizPassingScore,
        isPublished: true,
        category: category || 'General',
        difficulty: quizDifficulty,
        createdBy: user.id,
        questions: questions ? {
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
        } : undefined,
      },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json({ success: true, quiz }, { status: 201 });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}
