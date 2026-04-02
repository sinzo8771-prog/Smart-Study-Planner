import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { shouldUseStaticData, getCourseById } from '@/lib/data-service';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    
    if (shouldUseStaticData()) {
      const { searchParams } = new URL(request.url);
      const courseId = searchParams.get('courseId');

      if (courseId) {
        const course = await getCourseById(courseId);
        if (!course) {
          return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          progress: {
            courseId,
            courseProgress: { progress: 0 },
            moduleProgress: course.modules.map((m: { id: string }) => ({
              moduleId: m.id,
              completed: false,
              completedAt: null,
            })),
            summary: {
              totalModules: course.modules.length,
              completedModules: 0,
              progressPercentage: 0,
            },
          },
        });
      }

      return NextResponse.json({
        success: true,
        progress: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    
    if (courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          modules: { orderBy: { order: 'asc' }, select: { id: true } },
        },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      const courseProgress = await db.courseProgress.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      });

      const moduleIds = course.modules.map((m) => m.id);
      const moduleProgress = await db.moduleProgress.findMany({
        where: { userId: user.id, moduleId: { in: moduleIds } },
      });

      const completedModules = moduleProgress.filter((mp) => mp.completed).length;
      const totalModules = course.modules.length;
      const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      return NextResponse.json({
        success: true,
        progress: {
          courseId,
          courseProgress: courseProgress ? { ...courseProgress, calculatedProgress: progressPercentage } : null,
          moduleProgress: moduleProgress.map((mp) => ({
            moduleId: mp.moduleId,
            completed: mp.completed,
            completedAt: mp.completedAt,
          })),
          summary: { totalModules, completedModules, progressPercentage },
        },
      });
    }

    
    const allCourseProgress = await db.courseProgress.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            category: true,
            level: true,
            modules: { select: { id: true } },
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const allModuleProgress = await db.moduleProgress.findMany({
      where: { userId: user.id },
      select: { moduleId: true, completed: true, completedAt: true },
    });

    const moduleProgressMap = new Map(allModuleProgress.map((mp) => [mp.moduleId, mp]));

    const coursesWithProgress = allCourseProgress.map((cp) => {
      const totalModules = cp.course.modules.length;
      const completedModules = cp.course.modules.filter((m) => moduleProgressMap.get(m.id)?.completed).length;
      const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

      return {
        courseId: cp.courseId,
        course: cp.course,
        progress: cp.progress,
        calculatedProgress: progressPercentage,
        startedAt: cp.startedAt,
        completedAt: cp.completedAt,
        lastAccessedAt: cp.lastAccessedAt,
        summary: { totalModules, completedModules, progressPercentage },
      };
    });

    return NextResponse.json({ success: true, progress: coursesWithProgress });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { moduleId, completed } = body;

    if (!moduleId || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'moduleId and completed (boolean) are required' }, { status: 400 });
    }

    
    if (shouldUseStaticData()) {
      return NextResponse.json({
        success: true,
        progress: {
          module: { moduleId, completed, completedAt: completed ? new Date() : null },
          course: { progress: 0, totalModules: 4, completedModules: completed ? 1 : 0, isCompleted: false },
        },
      });
    }

    const moduleData = await db.module.findUnique({
      where: { id: moduleId },
      include: { course: { include: { modules: { orderBy: { order: 'asc' }, select: { id: true } } } } },
    });

    if (!moduleData || !moduleData.course.isPublished) {
      return NextResponse.json({ error: 'Module not found or not accessible' }, { status: 404 });
    }

    const courseId = moduleData.courseId;
    const now = new Date();

    const moduleProgress = await db.moduleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId } },
      update: { completed, completedAt: completed ? now : null },
      create: { userId: user.id, moduleId, completed, completedAt: completed ? now : null },
    });

    const allModuleProgress = await db.moduleProgress.findMany({
      where: { userId: user.id, moduleId: { in: moduleData.course.modules.map((m) => m.id) } },
    });

    const totalModules = moduleData.course.modules.length;
    const completedModules = allModuleProgress.filter((mp) => mp.completed).length;
    const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    const isCourseCompleted = completedModules === totalModules && totalModules > 0;

    const courseProgress = await db.courseProgress.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: { progress: progressPercentage, completedAt: isCourseCompleted ? now : null, lastAccessedAt: now },
      create: { userId: user.id, courseId, progress: progressPercentage, completedAt: isCourseCompleted ? now : null },
    });

    return NextResponse.json({
      success: true,
      progress: {
        module: { moduleId, completed: moduleProgress.completed, completedAt: moduleProgress.completedAt },
        course: {
          courseId,
          progress: progressPercentage,
          totalModules,
          completedModules,
          isCompleted: isCourseCompleted,
          startedAt: courseProgress.startedAt,
          completedAt: courseProgress.completedAt,
          lastAccessedAt: courseProgress.lastAccessedAt,
        },
      },
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
