import { db } from '@/lib/db';

// Courses to remove
const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
  'Physics Full Course',
  'Algebra Full Course',
];

let cleanupDone = false;

export async function runCleanupIfNeeded(): Promise<void> {
  // Only run once per server instance
  if (cleanupDone) return;
  
  try {
    // Quick check if cleanup is needed
    const coursesCount = await db.course.count({
      where: {
        title: { in: COURSES_TO_REMOVE }
      }
    });
    
    if (coursesCount === 0) {
      cleanupDone = true;
      return;
    }
    
    console.log('🧹 Running course cleanup...');
    
    for (const courseTitle of COURSES_TO_REMOVE) {
      const course = await db.course.findFirst({
        where: { title: courseTitle },
        include: { modules: true }
      });
      
      if (course) {
        console.log(`Removing: ${courseTitle}`);
        
        // Delete module progress
        for (const courseModule of course.modules) {
          await db.moduleProgress.deleteMany({
            where: { moduleId: courseModule.id }
          }).catch(() => {});
        }
        
        // Delete course progress
        await db.courseProgress.deleteMany({
          where: { courseId: course.id }
        }).catch(() => {});
        
        // Delete modules
        await db.module.deleteMany({
          where: { courseId: course.id }
        }).catch(() => {});
        
        // Delete related quizzes
        const quizzes = await db.quiz.findMany({
          where: { courseId: course.id }
        });
        
        for (const quiz of quizzes) {
          await db.question.deleteMany({
            where: { quizId: quiz.id }
          }).catch(() => {});
          await db.quizAttempt.deleteMany({
            where: { quizId: quiz.id }
          }).catch(() => {});
        }
        
        await db.quiz.deleteMany({
          where: { courseId: course.id }
        }).catch(() => {});
        
        // Delete the course
        await db.course.delete({
          where: { id: course.id }
        }).catch(() => {});
        
        console.log(`✅ Removed: ${courseTitle}`);
      }
    }
    
    console.log('✅ Cleanup complete');
    cleanupDone = true;
  } catch (error) {
    console.error('Cleanup error (non-fatal):', error);
    cleanupDone = true; // Don't retry on error
  }
}
