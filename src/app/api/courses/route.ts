import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: List all courses (filter: published only for students, all for admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    // Build filter conditions
    const where: Record<string, unknown> = {};

    // Students can only see published courses
    if (!user || user.role !== 'admin') {
      where.isPublished = true;
    }

    // Optional filters
    if (category) {
      where.category = category;
    }
    if (level) {
      where.level = level;
    }

    const courses = await db.course.findMany({
      where,
      include: {
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
          },
        },
        _count: {
          select: { modules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      courses: courses.map((course) => ({
        ...course,
        moduleCount: course._count.modules,
        _count: undefined,
      })),
    });
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST: Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    // Check if user is authenticated and is admin
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, thumbnail, category, level, duration, isPublished } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create course
    const course = await db.course.create({
      data: {
        title,
        description: description || null,
        thumbnail: thumbnail || null,
        category: category || null,
        level: level || 'beginner',
        duration: duration || 0,
        isPublished: isPublished || false,
        createdBy: user.id,
      },
      include: {
        modules: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      course,
    }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
