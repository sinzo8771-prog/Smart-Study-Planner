import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Expected courses after cleanup
const EXPECTED_COURSES = [
  'Algebra Full Course',
  'Calculus 1 Full Course',
  'Physics Full Course',
  'Biology Full Course',
  'Psychology Full Course',
  'HTML & CSS Full Course',
  'JavaScript Full Course',
  'Python Full Course',
  'SQL Full Course',
  'Git & GitHub Full Course',
];

// Courses that should be removed
const REMOVED_COURSES = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
];

async function checkDatabase() {
  console.log('🔍 Database Health Check\n');
  console.log('=' .repeat(50));

  const issues: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. Check connection
    console.log('\n📡 Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');

    // 2. Check users
    console.log('\n👥 Checking users...');
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, name: true }
    });
    console.log(`   Total users: ${users.length}`);
    
    const adminUsers = users.filter(u => u.role === 'admin');
    console.log(`   Admin users: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      issues.push('❌ No admin users found');
    } else {
      console.log(`   ✅ Admin users exist: ${adminUsers.map(u => u.email).join(', ')}`);
    }

    // 3. Check courses
    console.log('\n📚 Checking courses...');
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, category: true, isPublished: true },
      orderBy: { title: 'asc' }
    });
    console.log(`   Total courses: ${courses.length}`);

    // Check for removed courses that still exist
    for (const removedTitle of REMOVED_COURSES) {
      const found = courses.find(c => c.title === removedTitle);
      if (found) {
        issues.push(`❌ Course "${removedTitle}" should be removed but still exists (ID: ${found.id})`);
      }
    }

    // Check if expected courses exist
    for (const expectedTitle of EXPECTED_COURSES) {
      const found = courses.find(c => c.title === expectedTitle);
      if (!found) {
        warnings.push(`⚠️ Expected course "${expectedTitle}" not found`);
      }
    }

    console.log('   Courses in database:');
    courses.forEach(c => {
      const status = c.isPublished ? '✅ Published' : '⏸️ Unpublished';
      console.log(`      - ${c.title} (${c.category}) ${status}`);
    });

    // 4. Check modules
    console.log('\n📖 Checking modules...');
    const modules = await prisma.module.findMany({
      select: { id: true, title: true, courseId: true }
    });
    console.log(`   Total modules: ${modules.length}`);

    // Check for orphaned modules (modules without valid course)
    for (const mod of modules) {
      const course = await prisma.course.findUnique({ where: { id: mod.courseId } });
      if (!course) {
        issues.push(`❌ Orphaned module: "${mod.title}" (courseId: ${mod.courseId} not found)`);
      }
    }

    // 5. Check quizzes
    console.log('\n📝 Checking quizzes...');
    const quizzes = await prisma.quiz.findMany({
      select: { id: true, title: true, courseId: true, category: true }
    });
    console.log(`   Total quizzes: ${quizzes.length}`);

    // Check for quizzes with invalid courseId
    for (const quiz of quizzes) {
      if (quiz.courseId) {
        const course = await prisma.course.findUnique({ where: { id: quiz.courseId } });
        if (!course) {
          issues.push(`❌ Quiz "${quiz.title}" references non-existent course (ID: ${quiz.courseId})`);
        }
      }
    }

    // 6. Check questions
    console.log('\n❓ Checking questions...');
    const questions = await prisma.question.findMany({
      select: { id: true, quizId: true, question: true }
    });
    console.log(`   Total questions: ${questions.length}`);

    // Check for orphaned questions
    for (const q of questions) {
      const quiz = await prisma.quiz.findUnique({ where: { id: q.quizId } });
      if (!quiz) {
        issues.push(`❌ Orphaned question (quizId: ${q.quizId} not found)`);
      }
    }

    // 7. Check quiz attempts
    console.log('\n🎯 Checking quiz attempts...');
    const quizAttempts = await prisma.quizAttempt.findMany({
      select: { id: true, userId: true, quizId: true }
    });
    console.log(`   Total quiz attempts: ${quizAttempts.length}`);

    // Check for orphaned quiz attempts
    for (const attempt of quizAttempts) {
      const user = await prisma.user.findUnique({ where: { id: attempt.userId } });
      if (!user) {
        issues.push(`❌ Quiz attempt references non-existent user (ID: ${attempt.userId})`);
      }
      const quiz = await prisma.quiz.findUnique({ where: { id: attempt.quizId } });
      if (!quiz) {
        issues.push(`❌ Quiz attempt references non-existent quiz (ID: ${attempt.quizId})`);
      }
    }

    // 8. Check course progress
    console.log('\n📊 Checking course progress...');
    const courseProgress = await prisma.courseProgress.findMany({
      select: { id: true, userId: true, courseId: true }
    });
    console.log(`   Total course progress records: ${courseProgress.length}`);

    // Check for orphaned progress
    for (const progress of courseProgress) {
      const course = await prisma.course.findUnique({ where: { id: progress.courseId } });
      if (!course) {
        issues.push(`❌ Course progress references non-existent course (ID: ${progress.courseId})`);
      }
    }

    // 9. Check module progress
    console.log('\n📈 Checking module progress...');
    const moduleProgress = await prisma.moduleProgress.findMany({
      select: { id: true, userId: true, moduleId: true }
    });
    console.log(`   Total module progress records: ${moduleProgress.length}`);

    // Check for orphaned module progress
    for (const progress of moduleProgress) {
      const courseModule = await prisma.module.findUnique({ where: { id: progress.moduleId } });
      if (!courseModule) {
        issues.push(`❌ Module progress references non-existent module (ID: ${progress.moduleId})`);
      }
    }

    // 10. Check accounts and sessions
    console.log('\n🔐 Checking authentication...');
    const accounts = await prisma.account.count();
    const sessions = await prisma.session.count();
    const verificationTokens = await prisma.verificationToken.count();
    console.log(`   Accounts: ${accounts}`);
    console.log(`   Sessions: ${sessions}`);
    console.log(`   Verification tokens: ${verificationTokens}`);

    // 11. Check tasks and subjects
    console.log('\n📋 Checking tasks and subjects...');
    const tasks = await prisma.task.count();
    const subjects = await prisma.subject.count();
    console.log(`   Subjects: ${subjects}`);
    console.log(`   Tasks: ${tasks}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 SUMMARY\n');

    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ Database is healthy! No issues found.');
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      warnings.forEach(w => console.log(`   ${w}`));
    }

    if (issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      issues.forEach(i => console.log(`   ${i}`));
      console.log('\n💡 Run the cleanup endpoint to fix these issues:');
      console.log('   POST /api/admin/cleanup-courses?secret=cleanup-courses-2024');
    }

    console.log('\n' + '='.repeat(50));

    return { issues, warnings, stats: { users, courses, quizzes, questions } };

  } catch (error) {
    console.error('❌ Database check failed:', error);
    throw error;
  }
}

checkDatabase()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
