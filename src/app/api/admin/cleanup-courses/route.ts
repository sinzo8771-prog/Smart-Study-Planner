import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
];

export async function POST(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret !== process.env.CLEANUP_SECRET && secret !== 'cleanup-courses-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: string[] = [];

    for (const courseTitle of COURSES_TO_REMOVE) {
      
      const course = await db.course.findFirst({
        where: { title: courseTitle },
        include: { modules: true }
      });

      if (course) {
        
        for (const courseModule of course.modules) {
          await db.moduleProgress.deleteMany({
            where: { moduleId: courseModule.id }
          });
        }
        
        
        await db.courseProgress.deleteMany({
          where: { courseId: course.id }
        });
        
        
        await db.module.deleteMany({
          where: { courseId: course.id }
        });
        
        
        const quizzes = await db.quiz.findMany({
          where: { courseId: course.id }
        });
        
        for (const quiz of quizzes) {
          await db.question.deleteMany({
            where: { quizId: quiz.id }
          });
          await db.quizAttempt.deleteMany({
            where: { quizId: quiz.id }
          });
        }
        
        await db.quiz.deleteMany({
          where: { courseId: course.id }
        });
        
        
        await db.course.delete({
          where: { id: course.id }
        });
        
        results.push(`Removed: ${courseTitle}`);
      } else {
        results.push(`Not found: ${courseTitle}`);
      }
    }

    
    const remainingCourses = await db.course.findMany({
      select: { title: true, category: true }
    });

    return NextResponse.json({
      success: true,
      results,
      remainingCourses: remainingCourses.map(c => c.title),
      totalRemaining: remainingCourses.length
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Course cleanup endpoint',
    usage: 'POST /api/admin/cleanup-courses?secret=cleanup-courses-2024',
    coursesToRemove: COURSES_TO_REMOVE
  });
}
