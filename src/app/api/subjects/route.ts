import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { db } from '@/lib/db';
import { shouldUseStaticData } from '@/lib/data-service';
import { sanitizeString, isValidHexColor } from '@/lib/validation';

// Enable dynamic rendering
export const dynamic = 'force-dynamic';

// Static subjects for demo mode (Vercel without database)
// Using let to allow mutation for demo mode
let staticSubjects = [
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

// GET /api/subjects - List all subjects for the authenticated user
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      return NextResponse.json({ subjects: staticSubjects });
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
    // Fallback to static data on error
    if (shouldUseStaticData()) {
      return NextResponse.json({ subjects: staticSubjects });
    }
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Students only can create subjects
    if (user.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can create subjects' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, color, examDate } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Subject name is required' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Subject name must be less than 100 characters' },
        { status: 400 }
      );
    }

    // Validate color format (optional but if provided, should be valid hex)
    const sanitizedColor = color ? color.trim() : '#6366f1';
    if (sanitizedColor && !isValidHexColor(sanitizedColor)) {
      return NextResponse.json(
        { error: 'Invalid color format. Use hex format like #6366f1' },
        { status: 400 }
      );
    }

    // Validate exam date if provided
    let parsedExamDate: Date | null = null;
    if (examDate) {
      parsedExamDate = new Date(examDate);
      if (isNaN(parsedExamDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid exam date format' },
          { status: 400 }
        );
      }
      // Ensure exam date is in the future
      if (parsedExamDate < new Date()) {
        return NextResponse.json(
          { error: 'Exam date must be in the future' },
          { status: 400 }
        );
      }
    }

    // Use static data for Vercel deployment without database
    if (shouldUseStaticData()) {
      const mockSubject = {
        id: `subject-${Date.now()}`,
        name: sanitizeString(name.trim()),
        description: description ? sanitizeString(description.trim()) : null,
        color: sanitizedColor,
        examDate: parsedExamDate,
        createdAt: new Date(),
        tasks: [],
        _count: { tasks: 0 },
      };
      // Add to static subjects array for persistence in demo mode
      staticSubjects.push(mockSubject);
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
