import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

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

    const task = await db.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
            description: true,
            examDate: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error);
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
    const { title, description, status, priority, dueDate, subjectId } = body;

    const existingTask = await db.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Task title cannot be empty' },
          { status: 400 }
        );
      }
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}` },
        { status: 400 }
      );
    }

    if (subjectId !== undefined) {
      const subject = await db.subject.findFirst({
        where: {
          id: subjectId,
          userId: user.id,
        },
      });

      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? (description?.trim() || null) : undefined,
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        subjectId: subjectId !== undefined ? subjectId : undefined,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existingTask = await db.task.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
