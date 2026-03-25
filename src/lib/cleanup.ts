import { db } from '@/lib/db';

// Courses to remove
const COURSES_TO_REMOVE = [
  'Personal Finance Full Course',
  'World History Full Course',
  'Economics Full Course',
  'English Grammar Full Course',
  'Chemistry Full Course',
  'Physics Full Course',
  'Algebra Full Course',
];

// Quizzes to ensure exist (title -> data mapping)
const QUIZZES_TO_SEED = [
  {
    title: 'HTML & CSS Fundamentals Quiz',
    description: 'Test your web development knowledge',
    category: 'Web Development',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'What does HTML stand for?', optionA: 'Hyper Text Markup Language', optionB: 'High Tech Modern Language', optionC: 'Hyper Transfer Markup Language', optionD: 'Home Tool Markup Language', correctAnswer: 'A', explanation: 'HTML stands for Hyper Text Markup Language.', points: 1, order: 1 },
      { question: 'Which CSS property changes text color?', optionA: 'text-color', optionB: 'font-color', optionC: 'color', optionD: 'text-style', correctAnswer: 'C', explanation: 'The "color" property sets text color.', points: 1, order: 2 },
      { question: 'What tag creates the largest heading?', optionA: '<heading>', optionB: '<h6>', optionC: '<h1>', optionD: '<head>', correctAnswer: 'C', explanation: '<h1> defines the largest heading.', points: 1, order: 3 },
      { question: 'How do you select an element with id "main"?', optionA: '.main', optionB: '#main', optionC: 'main', optionD: '*main', correctAnswer: 'B', explanation: '# is used to select elements by id.', points: 1, order: 4 },
      { question: 'What creates a flexbox container?', optionA: 'display: block', optionB: 'display: flex', optionC: 'display: grid', optionD: 'display: inline', correctAnswer: 'B', explanation: 'display: flex creates a flexbox container.', points: 1, order: 5 }
    ]
  },
  {
    title: 'Calculus Fundamentals Quiz',
    description: 'Test your calculus knowledge',
    category: 'Mathematics',
    difficulty: 'intermediate',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'What is the derivative of x²?', optionA: 'x', optionB: '2x', optionC: '2x²', optionD: 'x²', correctAnswer: 'B', explanation: 'The derivative of x² is 2x.', points: 1, order: 1 },
      { question: 'What is the limit of 1/x as x approaches infinity?', optionA: '1', optionB: '0', optionC: 'Infinity', optionD: 'Undefined', correctAnswer: 'B', explanation: 'As x gets very large, 1/x approaches 0.', points: 1, order: 2 },
      { question: 'What is the integral of 1?', optionA: '0', optionB: '1', optionC: 'x + C', optionD: 'C', correctAnswer: 'C', explanation: 'The integral of 1 with respect to x is x + C.', points: 1, order: 3 },
      { question: 'What is the derivative of sin(x)?', optionA: 'cos(x)', optionB: '-cos(x)', optionC: '-sin(x)', optionD: 'tan(x)', correctAnswer: 'A', explanation: 'The derivative of sin(x) is cos(x).', points: 1, order: 4 },
      { question: 'What does the integral represent?', optionA: 'Rate of change', optionB: 'Area under a curve', optionC: 'Slope of a line', optionD: 'Maximum value', correctAnswer: 'B', explanation: 'Integrals represent the area under a curve.', points: 1, order: 5 }
    ]
  },
  {
    title: 'Biology Fundamentals Quiz',
    description: 'Test your biology knowledge',
    category: 'Science',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'What is the powerhouse of the cell?', optionA: 'Nucleus', optionB: 'Mitochondria', optionC: 'Ribosome', optionD: 'Golgi apparatus', correctAnswer: 'B', explanation: 'Mitochondria produce energy (ATP) for the cell.', points: 1, order: 1 },
      { question: 'What molecule carries genetic information?', optionA: 'RNA', optionB: 'Protein', optionC: 'DNA', optionD: 'Carbohydrate', correctAnswer: 'C', explanation: 'DNA carries genetic information in cells.', points: 1, order: 2 },
      { question: 'What is photosynthesis?', optionA: 'Breaking down glucose', optionB: 'Converting light to chemical energy', optionC: 'Cell division', optionD: 'Protein synthesis', correctAnswer: 'B', explanation: 'Photosynthesis converts light energy into chemical energy (glucose).', points: 1, order: 3 },
      { question: 'How many chromosomes do humans have?', optionA: '23', optionB: '46', optionC: '48', optionD: '44', correctAnswer: 'B', explanation: 'Humans have 46 chromosomes (23 pairs).', points: 1, order: 4 },
      { question: 'What is the basic unit of life?', optionA: 'Atom', optionB: 'Molecule', optionC: 'Cell', optionD: 'Organ', correctAnswer: 'C', explanation: 'The cell is the basic unit of life.', points: 1, order: 5 }
    ]
  },
  {
    title: 'Psychology Fundamentals Quiz',
    description: 'Test your psychology knowledge',
    category: 'Psychology',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'Who is considered the father of psychoanalysis?', optionA: 'Carl Jung', optionB: 'B.F. Skinner', optionC: 'Sigmund Freud', optionD: 'William James', correctAnswer: 'C', explanation: 'Sigmund Freud is considered the father of psychoanalysis.', points: 1, order: 1 },
      { question: 'What is classical conditioning?', optionA: 'Learning through rewards', optionB: 'Learning through association', optionC: 'Learning through observation', optionD: 'Learning through practice', correctAnswer: 'B', explanation: 'Classical conditioning is learning through association (Pavlov).', points: 1, order: 2 },
      { question: 'What does IQ stand for?', optionA: 'Intelligence Quality', optionB: 'Intelligence Quotient', optionC: 'Intellectual Quality', optionD: 'Intellectual Quotient', correctAnswer: 'B', explanation: 'IQ stands for Intelligence Quotient.', points: 1, order: 3 },
      { question: 'What part of the brain controls memory?', optionA: 'Cerebellum', optionB: 'Hippocampus', optionC: 'Amygdala', optionD: 'Brainstem', correctAnswer: 'B', explanation: 'The hippocampus is essential for memory formation.', points: 1, order: 4 },
      { question: 'What is cognitive dissonance?', optionA: 'Mental conflict from contradictory beliefs', optionB: 'A type of memory loss', optionC: 'A sleep disorder', optionD: 'A learning disability', correctAnswer: 'A', explanation: 'Cognitive dissonance is mental discomfort from holding contradictory beliefs.', points: 1, order: 5 }
    ]
  },
  {
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your JavaScript knowledge',
    category: 'Programming',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'Which keyword declares a constant in JavaScript?', optionA: 'var', optionB: 'let', optionC: 'const', optionD: 'constant', correctAnswer: 'C', explanation: 'const declares a constant in JavaScript.', points: 1, order: 1 },
      { question: 'What does === compare?', optionA: 'Value only', optionB: 'Type only', optionC: 'Value and type', optionD: 'Reference only', correctAnswer: 'C', explanation: '=== compares both value and type (strict equality).', points: 1, order: 2 },
      { question: 'What is an arrow function?', optionA: 'A function with arrow syntax', optionB: 'A function that returns arrows', optionC: 'A loop structure', optionD: 'A variable type', correctAnswer: 'A', explanation: 'Arrow functions use => syntax for concise function expressions.', points: 1, order: 3 },
      { question: 'What method adds an element to the end of an array?', optionA: 'pop()', optionB: 'push()', optionC: 'shift()', optionD: 'unshift()', correctAnswer: 'B', explanation: 'push() adds elements to the end of an array.', points: 1, order: 4 },
      { question: 'What is the DOM?', optionA: 'Document Object Model', optionB: 'Data Object Model', optionC: 'Document Oriented Model', optionD: 'Digital Object Model', correctAnswer: 'A', explanation: 'DOM stands for Document Object Model.', points: 1, order: 5 }
    ]
  },
  {
    title: 'Python Fundamentals Quiz',
    description: 'Test your Python knowledge',
    category: 'Programming',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'How do you start a comment in Python?', optionA: '//', optionB: '/*', optionC: '#', optionD: '--', correctAnswer: 'C', explanation: 'In Python, comments start with #.', points: 1, order: 1 },
      { question: 'What is the correct way to create a list in Python?', optionA: 'list = {}', optionB: 'list = []', optionC: 'list = ()', optionD: 'list = ""', correctAnswer: 'B', explanation: 'Lists in Python are created with square brackets [].', points: 1, order: 2 },
      { question: 'What keyword is used to define a function in Python?', optionA: 'function', optionB: 'func', optionC: 'def', optionD: 'define', correctAnswer: 'C', explanation: 'def is used to define functions in Python.', points: 1, order: 3 },
      { question: 'What is the output of print(2 ** 3)?', optionA: '6', optionB: '8', optionC: '5', optionD: '9', correctAnswer: 'B', explanation: '2 ** 3 = 2³ = 8 (exponentiation).', points: 1, order: 4 },
      { question: 'Which data type is immutable in Python?', optionA: 'List', optionB: 'Dictionary', optionC: 'Tuple', optionD: 'Set', correctAnswer: 'C', explanation: 'Tuples are immutable in Python.', points: 1, order: 5 }
    ]
  },
  {
    title: 'SQL Fundamentals Quiz',
    description: 'Test your SQL knowledge',
    category: 'Database',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'What does SQL stand for?', optionA: 'Structured Query Language', optionB: 'Simple Query Language', optionC: 'Standard Query Language', optionD: 'System Query Language', correctAnswer: 'A', explanation: 'SQL stands for Structured Query Language.', points: 1, order: 1 },
      { question: 'Which command retrieves data from a database?', optionA: 'GET', optionB: 'FETCH', optionC: 'SELECT', optionD: 'RETRIEVE', correctAnswer: 'C', explanation: 'SELECT is used to retrieve data from a database.', points: 1, order: 2 },
      { question: 'Which JOIN returns all records from both tables?', optionA: 'INNER JOIN', optionB: 'LEFT JOIN', optionC: 'RIGHT JOIN', optionD: 'FULL JOIN', correctAnswer: 'D', explanation: 'FULL JOIN returns all records from both tables.', points: 1, order: 3 },
      { question: 'What clause filters results in a SELECT statement?', optionA: 'FILTER', optionB: 'WHERE', optionC: 'CHECK', optionD: 'VALIDATE', correctAnswer: 'B', explanation: 'WHERE clause filters results in SQL.', points: 1, order: 4 },
      { question: 'What does PRIMARY KEY do?', optionA: 'Encrypts data', optionB: 'Creates an index', optionC: 'Uniquely identifies each record', optionD: 'Sorts records', correctAnswer: 'C', explanation: 'PRIMARY KEY uniquely identifies each record in a table.', points: 1, order: 5 }
    ]
  },
  {
    title: 'Git & GitHub Fundamentals Quiz',
    description: 'Test your Git knowledge',
    category: 'Developer Tools',
    difficulty: 'beginner',
    duration: 15,
    passingScore: 60,
    questions: [
      { question: 'What command creates a new Git repository?', optionA: 'git create', optionB: 'git init', optionC: 'git new', optionD: 'git start', correctAnswer: 'B', explanation: 'git init creates a new Git repository.', points: 1, order: 1 },
      { question: 'What command stages files for commit?', optionA: 'git stage', optionB: 'git add', optionC: 'git prepare', optionD: 'git track', correctAnswer: 'B', explanation: 'git add stages files for commit.', points: 1, order: 2 },
      { question: 'What command creates a new branch?', optionA: 'git new-branch', optionB: 'git create-branch', optionC: 'git branch <name>', optionD: 'git make-branch', correctAnswer: 'C', explanation: 'git branch <name> creates a new branch.', points: 1, order: 3 },
      { question: 'What is a pull request?', optionA: 'A request to download code', optionB: 'A request to merge changes', optionC: 'A request to delete code', optionD: 'A request to fork a repository', correctAnswer: 'B', explanation: 'A pull request is a request to merge changes into a branch.', points: 1, order: 4 },
      { question: 'What command shows commit history?', optionA: 'git history', optionB: 'git commits', optionC: 'git log', optionD: 'git show', correctAnswer: 'C', explanation: 'git log shows the commit history.', points: 1, order: 5 }
    ]
  }
];

