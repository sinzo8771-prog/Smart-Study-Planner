import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: List modules (filter: courseId)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    // Build filter conditions
    const where: Record<string, unknown> = {};

    if (courseId) {
      where.courseId = courseId;

      // Check course access for students
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { isPublished: true },
      });

      if (!course) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }

      // Students can only see modules of published courses
      if (!course.isPublished && (!user || user.role !== 'admin')) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        );
      }
    }

    const modules = await db.module.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
        },
      },
      orderBy: [{ courseId: 'asc' }, { order: 'asc' }],
    });

    // Filter out modules from unpublished courses for non-admin users
    const filteredModules = user?.role === 'admin'
      ? modules
      : modules.filter((m) => m.course.isPublished);

    return NextResponse.json({
      success: true,
      modules: filteredModules,
    });
  } catch (error) {
    console.error('Get modules error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST: Create a new module (admin only)
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
    const { title, description, content, videoUrl, duration, order, courseId } = body;

    // Validate required fields
    if (!title || !courseId) {
      return NextResponse.json(
        { error: 'Title and courseId are required' },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // If order is not specified, get the next order number
    let moduleOrder = order;
    if (moduleOrder === undefined || moduleOrder === null) {
      const lastModule = await db.module.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      moduleOrder = (lastModule?.order ?? -1) + 1;
    }

    // Create module
    const newModule = await db.module.create({
      data: {
        title,
        description: description || null,
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration || 0,
        order: moduleOrder,
        courseId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      module: newModule,
    }, { status: 201 });
  } catch (error) {
    console.error('Create module error:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
