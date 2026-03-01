import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Get single module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

    const moduleData = await db.module.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            isPublished: true,
            level: true,
            category: true,
          },
        },
      },
    });

    if (!moduleData) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Check access: modules from unpublished courses are only visible to admins
    if (!moduleData.course.isPublished && (!user || user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Get user's progress for this module if authenticated
    let moduleProgress = null;
    if (user) {
      moduleProgress = await db.moduleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId: user.id,
            moduleId: id,
          },
        },
      });
    }

    // Get previous and next modules for navigation
    const siblings = await db.module.findMany({
      where: { courseId: moduleData.courseId },
      orderBy: { order: 'asc' },
      select: { id: true, title: true, order: true },
    });

    const currentIndex = siblings.findIndex((m) => m.id === id);
    const previousModule = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const nextModule = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

    return NextResponse.json({
      success: true,
      module: {
        ...moduleData,
        userProgress: moduleProgress,
        navigation: {
          previous: previousModule,
          next: nextModule,
          totalModules: siblings.length,
          currentModuleNumber: currentIndex + 1,
        },
      },
    });
  } catch (error) {
    console.error('Get module error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

// PUT: Update module (admin only)
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
    const { title, description, content, videoUrl, duration, order } = body;

    // Check if module exists
    const existingModule = await db.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Update module
    const updatedModule = await db.module.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(order !== undefined && { order }),
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
      module: updatedModule,
    });
  } catch (error) {
    console.error('Update module error:', error);
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    );
  }
}

// DELETE: Delete module (admin only)
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

    // Check if module exists
    const existingModule = await db.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }

    // Delete module (cascade will delete module progress records)
    await db.module.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error) {
    console.error('Delete module error:', error);
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    );
  }
}
