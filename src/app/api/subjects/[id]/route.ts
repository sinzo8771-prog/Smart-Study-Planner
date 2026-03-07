import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { shouldUseStaticData } from '@/lib/data-service';

// Import the mutable static subjects array from the parent route
// Note: In a real app, you'd use a shared data store
let staticSubjectsStore: Array<{
  id: string;
  name: string;
  description: string | null;
  color: string;
  examDate: Date | null;
  createdAt: Date;
  tasks: unknown[];
  _count: { tasks: number };
}> | null = null;

// Initialize static subjects store
function getStaticSubjects() {
  if (!staticSubjectsStore) {
    staticSubjectsStore = [
      {
        id: 'subject-1',
        name: 'Mathematics',
        description: 'Algebra, Calculus, and Statistics',
        color: '#6366f1',
        examDate: null,
        createdAt: new Date(),
        tasks: [],
        _count: { tasks: 3 },
      },
      {
        id: 'subject-2',
        name: 'Physics',
        description: 'Mechanics and Thermodynamics',
        color: '#f59e0b',
        examDate: null,
        createdAt: new Date(),
        tasks: [],
        _count: { tasks: 2 },
      },
      {
        id: 'subject-3',
        name: 'Computer Science',
        description: 'Programming and Algorithms',
        color: '#10b981',
        examDate: null,
        createdAt: new Date(),
        tasks: [],
        _count: { tasks: 4 },
      },
    ];
  }
  return staticSubjectsStore;
}

// GET /api/subjects/[id] - Get single subject with tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const subjects = getStaticSubjects();
      const subject = subjects.find(s => s.id === id);
      
      if (!subject) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ subject });
    }

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

// PUT /api/subjects/[id] - Update subject
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, color, examDate } = body;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const subjects = getStaticSubjects();
      const subjectIndex = subjects.findIndex(s => s.id === id);
      
      if (subjectIndex === -1) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
      
      // Update the subject
      subjects[subjectIndex] = {
        ...subjects[subjectIndex],
        name: name !== undefined ? name.trim() : subjects[subjectIndex].name,
        description: description !== undefined ? (description?.trim() || null) : subjects[subjectIndex].description,
        color: color !== undefined ? color : subjects[subjectIndex].color,
        examDate: examDate !== undefined ? (examDate ? new Date(examDate) : null) : subjects[subjectIndex].examDate,
      };
      
      return NextResponse.json({ subject: subjects[subjectIndex] });
    }

    // Check if subject exists and belongs to user
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

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Subject name cannot be empty' },
          { status: 400 }
        );
      }
    }

    // Validate color format if provided
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

// DELETE /api/subjects/[id] - Delete subject and all its tasks
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const subjects = getStaticSubjects();
      const subjectIndex = subjects.findIndex(s => s.id === id);
      
      if (subjectIndex === -1) {
        return NextResponse.json(
          { error: 'Subject not found' },
          { status: 404 }
        );
      }
      
      const deletedSubject = subjects[subjectIndex];
      subjects.splice(subjectIndex, 1);
      
      return NextResponse.json({
        message: 'Subject deleted successfully',
        deletedTasksCount: deletedSubject._count.tasks,
      });
    }

    // Check if subject exists and belongs to user
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
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Delete the subject (tasks will be cascade deleted due to schema relation)
    await db.subject.delete({
      where: { id },
    });

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
