#!/usr/bin/env bun
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Courses to remove
const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
];

async function cleanupCourses() {
  console.log('🧹 Running automatic course cleanup...\n');

  try {
    // Try to connect to database
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    console.log('⚠️  Database not available, skipping cleanup');
    process.exit(0);
  }

  let removedCount = 0;

  for (const courseTitle of COURSES_TO_REMOVE) {
    const course = await prisma.course.findFirst({
      where: { title: courseTitle },
      include: { modules: true }
    });

    if (course) {
      console.log(`Removing: ${courseTitle}`);
      
      // Delete module progress
      for (const courseModule of course.modules) {
        await prisma.moduleProgress.deleteMany({
          where: { moduleId: courseModule.id }
        }).catch(() => {});
      }
      
      // Delete course progress
      await prisma.courseProgress.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete modules
      await prisma.module.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete related quizzes
      const quizzes = await prisma.quiz.findMany({
        where: { courseId: course.id }
      });
      
      for (const quiz of quizzes) {
        await prisma.question.deleteMany({
          where: { quizId: quiz.id }
        }).catch(() => {});
        await prisma.quizAttempt.deleteMany({
          where: { quizId: quiz.id }
        }).catch(() => {});
      }
      
      await prisma.quiz.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete the course
      await prisma.course.delete({
        where: { id: course.id }
      });
      
      removedCount++;
      console.log(`   ✅ Removed: ${courseTitle}`);
    }
  }

  if (removedCount > 0) {
    console.log(`\n✅ Cleanup complete! Removed ${removedCount} courses.`);
  } else {
    console.log('\n✅ No courses to remove. Database is clean.');
  }

  await prisma.$disconnect();
}

cleanupCourses().catch((e) => {
  console.error('Cleanup error (non-fatal):', e.message);
  process.exit(0); // Exit 0 to not fail the build
});
