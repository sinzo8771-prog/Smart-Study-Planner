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

// Sample courses with modules - Real YouTube courses
export const staticCourses: StaticCourse[] = [
  {
    id: 'course-1',
    title: 'HTML & CSS Full Course - Beginner to Pro',
    description: 'Learn HTML and CSS from scratch with this comprehensive course. Build real websites and master responsive design.',
    thumbnail: 'https://i.ytimg.com/vi/pQN-pnXPaVg/maxresdefault.jpg',
    category: 'Web Development',
    level: 'beginner',
    duration: 360,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-1-1',
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML and document structure',
        content: `# Introduction to HTML

This module covers the fundamentals of HTML (HyperText Markup Language), the standard language for creating web pages.

## What You'll Learn
- HTML document structure
- Common HTML elements
- Semantic HTML
- Best practices`,
        videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=0s',
        duration: 45,
        order: 1,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-2',
        title: 'CSS Fundamentals',
        description: 'Master CSS styling and selectors',
        content: `# CSS Fundamentals

Learn how to style your HTML with CSS (Cascading Style Sheets).

## Topics Covered
- CSS selectors
- Box model
- Colors and typography
- Layout basics`,
        videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=1800s',
        duration: 60,
        order: 2,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-3',
        title: 'Responsive Design with Flexbox',
        description: 'Create responsive layouts with Flexbox',
        content: `# Responsive Design with Flexbox

Master the Flexbox layout system for building responsive designs.

## Flexbox Properties
- flex-direction
- justify-content
- align-items
- flex-wrap`,
        videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=5400s',
        duration: 50,
        order: 3,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-4',
        title: 'CSS Grid Layout',
        description: 'Build complex layouts with CSS Grid',
        content: `# CSS Grid Layout

Learn CSS Grid for creating complex two-dimensional layouts.

## Grid Concepts
- grid-template-columns
- grid-template-rows
- grid-gap
- Grid areas`,
        videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=9000s',
        duration: 55,
        order: 4,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-1-5',
        title: 'Build a Complete Website Project',
        description: 'Put your skills together and build a real website',
        content: `# Build a Complete Website Project

Apply everything you've learned by building a complete, responsive website from scratch.

## Project Features
- Responsive navigation
- Hero section
- Feature cards
- Contact form
- Footer`,
        videoUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=12000s',
        duration: 90,
        order: 5,
        courseId: 'course-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-2',
    title: 'JavaScript Programming Full Course',
    description: 'Master JavaScript from basics to advanced concepts. Learn modern ES6+ features, DOM manipulation, async programming, and build real projects.',
    thumbnail: 'https://i.ytimg.com/vi/EfAl9bwzV7I/maxresdefault.jpg',
    category: 'Programming',
    level: 'beginner',
    duration: 480,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-2-1',
        title: 'JavaScript Basics & Variables',
        description: 'Introduction to JavaScript, variables, and data types',
        content: `# JavaScript Basics

Learn the fundamentals of JavaScript programming.

## Topics
- Variables (let, const, var)
- Data types
- Type coercion
- Operators`,
        videoUrl: 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=0s',
        duration: 40,
        order: 1,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-2',
        title: 'Functions & Scope',
        description: 'Master functions, arrow functions, and scope',
        content: `# Functions & Scope

Understand how functions work in JavaScript.

## Concepts
- Function declarations
- Arrow functions
- Scope (global, function, block)
- Closures`,
        videoUrl: 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=2400s',
        duration: 45,
        order: 2,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-3',
        title: 'Arrays & Objects',
        description: 'Work with arrays, objects, and array methods',
        content: `# Arrays & Objects

Master data structures in JavaScript.

## Array Methods
- map, filter, reduce
- find, some, every
- spread operator
- destructuring`,
        videoUrl: 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=5100s',
        duration: 50,
        order: 3,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-4',
        title: 'DOM Manipulation',
        description: 'Interact with web pages using the DOM',
        content: `# DOM Manipulation

Learn to interact with HTML elements using JavaScript.

## DOM Methods
- querySelector, querySelectorAll
- createElement
- addEventListener
- Event bubbling`,
        videoUrl: 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=8000s',
        duration: 55,
        order: 4,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-2-5',
        title: 'Async JavaScript & Promises',
        description: 'Master asynchronous programming in JavaScript',
        content: `# Async JavaScript

Understand asynchronous programming patterns.

## Async Concepts
- Callbacks
- Promises
- async/await
- Fetch API`,
        videoUrl: 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=11000s',
        duration: 60,
        order: 5,
        courseId: 'course-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-3',
    title: 'React JS Full Course for Beginners',
    description: 'Learn React from scratch. Build modern web applications with components, hooks, state management, and more.',
    thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg',
    category: 'Web Development',
    level: 'intermediate',
    duration: 720,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-3-1',
        title: 'React Fundamentals',
        description: 'Introduction to React and components',
        content: `# React Fundamentals

Get started with React development.

## Concepts
- What is React?
- JSX syntax
- Components
- Props`,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=0s',
        duration: 60,
        order: 1,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-2',
        title: 'State & useState Hook',
        description: 'Manage component state with useState',
        content: `# State Management

Learn to manage state in React components.

## useState Hook
- Declaring state
- Updating state
- State vs props
- Multiple state variables`,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=3600s',
        duration: 50,
        order: 2,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-3',
        title: 'Effects & useEffect Hook',
        description: 'Handle side effects in React',
        content: `# useEffect Hook

Learn to handle side effects in your components.

## useEffect
- Component lifecycle
- Dependency array
- Cleanup functions
- Fetching data`,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=7200s',
        duration: 55,
        order: 3,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-4',
        title: 'Forms & Events in React',
        description: 'Handle user input and events',
        content: `# Forms & Events

Build interactive forms in React.

## Form Handling
- Controlled components
- Form submission
- Validation
- Event handlers`,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=10800s',
        duration: 45,
        order: 4,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-3-5',
        title: 'Build a Complete React Project',
        description: 'Create a full React application',
        content: `# Complete React Project

Build a real-world React application.

## Project Features
- Multiple pages
- State management
- API integration
- Responsive design`,
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=14400s',
        duration: 90,
        order: 5,
        courseId: 'course-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Python Full Course for Beginners',
    description: 'Learn Python programming from scratch. Master the basics and build practical projects.',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    category: 'Programming',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-4-1',
        title: 'Python Basics & Setup',
        description: 'Get started with Python programming',
        content: `# Python Basics

Introduction to Python programming language.

## Setup
- Installing Python
- IDE setup
- Running Python
- Print statements`,
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=0s',
        duration: 30,
        order: 1,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-2',
        title: 'Variables & Data Types',
        description: 'Understand Python data types and variables',
        content: `# Variables & Data Types

Learn about Python's data types.

## Data Types
- Strings
- Integers, Floats
- Booleans
- Type conversion`,
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=1800s',
        duration: 45,
        order: 2,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-3',
        title: 'Lists, Tuples & Dictionaries',
        description: 'Work with Python data structures',
        content: `# Data Structures

Master Python's built-in data structures.

## Collections
- Lists
- Tuples
- Dictionaries
- Sets`,
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=4500s',
        duration: 60,
        order: 3,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-4',
        title: 'Functions & Modules',
        description: 'Create reusable code with functions',
        content: `# Functions & Modules

Write modular Python code.

## Concepts
- Defining functions
- Parameters & return
- Lambda functions
- Importing modules`,
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=8100s',
        duration: 55,
        order: 4,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-4-5',
        title: 'File Handling & Exceptions',
        description: 'Work with files and handle errors',
        content: `# File Handling

Read and write files in Python.

## Topics
- Reading files
- Writing files
- Exception handling
- Try/except blocks`,
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=11700s',
        duration: 50,
        order: 5,
        courseId: 'course-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Node.js Full Course for Beginners',
    description: 'Learn backend development with Node.js. Build APIs, work with databases, and deploy applications.',
    thumbnail: 'https://i.ytimg.com/vi/Oe421EPjeBE/maxresdefault.jpg',
    category: 'Backend Development',
    level: 'intermediate',
    duration: 600,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-5-1',
        title: 'Introduction to Node.js',
        description: 'Get started with Node.js runtime',
        content: `# Introduction to Node.js

Learn server-side JavaScript with Node.js.

## Fundamentals
- What is Node.js?
- npm package manager
- Node modules
- Creating a server`,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=0s',
        duration: 40,
        order: 1,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-2',
        title: 'Express.js Framework',
        description: 'Build web applications with Express',
        content: `# Express.js Framework

Learn the most popular Node.js framework.

## Express Basics
- Creating an Express app
- Routing
- Middleware
- Request/Response`,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=2700s',
        duration: 50,
        order: 2,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-3',
        title: 'REST API Development',
        description: 'Build RESTful APIs with Node.js',
        content: `# REST API Development

Create RESTful APIs following best practices.

## API Concepts
- REST principles
- HTTP methods
- Status codes
- API structure`,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=5400s',
        duration: 55,
        order: 3,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-4',
        title: 'MongoDB & Mongoose',
        description: 'Work with MongoDB database',
        content: `# MongoDB & Mongoose

Learn NoSQL database integration.

## Database Topics
- MongoDB basics
- Mongoose ODM
- CRUD operations
- Data modeling`,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=9000s',
        duration: 60,
        order: 4,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-5-5',
        title: 'Authentication & Deployment',
        description: 'Add user auth and deploy your app',
        content: `# Authentication & Deployment

Secure your app and deploy it.

## Advanced Topics
- JWT authentication
- Password hashing
- Environment variables
- Deployment`,
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=12600s',
        duration: 65,
        order: 5,
        courseId: 'course-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Git & GitHub Full Course',
    description: 'Master version control with Git and GitHub. Learn collaboration, branching, and best practices.',
    thumbnail: 'https://i.ytimg.com/vi/RGOj5yH7evk/maxresdefault.jpg',
    category: 'Developer Tools',
    level: 'beginner',
    duration: 420,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-6-1',
        title: 'Git Basics',
        description: 'Learn fundamental Git commands',
        content: `# Git Basics

Get started with version control.

## Core Concepts
- What is Git?
- git init, add, commit
- git status, log
- .gitignore`,
        videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=0s',
        duration: 35,
        order: 1,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-6-2',
        title: 'Branching & Merging',
        description: 'Work with branches in Git',
        content: `# Branching & Merging

Master Git branching workflows.

## Branch Operations
- Creating branches
- Switching branches
- Merging
- Merge conflicts`,
        videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=2100s',
        duration: 45,
        order: 2,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-6-3',
        title: 'GitHub & Remote Repositories',
        description: 'Work with GitHub for collaboration',
        content: `# GitHub & Remote Repositories

Collaborate using GitHub.

## GitHub Features
- Remote repositories
- Push & pull
- Fork & clone
- Pull requests`,
        videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=4500s',
        duration: 50,
        order: 3,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-6-4',
        title: 'Advanced Git Concepts',
        description: 'Learn advanced Git techniques',
        content: `# Advanced Git Concepts

Take your Git skills to the next level.

## Advanced Topics
- Rebasing
- Stashing
- Cherry-picking
- Git workflow strategies`,
        videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=7200s',
        duration: 55,
        order: 4,
        courseId: 'course-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-7',
    title: 'TypeScript for Beginners',
    description: 'Learn TypeScript and understand why it is a powerful addition to JavaScript.',
    thumbnail: 'https://i.ytimg.com/vi/BwuLxPH8IDs/maxresdefault.jpg',
    category: 'Programming',
    level: 'intermediate',
    duration: 480,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-7-1',
        title: 'TypeScript Fundamentals',
        description: 'Introduction to TypeScript',
        content: `# TypeScript Fundamentals

Get started with TypeScript.

## Basics
- What is TypeScript?
- Installation & setup
- Type annotations
- Basic types`,
        videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=0s',
        duration: 40,
        order: 1,
        courseId: 'course-7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-7-2',
        title: 'Interfaces & Types',
        description: 'Define custom types in TypeScript',
        content: `# Interfaces & Types

Create complex type definitions.

## Type System
- Interfaces
- Type aliases
- Union types
- Intersection types`,
        videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=2400s',
        duration: 50,
        order: 2,
        courseId: 'course-7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-7-3',
        title: 'Functions & Generics',
        description: 'Write type-safe functions',
        content: `# Functions & Generics

Master TypeScript functions.

## Advanced Types
- Function types
- Generic functions
- Generic constraints
- Type inference`,
        videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=5400s',
        duration: 55,
        order: 3,
        courseId: 'course-7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-7-4',
        title: 'TypeScript with React',
        description: 'Use TypeScript in React projects',
        content: `# TypeScript with React

Build type-safe React applications.

## React + TS
- Component props
- useState typing
- Event handling
- Custom hooks`,
        videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=8400s',
        duration: 60,
        order: 4,
        courseId: 'course-7',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  },
  {
    id: 'course-8',
    title: 'SQL & Database Design Full Course',
    description: 'Learn SQL from scratch. Master database design, queries, and relational database concepts.',
    thumbnail: 'https://i.ytimg.com/vi/HXV3zeQKqGY/maxresdefault.jpg',
    category: 'Database',
    level: 'beginner',
    duration: 540,
    isPublished: true,
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'mod-8-1',
        title: 'Introduction to Databases',
        description: 'Learn database fundamentals',
        content: `# Introduction to Databases

Understand database concepts.

## Fundamentals
- What is a database?
- Relational databases
- SQL basics
- Database design`,
        videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=0s',
        duration: 35,
        order: 1,
        courseId: 'course-8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-8-2',
        title: 'SQL Queries & Clauses',
        description: 'Master SQL query syntax',
        content: `# SQL Queries

Write powerful SQL queries.

## Query Elements
- SELECT statements
- WHERE clause
- ORDER BY
- GROUP BY`,
        videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=2100s',
        duration: 45,
        order: 2,
        courseId: 'course-8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-8-3',
        title: 'Joins & Relationships',
        description: 'Connect tables with SQL joins',
        content: `# Joins & Relationships

Master table relationships.

## Join Types
- INNER JOIN
- LEFT JOIN
- RIGHT JOIN
- Multiple joins`,
        videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=4800s',
        duration: 50,
        order: 3,
        courseId: 'course-8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'mod-8-4',
        title: 'Database Design Best Practices',
        description: 'Design efficient databases',
        content: `# Database Design

Learn proper database design.

## Design Concepts
- Normalization
- Primary keys
- Foreign keys
- Indexing`,
        videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=8100s',
        duration: 55,
        order: 4,
        courseId: 'course-8',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]
  }
];

