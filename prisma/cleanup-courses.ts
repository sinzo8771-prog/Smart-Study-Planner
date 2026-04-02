import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Courses to remove (the ones that were deleted from seed)
const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
];

async function main() {
  console.log('🧹 Cleaning up removed courses from database...\n');

  for (const courseTitle of COURSES_TO_REMOVE) {
    // Find the course
    const course = await prisma.course.findFirst({
      where: { title: courseTitle },
      include: { modules: true }
    });

    if (course) {
      console.log(`Found: ${courseTitle} (ID: ${course.id})`);
      
      // Delete module progress first
      for (const courseModule of course.modules) {
        await prisma.moduleProgress.deleteMany({
          where: { moduleId: courseModule.id }
        });
      }
      
      // Delete course progress
      await prisma.courseProgress.deleteMany({
        where: { courseId: course.id }
      });
      
      // Delete modules
      await prisma.module.deleteMany({
        where: { courseId: course.id }
      });
      
      // Delete related quizzes
      const quizzes = await prisma.quiz.findMany({
        where: { courseId: course.id }
      });
      
      for (const quiz of quizzes) {
        await prisma.question.deleteMany({
          where: { quizId: quiz.id }
        });
        await prisma.quizAttempt.deleteMany({
          where: { quizId: quiz.id }
        });
      }
      
      await prisma.quiz.deleteMany({
        where: { courseId: course.id }
      });
      
      // Delete the course
      await prisma.course.delete({
        where: { id: course.id }
      });
      
      console.log(`✅ Removed: ${courseTitle}\n`);
    } else {
      console.log(`⏭️ Not found (already removed): ${courseTitle}\n`);
    }
  }

  // Show remaining courses
  const remainingCourses = await prisma.course.findMany({
    select: { title: true, category: true }
  });
  
  console.log('📚 Remaining courses in database:');
  remainingCourses.forEach(c => console.log(`   - ${c.title} (${c.category})`));
  console.log(`\n✅ Total: ${remainingCourses.length} courses`);
}

main()
  .catch((e) => {
    console.error('❌ Cleanup error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
