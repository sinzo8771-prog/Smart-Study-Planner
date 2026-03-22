import { NextRequest, NextResponse } from 'next/server';
import { getCourseById, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sanitizeString, isValidCourseLevel } from '@/lib/validation';

// GET: Get a single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT: Update a course (admin only)
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

    // Use static data for Vercel deployment without database
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

    // Check if course exists
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Build update data
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

    // Update course
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

// DELETE: Delete a course (admin only)
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

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      return NextResponse.json({ success: true, message: 'Course deleted successfully' });
    }

    // Check if course exists
    const existingCourse = await db.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Delete course (cascade will handle modules and progress)
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
