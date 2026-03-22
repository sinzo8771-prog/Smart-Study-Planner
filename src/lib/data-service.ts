// Data service that handles both database and static data
// Used for Vercel compatibility

import { db } from './db';
import { shouldUseStaticData, staticCourses, staticQuizzes, staticUsers, addRegisteredUser, findUserByEmailFromAll, findUserByIdFromAll } from './static-data';

// Re-export shouldUseStaticData for use in other modules
export { shouldUseStaticData };

// Course operations
export async function getCourses(filters?: { category?: string; level?: string }) {
  if (shouldUseStaticData()) {
    let courses = staticCourses.filter(c => c.isPublished);
    if (filters?.category) {
      courses = courses.filter(c => c.category === filters.category);
    }
    if (filters?.level) {
      courses = courses.filter(c => c.level === filters.level);
    }
    return courses.map(c => ({
      ...c,
      modules: c.modules.map(m => ({
        id: m.id,
        title: m.title,
        duration: m.duration,
        order: m.order,
      })),
      moduleCount: c.modules.length,
    }));
  }

  try {
    const where: Record<string, unknown> = { isPublished: true };
    if (filters?.category) where.category = filters.category;
    if (filters?.level) where.level = filters.level;

    const courses = await db.course.findMany({
      where,
      include: {
        modules: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, duration: true, order: true },
        },
        _count: { select: { modules: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map(c => ({ ...c, moduleCount: c._count.modules }));
  } catch (error) {
    console.error('[DataService] getCourses error, falling back to static:', error);
    return staticCourses.filter(c => c.isPublished).map(c => ({
      ...c,
      modules: c.modules.map(m => ({
        id: m.id,
        title: m.title,
        duration: m.duration,
        order: m.order,
      })),
      moduleCount: c.modules.length,
    }));
  }
}

export async function getCourseById(id: string) {
  if (shouldUseStaticData()) {
    const course = staticCourses.find(c => c.id === id && c.isPublished);
    if (!course) return null;
    return { ...course, moduleCount: course.modules.length };
  }

  try {
    const course = await db.course.findFirst({
      where: { id, isPublished: true },
      include: {
        modules: { orderBy: { order: 'asc' } },
        _count: { select: { modules: true } },
      },
    });
    if (!course) return null;
    return { ...course, moduleCount: course._count.modules };
  } catch (error) {
    console.error('[DataService] getCourseById error, falling back to static:', error);
    const course = staticCourses.find(c => c.id === id && c.isPublished);
    if (!course) return null;
    return { ...course, moduleCount: course.modules.length };
  }
}

export async function getModuleById(id: string) {
  if (shouldUseStaticData()) {
    for (const course of staticCourses) {
      const moduleData = course.modules.find(m => m.id === id);
      if (moduleData) return moduleData;
    }
    return null;
  }

  try {
    return await db.module.findUnique({ where: { id } });
  } catch (error) {
    console.error('[DataService] getModuleById error, falling back to static:', error);
    for (const course of staticCourses) {
      const moduleData = course.modules.find(m => m.id === id);
      if (moduleData) return moduleData;
    }
    return null;
  }
}

// Quiz operations
export async function getQuizzes() {
  if (shouldUseStaticData()) {
    return staticQuizzes.filter(q => q.isPublished).map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      courseId: q.courseId,
      duration: q.duration,
      passingScore: q.passingScore,
      category: q.category || 'General',
      difficulty: q.difficulty || 'beginner',
      questionCount: q.questions.length,
      _count: { questions: q.questions.length },
    }));
  }

  try {
    return await db.quiz.findMany({
      where: { isPublished: true },
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('[DataService] getQuizzes error, falling back to static:', error);
    return staticQuizzes.filter(q => q.isPublished).map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      courseId: q.courseId,
      duration: q.duration,
      passingScore: q.passingScore,
      category: q.category || 'General',
      difficulty: q.difficulty || 'beginner',
      questionCount: q.questions.length,
      _count: { questions: q.questions.length },
    }));
  }
}

