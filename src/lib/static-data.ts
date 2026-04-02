


export interface StaticUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  image?: string | null;
  emailVerified?: Date | null;
}

export interface StaticCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  category: string | null;
  level: string;
  duration: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  modules: StaticModule[];
}

export interface StaticModule {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  duration: number;
  order: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaticQuiz {
  id: string;
  title: string;
  description: string | null;
  courseId: string | null;
  duration: number;
  passingScore: number;
  isPublished: boolean;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  questions: StaticQuestion[];
}

export interface StaticQuestion {
  id: string;
  quizId: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
  points: number;
  order: number;
  createdAt: Date;
}


export const staticUsers: StaticUser[] = [
  {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@studyplanner.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO',
    role: 'admin',
    emailVerified: new Date(),
  },
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@smartstudy.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO',
    role: 'admin',
    emailVerified: new Date(),
  },
  {
    id: 'demo-user-1',
    name: 'Demo Student',
    email: 'student@demo.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO',
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu',
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu',
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu',
    role: 'student',
    emailVerified: new Date(),
  },
];


export const staticCourses: StaticCourse[] = [
  
  
  
  {
    id: 'course-math-2',
    title: 'Calculus 1 Full Course',
    description: 'Learn calculus from scratch. Understand limits, derivatives, and integrals with clear explanations and examples.',
    thumbnail: 'https://i.ytimg.com/vi/HfACrKJ_Y2w/hqdefault.jpg',
    category: 'Mathematics',
    level: 'intermediate',
    duration: 600,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-math-2-1',
        title: 'Calculus 1 - Complete Course',
        description: 'Full calculus 1 course for beginners',
        content: `# Calculus 1 Full Course

Learn calculus step by step.

## What You'll Learn
- Limits and Continuity
- Derivatives
- Differentiation Rules
- Applications of Derivatives
- Introduction to Integrals
- Fundamental Theorem of Calculus`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/HfACrKJ_Y2w',
        duration: 360,
        order: 1,
        courseId: 'course-math-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },

  {
    id: 'course-sci-3',
    title: 'Biology Full Course',
    description: 'Explore the science of life. Learn about cells, genetics, evolution, ecology, and human biology.',
    thumbnail: 'https://i.ytimg.com/vi/QnQe0xW_JY4/hqdefault.jpg',
    category: 'Science',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-sci-3-1',
        title: 'Biology - Complete Course',
        description: 'Full biology course covering life sciences',
        content: `# Biology Full Course

Study the science of life.

## Topics Covered
- Cell Biology
- Genetics and DNA
- Evolution
- Ecology
- Human Anatomy
- Plant Biology
- Microbiology`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/QnQe0xW_JY4',
        duration: 300,
        order: 1,
        courseId: 'course-sci-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },




  {
    id: 'course-psych-1',
    title: 'Psychology Full Course',
    description: 'Understand human behavior and the mind. Learn about cognitive processes, development, and mental health.',
    thumbnail: 'https://i.ytimg.com/vi/vo4pMVb0R6M/hqdefault.jpg',
    category: 'Psychology',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-psych-1-1',
        title: 'Introduction to Psychology',
        description: 'Complete psychology course',
        content: `# Psychology Full Course

Explore the human mind and behavior.

## What You'll Learn
- History of Psychology
- Research Methods
- Biological Bases of Behavior
- Learning and Memory
- Developmental Psychology
- Social Psychology
- Mental Health`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/vo4pMVb0R6M',
        duration: 360,
        order: 1,
        courseId: 'course-psych-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  
  
  
  {
    id: 'course-tech-1',
    title: 'HTML & CSS Full Course',
    description: 'Learn HTML and CSS from scratch with this comprehensive beginner-friendly course. Build real websites and master responsive design.',
    thumbnail: 'https://i.ytimg.com/vi/kUMe1FH4CHE/hqdefault.jpg',
    category: 'Web Development',
    level: 'beginner',
    duration: 360,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-tech-1-1',
        title: 'HTML & CSS Full Course - Beginner to Pro',
        description: 'Complete HTML and CSS tutorial for beginners',
        content: `# HTML & CSS Full Course

Learn web development from scratch.

## What You'll Learn
- HTML document structure
- CSS styling and selectors
- Responsive design
- Flexbox and Grid
- Real-world projects`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE',
        duration: 120,
        order: 1,
        courseId: 'course-tech-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-tech-2',
    title: 'JavaScript Full Course',
    description: 'Master JavaScript from basics to advanced concepts. Learn modern ES6+ features, DOM manipulation, and async programming.',
    thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/hqdefault.jpg',
    category: 'Programming',
    level: 'beginner',
    duration: 480,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-tech-2-1',
        title: 'JavaScript Tutorial for Beginners',
        description: 'Complete JavaScript course for beginners',
        content: `# JavaScript Full Course

Master JavaScript programming.

## Topics Covered
- Variables and Data Types
- Functions and Arrow Functions
- Objects and Arrays
- DOM Manipulation
- Async JavaScript`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/PkZNo7MFNFg',
        duration: 180,
        order: 1,
        courseId: 'course-tech-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-tech-3',
    title: 'Python Full Course',
    description: 'Learn Python programming from scratch. Master the basics and build practical projects.',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
    category: 'Programming',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-tech-3-1',
        title: 'Python for Beginners - Full Course',
        description: 'Complete Python programming tutorial',
        content: `# Python Full Course

Learn Python from scratch.

## What You'll Learn
- Python basics and setup
- Variables and data types
- Functions and modules
- Object-oriented programming
- Projects`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw',
        duration: 240,
        order: 1,
        courseId: 'course-tech-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-tech-4',
    title: 'SQL Full Course',
    description: 'Learn SQL from scratch. Master database design, queries, and relational database concepts.',
    thumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/hqdefault.jpg',
    category: 'Database',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-tech-4-1',
        title: 'SQL Full Course for Beginners',
        description: 'Complete SQL tutorial',
        content: `# SQL Full Course

Learn SQL and database management.

## Topics
- SQL fundamentals
- SELECT, INSERT, UPDATE, DELETE
- Joins and Relationships
- Database design`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/HXV3zeQKqGY',
        duration: 240,
        order: 1,
        courseId: 'course-tech-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-tech-5',
    title: 'Git & GitHub Full Course',
    description: 'Master version control with Git and GitHub. Learn collaboration, branching, and best practices.',
    thumbnail: 'https://i.ytimg.com/vi/RGOj5yH7evk/hqdefault.jpg',
    category: 'Developer Tools',
    level: 'beginner',
    duration: 420,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-tech-5-1',
        title: 'Git and GitHub for Beginners',
        description: 'Complete Git and GitHub tutorial',
        content: `# Git & GitHub Full Course

Master version control.

## Topics
- Git basics
- Branching and merging
- GitHub collaboration
- Pull requests`,
        videoUrl: 'https://www.youtube-nocookie.com/embed/RGOj5yH7evk',
        duration: 180,
        order: 1,
        courseId: 'course-tech-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];


export const staticQuizzes: StaticQuiz[] = [
  {
    id: 'quiz-tech-1',
    title: 'HTML & CSS Fundamentals Quiz',
    description: 'Test your web development knowledge',
    courseId: 'course-tech-1',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Web Development',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-tech-1-1',
        quizId: 'quiz-tech-1',
        question: 'What does HTML stand for?',
        optionA: 'Hyper Text Markup Language',
        optionB: 'High Tech Modern Language',
        optionC: 'Hyper Transfer Markup Language',
        optionD: 'Home Tool Markup Language',
        correctAnswer: 'A',
        explanation: 'HTML stands for Hyper Text Markup Language.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-1-2',
        quizId: 'quiz-tech-1',
        question: 'Which CSS property changes text color?',
        optionA: 'text-color',
        optionB: 'font-color',
        optionC: 'color',
        optionD: 'text-style',
        correctAnswer: 'C',
        explanation: 'The "color" property sets text color.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-1-3',
        quizId: 'quiz-tech-1',
        question: 'What tag creates the largest heading?',
        optionA: '<heading>',
        optionB: '<h6>',
        optionC: '<h1>',
        optionD: '<head>',
        correctAnswer: 'C',
        explanation: '<h1> defines the largest heading.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-1-4',
        quizId: 'quiz-tech-1',
        question: 'How do you select an element with id "main"?',
        optionA: '.main',
        optionB: '#main',
        optionC: 'main',
        optionD: '*main',
        correctAnswer: 'B',
        explanation: '# is used to select elements by id.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-1-5',
        quizId: 'quiz-tech-1',
        question: 'What creates a flexbox container?',
        optionA: 'display: block',
        optionB: 'display: flex',
        optionC: 'display: grid',
        optionD: 'display: inline',
        correctAnswer: 'B',
        explanation: 'display: flex creates a flexbox container.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  
  
  
  {
    id: 'quiz-math-2',
    title: 'Calculus Fundamentals Quiz',
    description: 'Test your calculus knowledge',
    courseId: 'course-math-2',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Mathematics',
    difficulty: 'intermediate',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-math-2-1',
        quizId: 'quiz-math-2',
        question: 'What is the derivative of x²?',
        optionA: 'x',
        optionB: '2x',
        optionC: '2x²',
        optionD: 'x²',
        correctAnswer: 'B',
        explanation: 'The derivative of x² is 2x.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-math-2-2',
        quizId: 'quiz-math-2',
        question: 'What is the limit of 1/x as x approaches infinity?',
        optionA: '1',
        optionB: '0',
        optionC: 'Infinity',
        optionD: 'Undefined',
        correctAnswer: 'B',
        explanation: 'As x gets very large, 1/x approaches 0.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-math-2-3',
        quizId: 'quiz-math-2',
        question: 'What is the integral of 1?',
        optionA: '0',
        optionB: '1',
        optionC: 'x + C',
        optionD: 'C',
        correctAnswer: 'C',
        explanation: 'The integral of 1 with respect to x is x + C.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-math-2-4',
        quizId: 'quiz-math-2',
        question: 'What is the derivative of sin(x)?',
        optionA: 'cos(x)',
        optionB: '-cos(x)',
        optionC: '-sin(x)',
        optionD: 'tan(x)',
        correctAnswer: 'A',
        explanation: 'The derivative of sin(x) is cos(x).',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-math-2-5',
        quizId: 'quiz-math-2',
        question: 'What does the integral represent?',
        optionA: 'Rate of change',
        optionB: 'Area under a curve',
        optionC: 'Slope of a line',
        optionD: 'Maximum value',
        correctAnswer: 'B',
        explanation: 'Integrals represent the area under a curve.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-sci-3',
    title: 'Biology Fundamentals Quiz',
    description: 'Test your biology knowledge',
    courseId: 'course-sci-3',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Science',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-sci-3-1',
        quizId: 'quiz-sci-3',
        question: 'What is the powerhouse of the cell?',
        optionA: 'Nucleus',
        optionB: 'Mitochondria',
        optionC: 'Ribosome',
        optionD: 'Golgi apparatus',
        correctAnswer: 'B',
        explanation: 'Mitochondria produce energy (ATP) for the cell.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-sci-3-2',
        quizId: 'quiz-sci-3',
        question: 'What molecule carries genetic information?',
        optionA: 'RNA',
        optionB: 'Protein',
        optionC: 'DNA',
        optionD: 'Carbohydrate',
        correctAnswer: 'C',
        explanation: 'DNA carries genetic information in cells.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-sci-3-3',
        quizId: 'quiz-sci-3',
        question: 'What is photosynthesis?',
        optionA: 'Breaking down glucose',
        optionB: 'Converting light to chemical energy',
        optionC: 'Cell division',
        optionD: 'Protein synthesis',
        correctAnswer: 'B',
        explanation: 'Photosynthesis converts light energy into chemical energy (glucose).',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-sci-3-4',
        quizId: 'quiz-sci-3',
        question: 'How many chromosomes do humans have?',
        optionA: '23',
        optionB: '46',
        optionC: '48',
        optionD: '44',
        correctAnswer: 'B',
        explanation: 'Humans have 46 chromosomes (23 pairs).',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-sci-3-5',
        quizId: 'quiz-sci-3',
        question: 'What is the basic unit of life?',
        optionA: 'Atom',
        optionB: 'Molecule',
        optionC: 'Cell',
        optionD: 'Organ',
        correctAnswer: 'C',
        explanation: 'The cell is the basic unit of life.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },



  {
    id: 'quiz-psych-1',
    title: 'Psychology Fundamentals Quiz',
    description: 'Test your psychology knowledge',
    courseId: 'course-psych-1',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Psychology',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-psych-1-1',
        quizId: 'quiz-psych-1',
        question: 'Who is considered the father of psychoanalysis?',
        optionA: 'Carl Jung',
        optionB: 'B.F. Skinner',
        optionC: 'Sigmund Freud',
        optionD: 'William James',
        correctAnswer: 'C',
        explanation: 'Sigmund Freud is considered the father of psychoanalysis.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-psych-1-2',
        quizId: 'quiz-psych-1',
        question: 'What is classical conditioning?',
        optionA: 'Learning through rewards',
        optionB: 'Learning through association',
        optionC: 'Learning through observation',
        optionD: 'Learning through practice',
        correctAnswer: 'B',
        explanation: 'Classical conditioning is learning through association (Pavlov).',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-psych-1-3',
        quizId: 'quiz-psych-1',
        question: 'What does IQ stand for?',
        optionA: 'Intelligence Quality',
        optionB: 'Intelligence Quotient',
        optionC: 'Intellectual Quality',
        optionD: 'Intellectual Quotient',
        correctAnswer: 'B',
        explanation: 'IQ stands for Intelligence Quotient.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-psych-1-4',
        quizId: 'quiz-psych-1',
        question: 'What part of the brain controls memory?',
        optionA: 'Cerebellum',
        optionB: 'Hippocampus',
        optionC: 'Amygdala',
        optionD: 'Brainstem',
        correctAnswer: 'B',
        explanation: 'The hippocampus is essential for memory formation.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-psych-1-5',
        quizId: 'quiz-psych-1',
        question: 'What is cognitive dissonance?',
        optionA: 'Mental conflict from contradictory beliefs',
        optionB: 'A type of memory loss',
        optionC: 'A sleep disorder',
        optionD: 'A learning disability',
        correctAnswer: 'A',
        explanation: 'Cognitive dissonance is mental discomfort from holding contradictory beliefs.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-tech-2',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your JavaScript knowledge',
    courseId: 'course-tech-2',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Programming',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-tech-2-1',
        quizId: 'quiz-tech-2',
        question: 'Which keyword declares a constant in JavaScript?',
        optionA: 'var',
        optionB: 'let',
        optionC: 'const',
        optionD: 'constant',
        correctAnswer: 'C',
        explanation: 'const declares a constant in JavaScript.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-2-2',
        quizId: 'quiz-tech-2',
        question: 'What does === compare?',
        optionA: 'Value only',
        optionB: 'Type only',
        optionC: 'Value and type',
        optionD: 'Reference only',
        correctAnswer: 'C',
        explanation: '=== compares both value and type (strict equality).',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-2-3',
        quizId: 'quiz-tech-2',
        question: 'What is an arrow function?',
        optionA: 'A function with arrow syntax',
        optionB: 'A function that returns arrows',
        optionC: 'A loop structure',
        optionD: 'A variable type',
        correctAnswer: 'A',
        explanation: 'Arrow functions use => syntax for concise function expressions.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-2-4',
        quizId: 'quiz-tech-2',
        question: 'What method adds an element to the end of an array?',
        optionA: 'pop()',
        optionB: 'push()',
        optionC: 'shift()',
        optionD: 'unshift()',
        correctAnswer: 'B',
        explanation: 'push() adds elements to the end of an array.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-2-5',
        quizId: 'quiz-tech-2',
        question: 'What is the DOM?',
        optionA: 'Document Object Model',
        optionB: 'Data Object Model',
        optionC: 'Document Oriented Model',
        optionD: 'Digital Object Model',
        correctAnswer: 'A',
        explanation: 'DOM stands for Document Object Model.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-tech-3',
    title: 'Python Fundamentals Quiz',
    description: 'Test your Python knowledge',
    courseId: 'course-tech-3',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Programming',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-tech-3-1',
        quizId: 'quiz-tech-3',
        question: 'How do you start a comment in Python?',
        optionA: '//',
        optionB: '/*',
        optionC: '#',
        optionD: '--',
        correctAnswer: 'C',
        explanation: 'In Python, comments start with #.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-3-2',
        quizId: 'quiz-tech-3',
        question: 'What is the correct way to create a list in Python?',
        optionA: 'list = {}',
        optionB: 'list = []',
        optionC: 'list = ()',
        optionD: 'list = ""',
        correctAnswer: 'B',
        explanation: 'Lists in Python are created with square brackets [].',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-3-3',
        quizId: 'quiz-tech-3',
        question: 'What keyword is used to define a function in Python?',
        optionA: 'function',
        optionB: 'func',
        optionC: 'def',
        optionD: 'define',
        correctAnswer: 'C',
        explanation: 'def is used to define functions in Python.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-3-4',
        quizId: 'quiz-tech-3',
        question: 'What is the output of print(2 ** 3)?',
        optionA: '6',
        optionB: '8',
        optionC: '5',
        optionD: '9',
        correctAnswer: 'B',
        explanation: '2 ** 3 = 2³ = 8 (exponentiation).',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-3-5',
        quizId: 'quiz-tech-3',
        question: 'Which data type is immutable in Python?',
        optionA: 'List',
        optionB: 'Dictionary',
        optionC: 'Tuple',
        optionD: 'Set',
        correctAnswer: 'C',
        explanation: 'Tuples are immutable in Python.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-tech-4',
    title: 'SQL Fundamentals Quiz',
    description: 'Test your SQL knowledge',
    courseId: 'course-tech-4',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Database',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-tech-4-1',
        quizId: 'quiz-tech-4',
        question: 'What does SQL stand for?',
        optionA: 'Structured Query Language',
        optionB: 'Simple Query Language',
        optionC: 'Standard Query Language',
        optionD: 'System Query Language',
        correctAnswer: 'A',
        explanation: 'SQL stands for Structured Query Language.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-4-2',
        quizId: 'quiz-tech-4',
        question: 'Which command retrieves data from a database?',
        optionA: 'GET',
        optionB: 'FETCH',
        optionC: 'SELECT',
        optionD: 'RETRIEVE',
        correctAnswer: 'C',
        explanation: 'SELECT is used to retrieve data from a database.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-4-3',
        quizId: 'quiz-tech-4',
        question: 'Which JOIN returns all records from both tables?',
        optionA: 'INNER JOIN',
        optionB: 'LEFT JOIN',
        optionC: 'RIGHT JOIN',
        optionD: 'FULL JOIN',
        correctAnswer: 'D',
        explanation: 'FULL JOIN returns all records from both tables.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-4-4',
        quizId: 'quiz-tech-4',
        question: 'What clause filters results in a SELECT statement?',
        optionA: 'FILTER',
        optionB: 'WHERE',
        optionC: 'CHECK',
        optionD: 'VALIDATE',
        correctAnswer: 'B',
        explanation: 'WHERE clause filters results in SQL.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-4-5',
        quizId: 'quiz-tech-4',
        question: 'What does PRIMARY KEY do?',
        optionA: 'Encrypts data',
        optionB: 'Creates an index',
        optionC: 'Uniquely identifies each record',
        optionD: 'Sorts records',
        correctAnswer: 'C',
        explanation: 'PRIMARY KEY uniquely identifies each record in a table.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-tech-5',
    title: 'Git & GitHub Fundamentals Quiz',
    description: 'Test your Git knowledge',
    courseId: 'course-tech-5',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Developer Tools',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-tech-5-1',
        quizId: 'quiz-tech-5',
        question: 'What command creates a new Git repository?',
        optionA: 'git create',
        optionB: 'git init',
        optionC: 'git new',
        optionD: 'git start',
        correctAnswer: 'B',
        explanation: 'git init creates a new Git repository.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-5-2',
        quizId: 'quiz-tech-5',
        question: 'What command stages files for commit?',
        optionA: 'git stage',
        optionB: 'git add',
        optionC: 'git prepare',
        optionD: 'git track',
        correctAnswer: 'B',
        explanation: 'git add stages files for commit.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-5-3',
        quizId: 'quiz-tech-5',
        question: 'What command creates a new branch?',
        optionA: 'git new-branch',
        optionB: 'git create-branch',
        optionC: 'git branch <name>',
        optionD: 'git make-branch',
        correctAnswer: 'C',
        explanation: 'git branch <name> creates a new branch.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-5-4',
        quizId: 'quiz-tech-5',
        question: 'What is a pull request?',
        optionA: 'A request to download code',
        optionB: 'A request to merge changes',
        optionC: 'A request to delete code',
        optionD: 'A request to fork a repository',
        correctAnswer: 'B',
        explanation: 'A pull request is a request to merge changes into a branch.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-tech-5-5',
        quizId: 'quiz-tech-5',
        question: 'What command shows commit history?',
        optionA: 'git history',
        optionB: 'git commits',
        optionC: 'git log',
        optionD: 'git show',
        correctAnswer: 'C',
        explanation: 'git log shows the commit history.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  }
];


const registeredUsers = new Map<string, StaticUser>();

export function addRegisteredUser(user: StaticUser) {
  registeredUsers.set(user.email.toLowerCase(), user);
}

export function findUserByEmailFromAll(email: string): StaticUser | null {
  const normalizedEmail = email.toLowerCase();
  const staticUser = staticUsers.find(u => u.email.toLowerCase() === normalizedEmail);
  if (staticUser) return staticUser;
  const registeredUser = registeredUsers.get(normalizedEmail);
  if (registeredUser) return registeredUser;
  return null;
}

export function findUserByIdFromAll(id: string): StaticUser | null {
  const staticUser = staticUsers.find(u => u.id === id);
  if (staticUser) return staticUser;
  for (const user of registeredUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export function shouldUseStaticData(): boolean {
  if (process.env.USE_STATIC_DATA === 'true') return true;
  if (!process.env.DATABASE_URL) return true;
  return false;
}
