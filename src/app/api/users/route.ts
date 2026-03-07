import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { shouldUseStaticData } from '@/lib/data-service';
import { hashPassword } from '@/lib/auth';
import { sanitizeString, isValidEmail, isValidPassword, isValidName, isValidRole } from '@/lib/validation';
import bcrypt from 'bcryptjs';

// Static users for demo mode (Vercel without database)
const staticUsersList = [
  {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@studyplanner.com',
    role: 'admin',
    image: null,
    createdAt: new Date('2024-01-01'),
    _count: { subjects: 0, tasks: 0 },
    stats: {
      quizAttemptsCount: 5,
      averageQuizScore: 85,
      bestQuizScore: 100,
      coursesEnrolled: 2,
    },
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'student',
    image: null,
    createdAt: new Date('2024-01-15'),
    _count: { subjects: 3, tasks: 12 },
    stats: {
      quizAttemptsCount: 7,
      averageQuizScore: 78,
      bestQuizScore: 95,
      coursesEnrolled: 4,
    },
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'student',
    image: null,
    createdAt: new Date('2024-02-01'),
    _count: { subjects: 2, tasks: 8 },
    stats: {
      quizAttemptsCount: 4,
      averageQuizScore: 82,
      bestQuizScore: 88,
      coursesEnrolled: 3,
    },
  },
  {
    id: 'user-3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    role: 'student',
    image: null,
    createdAt: new Date('2024-02-15'),
    _count: { subjects: 4, tasks: 15 },
    stats: {
      quizAttemptsCount: 10,
      averageQuizScore: 91,
      bestQuizScore: 100,
      coursesEnrolled: 5,
    },
  },
];

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

    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role');

    // Use static data ONLY for Vercel deployment (no database)
    if (shouldUseStaticData()) {
      let filteredUsers = [...staticUsersList];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(u =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
        );
      }

      if (role && isValidRole(role)) {
        filteredUsers = filteredUsers.filter(u => u.role === role);
      }

      const total = filteredUsers.length;
      const startIndex = (page - 1) * limit;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        success: true,
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    }

    // Build filter for database query
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && isValidRole(role)) {
      where.role = role;
    }

    // Get total count and users in parallel for performance
    const [total, users] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
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
      }),
    ]);

    // Optimize stats fetching - do in parallel for all users
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const [quizStats, taskStats] = await Promise.all([
          db.quizAttempt.aggregate({
            where: { userId: u.id },
            _count: true,
            _avg: { score: true },
            _max: { score: true },
          }),
          db.task.groupBy({
            by: ['status'],
            where: { userId: u.id },
            _count: true,
          }),
        ]);

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          image: u.image,
          createdAt: u.createdAt,
          _count: {
            subjects: u._count.subjects,
            tasks: u._count.tasks,
          },
          stats: {
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
    // Fallback to static data on error
    return NextResponse.json({
      success: true,
      users: staticUsersList.slice(0, 10),
      pagination: {
        page: 1,
        limit: 10,
        total: staticUsersList.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    });
  }
}

// POST: Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role = 'student' } = body;

    // Validate name
    const nameValidation = isValidName(name);
    if (!nameValidation.valid) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Validate password
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
    }

    // Validate role
    if (!isValidRole(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be "student" or "admin"' }, { status: 400 });
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = sanitizeString(name.trim());

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const mockUser = {
        id: `user-${Date.now()}`,
        name: sanitizedName,
        email: sanitizedEmail,
        role,
        image: null,
        createdAt: new Date(),
        _count: { subjects: 0, tasks: 0 },
        stats: {
          quizAttemptsCount: 0,
          averageQuizScore: 0,
          bestQuizScore: 0,
          coursesEnrolled: 0,
        },
      };
      return NextResponse.json({ success: true, user: mockUser }, { status: 201 });
    }

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser = await db.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashedPassword,
        role,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...newUser,
        _count: { subjects: 0, tasks: 0 },
        stats: {
          quizAttemptsCount: 0,
          averageQuizScore: 0,
          bestQuizScore: 0,
          coursesEnrolled: 0,
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT: Update a user (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, email, role, password } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const existingUser = staticUsersList.find(u => u.id === id);
      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const updatedUser = {
        ...existingUser,
        name: name ? sanitizeString(name.trim()) : existingUser.name,
        email: email ? email.toLowerCase().trim() : existingUser.email,
        role: role && isValidRole(role) ? role : existingUser.role,
      };
      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Build update data with validation
    const updateData: Record<string, unknown> = {};

    if (name) {
      const nameValidation = isValidName(name);
      if (!nameValidation.valid) {
        return NextResponse.json({ error: nameValidation.error }, { status: 400 });
      }
      updateData.name = sanitizeString(name.trim());
    }

    if (email) {
      if (!isValidEmail(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
      }
      const sanitizedEmail = email.toLowerCase().trim();
      if (sanitizedEmail !== existingUser.email) {
        const emailExists = await db.user.findUnique({
          where: { email: sanitizedEmail },
        });
        if (emailExists) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
      }
      updateData.email = sanitizedEmail;
    }

    if (role) {
      if (!isValidRole(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateData.role = role;
    }

    if (password) {
      const passwordValidation = isValidPassword(password);
      if (!passwordValidation.valid) {
        return NextResponse.json({ error: passwordValidation.error }, { status: 400 });
      }
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
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
    });

    // Get quiz stats in parallel
    const quizStats = await db.quizAttempt.aggregate({
      where: { userId: id },
      _count: true,
      _avg: { score: true },
      _max: { score: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        _count: {
          subjects: updatedUser._count.subjects,
          tasks: updatedUser._count.tasks,
        },
        stats: {
          quizAttemptsCount: quizStats._count,
          averageQuizScore: quizStats._avg.score || 0,
          bestQuizScore: quizStats._max.score || 0,
          coursesEnrolled: updatedUser._count.courseProgress,
        },
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE: Delete a user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const existingUser = staticUsersList.find(u => u.id === id);
      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'User deleted successfully' });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete user (cascades will handle related data)
    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
