// Static data for Vercel deployment (when database is not available)
// This serves as a fallback for demo purposes

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

// Default users (passwords are bcrypt hashed)
// Admin@123456 hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO
// Student@123 hash: $2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu
export const staticUsers: StaticUser[] = [
  {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@studyplanner.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO', // Admin@123456
    role: 'admin',
    emailVerified: new Date(),
  },
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@smartstudy.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO', // Admin@123456
    role: 'admin',
    emailVerified: new Date(),
  },
  {
    id: 'demo-user-1',
    name: 'Demo Student',
    email: 'student@demo.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Le4XKMqF8GJA8JbLO', // Admin@123456
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu', // Student@123
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu', // Student@123
    role: 'student',
    emailVerified: new Date(),
  },
  {
    id: 'student-3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: '$2b$12$h6VoFnuW7mQDsAfLooZ6kOFdzGf2WcBxiHzZBXKDWvo1toKytqLgu', // Student@123
    role: 'student',
    emailVerified: new Date(),
  },
];

// Sample courses with modules
export const staticCourses: StaticCourse[] = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners who want to start their journey in web development.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    category: 'Programming',
    level: 'beginner',
    duration: 120,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-1-1',
        title: 'Getting Started with HTML',
        description: 'Learn the basics of HTML and document structure',
        content: `# Getting Started with HTML

## What is HTML?

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a series of elements.

## Basic Structure

Every HTML document has a basic structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first web page.</p>
</body>
</html>
\`\`\`

## Key Concepts

- **Elements**: Building blocks of HTML
- **Tags**: Labels that define elements
- **Attributes**: Additional information about elements

## Practice Exercise

Create a simple HTML page with:
1. A heading with your name
2. A paragraph about yourself
3. A list of your hobbies`,
        videoUrl: null,
        duration: 15,
        order: 1,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-2',
        title: 'CSS Fundamentals',
        description: 'Style your web pages with CSS',
        content: `# CSS Fundamentals

## What is CSS?

CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.

## Basic Syntax

\`\`\`css
selector {
    property: value;
}

/* Example */
h1 {
    color: blue;
    font-size: 24px;
}
\`\`\`

## Selectors

- **Element**: \`p { }\`
- **Class**: \`.my-class { }\`
- **ID**: \`#my-id { }\`

## The Box Model

Every element is a box with:
- Content
- Padding
- Border
- Margin`,
        videoUrl: null,
        duration: 20,
        order: 2,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-3',
        title: 'JavaScript Basics',
        description: 'Add interactivity with JavaScript',
        content: `# JavaScript Basics

## What is JavaScript?

JavaScript is a programming language that makes web pages interactive.

## Variables

\`\`\`javascript
// Modern JavaScript
let name = "John";
const age = 25;
\`\`\`

## Functions

\`\`\`javascript
function greet(name) {
    return "Hello, " + name + "!";
}

// Arrow functions
const greetArrow = (name) => \`Hello, \${name}!\`;
\`\`\`

## DOM Manipulation

\`\`\`javascript
const heading = document.querySelector('h1');
heading.textContent = 'New Title';
\`\`\``,
        videoUrl: null,
        duration: 25,
        order: 3,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-4',
        title: 'Building Your First Website',
        description: 'Put it all together',
        content: `# Building Your First Website

## Project Overview

Let's create a personal portfolio page using HTML, CSS, and JavaScript!

## Steps

1. **HTML Structure** - Create sections for header, hero, about, projects, contact
2. **Styling** - Add CSS for responsive layout, colors, typography
3. **Interactivity** - Add JavaScript for mobile menu, smooth scrolling

## Best Practices

1. Mobile-first design
2. Semantic HTML
3. Accessible content
4. Performance optimization`,
        videoUrl: null,
        duration: 30,
        order: 4,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Mathematics: Algebra Fundamentals',
    description: 'Master the basics of algebra including equations, inequalities, and functions. Build a strong foundation for advanced mathematics.',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'Mathematics',
    level: 'beginner',
    duration: 90,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-2-1',
        title: 'Understanding Variables and Expressions',
        description: 'Learn what variables are and how to write algebraic expressions',
        content: `# Variables and Expressions

## What is a Variable?

A variable is a symbol (usually a letter) that represents an unknown number.

**Example**: In \`x + 5\`, x is a variable.

## Evaluating Expressions

To evaluate an expression, substitute the variable with a number.

**Example**: Evaluate \`3x + 2\` when \`x = 4\`

\`3(4) + 2 = 12 + 2 = 14\``,
        videoUrl: null,
        duration: 15,
        order: 1,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-2',
        title: 'Solving Linear Equations',
        description: 'Learn to solve equations with one variable',
        content: `# Solving Linear Equations

## Golden Rule

Whatever you do to one side, you must do to the other!

## Example

Solve: \`2x + 3 = 11\`

\`\`\`
2x + 3 = 11
2x + 3 - 3 = 11 - 3
2x = 8
x = 4
\`\`\``,
        videoUrl: null,
        duration: 20,
        order: 2,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-3',
        title: 'Working with Inequalities',
        description: 'Understand and solve inequalities',
        content: `# Working with Inequalities

## Inequality Symbols

| Symbol | Meaning |
|--------|---------|
| < | Less than |
| > | Greater than |
| ≤ | Less than or equal to |
| ≥ | Greater than or equal to |

## Important Rule

When multiplying or dividing by a negative number, flip the inequality sign!`,
        videoUrl: null,
        duration: 15,
        order: 3,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-4',
        title: 'Introduction to Functions',
        description: 'Learn what functions are and how to use them',
        content: `# Introduction to Functions

## What is a Function?

A function is a relationship where each input has exactly one output.

**Notation**: \`f(x)\` read as "f of x"

## Example

\`f(x) = 2x + 3\`

| x | f(x) |
|---|------|
| 0 | 3 |
| 1 | 5 |
| 2 | 7 |`,
        videoUrl: null,
        duration: 20,
        order: 4,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning basics using Python. Perfect for aspiring data scientists.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'Data Science',
    level: 'intermediate',
    duration: 180,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-3-1',
        title: 'Python for Data Science',
        description: 'Python basics tailored for data science',
        content: `# Python for Data Science

## Essential Libraries

\`\`\`python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
\`\`\`

## Data Types

\`\`\`python
x = 42          # integer
y = 3.14        # float
my_list = [1, 2, 3]  # list
\`\`\``,
        videoUrl: null,
        duration: 20,
        order: 1,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-2',
        title: 'NumPy Fundamentals',
        description: 'Master numerical computing with NumPy',
        content: `# NumPy Fundamentals

## Creating Arrays

\`\`\`python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
zeros = np.zeros(5)
\`\`\`

## Array Operations

\`\`\`python
a = np.array([1, 2, 3])
a + 10  # [11, 12, 13]
a * 2   # [2, 4, 6]
\`\`\``,
        videoUrl: null,
        duration: 25,
        order: 2,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-3',
        title: 'Pandas for Data Analysis',
        description: 'Data manipulation and analysis with Pandas',
        content: `# Pandas for Data Analysis

## DataFrame Basics

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob'],
    'age': [25, 30]
})

df.head()  # First 5 rows
df['name']  # Select column
\`\`\``,
        videoUrl: null,
        duration: 30,
        order: 3,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-4',
        title: 'Data Visualization',
        description: 'Create beautiful visualizations',
        content: `# Data Visualization

## Matplotlib Basics

\`\`\`python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [1, 4, 2])
plt.title('Line Plot')
plt.show()
\`\`\`

## Seaborn

\`\`\`python
import seaborn as sns
sns.histplot(data=df, x='age')
\`\`\``,
        videoUrl: null,
        duration: 25,
        order: 4,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-4',
    title: 'English Writing Skills',
    description: 'Improve your writing with lessons on grammar, essay structure, and creative writing.',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
    category: 'Language',
    level: 'beginner',
    duration: 100,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-4-1',
        title: 'Grammar Essentials',
        description: 'Master the fundamentals of English grammar',
        content: `# Grammar Essentials

## Parts of Speech

| Part | Example |
|------|---------|
| Noun | book, city |
| Verb | run, think |
| Adjective | beautiful |
| Adverb | quickly |

## Common Mistakes

- **Their** = possession
- **There** = place
- **They're** = they are`,
        videoUrl: null,
        duration: 20,
        order: 1,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-2',
        title: 'Essay Structure',
        description: 'Learn to write well-structured essays',
        content: `# Essay Structure

## Five-Paragraph Essay

1. **Introduction** - Hook + thesis
2. **Body 1** - First point
3. **Body 2** - Second point
4. **Body 3** - Third point
5. **Conclusion** - Summary

## Thesis Statement

A good thesis is:
- Specific
- Arguable
- Concise`,
        videoUrl: null,
        duration: 25,
        order: 2,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-3',
        title: 'Creative Writing Basics',
        description: 'Explore creative writing techniques',
        content: `# Creative Writing Basics

## Show, Don't Tell

**Telling**: She was angry.
**Showing**: She slammed the door.

## Strong Verbs

| Weak | Strong |
|------|--------|
| ran quickly | sprinted |
| said softly | whispered |`,
        videoUrl: null,
        duration: 20,
        order: 3,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Physics: Mechanics',
    description: 'Understand motion, forces, and energy. Build a strong foundation in classical mechanics.',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800',
    category: 'Science',
    level: 'intermediate',
    duration: 150,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-5-1',
        title: 'Motion and Kinematics',
        description: 'Learn about motion, speed, velocity',
        content: `# Motion and Kinematics

## Key Concepts

- **Distance**: Total path length
- **Displacement**: Change in position
- **Speed**: Distance/time
- **Velocity**: Displacement/time

## Equations of Motion

\`\`\`
v = u + at
s = ut + ½at²
v² = u² + 2as
\`\`\``,
        videoUrl: null,
        duration: 25,
        order: 1,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-2',
        title: "Newton's Laws of Motion",
        description: "Understand forces and Newton's three laws",
        content: `# Newton's Laws of Motion

## First Law: Inertia

Objects at rest stay at rest unless acted upon.

## Second Law

\`F = ma\`

## Third Law

For every action, there is an equal and opposite reaction.`,
        videoUrl: null,
        duration: 30,
        order: 2,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-3',
        title: 'Work, Energy, and Power',
        description: 'Learn about work, energy, and power',
        content: `# Work, Energy, and Power

## Work

\`W = F × d × cos(θ)\`

## Energy

- **Kinetic Energy**: \`KE = ½mv²\`
- **Potential Energy**: \`PE = mgh\`

## Power

\`P = W/t\` (Watts)`,
        videoUrl: null,
        duration: 30,
        order: 3,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Business Communication',
    description: 'Master professional communication skills for the workplace.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category: 'Business',
    level: 'beginner',
    duration: 80,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-6-1',
        title: 'Professional Email Writing',
        description: 'Write clear, effective business emails',
        content: `# Professional Email Writing

## Email Structure

1. **Subject Line** - Be specific
2. **Greeting** - Dear/Hi [Name]
3. **Body** - Clear and concise
4. **Closing** - Best regards

## Best Practices

- Be concise
- Be clear
- Proofread`,
        videoUrl: null,
        duration: 20,
        order: 1,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-6-2',
        title: 'Business Reports',
        description: 'Create effective business reports',
        content: `# Business Reports

## Structure

1. Executive Summary
2. Introduction
3. Findings
4. Conclusions
5. Recommendations`,
        videoUrl: null,
        duration: 25,
        order: 2,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-6-3',
        title: 'Presentation Skills',
        description: 'Deliver effective presentations',
        content: `# Presentation Skills

## The 10/20/30 Rule

- 10 slides
- 20 minutes
- 30-point font

## Delivery Tips

- Vary your pace
- Make eye contact
- Handle questions confidently`,
        videoUrl: null,
        duration: 20,
        order: 3,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];

