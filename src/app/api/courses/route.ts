import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getCourses, shouldUseStaticData } from '@/lib/data-service';
import { db } from '@/lib/db';

// Static courses for demo mode
const staticCoursesList = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
    thumbnail: null,
    category: 'Programming',
    level: 'beginner',
    duration: 120,
    isPublished: true,
    createdAt: new Date(),
    _count: { modules: 4 },
  },
  {
    id: 'course-2',
    title: 'Mathematics: Algebra Fundamentals',
    description: 'Master the basics of algebra including equations, inequalities, and functions.',
    thumbnail: null,
    category: 'Mathematics',
    level: 'beginner',
    duration: 90,
    isPublished: true,
    createdAt: new Date(),
    _count: { modules: 4 },
  },
  {
    id: 'course-3',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning basics using Python.',
    thumbnail: null,
    category: 'Data Science',
    level: 'intermediate',
    duration: 180,
    isPublished: true,
    createdAt: new Date(),
    _count: { modules: 4 },
  },
];

// GET: List all published courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const level = searchParams.get('level') || undefined;

    // Use static data for Vercel
    if (shouldUseStaticData()) {
      let filtered = [...staticCoursesList];
      if (category) {
        filtered = filtered.filter(c => c.category === category);
      }
      if (level) {
        filtered = filtered.filter(c => c.level === level);
      }
      return NextResponse.json({
        success: true,
        courses: filtered,
      });
    }

    const courses = await getCourses({ category, level });

    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('Get courses error:', error);
    // Fallback to static data
    return NextResponse.json({
      success: true,
      courses: staticCoursesList,
    });
  }
}

// POST: Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, category, level, duration, isPublished } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Course title is required' }, { status: 400 });
    }

    // Use static data for Vercel (no database)
    if (shouldUseStaticData()) {
      const mockCourse = {
        id: `course-${Date.now()}`,
        title: title.trim(),
        description: description?.trim() || null,
        category: category || 'General',
        level: level || 'beginner',
        duration: duration || 60,
        isPublished: isPublished ?? true,
        createdAt: new Date(),
        _count: { modules: 0 },
      };
      return NextResponse.json({ success: true, course: mockCourse }, { status: 201 });
    }

    // Create course in database
    const course = await db.course.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        category: category || null,
        level: level || 'beginner',
        duration: duration || 0,
        isPublished: isPublished ?? false,
        createdBy: user.id,
      },
      include: {
        _count: { select: { modules: true } },
      },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