let cleanupDone = false;

export async function runCleanupIfNeeded(): Promise<void> {
  // Only run once per server instance
  if (cleanupDone) return;
  
  try {
    // Run course cleanup
    await runCourseCleanup();
    
    // Ensure quizzes exist
    await ensureQuizzesExist();
    
    cleanupDone = true;
  } catch (error) {
    console.error('Cleanup error (non-fatal):', error);
    cleanupDone = true; // Don't retry on error
  }
}

async function runCourseCleanup(): Promise<void> {
  // Quick check if cleanup is needed
  const coursesCount = await db.course.count({
    where: {
      title: { in: COURSES_TO_REMOVE }
    }
  });
  
  if (coursesCount === 0) {
    return;
  }
  
  console.log('🧹 Running course cleanup...');
  
  for (const courseTitle of COURSES_TO_REMOVE) {
    const course = await db.course.findFirst({
      where: { title: courseTitle },
      include: { modules: true }
    });
    
    if (course) {
      console.log(`Removing: ${courseTitle}`);
      
      // Delete module progress
      for (const courseModule of course.modules) {
        await db.moduleProgress.deleteMany({
          where: { moduleId: courseModule.id }
        }).catch(() => {});
      }
      
      // Delete course progress
      await db.courseProgress.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete modules
      await db.module.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete related quizzes
      const quizzes = await db.quiz.findMany({
        where: { courseId: course.id }
      });
      
      for (const quiz of quizzes) {
        await db.question.deleteMany({
          where: { quizId: quiz.id }
        }).catch(() => {});
        await db.quizAttempt.deleteMany({
          where: { quizId: quiz.id }
        }).catch(() => {});
      }
      
      await db.quiz.deleteMany({
        where: { courseId: course.id }
      }).catch(() => {});
      
      // Delete the course
      await db.course.delete({
        where: { id: course.id }
      }).catch(() => {});
      
      console.log(`✅ Removed: ${courseTitle}`);
    }
  }
  
  console.log('✅ Course cleanup complete');
}

