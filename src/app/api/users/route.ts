import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: List all users with pagination (admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can list users
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    // Build filter
    const where: Record<string, unknown> = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    
    if (role && ['student', 'admin'].includes(role)) {
      where.role = role;
    }

    // Get total count
    const total = await db.user.count({ where });

    // Get users with pagination
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            subjects: true,
            tasks: true,
            quizAttempts: true,
            courseProgress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        // Get quiz attempt stats
        const quizStats = await db.quizAttempt.aggregate({
          where: { userId: u.id },
          _count: true,
          _avg: { score: true },
          _max: { score: true },
        });

        // Get task completion stats
        const taskStats = await db.task.groupBy({
          by: ['status'],
          where: { userId: u.id },
          _count: true,
        });

        const completedTasks = taskStats.find(s => s.status === 'completed')?._count || 0;
        const totalTasks = u._count.tasks;

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          image: u.image,
          createdAt: u.createdAt,
          stats: {
            subjectsCount: u._count.subjects,
            tasksCount: totalTasks,
            completedTasks,
            tasksCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
            quizAttemptsCount: quizStats._count,
            averageQuizScore: quizStats._avg.score || 0,
            bestQuizScore: quizStats._max.score || 0,
            coursesEnrolled: u._count.courseProgress,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
