import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { shouldUseStaticData, getStaticTasks, addStaticTask, getStaticSubjects, StaticTask } from '@/lib/static-data';
import { sanitizeString, isValidTaskStatus, isValidTaskPriority } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can view tasks' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const status = searchParams.get('status');

    if (shouldUseStaticData()) {
      let filteredTasks = getStaticTasks(user.id);

      if (status && isValidTaskStatus(status)) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
      }

      if (subjectId) {
        filteredTasks = filteredTasks.filter(t => t.subjectId === subjectId);
      }

      return NextResponse.json({ tasks: filteredTasks });
    }

    const where: {
      userId: string;
      subjectId?: string;
      status?: string;
    } = {
      userId: user.id,
    };

    if (subjectId) {
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

      where.subjectId = subjectId;
    }

    if (status) {
      if (!isValidTaskStatus(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: pending, in_progress, completed' },
          { status: 400 }
        );
      }
      where.status = status;
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { priority: 'desc' },
        { dueDate: 'asc' },
      ],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can create tasks' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, subjectId } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    if (title.trim().length > 200) {
      return NextResponse.json(
        { error: 'Task title must be less than 200 characters' },
        { status: 400 }
      );
    }

    if (!subjectId || typeof subjectId !== 'string') {
      return NextResponse.json(
        { error: 'Subject ID is required' },
        { status: 400 }
      );
    }

    const taskStatus = status || 'pending';
    if (!isValidTaskStatus(taskStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, in_progress, completed' },
        { status: 400 }
      );
    }

    const taskPriority = priority || 'medium';
    if (!isValidTaskPriority(taskPriority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high' },
        { status: 400 }
      );
    }

    let parsedDueDate: Date | null = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    if (shouldUseStaticData()) {
      const subjects = getStaticSubjects(user.id);
      const subject = subjects.find(s => s.id === subjectId) || { id: subjectId, name: 'Subject', color: '#6366f1' };

      const mockTask: StaticTask = {
        id: `task-${Date.now()}`,
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: parsedDueDate,
        subjectId,
        userId: user.id,
        createdAt: new Date(),
        subject: { id: subject.id, name: subject.name, color: subject.color },
      };

      addStaticTask(user.id, mockTask);
      return NextResponse.json({ task: mockTask }, { status: 201 });
    }

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

    const task = await db.task.create({
      data: {
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: parsedDueDate,
        subjectId,
        userId: user.id,
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

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
