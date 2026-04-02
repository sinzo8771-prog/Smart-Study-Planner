import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sanitizeString, isValidCourseLevel } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    
    if (user && !shouldUseStaticData()) {
      try {
        const moduleIds = course.modules?.map((m: { id: string }) => m.id) || [];
        const moduleProgress = await db.moduleProgress.findMany({
          where: { userId: user.id, moduleId: { in: moduleIds } },
        });

        const progressMap = new Map(moduleProgress.map((mp) => [mp.moduleId, mp.completed]));

        
        const modulesWithProgress = course.modules?.map((m: { id: string; completed?: boolean }) => ({
          ...m,
          completed: progressMap.get(m.id) || false,
        }));

        
        const completedModules = moduleProgress.filter((mp) => mp.completed).length;
        const totalModules = moduleIds.length;
        const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return NextResponse.json({
          success: true,
          course: {
            ...course,
            modules: modulesWithProgress,
            progress: progressPercentage,
          },
        });
      } catch (progressError) {
        console.error('Error fetching progress:', progressError);
        
        return NextResponse.json({
          success: true,
          course: {
            ...course,
            modules: course.modules?.map((m: { id: string; completed?: boolean }) => ({
              ...m,
              completed: false,
            })),
            progress: 0,
          },
        });
      }
    }

    
    return NextResponse.json({
      success: true,
      course: {
        ...course,
        modules: course.modules?.map((m: { id: string; completed?: boolean }) => ({
          ...m,
          completed: false,
        })),
        progress: 0,
      },
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, category, level, duration, isPublished, thumbnail } = body;

    
    if (shouldUseStaticData()) {
      const mockCourse = {
        id,
        title: title || 'Updated Course',
        description: description || null,
        category: category || 'General',
        level: level || 'beginner',
        duration: duration || 60,
        isPublished: isPublished ?? true,
        thumbnail: thumbnail || null,
        updatedAt: new Date(),
        _count: { modules: 0 },
      };
      return NextResponse.json({ success: true, course: mockCourse });
    }

    
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = sanitizeString(title.trim());
    if (description !== undefined) updateData.description = description ? sanitizeString(description.trim()) : null;
    if (category !== undefined) updateData.category = category;
    if (level !== undefined) {
      if (!isValidCourseLevel(level)) {
        return NextResponse.json({ error: 'Invalid level. Must be: beginner, intermediate, or advanced' }, { status: 400 });
      }
      updateData.level = level;
    }
    if (duration !== undefined) updateData.duration = duration;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    
    const course = await db.course.update({
      where: { id },
      data: updateData,
      include: {
        modules: { orderBy: { order: 'asc' } },
        _count: { select: { modules: true } },
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    
    if (shouldUseStaticData()) {
      return NextResponse.json({ success: true, message: 'Course deleted successfully' });
    }

    
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    
    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
