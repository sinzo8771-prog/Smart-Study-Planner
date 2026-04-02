import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { shouldUseStaticData } from '@/lib/data-service';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

let staticTasksStore: Array<{
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  subjectId: string;
  userId: string;
  createdAt: Date;
  subject: { id: string; name: string; color: string };
}> | null = null;

function getStaticTasks() {
  if (!staticTasksStore) {
    staticTasksStore = [
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
  }
  return staticTasksStore;
}

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

    
    if (shouldUseStaticData()) {
      const tasks = getStaticTasks();
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ task });
    }

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

    
    if (shouldUseStaticData()) {
      const tasks = getStaticTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
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
      
      
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title.trim() : tasks[taskIndex].title,
        description: description !== undefined ? (description?.trim() || null) : tasks[taskIndex].description,
        status: status !== undefined ? status : tasks[taskIndex].status,
        priority: priority !== undefined ? priority : tasks[taskIndex].priority,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : tasks[taskIndex].dueDate,
        subjectId: subjectId !== undefined ? subjectId : tasks[taskIndex].subjectId,
      };
      
      return NextResponse.json({ task: tasks[taskIndex] });
    }

    
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

    
    if (shouldUseStaticData()) {
      const tasks = getStaticTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      tasks.splice(taskIndex, 1);
      
      return NextResponse.json({
        message: 'Task deleted successfully',
      });
    }

    
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
