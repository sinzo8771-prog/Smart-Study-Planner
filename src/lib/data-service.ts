

import { db, runMigrations } from './db';
import { shouldUseStaticData, staticCourses, staticQuizzes, staticUsers, addRegisteredUser, findUserByEmailFromAll, findUserByIdFromAll } from './static-data';
import { cachedFetch, getCached, setCache, CACHE_KEYS, CACHE_TTL, invalidateCachePattern } from './cache';
import { runCleanupInBackground } from './cleanup';

export { shouldUseStaticData };

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
      id: c.id,
      title: c.title,
      description: c.description,
      thumbnail: c.thumbnail,
      category: c.category,
      level: c.level,
      duration: c.duration,
      isPublished: c.isPublished,
      createdBy: c.createdBy,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      modules: c.modules.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description,
        content: m.content,
        videoUrl: m.videoUrl,
        duration: m.duration,
        order: m.order,
        courseId: m.courseId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      _count: { modules: c.modules.length },
    }));
  }

  
  const cacheKey = filters 
    ? `${CACHE_KEYS.COURSES}_${filters.category || 'all'}_${filters.level || 'all'}`
    : CACHE_KEYS.COURSES;

  return cachedFetch(
    cacheKey,
    async () => {
      
      runCleanupInBackground();
      
      const where: Record<string, unknown> = { isPublished: true };
      if (filters?.category) where.category = filters.category;
      if (filters?.level) where.level = filters.level;

      const courses = await db.course.findMany({
        where,
        include: {
          modules: {
            orderBy: { order: 'asc' },
            select: { 
              id: true, 
              title: true, 
              description: true,
              content: true,
              videoUrl: true,
              duration: true, 
              order: true,
              courseId: true,
            },
          },
          _count: { select: { modules: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return courses;
    },
    CACHE_TTL.LONG 
  );
}

export async function getCourseById(id: string) {
  if (shouldUseStaticData()) {
    const course = staticCourses.find(c => c.id === id && c.isPublished);
    if (!course) return null;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      level: course.level,
      duration: course.duration,
      isPublished: course.isPublished,
      createdBy: course.createdBy,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      modules: course.modules,
      _count: { modules: course.modules.length },
    };
  }

  const cacheKey = `${CACHE_KEYS.COURSES}_${id}`;
  
  return cachedFetch(
    cacheKey,
    async () => {
      const course = await db.course.findFirst({
        where: { id, isPublished: true },
        include: {
          modules: { orderBy: { order: 'asc' } },
          _count: { select: { modules: true } },
        },
      });
      return course;
    },
    CACHE_TTL.LONG
  );
}

export async function getModuleById(id: string) {
  if (shouldUseStaticData()) {
    for (const course of staticCourses) {
      const moduleData = course.modules.find(m => m.id === id);
      if (moduleData) return moduleData;
    }
    return null;
  }

  const cacheKey = `module_${id}`;
  
  return cachedFetch(
    cacheKey,
    async () => {
      return await db.module.findUnique({ where: { id } });
    },
    CACHE_TTL.LONG
  );
}

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

  return cachedFetch(
    CACHE_KEYS.QUIZZES,
    async () => {
      
      runMigrations().catch(() => {});
      runCleanupInBackground();

      return await db.quiz.findMany({
        where: { isPublished: true },
        include: { _count: { select: { questions: true } } },
        orderBy: { createdAt: 'desc' },
      });
    },
    CACHE_TTL.LONG
  );
}

export async function getQuizById(id: string) {
  if (shouldUseStaticData()) {
    const quiz = staticQuizzes.find(q => q.id === id && q.isPublished);
    if (!quiz) return null;
    
    return { ...quiz, questionCount: quiz.questions.length };
  }

  const cacheKey = `quiz_${id}`;
  
  return cachedFetch(
    cacheKey,
    async () => {
      
      await runMigrations();

      const quiz = await db.quiz.findFirst({
        where: { id, isPublished: true },
        include: {
          questions: { orderBy: { order: 'asc' } },
          _count: { select: { questions: true } },
        },
      });
      if (!quiz) return null;
      return { ...quiz, questionCount: quiz._count.questions };
    },
    CACHE_TTL.MEDIUM
  );
}

export async function getUserByEmail(email: string) {
  if (shouldUseStaticData()) {
    
    return findUserByEmailFromAll(email);
  }

  const cacheKey = `${CACHE_KEYS.USER_PREFIX}email_${email}`;
  
  return cachedFetch(
    cacheKey,
    async () => {
      return await db.user.findUnique({ where: { email } });
    },
    CACHE_TTL.SHORT
  );
}

export async function getUserById(id: string) {
  if (shouldUseStaticData()) {
    
    return findUserByIdFromAll(id);
  }

  const cacheKey = `${CACHE_KEYS.USER_PREFIX}id_${id}`;
  
  return cachedFetch(
    cacheKey,
    async () => {
      return await db.user.findUnique({ where: { id } });
    },
    CACHE_TTL.SHORT
  );
}

export async function createUser(data: { name: string; email: string; password?: string; role: string; image?: string | null; emailVerified?: Date | null }) {
  if (shouldUseStaticData()) {
    
    const existing = findUserByEmailFromAll(data.email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password, 
      role: data.role,
      image: data.image || null,
      emailVerified: data.emailVerified || new Date(),
    };
    
    
    addRegisteredUser(newUser);
    
    console.log('[DataService] Created new user in static mode:', data.email);
    
    return {
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    const user = await db.user.create({ 
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        image: data.image || null,
        emailVerified: data.emailVerified || new Date(), 
      }
    });
    
    
    invalidateCachePattern(CACHE_KEYS.USER_PREFIX);
    
    return user;
  } catch (error) {
    console.error('[DataService] createUser error:', error);
    
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
    
    return { id, ...data, updatedAt: new Date() };
  }

  try {
    const user = await db.user.update({ where: { id }, data });
    
    
    invalidateCachePattern(CACHE_KEYS.USER_PREFIX);
    
    return user;
  } catch (error) {
    console.error('[DataService] updateUser error:', error);
    return { id, ...data, updatedAt: new Date() };
  }
}

export async function getDashboardStats() {
  if (shouldUseStaticData()) {
    return {
      totalCourses: staticCourses.length,
      totalQuizzes: staticQuizzes.length,
      totalModules: staticCourses.reduce((acc, c) => acc + c.modules.length, 0),
      categories: [...new Set(staticCourses.map(c => c.category).filter(Boolean))],
    };
  }

  return cachedFetch(
    CACHE_KEYS.DASHBOARD_STATS,
    async () => {
      const [totalCourses, totalQuizzes, totalModules] = await Promise.all([
        db.course.count({ where: { isPublished: true } }),
        db.quiz.count({ where: { isPublished: true } }),
        db.module.count(),
      ]);

      return { totalCourses, totalQuizzes, totalModules };
    },
    CACHE_TTL.MEDIUM
  );
}