// Sample quizzes
export const staticQuizzes: StaticQuiz[] = [
  {
    id: 'quiz-1',
    title: 'Web Development Basics Quiz',
    description: 'Test your knowledge of HTML, CSS, and JavaScript fundamentals',
    courseId: 'course-1',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-1-1',
        quizId: 'quiz-1',
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
        id: 'q-1-2',
        quizId: 'quiz-1',
        question: 'Which CSS property is used to change text color?',
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
        id: 'q-1-3',
        quizId: 'quiz-1',
        question: 'How do you declare a variable in modern JavaScript?',
        optionA: 'variable x = 5',
        optionB: 'let x = 5',
        optionC: 'v x = 5',
        optionD: 'declare x = 5',
        correctAnswer: 'B',
        explanation: '"let" and "const" are modern variable declarations.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-1-4',
        quizId: 'quiz-1',
        question: 'What tag is used for the largest heading in HTML?',
        optionA: '<heading>',
        optionB: '<h6>',
        optionC: '<h1>',
        optionD: '<head>',
        correctAnswer: 'C',
        explanation: '<h1> defines the largest heading.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-1-5',
        quizId: 'quiz-1',
        question: 'Which method selects an element by its ID in JavaScript?',
        optionA: 'document.getElement()',
        optionB: 'document.getElementById()',
        optionC: 'document.querySelector()',
        optionD: 'document.selectById()',
        correctAnswer: 'B',
        explanation: 'document.getElementById() selects by ID.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Algebra Fundamentals Quiz',
    description: 'Test your algebra skills',
    courseId: 'course-2',
    duration: 20,
    passingScore: 70,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-2-1',
        quizId: 'quiz-2',
        question: 'Solve: 2x + 5 = 13',
        optionA: 'x = 4',
        optionB: 'x = 5',
        optionC: 'x = 3',
        optionD: 'x = 6',
        correctAnswer: 'A',
        explanation: '2x + 5 = 13 → 2x = 8 → x = 4',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-2-2',
        quizId: 'quiz-2',
        question: 'What is the value of 3x² when x = 4?',
        optionA: '24',
        optionB: '48',
        optionC: '12',
        optionD: '36',
        correctAnswer: 'B',
        explanation: '3x² = 3(16) = 48',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-2-3',
        quizId: 'quiz-2',
        question: 'Solve: -3x < 15',
        optionA: 'x < -5',
        optionB: 'x > -5',
        optionC: 'x < 5',
        optionD: 'x > 5',
        correctAnswer: 'B',
        explanation: 'Dividing by negative flips the sign: x > -5',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-2-4',
        quizId: 'quiz-2',
        question: 'If f(x) = 2x - 3, what is f(5)?',
        optionA: '7',
        optionB: '10',
        optionC: '13',
        optionD: '5',
        correctAnswer: 'A',
        explanation: 'f(5) = 2(5) - 3 = 7',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-2-5',
        quizId: 'quiz-2',
        question: 'Simplify: 4x + 3x - 2x',
        optionA: '9x',
        optionB: '5x',
        optionC: '6x',
        optionD: '4x',
        correctAnswer: 'B',
        explanation: '4x + 3x - 2x = 5x',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'Physics Mechanics Quiz',
    description: 'Test your understanding of motion, forces, and energy',
    courseId: 'course-5',
    duration: 20,
    passingScore: 60,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-3-1',
        quizId: 'quiz-3',
        question: 'What is the SI unit of force?',
        optionA: 'Joule',
        optionB: 'Newton',
        optionC: 'Watt',
        optionD: 'Pascal',
        correctAnswer: 'B',
        explanation: 'Newton (N) is the SI unit of force.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-3-2',
        quizId: 'quiz-3',
        question: 'A car accelerates from rest at 4 m/s² for 3 seconds. What is its final velocity?',
        optionA: '7 m/s',
        optionB: '12 m/s',
        optionC: '10 m/s',
        optionD: '8 m/s',
        correctAnswer: 'B',
        explanation: 'v = u + at = 0 + 4(3) = 12 m/s',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-3-3',
        quizId: 'quiz-3',
        question: "What does Newton's First Law describe?",
        optionA: 'F = ma',
        optionB: 'Action-reaction pairs',
        optionC: 'Inertia',
        optionD: 'Gravity',
        correctAnswer: 'C',
        explanation: "Newton's First Law describes inertia.",
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-3-4',
        quizId: 'quiz-3',
        question: 'Calculate kinetic energy of a 2 kg object moving at 3 m/s.',
        optionA: '6 J',
        optionB: '9 J',
        optionC: '3 J',
        optionD: '18 J',
        correctAnswer: 'B',
        explanation: 'KE = ½mv² = ½(2)(9) = 9 J',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-3-5',
        quizId: 'quiz-3',
        question: 'What is the acceleration due to gravity on Earth (approximate)?',
        optionA: '5 m/s²',
        optionB: '9.8 m/s²',
        optionC: '15 m/s²',
        optionD: '1 m/s²',
        correctAnswer: 'B',
        explanation: 'Earth\'s gravity is approximately 9.8 m/s².',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-4',
    title: 'Python Data Science Quiz',
    description: 'Test your Python and data science knowledge',
    courseId: 'course-3',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-4-1',
        quizId: 'quiz-4',
        question: 'Which library is used for data manipulation in Python?',
        optionA: 'NumPy',
        optionB: 'Pandas',
        optionC: 'Matplotlib',
        optionD: 'Scikit-learn',
        correctAnswer: 'B',
        explanation: 'Pandas is used for data manipulation.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-4-2',
        quizId: 'quiz-4',
        question: 'What does np.zeros(5) create?',
        optionA: 'A list of 5 zeros',
        optionB: 'An array of 5 zeros',
        optionC: 'A matrix of 5x5 zeros',
        optionD: 'A variable set to zero',
        correctAnswer: 'B',
        explanation: 'np.zeros(5) creates a NumPy array of 5 zeros.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-4-3',
        quizId: 'quiz-4',
        question: 'How do you read a CSV file in Pandas?',
        optionA: 'pd.read_csv()',
        optionB: 'pd.load_csv()',
        optionC: 'pd.import_csv()',
        optionD: 'pd.open_csv()',
        correctAnswer: 'A',
        explanation: 'pd.read_csv() reads CSV files.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-4-4',
        quizId: 'quiz-4',
        question: 'Which method shows the first 5 rows of a DataFrame?',
        optionA: 'df.first()',
        optionB: 'df.top()',
        optionC: 'df.head()',
        optionD: 'df.show()',
        correctAnswer: 'C',
        explanation: 'df.head() shows the first 5 rows.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-4-5',
        quizId: 'quiz-4',
        question: 'Which library is used for data visualization?',
        optionA: 'Pandas',
        optionB: 'NumPy',
        optionC: 'Matplotlib',
        optionD: 'Requests',
        correctAnswer: 'C',
        explanation: 'Matplotlib is used for data visualization.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-5',
    title: 'English Grammar Essentials',
    description: 'Test your understanding of grammar rules and proper usage',
    courseId: 'course-4',
    duration: 10,
    passingScore: 70,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-5-1',
        quizId: 'quiz-5',
        question: 'Which sentence uses the correct form of "their/there/they\'re"?',
        optionA: 'They\'re going to the store.',
        optionB: 'There going to the store.',
        optionC: 'Their going to the store.',
        optionD: 'Theyre going to the store.',
        correctAnswer: 'A',
        explanation: '"They\'re" is the contraction of "they are".',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-5-2',
        quizId: 'quiz-5',
        question: 'What is the correct subject-verb agreement?',
        optionA: 'The team are winning.',
        optionB: 'The team is winning.',
        optionC: 'The team were winning.',
        optionD: 'The team be winning.',
        correctAnswer: 'B',
        explanation: '"Team" is a collective noun treated as singular in American English.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-5-3',
        quizId: 'quiz-5',
        question: 'Which is the correct possessive form?',
        optionA: 'Its a beautiful day.',
        optionB: 'It\'s a beautiful day.',
        optionC: 'Its\' a beautiful day.',
        optionD: 'Its a beautifull day.',
        correctAnswer: 'B',
        explanation: '"It\'s" is the contraction of "it is". "Its" is possessive.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-5-4',
        quizId: 'quiz-5',
        question: 'Identify the correct sentence:',
        optionA: 'Me and him went to the store.',
        optionB: 'Him and me went to the store.',
        optionC: 'He and I went to the store.',
        optionD: 'Me and he went to the store.',
        correctAnswer: 'C',
        explanation: 'Subject pronouns (he, I) should be used for the subject of a sentence.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-5-5',
        quizId: 'quiz-5',
        question: 'Which word is an adverb?',
        optionA: 'Beautiful',
        optionB: 'Quickly',
        optionC: 'Happiness',
        optionD: 'Running',
        correctAnswer: 'B',
        explanation: 'Adverbs often end in "-ly" and modify verbs, adjectives, or other adverbs.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-6',
    title: 'Business Communication Skills',
    description: 'Test your professional communication knowledge',
    courseId: 'course-6',
    duration: 12,
    passingScore: 60,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-6-1',
        quizId: 'quiz-6',
        question: 'What is the best subject line for a meeting request?',
        optionA: 'Meeting',
        optionB: 'Can we meet?',
        optionC: 'Project Review Meeting - Tuesday 2PM',
        optionD: 'IMPORTANT!!!',
        correctAnswer: 'C',
        explanation: 'A good subject line is specific, actionable, and concise.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-6-2',
        quizId: 'quiz-6',
        question: 'What is the 10/20/30 rule for presentations?',
        optionA: '10 slides, 20 minutes, 30-point font',
        optionB: '10 minutes, 20 slides, 30 words',
        optionC: '10 topics, 20 points, 30 seconds',
        optionD: '10 people, 20 chairs, 30 minutes',
        correctAnswer: 'A',
        explanation: 'Guy Kawasaki\'s rule: 10 slides, 20 minutes, 30-point font minimum.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-6-3',
        quizId: 'quiz-6',
        question: 'What should be included in an executive summary?',
        optionA: 'Detailed technical specifications',
        optionB: 'Key findings and recommendations',
        optionC: 'All raw data collected',
        optionD: 'Personal opinions',
        correctAnswer: 'B',
        explanation: 'Executive summaries should highlight key findings and actionable recommendations.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-6-4',
        quizId: 'quiz-6',
        question: 'Which email closing is most professional?',
        optionA: 'Later!',
        optionB: 'Best regards,',
        optionC: 'Bye bye',
        optionD: 'XOXO',
        correctAnswer: 'B',
        explanation: '"Best regards" is a standard professional email closing.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-6-5',
        quizId: 'quiz-6',
        question: 'What is the PEEL method for writing paragraphs?',
        optionA: 'Point, Evidence, Explanation, Link',
        optionB: 'Plan, Edit, Edit, Launch',
        optionC: 'Prepare, Explain, Execute, Learn',
        optionD: 'Proof, Example, Evaluate, List',
        correctAnswer: 'A',
        explanation: 'PEEL: Point (topic sentence), Evidence, Explanation, Link to next paragraph.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-7',
    title: 'Advanced JavaScript Concepts',
    description: 'Test your knowledge of advanced JavaScript features',
    courseId: 'course-1',
    duration: 15,
    passingScore: 70,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-7-1',
        quizId: 'quiz-7',
        question: 'What is a closure in JavaScript?',
        optionA: 'A function that has access to its outer scope',
        optionB: 'A way to close the browser',
        optionC: 'A method to end loops',
        optionD: 'A type of variable declaration',
        correctAnswer: 'A',
        explanation: 'A closure is a function that remembers and can access variables from its outer scope.',
        points: 2,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-7-2',
        quizId: 'quiz-7',
        question: 'What does "async/await" do in JavaScript?',
        optionA: 'Makes code run faster',
        optionB: 'Handles asynchronous code more readably',
        optionC: 'Creates new threads',
        optionD: 'Stops code execution',
        correctAnswer: 'B',
        explanation: 'async/await is syntactic sugar for Promises, making async code easier to read.',
        points: 2,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-7-3',
        quizId: 'quiz-7',
        question: 'What is the difference between "==" and "==="?',
        optionA: 'No difference',
        optionB: '"==" checks value only, "===" checks value and type',
        optionC: '"===" is for strings only',
        optionD: '"==" is deprecated',
        correctAnswer: 'B',
        explanation: '"===" is strict equality (value AND type), "==" is loose equality (value only).',
        points: 2,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-7-4',
        quizId: 'quiz-7',
        question: 'What is the spread operator in JavaScript?',
        optionA: '...',
        optionB: '***',
        optionC: '###',
        optionD: '>>>',
        correctAnswer: 'A',
        explanation: 'The spread operator (...) allows iterables to be expanded in place.',
        points: 2,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-7-5',
        quizId: 'quiz-7',
        question: 'What is destructuring in JavaScript?',
        optionA: 'Destroying variables',
        optionB: 'Extracting values from objects/arrays',
        optionC: 'Deleting objects',
        optionD: 'Creating new arrays',
        correctAnswer: 'B',
        explanation: 'Destructuring allows extracting multiple values from objects or arrays into variables.',
        points: 2,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-8',
    title: 'Advanced Algebra & Functions',
    description: 'Challenge yourself with advanced algebra problems',
    courseId: 'course-2',
    duration: 20,
    passingScore: 65,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-8-1',
        quizId: 'quiz-8',
        question: 'Solve: x² - 5x + 6 = 0',
        optionA: 'x = 2 or x = 3',
        optionB: 'x = -2 or x = -3',
        optionC: 'x = 1 or x = 6',
        optionD: 'x = -1 or x = -6',
        correctAnswer: 'A',
        explanation: 'Factor: (x-2)(x-3) = 0, so x = 2 or x = 3.',
        points: 2,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-8-2',
        quizId: 'quiz-8',
        question: 'What is the domain of f(x) = √(x-3)?',
        optionA: 'All real numbers',
        optionB: 'x ≥ 3',
        optionC: 'x > 3',
        optionD: 'x ≤ 3',
        correctAnswer: 'B',
        explanation: 'For √(x-3) to be real, x-3 ≥ 0, so x ≥ 3.',
        points: 2,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-8-3',
        quizId: 'quiz-8',
        question: 'Simplify: (x³)² × x⁴',
        optionA: 'x⁹',
        optionB: 'x¹⁰',
        optionC: 'x¹²',
        optionD: 'x⁸',
        correctAnswer: 'B',
        explanation: '(x³)² = x⁶, then x⁶ × x⁴ = x¹⁰.',
        points: 2,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-8-4',
        quizId: 'quiz-8',
        question: 'If f(x) = 2x + 1 and g(x) = x², what is f(g(2))?',
        optionA: '5',
        optionB: '9',
        optionC: '17',
        optionD: '25',
        correctAnswer: 'B',
        explanation: 'g(2) = 4, then f(4) = 2(4) + 1 = 9.',
        points: 2,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-8-5',
        quizId: 'quiz-8',
        question: 'Solve the system: x + y = 10, x - y = 4',
        optionA: 'x = 5, y = 5',
        optionB: 'x = 7, y = 3',
        optionC: 'x = 6, y = 4',
        optionD: 'x = 8, y = 2',
        correctAnswer: 'B',
        explanation: 'Add equations: 2x = 14, x = 7. Then 7 + y = 10, y = 3.',
        points: 2,
        order: 5,
        createdAt: new Date(),
      }
    ]
  }
];

