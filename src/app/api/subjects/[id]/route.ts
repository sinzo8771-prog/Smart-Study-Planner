import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const subject = await db.subject.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subject });
  } catch (error) {
    console.error('Error fetching subject:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, color, examDate } = body;

    const existingSubject = await db.subject.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingSubject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Subject name cannot be empty' },
          { status: 400 }
        );
      }
    }

    if (color !== undefined && color !== null && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      return NextResponse.json(
        { error: 'Invalid color format. Use hex format like #6366f1' },
        { status: 400 }
      );
    }

    const updatedSubject = await db.subject.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        description: description !== undefined ? (description?.trim() || null) : undefined,
        color: color !== undefined ? color : undefined,
        examDate: examDate !== undefined ? (examDate ? new Date(examDate) : null) : undefined,
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json({ subject: updatedSubject });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      console.log('[Subject DELETE] Unauthorized - no user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log('[Subject DELETE] Attempting to delete subject:', id, 'for user:', user.id);

    const existingSubject = await db.subject.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!existingSubject) {
      console.log('[Subject DELETE] Subject not found for user. Subject ID:', id, 'User ID:', user.id);
      
      // Check if subject exists but belongs to another user
      const subjectExists = await db.subject.findUnique({
        where: { id },
        select: { userId: true }
      });
      
      if (subjectExists) {
        console.log('[Subject DELETE] Subject exists but belongs to user:', subjectExists.userId);
      } else {
        console.log('[Subject DELETE] Subject does not exist in database');
      }
      
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    await db.subject.delete({
      where: { id },
    });

    console.log('[Subject DELETE] Subject deleted successfully:', id);
    return NextResponse.json({
      message: 'Subject deleted successfully',
      deletedTasksCount: existingSubject._count.tasks,
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