// Sample quizzes - Updated for new YouTube courses
export const staticQuizzes: StaticQuiz[] = [
  {
    id: 'quiz-1',
    title: 'HTML & CSS Fundamentals Quiz',
    description: 'Test your knowledge of HTML and CSS basics from the full course',
    courseId: 'course-1',
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
        question: 'What is the correct CSS flexbox property to center items horizontally?',
        optionA: 'justify-content: center',
        optionB: 'align-items: center',
        optionC: 'text-align: center',
        optionD: 'margin: center',
        correctAnswer: 'A',
        explanation: 'justify-content centers flex items along the main axis (horizontal by default).',
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
        question: 'Which CSS property creates a grid container?',
        optionA: 'display: flex',
        optionB: 'display: grid',
        optionC: 'display: block',
        optionD: 'display: table',
        correctAnswer: 'B',
        explanation: 'display: grid creates a grid container for two-dimensional layouts.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your JavaScript knowledge from basics to async',
    courseId: 'course-2',
    duration: 20,
    passingScore: 60,
    isPublished: true,
    category: 'Programming',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-2-1',
        quizId: 'quiz-2',
        question: 'Which keyword declares a block-scoped variable in JavaScript?',
        optionA: 'var',
        optionB: 'let',
        optionC: 'variable',
        optionD: 'define',
        correctAnswer: 'B',
        explanation: 'let and const are block-scoped, while var is function-scoped.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-2-2',
        quizId: 'quiz-2',
        question: 'What does the map() method do?',
        optionA: 'Filters elements from an array',
        optionB: 'Transforms each element and returns a new array',
        optionC: 'Finds an element in an array',
        optionD: 'Sorts the array',
        correctAnswer: 'B',
        explanation: 'map() creates a new array by transforming each element.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-2-3',
        quizId: 'quiz-2',
        question: 'How do you select an element by ID in JavaScript?',
        optionA: 'document.getElement()',
        optionB: 'document.getElementById()',
        optionC: 'document.querySelector("#id")',
        optionD: 'Both B and C work',
        correctAnswer: 'D',
        explanation: 'Both getElementById() and querySelector("#id") can select by ID.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-2-4',
        quizId: 'quiz-2',
        question: 'What is an async function?',
        optionA: 'A function that runs synchronously',
        optionB: 'A function that always returns a Promise',
        optionC: 'A function without parameters',
        optionD: 'A deprecated function type',
        correctAnswer: 'B',
        explanation: 'async functions always return a Promise.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-2-5',
        quizId: 'quiz-2',
        question: 'What is the purpose of arrow functions?',
        optionA: 'To create longer function syntax',
        optionB: 'To provide shorter syntax and lexical this',
        optionC: 'To make functions slower',
        optionD: 'To prevent function hoisting',
        correctAnswer: 'B',
        explanation: 'Arrow functions provide concise syntax and inherit this from surrounding scope.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-3',
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React components and hooks',
    courseId: 'course-3',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Web Development',
    difficulty: 'intermediate',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-3-1',
        quizId: 'quiz-3',
        question: 'What is JSX?',
        optionA: 'A new programming language',
        optionB: 'JavaScript XML - syntax extension for JavaScript',
        optionC: 'A CSS framework',
        optionD: 'A database query language',
        correctAnswer: 'B',
        explanation: 'JSX is a syntax extension that allows writing HTML-like code in JavaScript.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-3-2',
        quizId: 'quiz-3',
        question: 'What does useState return?',
        optionA: 'Just the state value',
        optionB: 'Just the setter function',
        optionC: 'An array with state value and setter function',
        optionD: 'A Promise',
        correctAnswer: 'C',
        explanation: 'useState returns [stateValue, setStateFunction].',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-3-3',
        quizId: 'quiz-3',
        question: 'When does useEffect run by default?',
        optionA: 'Only on first render',
        optionB: 'On every render',
        optionC: 'Only when state changes',
        optionD: 'Never automatically',
        correctAnswer: 'B',
        explanation: 'useEffect runs after every render unless a dependency array is provided.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-3-4',
        quizId: 'quiz-3',
        question: 'What are props in React?',
        optionA: 'State management tools',
        optionB: 'Arguments passed to components',
        optionC: 'CSS properties',
        optionD: 'Event handlers',
        correctAnswer: 'B',
        explanation: 'Props (properties) are arguments passed from parent to child components.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-3-5',
        quizId: 'quiz-3',
        question: 'What is a controlled component in React?',
        optionA: 'A component with controlled CSS',
        optionB: 'A form element whose value is controlled by React state',
        optionC: 'A component that controls other components',
        optionD: 'A component with restricted props',
        correctAnswer: 'B',
        explanation: 'Controlled components have their value controlled by React state.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-4',
    title: 'Python Basics Quiz',
    description: 'Test your Python programming fundamentals',
    courseId: 'course-4',
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
        id: 'q-4-1',
        quizId: 'quiz-4',
        question: 'How do you create a list in Python?',
        optionA: 'list = (1, 2, 3)',
        optionB: 'list = [1, 2, 3]',
        optionC: 'list = {1, 2, 3}',
        optionD: 'list = <1, 2, 3>',
        correctAnswer: 'B',
        explanation: 'Lists in Python are created with square brackets [].',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-4-2',
        quizId: 'quiz-4',
        question: 'What is the difference between a tuple and a list?',
        optionA: 'Tuples are mutable, lists are immutable',
        optionB: 'Tuples are immutable, lists are mutable',
        optionC: 'There is no difference',
        optionD: 'Tuples can only store strings',
        correctAnswer: 'B',
        explanation: 'Tuples are immutable (cannot be changed), lists are mutable.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-4-3',
        quizId: 'quiz-4',
        question: 'How do you define a function in Python?',
        optionA: 'function myFunc():',
        optionB: 'def myFunc():',
        optionC: 'func myFunc():',
        optionD: 'create myFunc():',
        correctAnswer: 'B',
        explanation: 'Python uses the def keyword to define functions.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-4-4',
        quizId: 'quiz-4',
        question: 'What is a dictionary in Python?',
        optionA: 'A list of words',
        optionB: 'A collection of key-value pairs',
        optionC: 'A type of loop',
        optionD: 'A file format',
        correctAnswer: 'B',
        explanation: 'Dictionaries store data as key-value pairs in curly braces {}.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-4-5',
        quizId: 'quiz-4',
        question: 'How do you handle exceptions in Python?',
        optionA: 'try/catch',
        optionB: 'try/except',
        optionC: 'catch/error',
        optionD: 'handle/exception',
        correctAnswer: 'B',
        explanation: 'Python uses try/except for exception handling.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-5',
    title: 'Node.js Backend Quiz',
    description: 'Test your Node.js and Express knowledge',
    courseId: 'course-5',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Backend Development',
    difficulty: 'intermediate',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-5-1',
        quizId: 'quiz-5',
        question: 'What is npm?',
        optionA: 'Node Package Manager',
        optionB: 'New Programming Method',
        optionC: 'Network Protocol Module',
        optionD: 'Node Process Manager',
        correctAnswer: 'A',
        explanation: 'npm is the Node Package Manager for managing JavaScript packages.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-5-2',
        quizId: 'quiz-5',
        question: 'What is Express.js?',
        optionA: 'A database',
        optionB: 'A Node.js web application framework',
        optionC: 'A frontend library',
        optionD: 'A testing tool',
        correctAnswer: 'B',
        explanation: 'Express.js is a minimal and flexible Node.js web application framework.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-5-3',
        quizId: 'quiz-5',
        question: 'What is middleware in Express?',
        optionA: 'Software installed on the server',
        optionB: 'Functions that have access to request, response, and next function',
        optionC: 'A type of database',
        optionD: 'A frontend component',
        correctAnswer: 'B',
        explanation: 'Middleware functions have access to req, res, and the next middleware function.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-5-4',
        quizId: 'quiz-5',
        question: 'What is MongoDB?',
        optionA: 'A relational database',
        optionB: 'A NoSQL document database',
        optionC: 'A JavaScript library',
        optionD: 'A web server',
        correctAnswer: 'B',
        explanation: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-5-5',
        quizId: 'quiz-5',
        question: 'What does REST stand for?',
        optionA: 'Remote Execution State Transfer',
        optionB: 'Representational State Transfer',
        optionC: 'Request State Transaction',
        optionD: 'Remote API State Transfer',
        correctAnswer: 'B',
        explanation: 'REST stands for Representational State Transfer.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-6',
    title: 'Git & GitHub Quiz',
    description: 'Test your version control knowledge',
    courseId: 'course-6',
    duration: 12,
    passingScore: 60,
    isPublished: true,
    category: 'Developer Tools',
    difficulty: 'beginner',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-6-1',
        quizId: 'quiz-6',
        question: 'What command initializes a new Git repository?',
        optionA: 'git start',
        optionB: 'git init',
        optionC: 'git create',
        optionD: 'git new',
        correctAnswer: 'B',
        explanation: 'git init creates a new Git repository.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-6-2',
        quizId: 'quiz-6',
        question: 'What does git status show?',
        optionA: 'The current branch name only',
        optionB: 'The state of the working directory and staging area',
        optionC: 'Git version information',
        optionD: 'Remote repository status',
        correctAnswer: 'B',
        explanation: 'git status shows the state of the working directory and staging area.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-6-3',
        quizId: 'quiz-6',
        question: 'What is a branch in Git?',
        optionA: 'A copy of the entire repository',
        optionB: 'A parallel version of the repository for development',
        optionC: 'A deleted commit',
        optionD: 'A type of merge conflict',
        correctAnswer: 'B',
        explanation: 'A branch is a parallel version of the repository for isolated development.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-6-4',
        quizId: 'quiz-6',
        question: 'What is a pull request on GitHub?',
        optionA: 'A request to download code',
        optionB: 'A proposal to merge changes from one branch to another',
        optionC: 'A request to delete a repository',
        optionD: 'A way to request access to a repository',
        correctAnswer: 'B',
        explanation: 'A pull request proposes changes for review before merging.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-6-5',
        quizId: 'quiz-6',
        question: 'What command uploads local changes to a remote repository?',
        optionA: 'git upload',
        optionB: 'git push',
        optionC: 'git send',
        optionD: 'git sync',
        correctAnswer: 'B',
        explanation: 'git push uploads local repository content to a remote repository.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-7',
    title: 'TypeScript Basics Quiz',
    description: 'Test your TypeScript fundamentals',
    courseId: 'course-7',
    duration: 15,
    passingScore: 60,
    isPublished: true,
    category: 'Programming',
    difficulty: 'intermediate',
    createdBy: 'admin-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    questions: [
      {
        id: 'q-7-1',
        quizId: 'quiz-7',
        question: 'What is TypeScript?',
        optionA: 'A new programming language unrelated to JavaScript',
        optionB: 'JavaScript with syntax for types',
        optionC: 'A CSS framework',
        optionD: 'A database tool',
        correctAnswer: 'B',
        explanation: 'TypeScript is JavaScript with added static type definitions.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-7-2',
        quizId: 'quiz-7',
        question: 'What keyword defines a custom type in TypeScript?',
        optionA: 'type',
        optionB: 'interface',
        optionC: 'Both A and B',
        optionD: 'define',
        correctAnswer: 'C',
        explanation: 'Both type and interface can be used to define custom types.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-7-3',
        quizId: 'quiz-7',
        question: 'What is a union type in TypeScript?',
        optionA: 'A type that combines multiple types with OR',
        optionB: 'A type that combines types with AND',
        optionC: 'A database union',
        optionD: 'A JavaScript operator',
        correctAnswer: 'A',
        explanation: 'Union types allow a value to be one of several types (using |).',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-7-4',
        quizId: 'quiz-7',
        question: 'What are generics in TypeScript?',
        optionA: 'Generic brand types',
        optionB: 'Variables for types that create reusable components',
        optionC: 'Default types',
        optionD: 'Deprecated features',
        correctAnswer: 'B',
        explanation: 'Generics allow creating reusable components that work with multiple types.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-7-5',
        quizId: 'quiz-7',
        question: 'What is the any type in TypeScript?',
        optionA: 'The best type to use always',
        optionB: 'A type that disables type checking',
        optionC: 'A type that means null',
        optionD: 'A type for numbers only',
        correctAnswer: 'B',
        explanation: 'any disables type checking and should be avoided when possible.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  },
  {
    id: 'quiz-8',
    title: 'SQL & Database Quiz',
    description: 'Test your database and SQL knowledge',
    courseId: 'course-8',
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
        id: 'q-8-1',
        quizId: 'quiz-8',
        question: 'What does SQL stand for?',
        optionA: 'Structured Query Language',
        optionB: 'Simple Query Language',
        optionC: 'Standard Query Logic',
        optionD: 'System Query Library',
        correctAnswer: 'A',
        explanation: 'SQL stands for Structured Query Language.',
        points: 1,
        order: 1,
        createdAt: new Date(),
      },
      {
        id: 'q-8-2',
        quizId: 'quiz-8',
        question: 'Which SQL clause filters results?',
        optionA: 'ORDER BY',
        optionB: 'WHERE',
        optionC: 'GROUP BY',
        optionD: 'SELECT',
        correctAnswer: 'B',
        explanation: 'WHERE clause filters rows based on a condition.',
        points: 1,
        order: 2,
        createdAt: new Date(),
      },
      {
        id: 'q-8-3',
        quizId: 'quiz-8',
        question: 'What type of JOIN returns all rows from both tables?',
        optionA: 'INNER JOIN',
        optionB: 'LEFT JOIN',
        optionC: 'FULL OUTER JOIN',
        optionD: 'RIGHT JOIN',
        correctAnswer: 'C',
        explanation: 'FULL OUTER JOIN returns all rows when there is a match in either table.',
        points: 1,
        order: 3,
        createdAt: new Date(),
      },
      {
        id: 'q-8-4',
        quizId: 'quiz-8',
        question: 'What is a primary key?',
        optionA: 'The first column in a table',
        optionB: 'A unique identifier for each row',
        optionC: 'A foreign reference',
        optionD: 'A password for the database',
        correctAnswer: 'B',
        explanation: 'A primary key uniquely identifies each row in a table.',
        points: 1,
        order: 4,
        createdAt: new Date(),
      },
      {
        id: 'q-8-5',
        quizId: 'quiz-8',
        question: 'What does GROUP BY do in SQL?',
        optionA: 'Sorts the results',
        optionB: 'Groups rows with the same values for aggregation',
        optionC: 'Creates a new table',
        optionD: 'Deletes duplicate rows',
        correctAnswer: 'B',
        explanation: 'GROUP BY groups rows with the same values for aggregate functions.',
        points: 1,
        order: 5,
        createdAt: new Date(),
      }
    ]
  }
];

// Helper functions for user management

// Check if we should use static data (demo mode)
// In production on Vercel with DATABASE_URL, we'll use the database
export function shouldUseStaticData(): boolean {
  console.log('[StaticData] Checking static mode:', {
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30),
    vercel: process.env.VERCEL,
    nodeEnv: process.env.NODE_ENV,
  });
  
  // If we have a real database URL (not the demo placeholder), use database mode
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && (dbUrl.includes('supabase') || dbUrl.includes('postgresql://'))) {
    console.log('[StaticData] Production database URL detected, using database mode');
    return false;
  }
  
  console.log('[StaticData] DATABASE_URL not recognized as valid format, using static mode');
  return true;
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
