import { NextRequest, NextResponse } from 'next/server';
import { getModuleById, shouldUseStaticData } from '@/lib/data-service';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { sanitizeString } from '@/lib/validation';

// GET: Get a single module by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const moduleData = await getModuleById(id);

    if (!moduleData) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      module: moduleData,
    });
  } catch (error) {
    console.error('Get module error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch module' },
      { status: 500 }
    );
  }
}

// PUT: Update a module (admin only)
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
    const { title, description, content, videoUrl, duration, order } = body;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const mockModule = {
        id,
        title: title || 'Updated Module',
        description: description || null,
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration || 15,
        order: order || 0,
        updatedAt: new Date(),
      };
      return NextResponse.json({ success: true, module: mockModule });
    }

    // Check if module exists
    const existingModule = await db.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = sanitizeString(title.trim());
    if (description !== undefined) updateData.description = description ? sanitizeString(description.trim()) : null;
    if (content !== undefined) updateData.content = content ? sanitizeString(content.trim()) : null;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl || null;
    if (duration !== undefined) updateData.duration = duration;
    if (order !== undefined) updateData.order = order;

    // Update module
    const moduleData = await db.module.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, module: moduleData });
  } catch (error) {
    console.error('Update module error:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

// DELETE: Delete a module (admin only)
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
      return NextResponse.json({ success: true, message: 'Module deleted successfully' });
    }

    // Check if module exists
    const existingModule = await db.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Delete module (cascade will handle progress)
    await db.module.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error) {
    console.error('Delete module error:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
