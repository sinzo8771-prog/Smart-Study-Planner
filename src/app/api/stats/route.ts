import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Get statistics based on user role
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Admin statistics - system overview
    if (user.role === 'admin') {
      // Get total counts
      const [
        totalUsers,
        totalStudents,
        totalAdmins,
        totalCourses,
        totalQuizzes,
        totalQuizAttempts,
        publishedQuizzes,
        totalSubjects,
        totalTasks,
      ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: 'student' } }),
        db.user.count({ where: { role: 'admin' } }),
        db.course.count(),
        db.quiz.count(),
        db.quizAttempt.count(),
        db.quiz.count({ where: { isPublished: true } }),
        db.subject.count(),
        db.task.count(),
      ]);

      // Get recent activity (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentUsers = await db.user.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      });

      const recentQuizAttempts = await db.quizAttempt.count({
        where: {
          completedAt: { gte: sevenDaysAgo },
        },
      });

      // Get average quiz score
      const avgScore = await db.quizAttempt.aggregate({
        _avg: { score: true },
      });

      // Get task completion stats
      const taskStats = await db.task.groupBy({
        by: ['status'],
        _count: true,
      });

      const completedTasks = taskStats.find(s => s.status === 'completed')?._count || 0;
      const pendingTasks = taskStats.find(s => s.status === 'pending')?._count || 0;
      const inProgressTasks = taskStats.find(s => s.status === 'in_progress')?._count || 0;

      // Get course progress stats
      const courseProgressStats = await db.courseProgress.aggregate({
        _avg: { progress: true },
      });

      return NextResponse.json({
        success: true,
        role: 'admin',
        stats: {
          users: {
            total: totalUsers,
            students: totalStudents,
            admins: totalAdmins,
            recentNewUsers: recentUsers,
          },
          courses: {
            total: totalCourses,
            averageProgress: courseProgressStats._avg.progress || 0,
          },
          quizzes: {
            total: totalQuizzes,
            published: publishedQuizzes,
            totalAttempts: totalQuizAttempts,
            recentAttempts: recentQuizAttempts,
            averageScore: avgScore._avg.score || 0,
          },
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
          },
          subjects: {
            total: totalSubjects,
          },
        },
      });
    }

    // Student statistics - personal dashboard
    // Get subjects count
    const subjectsCount = await db.subject.count({
      where: { userId: user.id },
    });

    // Get task stats
    const tasks = await db.task.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    });

    const completedTasks = tasks.find(t => t.status === 'completed')?._count || 0;
    const pendingTasks = tasks.find(t => t.status === 'pending')?._count || 0;
    const inProgressTasks = tasks.find(t => t.status === 'in_progress')?._count || 0;
    const totalTasks = completedTasks + pendingTasks + inProgressTasks;

    // Get quiz attempts
    const quizAttempts = await db.quizAttempt.findMany({
      where: { userId: user.id },
      select: {
        score: true,
        quizId: true,
        completedAt: true,
        quiz: {
          select: {
            title: true,
            passingScore: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalQuizAttempts = quizAttempts.length;
    const passedQuizzes = quizAttempts.filter(
      a => a.score >= a.quiz.passingScore
    ).length;
    const averageScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
      : 0;
    const bestScore = quizAttempts.length > 0
      ? Math.max(...quizAttempts.map(a => a.score))
      : 0;

    // Get recent quiz attempts (last 5)
    const recentAttempts = quizAttempts.slice(0, 5).map(a => ({
      quizTitle: a.quiz.title,
      score: a.score,
      passed: a.score >= a.quiz.passingScore,
      completedAt: a.completedAt,
    }));

    // Get course progress
    const courseProgress = await db.courseProgress.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const totalCoursesEnrolled = courseProgress.length;
    const completedCourses = courseProgress.filter(c => c.progress === 100).length;
    const averageProgress = courseProgress.length > 0
      ? courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length
      : 0;

    // Get upcoming tasks (due in next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTasks = await db.task.findMany({
      where: {
        userId: user.id,
        status: { not: 'completed' },
        dueDate: {
          gte: now,
          lte: nextWeek,
        },
      },
      include: {
        subject: {
          select: { name: true, color: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      role: 'student',
      stats: {
        subjects: {
          total: subjectsCount,
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        },
        quizzes: {
          totalAttempts: totalQuizAttempts,
          passed: passedQuizzes,
          averageScore,
          bestScore,
          passRate: totalQuizAttempts > 0 ? (passedQuizzes / totalQuizAttempts) * 100 : 0,
          recentAttempts,
        },
        courses: {
          enrolled: totalCoursesEnrolled,
          completed: completedCourses,
          averageProgress,
        },
        upcomingTasks: upcomingTasks.map(t => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          priority: t.priority,
          subject: t.subject,
        })),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
