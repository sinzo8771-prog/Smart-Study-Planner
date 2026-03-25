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
      title: 'Algebra Full Course',
      description: 'Master algebra from basics to advanced concepts. Learn equations, functions, polynomials, and problem-solving techniques.',
      thumbnail: 'https://i.ytimg.com/vi/NybHckSEQBI/maxresdefault.jpg',
      category: 'Mathematics',
      level: 'beginner',
      duration: 480,
      isPublished: true,
      modules: [
        {
          title: 'Algebra Basics - What Is Algebra?',
          description: 'Complete algebra tutorial covering all fundamentals',
          videoUrl: 'https://www.youtube-nocookie.com/embed/NybHckSEQBI',
          content: `# Algebra Full Course

Master algebra from the ground up.

## Topics Covered
- Variables and Expressions
- Linear Equations
- Systems of Equations
- Polynomials
- Factoring
- Quadratic Equations`,
          duration: 240,
          order: 1
        }
      ]
    },
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
      title: 'Physics Full Course',
      description: 'Understand the fundamental laws of physics. Learn mechanics, thermodynamics, waves, and more.',
      thumbnail: 'https://i.ytimg.com/vi/ZM8ECpBuQYE/maxresdefault.jpg',
      category: 'Science',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'Motion in a Straight Line - Crash Course Physics',
          description: 'Full physics course covering all major topics',
          videoUrl: 'https://www.youtube-nocookie.com/embed/ZM8ECpBuQYE',
          content: `# Physics Full Course

Explore the laws that govern our universe.

## Topics
- Motion and Kinematics
- Forces and Newton's Laws
- Energy and Work
- Waves and Sound
- Electricity and Magnetism`,
          duration: 300,
          order: 1
        }
      ]
    },
    {
      title: 'Chemistry Full Course',
      description: 'Learn chemistry from atomic structure to organic chemistry. Understand reactions, bonding, and more.',
      thumbnail: 'https://i.ytimg.com/vi/Aoi4j8es4gQ/maxresdefault.jpg',
      category: 'Science',
      level: 'beginner',
      duration: 540,
      isPublished: true,
      modules: [
        {
          title: 'Quantum Numbers and Atomic Orbitals - Chemistry',
          description: 'Full chemistry course for beginners',
          videoUrl: 'https://www.youtube-nocookie.com/embed/Aoi4j8es4gQ',
          content: `# Chemistry Full Course

Discover the science of matter.

## What You'll Learn
- Atomic Structure
- Periodic Table
- Chemical Bonding
- Chemical Reactions
- Acids and Bases`,
          duration: 300,
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
      title: 'English Grammar Full Course',
      description: 'Master English grammar from basics to advanced. Perfect for improving your writing skills.',
      thumbnail: 'https://i.ytimg.com/vi/TsYMJQEtpJU/maxresdefault.jpg',
      category: 'Language',
      level: 'beginner',
      duration: 420,
      isPublished: true,
      modules: [
        {
          title: 'Complete English Grammar - Full Beginner Course',
          description: 'Full English grammar tutorial',
          videoUrl: 'https://www.youtube-nocookie.com/embed/TsYMJQEtpJU',
          content: `# English Grammar Full Course

Master English grammar rules.

## What You'll Learn
- Parts of Speech
- Sentence Structure
- Tenses
- Punctuation
- Common Errors`,
          duration: 240,
          order: 1
        }
      ]
    },
    {
      title: 'World History Full Course',
      description: 'Journey through human history from ancient civilizations to modern times.',
      thumbnail: 'https://i.ytimg.com/vi/xuCn8ux2gbs/maxresdefault.jpg',
      category: 'History',
      level: 'beginner',
      duration: 720,
      isPublished: true,
      modules: [
        {
          title: 'World History - Complete Course',
          description: 'Full world history overview',
          videoUrl: 'https://www.youtube-nocookie.com/embed/xuCn8ux2gbs',
          content: `# World History Full Course

Explore the story of humanity.

## Topics
- Ancient Civilizations
- Classical Period
- Medieval Era
- Renaissance
- Industrial Revolution
- Modern Era`,
          duration: 480,
          order: 1
        }
      ]
    },
    {
      title: 'Economics Full Course',
      description: 'Understand how economies work. Learn microeconomics, macroeconomics, and key principles.',
      thumbnail: 'https://i.ytimg.com/vi/3ez10ADR_gM/maxresdefault.jpg',
      category: 'Economics',
      level: 'beginner',
      duration: 480,
      isPublished: true,
      modules: [
        {
          title: 'Intro to Economics - Crash Course',
          description: 'Full economics course',
          videoUrl: 'https://www.youtube-nocookie.com/embed/3ez10ADR_gM',
          content: `# Economics Full Course

Learn how economies function.

## What You'll Learn
- Supply and Demand
- Market Structures
- GDP and Economic Growth
- Fiscal and Monetary Policy
- International Trade`,
          duration: 300,
          order: 1
        }
      ]
    },
    {
      title: 'Personal Finance Full Course',
      description: 'Learn to manage your money. Budgeting, investing, saving, and building wealth.',
      thumbnail: 'https://i.ytimg.com/vi/NEzqHbtGa9U/maxresdefault.jpg',
      category: 'Finance',
      level: 'beginner',
      duration: 360,
      isPublished: true,
      modules: [
        {
          title: 'How To Manage Your Money - Personal Finance',
          description: 'Full personal finance course',
          videoUrl: 'https://www.youtube-nocookie.com/embed/NEzqHbtGa9U',
          content: `# Personal Finance Full Course

Take control of your financial future.

## Topics
- Budgeting Basics
- Emergency Funds
- Debt Management
- Investing Basics
- Retirement Planning`,
          duration: 240,
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
      title: 'Algebra Fundamentals Quiz',
      description: 'Test your algebra knowledge',
      category: 'Mathematics',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Solve: 2x + 5 = 13', optionA: 'x = 4', optionB: 'x = 5', optionC: 'x = 3', optionD: 'x = 6', correctAnswer: 'A', explanation: '2x = 8, x = 4', points: 1, order: 1 },
        { question: 'What is x² when x = 3?', optionA: '6', optionB: '9', optionC: '3', optionD: '12', correctAnswer: 'B', explanation: '3² = 9', points: 1, order: 2 },
        { question: 'Simplify: 3x + 2x - x', optionA: '5x', optionB: '4x', optionC: '6x', optionD: '3x', correctAnswer: 'B', explanation: '3x + 2x - x = 4x', points: 1, order: 3 },
        { question: 'Slope of y = 2x + 3?', optionA: '3', optionB: '2', optionC: '5', optionD: '1', correctAnswer: 'B', explanation: 'Slope is 2', points: 1, order: 4 },
        { question: 'Factor: x² - 9', optionA: '(x+3)(x-3)', optionB: '(x+9)(x-1)', optionC: '(x-3)²', optionD: '(x+3)²', correctAnswer: 'A', explanation: 'Difference of squares', points: 1, order: 5 }
      ]
    },
    {
      title: 'Physics Fundamentals Quiz',
      description: 'Test your physics knowledge',
      category: 'Science',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'SI unit of force?', optionA: 'Joule', optionB: 'Newton', optionC: 'Watt', optionD: 'Pascal', correctAnswer: 'B', explanation: 'Newton is the SI unit of force', points: 1, order: 1 },
        { question: 'Gravity on Earth?', optionA: '5 m/s²', optionB: '9.8 m/s²', optionC: '15 m/s²', optionD: '1 m/s²', correctAnswer: 'B', explanation: 'g ≈ 9.8 m/s²', points: 1, order: 2 },
        { question: "Newton's First Law describes?", optionA: 'F = ma', optionB: 'Action-reaction', optionC: 'Inertia', optionD: 'Gravity', correctAnswer: 'C', explanation: 'First Law is about inertia', points: 1, order: 3 },
        { question: 'Kinetic energy is?', optionA: 'Energy of position', optionB: 'Energy of motion', optionC: 'Thermal energy', optionD: 'Chemical energy', correctAnswer: 'B', explanation: 'Kinetic = motion energy', points: 1, order: 4 },
        { question: 'Formula for speed?', optionA: 'force × time', optionB: 'distance / time', optionC: 'mass × acceleration', optionD: 'energy / mass', correctAnswer: 'B', explanation: 'Speed = distance/time', points: 1, order: 5 }
      ]
    },
    {
      title: 'Chemistry Basics Quiz',
      description: 'Test your chemistry knowledge',
      category: 'Science',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Atomic number of Carbon?', optionA: '4', optionB: '6', optionC: '12', optionD: '8', correctAnswer: 'B', explanation: 'Carbon has 6 protons', points: 1, order: 1 },
        { question: 'Bond with shared electrons?', optionA: 'Ionic', optionB: 'Covalent', optionC: 'Metallic', optionD: 'Hydrogen', correctAnswer: 'B', explanation: 'Covalent bonds share electrons', points: 1, order: 2 },
        { question: 'Chemical formula for water?', optionA: 'H2O', optionB: 'CO2', optionC: 'NaCl', optionD: 'O2', correctAnswer: 'A', explanation: 'Water is H2O', points: 1, order: 3 },
        { question: 'pH of neutral solution?', optionA: '0', optionB: '7', optionC: '14', optionD: '1', correctAnswer: 'B', explanation: 'pH 7 is neutral', points: 1, order: 4 },
        { question: 'Negative charge particle?', optionA: 'Proton', optionB: 'Neutron', optionC: 'Electron', optionD: 'Nucleus', correctAnswer: 'C', explanation: 'Electrons are negative', points: 1, order: 5 }
      ]
    },
    {
      title: 'English Grammar Quiz',
      description: 'Test your grammar skills',
      category: 'Language',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Which is correct?', optionA: 'Their going', optionB: 'Theyre going', optionC: "They're going", optionD: 'There going', correctAnswer: 'C', explanation: "They're = they are", points: 1, order: 1 },
        { question: 'Past tense of "write"?', optionA: 'writed', optionB: 'wrote', optionC: 'written', optionD: 'writing', correctAnswer: 'B', explanation: 'wrote is past tense', points: 1, order: 2 },
        { question: 'Which is a proper noun?', optionA: 'city', optionB: 'Paris', optionC: 'river', optionD: 'mountain', correctAnswer: 'B', explanation: 'Paris is a specific place', points: 1, order: 3 },
        { question: 'Correct spelling?', optionA: 'accomodate', optionB: 'acommodate', optionC: 'accommodate', optionD: 'acomodate', correctAnswer: 'C', explanation: 'accommodate is correct', points: 1, order: 4 },
        { question: '"Quickly" is what type?', optionA: 'Adjective', optionB: 'Adverb', optionC: 'Verb', optionD: 'Noun', correctAnswer: 'B', explanation: 'Quickly is an adverb', points: 1, order: 5 }
      ]
    },
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
      title: 'World History Quiz',
      description: 'Test your history knowledge',
      category: 'History',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Who built the pyramids?', optionA: 'Romans', optionB: 'Greeks', optionC: 'Egyptians', optionD: 'Mesopotamians', correctAnswer: 'C', explanation: 'Ancient Egyptians built pyramids', points: 1, order: 1 },
        { question: 'When did WWII end?', optionA: '1943', optionB: '1944', optionC: '1945', optionD: '1946', correctAnswer: 'C', explanation: 'WWII ended in 1945', points: 1, order: 2 },
        { question: 'First US President?', optionA: 'Jefferson', optionB: 'Washington', optionC: 'Adams', optionD: 'Franklin', correctAnswer: 'B', explanation: 'George Washington was first', points: 1, order: 3 },
        { question: 'Renaissance began where?', optionA: 'France', optionB: 'England', optionC: 'Italy', optionD: 'Germany', correctAnswer: 'C', explanation: 'Renaissance began in Italy', points: 1, order: 4 },
        { question: 'Trade route East to West?', optionA: 'Silk Road', optionB: 'Spice Route', optionC: 'Gold Trail', optionD: 'Trade Way', correctAnswer: 'A', explanation: 'Silk Road connected East and West', points: 1, order: 5 }
      ]
    },
    {
      title: 'Economics Fundamentals Quiz',
      description: 'Test your economics knowledge',
      category: 'Economics',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Law of supply states?', optionA: 'Price up, supply down', optionB: 'Price up, supply up', optionC: 'Price down, supply up', optionD: 'No effect', correctAnswer: 'B', explanation: 'Higher price, more supply', points: 1, order: 1 },
        { question: 'GDP stands for?', optionA: 'General Domestic Product', optionB: 'Gross Domestic Product', optionC: 'Gross Domestic Profit', optionD: 'General Domestic Profit', correctAnswer: 'B', explanation: 'GDP = Gross Domestic Product', points: 1, order: 2 },
        { question: 'What is inflation?', optionA: 'Price decrease', optionB: 'Price increase over time', optionC: 'Stable prices', optionD: 'Money supply decrease', correctAnswer: 'B', explanation: 'Inflation is rising prices', points: 1, order: 3 },
        { question: 'Opportunity cost is?', optionA: 'Money spent', optionB: 'Next best alternative', optionC: 'Production cost', optionD: 'Total expenses', correctAnswer: 'B', explanation: 'Value of next best alternative', points: 1, order: 4 },
        { question: 'US monetary policy by?', optionA: 'Congress', optionB: 'President', optionC: 'Federal Reserve', optionD: 'Treasury', correctAnswer: 'C', explanation: 'Fed controls monetary policy', points: 1, order: 5 }
      ]
    },
    {
      title: 'Personal Finance Quiz',
      description: 'Test your finance knowledge',
      category: 'Finance',
      difficulty: 'beginner',
      duration: 15,
      passingScore: 60,
      isPublished: true,
      questions: [
        { question: 'Emergency fund is for?', optionA: 'Vacations', optionB: 'Unexpected expenses', optionC: 'Investments', optionD: 'Credit limit', correctAnswer: 'B', explanation: 'Emergency fund = unexpected expenses', points: 1, order: 1 },
        { question: 'Compound interest is?', optionA: 'Interest on principal only', optionB: 'Interest on principal + interest', optionC: 'Fixed rate', optionD: 'Bank interest', correctAnswer: 'B', explanation: 'Interest on accumulated interest', points: 1, order: 2 },
        { question: '401(k) is a?', optionA: 'Loan', optionB: 'Retirement plan', optionC: 'Bank account', optionD: 'Insurance', correctAnswer: 'B', explanation: '401(k) is retirement savings', points: 1, order: 3 },
        { question: 'Emergency fund size?', optionA: '1 month', optionB: '3-6 months', optionC: '1 year', optionD: '2 weeks', correctAnswer: 'B', explanation: '3-6 months expenses recommended', points: 1, order: 4 },
        { question: 'Diversification means?', optionA: 'One stock', optionB: 'Spread investments', optionC: 'All cash', optionD: 'Only bonds', correctAnswer: 'B', explanation: 'Spread investments to reduce risk', points: 1, order: 5 }
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
  console.log(`📊 ${coursesData.length} courses (10 non-tech + 5 tech)`);
  console.log(`📊 ${quizzesData.length} quizzes (one for each course)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
