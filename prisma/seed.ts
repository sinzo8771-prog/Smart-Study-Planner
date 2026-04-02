import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env'), override: true });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  let adminUser = await prisma.user.findUnique({
    where: { email: 'admin@smartstudy.com' }
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Admin@123456', SALT_ROUNDS);
    adminUser = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@smartstudy.com',
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      }
    });
    console.log('✅ Created admin user');
  } else {
    console.log('⏭️ Admin user already exists');
  }

  // Create student users
  const studentUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'Student@123' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'Student@123' },
  ];

  for (const studentData of studentUsers) {
    const existingStudent = await prisma.user.findUnique({
      where: { email: studentData.email }
    });
    if (!existingStudent) {
      const hashedPassword = await bcrypt.hash(studentData.password, SALT_ROUNDS);
      await prisma.user.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          password: hashedPassword,
          role: 'student',
          emailVerified: new Date(),
        }
      });
      console.log(`✅ Created student: ${studentData.email}`);
    }
  }

  // Clear existing data
  console.log('\n🗑️ Clearing existing data...');
  await prisma.moduleProgress.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quiz.deleteMany();
  console.log('✅ Cleared existing data');

  // Courses - Mix of Tech and Non-Tech with verified YouTube videos
  const coursesData = [
    // NON-TECH COURSES
    {
      title: 'Calculus 1 Full Course',
      description: 'Learn calculus from scratch. Understand limits, derivatives, and integrals with clear explanations.',
      thumbnail: 'https://i.ytimg.com/vi/HfACrKJ_Y2w/maxresdefault.jpg',
      category: 'Mathematics',
      level: 'intermediate',
      duration: 600,
      isPublished: true,
      modules: [
        {
          title: 'Calculus 1 - Complete Course',
          description: 'Full calculus 1 course for beginners',
          videoUrl: 'https://www.youtube-nocookie.com/embed/HfACrKJ_Y2w',
          content: `# Calculus 1 Full Course

Learn calculus step by step.

## What You'll Learn
- Limits and Continuity
- Derivatives
- Differentiation Rules
- Applications of Derivatives
- Integrals`,
          duration: 360,
          order: 1
        }
      ]
    },

    {
      title: 'Biology Full Course',
      description: 'Explore the science of life. Learn about cells, genetics, evolution, and human biology.',
      thumbnail: 'https://i.ytimg.com/vi/QnQe0xW_JY4/maxresdefault.jpg',
      category: 'Science',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'Biology - Complete Course',
          description: 'Full biology course covering life sciences',
          videoUrl: 'https://www.youtube-nocookie.com/embed/QnQe0xW_JY4',
          content: `# Biology Full Course

Study the science of life.

## Topics Covered
- Cell Biology
- Genetics and DNA
- Evolution
- Ecology
- Human Anatomy`,
          duration: 300,
          order: 1
        }
      ]
    },



    {
      title: 'Psychology Full Course',
      description: 'Understand human behavior and the mind. Learn about cognitive processes and mental health.',
      thumbnail: 'https://i.ytimg.com/vi/vo4pMVb0R6M/maxresdefault.jpg',
      category: 'Psychology',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'Introduction to Psychology',
          description: 'Complete psychology course',
          videoUrl: 'https://www.youtube-nocookie.com/embed/vo4pMVb0R6M',
          content: `# Psychology Full Course

Explore the human mind and behavior.

## What You'll Learn
- History of Psychology
- Learning and Memory
- Developmental Psychology
- Social Psychology
- Mental Health`,
          duration: 360,
          order: 1
        }
      ]
    },
    // TECH COURSES
    {
      title: 'HTML & CSS Full Course',
      description: 'Learn HTML and CSS from scratch. Build real websites and master responsive design.',
      thumbnail: 'https://i.ytimg.com/vi/kUMe1FH4CHE/maxresdefault.jpg',
      category: 'Web Development',
      level: 'beginner',
      duration: 360,
      isPublished: true,
      modules: [
        {
          title: 'HTML & CSS Full Course - Beginner to Pro',
          description: 'Complete HTML and CSS tutorial',
          videoUrl: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE',
          content: `# HTML & CSS Full Course

Learn web development from scratch.

## What You'll Learn
- HTML structure
- CSS styling
- Responsive design
- Flexbox and Grid`,
          duration: 120,
          order: 1
        }
      ]
    },
    {
      title: 'JavaScript Full Course',
      description: 'Master JavaScript from basics to advanced. Learn ES6+, DOM manipulation, async programming.',
      thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
      category: 'Programming',
      level: 'beginner',
      duration: 480,
      isPublished: true,
      modules: [
        {
          title: 'JavaScript Tutorial for Beginners',
          description: 'Complete JavaScript course',
          videoUrl: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg',
          content: `# JavaScript Full Course

Master JavaScript programming.

## Topics
- Variables and Data Types
- Functions
- DOM Manipulation
- Async JavaScript`,
          duration: 180,
          order: 1
        }
      ]
    },
    {
      title: 'Python Full Course',
      description: 'Learn Python programming from scratch. Master basics and build practical projects.',
      thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg',
      category: 'Programming',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'Python for Beginners - Full Course',
          description: 'Complete Python tutorial',
          videoUrl: 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw',
          content: `# Python Full Course

Learn Python from scratch.

## What You'll Learn
- Python basics
- Functions and modules
- OOP
- Projects`,
          duration: 240,
          order: 1
        }
      ]
    },
    {
      title: 'SQL Full Course',
      description: 'Learn SQL from scratch. Master database design and queries.',
      thumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
      category: 'Database',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'SQL Full Course for Beginners',
          description: 'Complete SQL tutorial',
          videoUrl: 'https://www.youtube-nocookie.com/embed/HXV3zeQKqGY',
          content: `# SQL Full Course

Learn database management.

## Topics
- SQL fundamentals
- Joins
- Database design`,
          duration: 240,
          order: 1
        }
      ]
    },
    {
      title: 'Git & GitHub Full Course',
      description: 'Master version control with Git and GitHub. Learn collaboration and branching.',
      thumbnail: 'https://i.ytimg.com/vi/RGOj5yH7evk/maxresdefault.jpg',
      category: 'Developer Tools',
      level: 'beginner',
      duration: 420,
      isPublished: true,
      modules: [
        {
          title: 'Git and GitHub for Beginners',
          description: 'Complete Git tutorial',
          videoUrl: 'https://www.youtube-nocookie.com/embed/RGOj5yH7evk',
          content: `# Git & GitHub Full Course

Master version control.

## Topics
- Git basics
- Branching
- Pull requests`,
          duration: 180,
          order: 1
        }
      ]
    }
  ];

  // Create courses
  console.log('\n📚 Creating courses...');
  for (const courseData of coursesData) {
    const { modules, ...courseInfo } = courseData;
    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        createdBy: adminUser.id,
        modules: { create: modules }
      },
      include: { modules: true }
    });
    console.log(`✅ Created: ${course.title}`);
  }

  // Create quizzes
  console.log('\n📝 Creating quizzes...');
  const quizzesData = [
    {
      title: 'HTML & CSS Quiz',
      description: 'Test web development knowledge',
      category: 'Web Development',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'What does HTML stand for?', optionA: 'Hyper Text Markup Language', optionB: 'High Tech Modern Language', optionC: 'Hyper Transfer Language', optionD: 'Home Tool Language', correctAnswer: 'A', explanation: 'HTML = Hyper Text Markup Language', points: 1, order: 1 },
        { question: 'CSS property for text color?', optionA: 'text-color', optionB: 'font-color', optionC: 'color', optionD: 'text-style', correctAnswer: 'C', explanation: 'Use "color" property', points: 1, order: 2 },
        { question: 'Largest heading tag?', optionA: '<heading>', optionB: '<h6>', optionC: '<h1>', optionD: '<head>', correctAnswer: 'C', explanation: '<h1> is largest', points: 1, order: 3 },
        { question: 'Select by id "main"?', optionA: '.main', optionB: '#main', optionC: 'main', optionD: '*main', correctAnswer: 'B', explanation: '# for id selector', points: 1, order: 4 },
        { question: 'Create flexbox container?', optionA: 'display: block', optionB: 'display: flex', optionC: 'display: grid', optionD: 'display: inline', correctAnswer: 'B', explanation: 'display: flex', points: 1, order: 5 }
      ]
    },
    // ADDITIONAL QUIZZES
    {
      title: 'Calculus Fundamentals Quiz',
      description: 'Test your calculus knowledge',
      category: 'Mathematics',
      difficulty: 'intermediate',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'What is the derivative of x²?', optionA: 'x', optionB: '2x', optionC: '2x²', optionD: 'x²', correctAnswer: 'B', explanation: 'The derivative of x² is 2x', points: 1, order: 1 },
        { question: 'Limit of 1/x as x→∞?', optionA: '1', optionB: '0', optionC: '∞', optionD: 'Undefined', correctAnswer: 'B', explanation: 'As x gets large, 1/x approaches 0', points: 1, order: 2 },
        { question: 'Integral of 1?', optionA: '0', optionB: '1', optionC: 'x + C', optionD: 'C', correctAnswer: 'C', explanation: 'Integral of 1 dx is x + C', points: 1, order: 3 },
        { question: 'Derivative of sin(x)?', optionA: 'cos(x)', optionB: '-cos(x)', optionC: '-sin(x)', optionD: 'tan(x)', correctAnswer: 'A', explanation: 'Derivative of sin(x) is cos(x)', points: 1, order: 4 },
        { question: 'What does integral represent?', optionA: 'Rate of change', optionB: 'Area under curve', optionC: 'Slope', optionD: 'Maximum', correctAnswer: 'B', explanation: 'Integrals represent area under curves', points: 1, order: 5 }
      ]
    },
    {
      title: 'Biology Fundamentals Quiz',
      description: 'Test your biology knowledge',
      category: 'Science',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Powerhouse of the cell?', optionA: 'Nucleus', optionB: 'Mitochondria', optionC: 'Ribosome', optionD: 'Golgi', correctAnswer: 'B', explanation: 'Mitochondria produce ATP', points: 1, order: 1 },
        { question: 'What carries genetic info?', optionA: 'RNA', optionB: 'Protein', optionC: 'DNA', optionD: 'Carbohydrate', correctAnswer: 'C', explanation: 'DNA carries genetic information', points: 1, order: 2 },
        { question: 'What is photosynthesis?', optionA: 'Breaking glucose', optionB: 'Light to chemical energy', optionC: 'Cell division', optionD: 'Protein synthesis', correctAnswer: 'B', explanation: 'Photosynthesis converts light to glucose', points: 1, order: 3 },
        { question: 'Human chromosomes count?', optionA: '23', optionB: '46', optionC: '48', optionD: '44', correctAnswer: 'B', explanation: 'Humans have 46 chromosomes (23 pairs)', points: 1, order: 4 },
        { question: 'Basic unit of life?', optionA: 'Atom', optionB: 'Molecule', optionC: 'Cell', optionD: 'Organ', correctAnswer: 'C', explanation: 'The cell is the basic unit of life', points: 1, order: 5 }
      ]
    },


    {
      title: 'Psychology Fundamentals Quiz',
      description: 'Test your psychology knowledge',
      category: 'Psychology',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Father of psychoanalysis?', optionA: 'Jung', optionB: 'Skinner', optionC: 'Freud', optionD: 'James', correctAnswer: 'C', explanation: 'Freud founded psychoanalysis', points: 1, order: 1 },
        { question: 'Classical conditioning is?', optionA: 'Learning by rewards', optionB: 'Learning by association', optionC: 'Learning by observation', optionD: 'Learning by practice', correctAnswer: 'B', explanation: 'Pavlovian learning by association', points: 1, order: 2 },
        { question: 'IQ stands for?', optionA: 'Intelligence Quality', optionB: 'Intelligence Quotient', optionC: 'Intellectual Quality', optionD: 'Intellectual Quotient', correctAnswer: 'B', explanation: 'IQ = Intelligence Quotient', points: 1, order: 3 },
        { question: 'Memory brain part?', optionA: 'Cerebellum', optionB: 'Hippocampus', optionC: 'Amygdala', optionD: 'Brainstem', correctAnswer: 'B', explanation: 'Hippocampus controls memory', points: 1, order: 4 },
        { question: 'Cognitive dissonance is?', optionA: 'Conflicting beliefs discomfort', optionB: 'Memory loss', optionC: 'Sleep disorder', optionD: 'Learning disability', correctAnswer: 'A', explanation: 'Mental conflict from contradictory beliefs', points: 1, order: 5 }
      ]
    },
    {
      title: 'JavaScript Fundamentals Quiz',
      description: 'Test your JavaScript knowledge',
      category: 'Programming',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Constant keyword in JS?', optionA: 'var', optionB: 'let', optionC: 'const', optionD: 'constant', correctAnswer: 'C', explanation: 'const declares constants', points: 1, order: 1 },
        { question: '=== compares?', optionA: 'Value only', optionB: 'Type only', optionC: 'Value and type', optionD: 'Reference', correctAnswer: 'C', explanation: '=== is strict equality', points: 1, order: 2 },
        { question: 'Arrow function uses?', optionA: '-> syntax', optionB: '=> syntax', optionC: ':: syntax', optionD: '~ syntax', correctAnswer: 'B', explanation: 'Arrow functions use =>', points: 1, order: 3 },
        { question: 'Add to array end?', optionA: 'pop()', optionB: 'push()', optionC: 'shift()', optionD: 'unshift()', correctAnswer: 'B', explanation: 'push() adds to end', points: 1, order: 4 },
        { question: 'DOM stands for?', optionA: 'Document Object Model', optionB: 'Data Object Model', optionC: 'Document Oriented Model', optionD: 'Digital Object Model', correctAnswer: 'A', explanation: 'DOM = Document Object Model', points: 1, order: 5 }
      ]
    },
    {
      title: 'Python Fundamentals Quiz',
      description: 'Test your Python knowledge',
      category: 'Programming',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Python comment starts with?', optionA: '//', optionB: '/*', optionC: '#', optionD: '--', correctAnswer: 'C', explanation: 'Python uses # for comments', points: 1, order: 1 },
        { question: 'Create list in Python?', optionA: '{}', optionB: '[]', optionC: '()', optionD: '""', correctAnswer: 'B', explanation: 'Lists use square brackets', points: 1, order: 2 },
        { question: 'Function keyword in Python?', optionA: 'function', optionB: 'func', optionC: 'def', optionD: 'define', correctAnswer: 'C', explanation: 'def defines functions', points: 1, order: 3 },
        { question: 'print(2 ** 3) output?', optionA: '6', optionB: '8', optionC: '5', optionD: '9', correctAnswer: 'B', explanation: '2³ = 8', points: 1, order: 4 },
        { question: 'Immutable data type?', optionA: 'List', optionB: 'Dictionary', optionC: 'Tuple', optionD: 'Set', correctAnswer: 'C', explanation: 'Tuples are immutable', points: 1, order: 5 }
      ]
    },
    {
      title: 'SQL Fundamentals Quiz',
      description: 'Test your SQL knowledge',
      category: 'Database',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'SQL stands for?', optionA: 'Structured Query Language', optionB: 'Simple Query Language', optionC: 'Standard Query Language', optionD: 'System Query Language', correctAnswer: 'A', explanation: 'SQL = Structured Query Language', points: 1, order: 1 },
        { question: 'Retrieve data command?', optionA: 'GET', optionB: 'FETCH', optionC: 'SELECT', optionD: 'RETRIEVE', correctAnswer: 'C', explanation: 'SELECT retrieves data', points: 1, order: 2 },
        { question: 'Join all from both tables?', optionA: 'INNER JOIN', optionB: 'LEFT JOIN', optionC: 'RIGHT JOIN', optionD: 'FULL JOIN', correctAnswer: 'D', explanation: 'FULL JOIN returns all records', points: 1, order: 3 },
        { question: 'Filter clause?', optionA: 'FILTER', optionB: 'WHERE', optionC: 'CHECK', optionD: 'VALIDATE', correctAnswer: 'B', explanation: 'WHERE filters results', points: 1, order: 4 },
        { question: 'PRIMARY KEY does?', optionA: 'Encrypts data', optionB: 'Creates index', optionC: 'Unique identifier', optionD: 'Sorts records', correctAnswer: 'C', explanation: 'Primary key uniquely identifies', points: 1, order: 5 }
      ]
    },
    {
      title: 'Git & GitHub Fundamentals Quiz',
      description: 'Test your Git knowledge',
      category: 'Developer Tools',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Create new repo command?', optionA: 'git create', optionB: 'git init', optionC: 'git new', optionD: 'git start', correctAnswer: 'B', explanation: 'git init creates repo', points: 1, order: 1 },
        { question: 'Stage files command?', optionA: 'git stage', optionB: 'git add', optionC: 'git prepare', optionD: 'git track', correctAnswer: 'B', explanation: 'git add stages files', points: 1, order: 2 },
        { question: 'Create branch command?', optionA: 'git new-branch', optionB: 'git create-branch', optionC: 'git branch <name>', optionD: 'git make-branch', correctAnswer: 'C', explanation: 'git branch creates branches', points: 1, order: 3 },
        { question: 'Pull request is?', optionA: 'Download code', optionB: 'Merge request', optionC: 'Delete code', optionD: 'Fork repo', correctAnswer: 'B', explanation: 'PR requests to merge changes', points: 1, order: 4 },
        { question: 'Show commit history?', optionA: 'git history', optionB: 'git commits', optionC: 'git log', optionD: 'git show', correctAnswer: 'C', explanation: 'git log shows history', points: 1, order: 5 }
      ]
    }
  ];

  for (const quizData of quizzesData) {
    const { questions, ...quizInfo } = quizData;
    const quiz = await prisma.quiz.create({
      data: {
        ...quizInfo,
        createdBy: adminUser.id,
        questions: { create: questions }
      },
      include: { questions: true }
    });
    console.log(`✅ Created: ${quiz.title}`);
  }

  console.log('\n🎉 Seed completed!');
  console.log(`📊 ${coursesData.length} courses (3 non-tech + 5 tech)`);
  console.log(`📊 ${quizzesData.length} quizzes`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
