import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { shouldUseStaticData, getStaticSubjects, addStaticSubject, StaticSubject } from '@/lib/static-data';
import { sanitizeString, isValidHexColor } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (shouldUseStaticData()) {
      const subjects = getStaticSubjects(user.id);
      return NextResponse.json({ subjects });
    }

    const subjects = await db.subject.findMany({
      where: { userId: user.id },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ subjects: [] });
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
        { error: 'Only students can create subjects' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, color, examDate } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Subject name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Subject name must be less than 100 characters' },
        { status: 400 }
      );
    }

    const sanitizedColor = color ? color.trim() : '#6366f1';
    if (sanitizedColor && !isValidHexColor(sanitizedColor)) {
      return NextResponse.json(
        { error: 'Invalid color format. Use hex format like #6366f1' },
        { status: 400 }
      );
    }

    let parsedExamDate: Date | null = null;
    if (examDate) {
      parsedExamDate = new Date(examDate);
      if (isNaN(parsedExamDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid exam date format' },
          { status: 400 }
        );
      }
    }

    if (shouldUseStaticData()) {
      const mockSubject: StaticSubject = {
        id: `subject-${Date.now()}`,
        name: sanitizeString(name.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        color: sanitizedColor,
        examDate: parsedExamDate,
        createdAt: new Date(),
        userId: user.id,
        tasks: [],
        _count: { tasks: 0 },
      };
      addStaticSubject(user.id, mockSubject);
      return NextResponse.json({ subject: mockSubject }, { status: 201 });
    }

    const subject = await db.subject.create({
      data: {
        name: sanitizeString(name.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        color: sanitizedColor,
        examDate: parsedExamDate,
        userId: user.id,
      },
      include: {
        tasks: true,
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
