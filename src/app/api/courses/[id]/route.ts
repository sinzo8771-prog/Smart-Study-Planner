import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Get course with modules and progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            order: true,
            videoUrl: true,
          },
        },
        _count: {
          select: { modules: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check access: unpublished courses are only visible to admins
    if (!course.isPublished && (!user || user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Get user's progress for this course if authenticated
    let courseProgress = null;
    let moduleProgress: Array<{ moduleId: string; completed: boolean }> = [];

    if (user) {
      courseProgress = await db.courseProgress.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: id,
          },
        },
      });

      // Get module progress for all modules in this course
      const moduleIds = course.modules.map((m) => m.id);
      const progressRecords = await db.moduleProgress.findMany({
        where: {
          userId: user.id,
          moduleId: { in: moduleIds },
        },
        select: {
          moduleId: true,
          completed: true,
        },
      });

      moduleProgress = progressRecords.map((p) => ({
        moduleId: p.moduleId,
        completed: p.completed,
      }));
    }

    // Calculate progress percentage if user has progress
    let progressPercentage = 0;
    if (course.modules.length > 0 && moduleProgress.length > 0) {
      const completedModules = moduleProgress.filter((m) => m.completed).length;
      progressPercentage = Math.round((completedModules / course.modules.length) * 100);
    }

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        moduleCount: course._count.modules,
        _count: undefined,
        userProgress: courseProgress ? {
          ...courseProgress,
          calculatedProgress: progressPercentage,
        } : null,
        moduleProgress: moduleProgress.reduce((acc, mp) => {
          acc[mp.moduleId] = mp.completed;
          return acc;
        }, {} as Record<string, boolean>),
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT: Update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { title, description, thumbnail, category, level, duration, isPublished } = body;

    // Check if course exists
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Update course
    const course = await db.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(category !== undefined && { category }),
        ...(level !== undefined && { level }),
        ...(duration !== undefined && { duration }),
        ...(isPublished !== undefined && { isPublished }),
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
    });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE: Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if course exists
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Delete course (cascade will delete modules and progress records)
    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