// In-memory store for newly registered users (static/demo mode)
// This allows users to register and login in demo mode
const registeredUsers: Map<string, StaticUser> = new Map();

// Helper function to check if we should use static data
export function shouldUseStaticData(): boolean {
  // Use static data if DATABASE_URL is not set or if we're in Vercel without a proper database
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return true;
  
  // If using SQLite in production (Vercel), use static data instead
  if (process.env.VERCEL === '1' && dbUrl.includes('file:')) {
    return true;
  }
  
  return false;
}

// Add a newly registered user to the in-memory store
export function addRegisteredUser(user: StaticUser): void {
  registeredUsers.set(user.email.toLowerCase(), user);
  console.log('[StaticData] User registered:', user.email, 'ID:', user.id);
}

// Get all users (static + registered) for authentication
export function getAllUsers(): StaticUser[] {
  return [...staticUsers, ...Array.from(registeredUsers.values())];
}

// Find user by email from all sources (static + registered)
export function findUserByEmailFromAll(email: string): StaticUser | null {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check registered users first (more recent)
  const registered = registeredUsers.get(normalizedEmail);
  if (registered) return registered;
  
  // Then check static users
  return staticUsers.find(u => u.email.toLowerCase() === normalizedEmail) || null;
}

// Find user by ID from all sources (static + registered)
export function findUserByIdFromAll(id: string): StaticUser | null {
  console.log('[StaticData] findUserByIdFromAll called with ID:', id);
  console.log('[StaticData] Registered users count:', registeredUsers.size);
  console.log('[StaticData] Static users count:', staticUsers.length);
  
  // Check static users first
  const staticUser = staticUsers.find(u => u.id === id);
  if (staticUser) {
    console.log('[StaticData] Found in static users:', staticUser.email);
    return staticUser;
  }
  
  // Check registered users (need to iterate since map is keyed by email)
  for (const user of registeredUsers.values()) {
    if (user.id === id) {
      console.log('[StaticData] Found in registered users:', user.email);
      return user;
    }
  }
  
  console.log('[StaticData] User not found for ID:', id);
  return null;
}