async function ensureQuizzesExist(): Promise<void> {
  try {
    // Check how many quizzes exist
    const existingCount = await db.quiz.count();
    
    // If we have all 8 quizzes, we're good
    if (existingCount >= QUIZZES_TO_SEED.length) {
      return;
    }
    
    console.log('📝 Seeding quizzes...');
    
    // Get admin user for createdBy
    const adminUser = await db.user.findFirst({
      where: { role: 'admin' }
    });
    
    if (!adminUser) {
      console.log('⚠️ No admin user found, skipping quiz seeding');
      return;
    }
    
    // Get all courses for linking
    const courses = await db.course.findMany();
    
    // Map categories to courses
    const categoryToCourse = new Map<string, string>();
    for (const course of courses) {
      if (course.category) {
        categoryToCourse.set(course.category, course.id);
      }
    }
    
    for (const quizData of QUIZZES_TO_SEED) {
      // Check if quiz already exists
      const existing = await db.quiz.findFirst({
        where: { title: quizData.title }
      });
      
      if (existing) {
        continue; // Skip if already exists
      }
      
      // Find matching course by category
      const courseId = categoryToCourse.get(quizData.category) || null;
      
      // Create quiz with questions
      await db.quiz.create({
        data: {
          title: quizData.title,
          description: quizData.description,
          category: quizData.category,
          difficulty: quizData.difficulty,
          duration: quizData.duration,
          passingScore: quizData.passingScore,
          isPublished: true,
          courseId: courseId,
          createdBy: adminUser.id,
          questions: {
            create: quizData.questions
          }
        }
      });
      
      console.log(`✅ Created quiz: ${quizData.title}`);
    }
    
    console.log('✅ Quiz seeding complete');
  } catch (error) {
    console.error('Quiz seeding error:', error);
  }
}
