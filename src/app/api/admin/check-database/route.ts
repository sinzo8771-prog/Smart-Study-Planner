import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Courses to remove
const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const autoFix = searchParams.get('fix') === 'true';
    
    const issues: string[] = [];
    const warnings: string[] = [];
    const stats: Record<string, number> = {};

    // 1. Check users
    const users = await db.user.count();
    stats.users = users;

    // 2. Check courses
    const courses = await db.course.findMany({
      select: { id: true, title: true, category: true, isPublished: true },
      orderBy: { title: 'asc' }
    });
    stats.courses = courses.length;

    // Check for removed courses that still exist
    const coursesToRemove: typeof courses = [];
    for (const removedTitle of COURSES_TO_REMOVE) {
      const found = courses.find(c => c.title === removedTitle);
      if (found) {
        issues.push(`Course "${removedTitle}" should be removed`);
        coursesToRemove.push(found);
      }
    }

    // 3. Check modules
    const modules = await db.module.count();
    stats.modules = modules;

    // 4. Check quizzes
    const quizzes = await db.quiz.findMany({
      select: { id: true, title: true, courseId: true }
    });
    stats.quizzes = quizzes.length;

    // Check for quizzes linked to removed courses
    const orphanedQuizzes: string[] = [];
    for (const quiz of quizzes) {
      if (quiz.courseId) {
        const course = await db.course.findUnique({ where: { id: quiz.courseId } });
        if (!course) {
          issues.push(`Quiz "${quiz.title}" references non-existent course`);
          orphanedQuizzes.push(quiz.id);
        }
      }
    }

    // 5. Check questions
    const questions = await db.question.count();
    stats.questions = questions;

    // 6. Check progress records
    const courseProgress = await db.courseProgress.count();
    const moduleProgress = await db.moduleProgress.count();
    stats.courseProgress = courseProgress;
    stats.moduleProgress = moduleProgress;

    // 7. Check quiz attempts
    const quizAttempts = await db.quizAttempt.count();
    stats.quizAttempts = quizAttempts;

    // Auto-fix if requested
    const fixes: string[] = [];
    if (autoFix && coursesToRemove.length > 0) {
      for (const course of coursesToRemove) {
        // Delete module progress
        const courseModules = await db.module.findMany({
          where: { courseId: course.id },
          select: { id: true }
        });
        
        for (const mod of courseModules) {
          await db.moduleProgress.deleteMany({
            where: { moduleId: mod.id }
          });
        }
        
        // Delete course progress
        await db.courseProgress.deleteMany({
          where: { courseId: course.id }
        });
        
        // Delete modules
        await db.module.deleteMany({
          where: { courseId: course.id }
        });
        
        // Delete related quizzes
        const relatedQuizzes = await db.quiz.findMany({
          where: { courseId: course.id }
        });
        
        for (const quiz of relatedQuizzes) {
          await db.question.deleteMany({
            where: { quizId: quiz.id }
          });
          await db.quizAttempt.deleteMany({
            where: { quizId: quiz.id }
          });
          await db.quiz.delete({
            where: { id: quiz.id }
          });
        }
        
        // Delete the course
        await db.course.delete({
          where: { id: course.id }
        });
        
        fixes.push(`Removed: ${course.title}`);
      }
    }

    // Clean up orphaned quizzes
    if (autoFix && orphanedQuizzes.length > 0) {
      for (const quizId of orphanedQuizzes) {
        await db.question.deleteMany({
          where: { quizId }
        });
        await db.quizAttempt.deleteMany({
          where: { quizId }
        });
        await db.quiz.delete({
          where: { id: quizId }
        });
      }
      fixes.push(`Removed ${orphanedQuizzes.length} orphaned quizzes`);
    }

    return NextResponse.json({
      status: issues.length === 0 ? 'healthy' : 'issues_found',
      stats,
      issues: issues.length > 0 ? issues : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      courses: courses.map(c => ({ title: c.title, category: c.category })),
      fixes: fixes.length > 0 ? fixes : undefined,
      message: autoFix && fixes.length > 0 
        ? `Fixed ${fixes.length} issues` 
        : issues.length === 0 
          ? 'Database is healthy' 
          : 'Issues found. Add ?fix=true to auto-fix'
    });
  } catch (error) {
    console.error('Database check error:', error);
    return NextResponse.json({ 
      error: 'Database check failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
