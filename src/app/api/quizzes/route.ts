import { NextRequest, NextResponse } from 'next/server';
import { getQuizzes, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db, runMigrations } from '@/lib/db';
import { sanitizeString, isValidCourseLevel } from '@/lib/validation';

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

// Static quizzes for demo mode (Vercel without database)
const staticQuizzesList = [
  {
    id: 'quiz-1',
    title: 'Web Development Basics Quiz',
    description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals',
    courseId: 'course-1',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Programming',
    difficulty: 'beginner',
    createdAt: new Date(),
    _count: { questions: 5, quizAttempts: 10 },
  },
  {
    id: 'quiz-2',
    title: 'Algebra Fundamentals Quiz',
    description: 'Test your algebra skills',
    courseId: 'course-2',
    duration: 20,
    passingScore: 70,
    isPublished: true,
    category: 'Mathematics',
    difficulty: 'beginner',
    createdAt: new Date(),
    _count: { questions: 5, quizAttempts: 8 },
  },
  {
    id: 'quiz-3',
    title: 'Physics Mechanics Quiz',
    description: 'Test your understanding of motion, forces, and energy',
    courseId: 'course-5',
    duration: 20,
    passingScore: 60,
    isPublished: true,
    category: 'Science',
    difficulty: 'intermediate',
    createdAt: new Date(),
    _count: { questions: 5, quizAttempts: 6 },
  },
  {
    id: 'quiz-4',
    title: 'Python Data Science Quiz',
    description: 'Test your Python and data science knowledge',
    courseId: 'course-3',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Data Science',
    difficulty: 'intermediate',
    createdAt: new Date(),
    _count: { questions: 5, quizAttempts: 12 },
  },
];

// GET: List all published quizzes
export async function GET() {
  try {
    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      return NextResponse.json({
        success: true,
        quizzes: staticQuizzesList,
      });
    }

    const quizzes = await getQuizzes();

    return NextResponse.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    // Fallback to static data on error
    return NextResponse.json({
      success: true,
      quizzes: staticQuizzesList,
    });
  }
}

// POST: Create a new quiz (admin only)
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

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ error: 'Quiz title must be less than 200 characters' }, { status: 400 });
    }

    // Validate duration (1-120 minutes)
    const quizDuration = duration || 15;
    if (typeof quizDuration !== 'number' || quizDuration < 1 || quizDuration > 120) {
      return NextResponse.json({ error: 'Duration must be between 1 and 120 minutes' }, { status: 400 });
    }

    // Validate passing score (0-100)
    const quizPassingScore = passingScore || 60;
    if (typeof quizPassingScore !== 'number' || quizPassingScore < 0 || quizPassingScore > 100) {
      return NextResponse.json({ error: 'Passing score must be between 0 and 100' }, { status: 400 });
    }

    // Validate difficulty
    const quizDifficulty = difficulty || 'beginner';
    if (!isValidCourseLevel(quizDifficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty. Must be: beginner, intermediate, or advanced' }, { status: 400 });
    }

    // Validate questions if provided
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

    // Use static data for Vercel deployment without database
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

    // Verify course exists if courseId provided
    if (courseId) {
      const course = await db.course.findFirst({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }
    }

    // Run migrations before creating quiz
    await runMigrations();

    // Create quiz in database
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