export async function getQuizById(id: string) {
  if (shouldUseStaticData()) {
    const quiz = staticQuizzes.find(q => q.id === id && q.isPublished);
    if (!quiz) return null;
    return { ...quiz, questionCount: quiz.questions.length };
  }

  try {
    const quiz = await db.quiz.findFirst({
      where: { id, isPublished: true },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { questions: true } },
      },
    });
    if (!quiz) return null;
    return { ...quiz, questionCount: quiz._count.questions };
  } catch (error) {
    console.error('[DataService] getQuizById error, falling back to static:', error);
    const quiz = staticQuizzes.find(q => q.id === id && q.isPublished);
    if (!quiz) return null;
    return { ...quiz, questionCount: quiz.questions.length };
  }
}

// User operations
export async function getUserByEmail(email: string) {
  if (shouldUseStaticData()) {
    // Check both static users and registered users
    return findUserByEmailFromAll(email);
  }

  try {
    return await db.user.findUnique({ where: { email } });
  } catch (error) {
    console.error('[DataService] getUserByEmail error, falling back to static:', error);
    return findUserByEmailFromAll(email);
  }
}

export async function getUserById(id: string) {
  if (shouldUseStaticData()) {
    // Use the optimized lookup function
    return findUserByIdFromAll(id);
  }

  try {
    return await db.user.findUnique({ where: { id } });
  } catch (error) {
    console.error('[DataService] getUserById error, falling back to static:', error);
    return findUserByIdFromAll(id);
  }
}

export async function createUser(data: { name: string; email: string; password?: string; role: string; image?: string | null; emailVerified?: Date | null }) {
  if (shouldUseStaticData()) {
    // Check if user already exists
    const existing = findUserByEmailFromAll(data.email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    // Create user with hashed password stored
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password, // Already hashed by auth.ts
      role: data.role,
      image: data.image || null,
      emailVerified: data.emailVerified || new Date(),
    };
    
    // Store in the registered users map
    addRegisteredUser(newUser);
    
    console.log('[DataService] Created new user in static mode:', data.email);
    
    return {
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    return await db.user.create({ 
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        image: data.image || null,
        emailVerified: data.emailVerified || new Date(), // Auto-verify OAuth users
      }
    });
  } catch (error) {
    console.error('[DataService] createUser error:', error);
    // Return mock user on error
    return {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      image: data.image || null,
      emailVerified: data.emailVerified || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function updateUser(id: string, data: Record<string, unknown>) {
  if (shouldUseStaticData()) {
    // Return updated mock user
    return { id, ...data, updatedAt: new Date() };
  }

  try {
    return await db.user.update({ where: { id }, data });
  } catch (error) {
    console.error('[DataService] updateUser error:', error);
    return { id, ...data, updatedAt: new Date() };
  }
}

// Stats for dashboard
export async function getDashboardStats() {
  if (shouldUseStaticData()) {
    return {
      totalCourses: staticCourses.length,
      totalQuizzes: staticQuizzes.length,
      totalModules: staticCourses.reduce((acc, c) => acc + c.modules.length, 0),
      categories: [...new Set(staticCourses.map(c => c.category).filter(Boolean))],
    };
  }

  try {
    const [totalCourses, totalQuizzes, totalModules] = await Promise.all([
      db.course.count({ where: { isPublished: true } }),
      db.quiz.count({ where: { isPublished: true } }),
      db.module.count(),
    ]);

    return { totalCourses, totalQuizzes, totalModules };
  } catch (error) {
    console.error('[DataService] getDashboardStats error:', error);
    return {
      totalCourses: staticCourses.length,
      totalQuizzes: staticQuizzes.length,
      totalModules: staticCourses.reduce((acc, c) => acc + c.modules.length, 0),
    };
  }
}
