import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { shouldUseStaticData } from '@/lib/data-service';
import { sanitizeString, isValidTaskStatus, isValidTaskPriority } from '@/lib/validation';

// Static tasks for demo mode (Vercel without database)
const staticTasks = [
  {
    id: 'task-1',
    title: 'Complete Chapter 3 exercises',
    description: 'Work through all practice problems',
    status: 'pending',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000),
    subjectId: 'subject-1',
    userId: 'demo-user',
    createdAt: new Date(),
    subject: { id: 'subject-1', name: 'Mathematics', color: '#6366f1' },
  },
  {
    id: 'task-2',
    title: 'Watch lecture video',
    description: 'Physics mechanics lecture',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 172800000),
    subjectId: 'subject-2',
    userId: 'demo-user',
    createdAt: new Date(),
    subject: { id: 'subject-2', name: 'Physics', color: '#f59e0b' },
  },
  {
    id: 'task-3',
    title: 'Submit programming assignment',
    description: 'Complete the React project',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() - 86400000),
    subjectId: 'subject-3',
    userId: 'demo-user',
    createdAt: new Date(),
    subject: { id: 'subject-3', name: 'Computer Science', color: '#10b981' },
  },
];

// GET /api/tasks - List all tasks for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Students only can view their tasks
    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can view tasks' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const status = searchParams.get('status');

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      let filteredTasks = [...staticTasks];

      if (status && isValidTaskStatus(status)) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
      }

      if (subjectId) {
        filteredTasks = filteredTasks.filter(t => t.subjectId === subjectId);
      }

      return NextResponse.json({ tasks: filteredTasks });
    }

    // Build filter conditions
    const where: {
      userId: string;
      subjectId?: string;
      status?: string;
    } = {
      userId: user.id,
    };

    if (subjectId) {
      // Verify subject belongs to user
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
        { status: 'asc' }, // pending first, then in_progress, then completed
        { priority: 'desc' }, // high first, then medium, then low
        { dueDate: 'asc' },
      ],
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Fallback to static data on error
    if (shouldUseStaticData()) {
      return NextResponse.json({ tasks: staticTasks });
    }
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Students only can create tasks
    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can create tasks' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, status, priority, dueDate, subjectId } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    // Validate title length
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

    // Validate status
    const taskStatus = status || 'pending';
    if (!isValidTaskStatus(taskStatus)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, in_progress, completed' },
        { status: 400 }
      );
    }

    // Validate priority
    const taskPriority = priority || 'medium';
    if (!isValidTaskPriority(taskPriority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be one of: low, medium, high' },
        { status: 400 }
      );
    }

    // Parse and validate due date
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

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const mockTask = {
        id: `task-${Date.now()}`,
        title: sanitizeString(title.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        status: taskStatus,
        priority: taskPriority,
        dueDate: parsedDueDate,
        subjectId,
        userId: user.id,
        createdAt: new Date(),
        subject: { id: subjectId, name: 'Subject', color: '#6366f1' },
      };
      return NextResponse.json({ task: mockTask }, { status: 201 });
    }

    // Verify subject exists and belongs to user
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
