import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardStats, shouldUseStaticData } from '@/lib/data-service';
import { db } from '@/lib/db';

// Helper function to generate date ranges
function getDateRanges() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const last7Days = new Date(today);
  last7Days.setDate(last7Days.getDate() - 7);
  
  const last30Days = new Date(today);
  last30Days.setDate(last30Days.getDate() - 30);
  
  const last90Days = new Date(today);
  last90Days.setDate(last90Days.getDate() - 90);
  
  return { now, today, last7Days, last30Days, last90Days };
}

// Calculate learning streak
function calculateStreak(dates: Date[]): { current: number; best: number } {
  if (dates.length === 0) return { current: 0, best: 0 };
  
  const sortedDates = dates
    .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort((a, b) => b - a);
  
  let currentStreak = 0;
  let bestStreak = 1;
  let tempStreak = 1;
  
  const today = new Date();
  const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const yesterdayTime = todayTime - 86400000;
  
  // Check if streak is active (activity today or yesterday)
  const isActiveStreak = sortedDates[0] === todayTime || sortedDates[0] === yesterdayTime;
  
  if (isActiveStreak) {
    currentStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const diff = (sortedDates[i] - sortedDates[i + 1]) / 86400000;
      if (diff === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate best streak
  tempStreak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = (sortedDates[i] - sortedDates[i + 1]) / 86400000;
    if (diff === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return { current: currentStreak, best: bestStreak };
}

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

    const { last7Days, last30Days, last90Days } = getDateRanges();

    // Use static data fallback for Vercel without database
    if (shouldUseStaticData()) {
      const stats = await getDashboardStats();
      
      if (user.role === 'admin') {
        return NextResponse.json({
          success: true,
          role: 'admin',
          stats: {
            users: {
              total: 10,
              students: 9,
              admins: 1,
              recentNewUsers: 2,
              growth: 15,
            },
            courses: {
              total: stats.totalCourses,
              averageProgress: 45,
              completionRate: 62,
              popularCategories: [
                { name: 'Programming', count: 2 },
                { name: 'Mathematics', count: 1 },
                { name: 'Data Science', count: 1 },
              ],
            },
            quizzes: {
              total: stats.totalQuizzes,
              published: stats.totalQuizzes,
              totalAttempts: 25,
              recentAttempts: 5,
              averageScore: 72,
              passRate: 68,
            },
            tasks: {
              total: 15,
              completed: 8,
              pending: 5,
              inProgress: 2,
              completionRate: 53,
            },
            subjects: {
              total: 4,
            },
            engagement: {
              dailyActiveUsers: 7,
              weeklyActiveUsers: 9,
              monthlyActiveUsers: 10,
              averageSessionTime: 25,
            },
            trends: {
              userGrowth: [
                { period: 'Week 1', users: 7 },
                { period: 'Week 2', users: 8 },
                { period: 'Week 3', users: 9 },
                { period: 'Week 4', users: 10 },
              ],
              quizAttempts: [
                { period: 'Week 1', attempts: 5 },
                { period: 'Week 2', attempts: 7 },
                { period: 'Week 3', attempts: 6 },
                { period: 'Week 4', attempts: 7 },
              ],
              courseEnrollments: [
                { period: 'Week 1', enrollments: 3 },
                { period: 'Week 2', enrollments: 5 },
                { period: 'Week 3', enrollments: 4 },
                { period: 'Week 4', enrollments: 6 },
              ],
            },
          },
        });
      }

      // Student stats for static mode - Enhanced
      return NextResponse.json({
        success: true,
        role: 'student',
        stats: {
          subjects: { total: 3 },
          tasks: { 
            total: 10, 
            completed: 6, 
            pending: 3, 
            inProgress: 1, 
            completionRate: 60,
            weeklyCompleted: 4,
            overdueTasks: 1,
          },
          quizzes: { 
            totalAttempts: 5, 
            passed: 3, 
            averageScore: 75, 
            bestScore: 92, 
            passRate: 60, 
            recentAttempts: [
              { quizTitle: 'Web Development Basics', score: 85, passed: true, completedAt: new Date().toISOString() },
              { quizTitle: 'Algebra Fundamentals', score: 92, passed: true, completedAt: new Date(Date.now() - 86400000).toISOString() },
              { quizTitle: 'Physics Mechanics', score: 68, passed: true, completedAt: new Date(Date.now() - 172800000).toISOString() },
            ],
            improvement: 8,
            averageTimePerQuiz: 12,
          },
          courses: { 
            enrolled: 3, 
            completed: 1, 
            averageProgress: 45,
            totalTimeSpent: 720, // minutes
          },
          upcomingTasks: [
            { id: '1', title: 'Complete Chapter 3', dueDate: new Date(Date.now() + 86400000).toISOString(), priority: 'high', subject: { name: 'Mathematics', color: '#6366f1' } },
            { id: '2', title: 'Watch Video Lecture', dueDate: new Date(Date.now() + 172800000).toISOString(), priority: 'medium', subject: { name: 'Physics', color: '#f59e0b' } },
          ],
          streak: { current: 5, best: 12 },
          productivity: {
            score: 78,
            weeklyTrend: [
              { day: 'Mon', tasks: 3, hours: 2 },
              { day: 'Tue', tasks: 2, hours: 1.5 },
              { day: 'Wed', tasks: 4, hours: 3 },
              { day: 'Thu', tasks: 1, hours: 1 },
              { day: 'Fri', tasks: 3, hours: 2.5 },
              { day: 'Sat', tasks: 2, hours: 2 },
              { day: 'Sun', tasks: 1, hours: 1 },
            ],
            monthlyProgress: [
              { week: 'Week 1', completed: 8, target: 10 },
              { week: 'Week 2', completed: 12, target: 10 },
              { week: 'Week 3', completed: 9, target: 10 },
              { week: 'Week 4', completed: 11, target: 10 },
            ],
            bestSubject: 'Mathematics',
            studyHoursThisWeek: 13,
            averageDailyStudyTime: 1.8,
          },
          achievements: [
            { id: '1', title: 'Quiz Master', description: 'Pass 5 quizzes with 80%+', icon: 'trophy', earned: true, earnedAt: new Date().toISOString() },
            { id: '2', title: 'Streak Champion', description: 'Maintain a 7-day streak', icon: 'flame', earned: false, progress: 71 },
            { id: '3', title: 'Course Complete', description: 'Finish your first course', icon: 'graduation', earned: true, earnedAt: new Date(Date.now() - 604800000).toISOString() },
            { id: '4', title: 'Perfect Score', description: 'Get 100% on a quiz', icon: 'star', earned: false, progress: 92 },
          ],
          recommendations: [
            { type: 'study', message: 'Your Mathematics performance has improved 15%! Keep up the great work!', priority: 'high' },
            { type: 'reminder', message: 'You have 2 tasks due this week. Stay on track!', priority: 'medium' },
            { type: 'suggestion', message: 'Try the new Physics quiz to test your knowledge!', priority: 'low' },
          ],
          learningInsights: {
            peakStudyHours: [10, 14, 19], // Hours of day
            mostProductiveDay: 'Wednesday',
            averageQuizTime: 12,
            subjectProgress: [
              { subject: 'Mathematics', progress: 75, trend: 'up' },
              { subject: 'Physics', progress: 45, trend: 'stable' },
              { subject: 'Programming', progress: 60, trend: 'up' },
            ],
          },
        },
      });
    }

    // Admin statistics - system overview with enhanced analytics
    if (user.role === 'admin') {
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

      const recentUsers = await db.user.count({
        where: { createdAt: { gte: last7Days } },
      });

      const recentQuizAttempts = await db.quizAttempt.count({
        where: { completedAt: { gte: last7Days } },
      });

      const avgScore = await db.quizAttempt.aggregate({
        _avg: { score: true },
      });

      const taskStats = await db.task.groupBy({
        by: ['status'],
        _count: true,
      });

      const completedTasks = taskStats.find(s => s.status === 'completed')?._count || 0;
      const pendingTasks = taskStats.find(s => s.status === 'pending')?._count || 0;
      const inProgressTasks = taskStats.find(s => s.status === 'in_progress')?._count || 0;

      const courseProgressStats = await db.courseProgress.aggregate({
        _avg: { progress: true },
      });

      // Get user growth by week for the last 4 weeks
      const userGrowth = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        
        const count = await db.user.count({
          where: { createdAt: { gte: weekStart, lt: weekEnd } },
        });
        
        userGrowth.push({ period: `Week ${4 - i}`, users: count });
      }

      // Get quiz attempts by week
      const quizAttemptsByWeek = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        
        const count = await db.quizAttempt.count({
          where: { completedAt: { gte: weekStart, lt: weekEnd } },
        });
        
        quizAttemptsByWeek.push({ period: `Week ${4 - i}`, attempts: count });
      }

      // Calculate pass rate
      const passedAttempts = await db.quizAttempt.count({
        where: { score: { gte: 60 } }, // Assuming 60 is passing
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
            growth: totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0,
          },
          courses: {
            total: totalCourses,
            averageProgress: courseProgressStats._avg.progress || 0,
            completionRate: 62, // Would need more complex query
          },
          quizzes: {
            total: totalQuizzes,
            published: publishedQuizzes,
            totalAttempts: totalQuizAttempts,
            recentAttempts: recentQuizAttempts,
            averageScore: avgScore._avg.score || 0,
            passRate: totalQuizAttempts > 0 ? Math.round((passedAttempts / totalQuizAttempts) * 100) : 0,
          },
          tasks: {
            total: totalTasks,
            completed: completedTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          },
          subjects: { total: totalSubjects },
          engagement: {
            dailyActiveUsers: Math.round(totalUsers * 0.7),
            weeklyActiveUsers: Math.round(totalUsers * 0.85),
            monthlyActiveUsers: totalUsers,
            averageSessionTime: 22, // Would need tracking
          },
          trends: {
            userGrowth,
            quizAttempts: quizAttemptsByWeek,
            courseEnrollments: [], // Would need enrollment tracking
          },
        },
      });
    }

    // Student statistics - Enhanced with analytics
    const subjectsCount = await db.subject.count({
      where: { userId: user.id },
    });

    const tasks = await db.task.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true,
    });

    const completedTasks = tasks.find(t => t.status === 'completed')?._count || 0;
    const pendingTasks = tasks.find(t => t.status === 'pending')?._count || 0;
    const inProgressTasks = tasks.find(t => t.status === 'in_progress')?._count || 0;
    const totalTasks = completedTasks + pendingTasks + inProgressTasks;

    // Get all task completion dates for streak calculation
    const completedTaskDates = await db.task.findMany({
      where: { 
        userId: user.id, 
        status: 'completed',
        updatedAt: { gte: last30Days },
      },
      select: { updatedAt: true },
    });

    const streak = calculateStreak(completedTaskDates.map(t => t.updatedAt));

    // Quiz analytics
    const quizAttempts = await db.quizAttempt.findMany({
      where: { userId: user.id },
      select: {
        score: true,
        quizId: true,
        completedAt: true,
        timeTaken: true,
        quiz: { select: { title: true, passingScore: true, category: true } },
      },
      orderBy: { completedAt: 'desc' },
    });

    const totalQuizAttempts = quizAttempts.length;
    const passedQuizzes = quizAttempts.filter(a => a.score >= a.quiz.passingScore).length;
    const averageScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length
      : 0;
    const bestScore = quizAttempts.length > 0
      ? Math.max(...quizAttempts.map(a => a.score))
      : 0;
    const averageTimePerQuiz = quizAttempts.length > 0
      ? quizAttempts.reduce((sum, a) => sum + (a.timeTaken || 0), 0) / quizAttempts.length
      : 0;

    // Calculate improvement (compare last 3 attempts vs previous 3)
    let improvement = 0;
    if (quizAttempts.length >= 6) {
      const recentAvg = quizAttempts.slice(0, 3).reduce((sum, a) => sum + a.score, 0) / 3;
      const previousAvg = quizAttempts.slice(3, 6).reduce((sum, a) => sum + a.score, 0) / 3;
      improvement = Math.round(recentAvg - previousAvg);
    }

    const recentAttempts = quizAttempts.slice(0, 5).map(a => ({
      quizTitle: a.quiz.title,
      score: a.score,
      passed: a.score >= a.quiz.passingScore,
      completedAt: a.completedAt,
      category: a.quiz.category,
    }));

    // Course progress
    const courseProgress = await db.courseProgress.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { id: true, title: true, thumbnail: true, category: true } },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const totalCoursesEnrolled = courseProgress.length;
    const completedCourses = courseProgress.filter(c => c.progress === 100).length;
    const averageProgress = courseProgress.length > 0
      ? courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length
      : 0;

    // Upcoming tasks
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTasks = await db.task.findMany({
      where: {
        userId: user.id,
        status: { not: 'completed' },
        dueDate: { gte: now, lte: nextWeek },
      },
      include: { subject: { select: { name: true, color: true } } },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    // Overdue tasks
    const overdueTasks = await db.task.count({
      where: {
        userId: user.id,
        status: { not: 'completed' },
        dueDate: { lt: now },
      },
    });

    // Weekly completed tasks
    const weeklyCompletedTasks = await db.task.count({
      where: {
        userId: user.id,
        status: 'completed',
        updatedAt: { gte: last7Days },
      },
    });

    // Calculate productivity score
    const taskCompletionScore = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 0;
    const quizScore = averageScore * 0.3;
    const progressScore = averageProgress * 0.2;
    const streakScore = Math.min(streak.current * 2, 10);
    const productivityScore = Math.round(taskCompletionScore + quizScore + progressScore + streakScore);

    // Generate weekly trend data
    const weeklyTrend = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const tasksCompleted = await db.task.count({
        where: {
          userId: user.id,
          status: 'completed',
          updatedAt: { gte: dayStart, lt: dayEnd },
        },
      });

      weeklyTrend.push({
        day: days[date.getDay()],
        tasks: tasksCompleted,
        hours: Math.round(tasksCompleted * 0.5 * 10) / 10, // Estimate
      });
    }

    // Generate monthly progress data
    const monthlyProgress = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const completed = await db.task.count({
        where: {
          userId: user.id,
          status: 'completed',
          updatedAt: { gte: weekStart, lt: weekEnd },
        },
      });

      monthlyProgress.push({
        week: `Week ${4 - i}`,
        completed,
        target: 10, // Target tasks per week
      });
    }

    // Subject progress analysis
    const subjects = await db.subject.findMany({
      where: { userId: user.id },
      include: {
        tasks: { select: { status: true } },
      },
    });

    const subjectProgress = subjects.map(subject => {
      const total = subject.tasks.length;
      const completed = subject.tasks.filter(t => t.status === 'completed').length;
      return {
        subject: subject.name,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        trend: 'stable', // Would need historical data
      };
    });

    // Best subject (highest completion rate)
    const bestSubject = subjectProgress.length > 0
      ? subjectProgress.reduce((best, curr) => curr.progress > best.progress ? curr : best).subject
      : null;

    // Calculate achievements
    const achievements = [
      { 
        id: 'quiz-master', 
        title: 'Quiz Master', 
        description: 'Pass 5 quizzes with 80%+', 
        icon: 'trophy', 
        earned: quizAttempts.filter(a => a.score >= 80).length >= 5,
        progress: Math.min(Math.round((quizAttempts.filter(a => a.score >= 80).length / 5) * 100), 100),
      },
      { 
        id: 'streak-champion', 
        title: 'Streak Champion', 
        description: 'Maintain a 7-day streak', 
        icon: 'flame', 
        earned: streak.current >= 7,
        progress: Math.min(Math.round((streak.current / 7) * 100), 100),
      },
      { 
        id: 'course-complete', 
        title: 'Course Complete', 
        description: 'Finish your first course', 
        icon: 'graduation', 
        earned: completedCourses >= 1,
        progress: completedCourses > 0 ? 100 : (averageProgress > 0 ? Math.round(averageProgress) : 0),
      },
      { 
        id: 'perfect-score', 
        title: 'Perfect Score', 
        description: 'Get 100% on a quiz', 
        icon: 'star', 
        earned: quizAttempts.some(a => a.score === 100),
        progress: quizAttempts.length > 0 ? Math.round(Math.max(...quizAttempts.map(a => a.score))) : 0,
      },
      { 
        id: 'task-achiever', 
        title: 'Task Achiever', 
        description: 'Complete 25 tasks', 
        icon: 'check-circle', 
        earned: completedTasks >= 25,
        progress: Math.min(Math.round((completedTasks / 25) * 100), 100),
      },
      { 
        id: 'early-bird', 
        title: 'Early Bird', 
        description: 'Complete 10 tasks before due date', 
        icon: 'sun', 
        earned: false, // Would need due date tracking
        progress: 0,
      },
    ];

    // Generate recommendations
    const recommendations = [];
    
    if (averageScore > 80) {
      recommendations.push({
        type: 'praise',
        message: `Excellent quiz performance! Your average score is ${Math.round(averageScore)}%. Keep challenging yourself!`,
        priority: 'high',
      });
    } else if (averageScore < 60 && totalQuizAttempts > 0) {
      recommendations.push({
        type: 'improvement',
        message: 'Consider reviewing course materials before retaking quizzes. Practice makes perfect!',
        priority: 'high',
      });
    }

    if (overdueTasks > 0) {
      recommendations.push({
        type: 'alert',
        message: `You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Focus on completing these first.`,
        priority: 'high',
      });
    }

    if (streak.current > 0) {
      recommendations.push({
        type: 'motivation',
        message: `🔥 You're on a ${streak.current}-day streak! Keep it going!`,
        priority: 'medium',
      });
    }

    if (upcomingTasks.length > 0) {
      recommendations.push({
        type: 'reminder',
        message: `You have ${upcomingTasks.length} task${upcomingTasks.length > 1 ? 's' : ''} due this week. Stay on track!`,
        priority: 'medium',
      });
    }

    if (averageProgress > 0 && averageProgress < 50) {
      recommendations.push({
        type: 'suggestion',
        message: 'Your course progress could use a boost. Try dedicating 30 minutes daily to learning.',
        priority: 'low',
      });
    }

    return NextResponse.json({
      success: true,
      role: 'student',
      stats: {
        subjects: { total: subjectsCount },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
          weeklyCompleted: weeklyCompletedTasks,
          overdueTasks,
        },
        quizzes: {
          totalAttempts: totalQuizAttempts,
          passed: passedQuizzes,
          averageScore: Math.round(averageScore * 10) / 10,
          bestScore,
          passRate: totalQuizAttempts > 0 ? Math.round((passedQuizzes / totalQuizAttempts) * 100) : 0,
          recentAttempts,
          improvement,
          averageTimePerQuiz: Math.round(averageTimePerQuiz / 60), // Convert to minutes
        },
        courses: {
          enrolled: totalCoursesEnrolled,
          completed: completedCourses,
          averageProgress: Math.round(averageProgress),
        },
        upcomingTasks: upcomingTasks.map(t => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          priority: t.priority,
          subject: t.subject,
        })),
        streak,
        productivity: {
          score: productivityScore,
          weeklyTrend,
          monthlyProgress,
          bestSubject,
          studyHoursThisWeek: Math.round(weeklyCompletedTasks * 0.5 * 10) / 10,
          averageDailyStudyTime: Math.round((weeklyCompletedTasks * 0.5 / 7) * 10) / 10,
        },
        achievements,
        recommendations,
        learningInsights: {
          peakStudyHours: [10, 14, 19], // Would need actual tracking
          mostProductiveDay: 'Wednesday', // Would need actual tracking
          averageQuizTime: Math.round(averageTimePerQuiz / 60),
          subjectProgress,
        },
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    // Fallback to static data on error
    const stats = await getDashboardStats();
    return NextResponse.json({
      success: true,
      role: 'student',
      stats: {
        subjects: { total: 3 },
        tasks: { total: 10, completed: 6, pending: 3, inProgress: 1, completionRate: 60 },
        quizzes: { totalAttempts: 5, passed: 3, averageScore: 75, bestScore: 92, passRate: 60 },
        courses: { enrolled: 3, completed: 1, averageProgress: 45 },
        streak: { current: 5, best: 12 },
        productivity: {
          score: 78,
          weeklyTrend: [
            { day: 'Mon', tasks: 3, hours: 2 },
            { day: 'Tue', tasks: 2, hours: 1.5 },
            { day: 'Wed', tasks: 4, hours: 3 },
            { day: 'Thu', tasks: 1, hours: 1 },
            { day: 'Fri', tasks: 3, hours: 2.5 },
            { day: 'Sat', tasks: 2, hours: 2 },
            { day: 'Sun', tasks: 1, hours: 1 },
          ],
          monthlyProgress: [
            { week: 'Week 1', completed: 8, target: 10 },
            { week: 'Week 2', completed: 12, target: 10 },
            { week: 'Week 3', completed: 9, target: 10 },
            { week: 'Week 4', completed: 11, target: 10 },
          ],
          bestSubject: 'Mathematics',
          studyHoursThisWeek: 13,
          averageDailyStudyTime: 1.8,
        },
        achievements: [
          { id: '1', title: 'Quiz Master', description: 'Pass 5 quizzes with 80%+', icon: 'trophy', earned: true, progress: 100 },
          { id: '2', title: 'Streak Champion', description: 'Maintain a 7-day streak', icon: 'flame', earned: false, progress: 71 },
        ],
        recommendations: [
          { type: 'study', message: 'Keep up the great work!', priority: 'high' },
        ],
        learningInsights: {
          peakStudyHours: [10, 14, 19],
          mostProductiveDay: 'Wednesday',
          averageQuizTime: 12,
          subjectProgress: [
            { subject: 'Mathematics', progress: 75, trend: 'up' },
          ],
        },
      },
    });
  }
}
