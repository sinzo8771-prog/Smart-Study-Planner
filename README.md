# Smart Study Planner & Learning Management System

> **A Smart Way to Plan, Learn, and Track Progress**

A comprehensive, production-ready web application built with Next.js 16, TypeScript, Prisma, and modern UI technologies. This is a final-year major college project demonstrating full-stack development capabilities.

![StudyPlanner Banner](https://img.shields.io/badge/StudyPlanner-LMS-blue?style=for-the-badge)

## 🎯 Project Overview

The Smart Study Planner & Learning Management System is designed to help students organize their studies, track progress, and achieve academic excellence. It features a modern SaaS-like interface with role-based access control for students and administrators.

### Core Objectives Demonstrated

- ✅ Full-stack development with Next.js 16 App Router
- ✅ Secure authentication with JWT tokens
- ✅ Role-based access control (Student/Admin)
- ✅ Complete CRUD operations across all modules
- ✅ Real-time dashboard analytics with charts
- ✅ Professional UI/UX with dark mode support
- ✅ Clean modular architecture
- ✅ Deployment-ready configuration

---

## 🧱 Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Zustand
- **Theme**: next-themes (Dark mode support)

### Backend
- **Runtime**: Node.js (Bun)
- **API**: Next.js API Routes (REST)
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT + bcryptjs
- **Session Management**: HTTP-only cookies

### Development Tools
- **Package Manager**: Bun
- **Linting**: ESLint
- **Type Safety**: TypeScript strict mode

---

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema with all models
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication routes (login, register, logout, session)
│   │   │   ├── subjects/      # Subject CRUD operations
│   │   │   ├── tasks/         # Task management API
│   │   │   ├── courses/       # Course management API
│   │   │   ├── modules/       # Module management API
│   │   │   ├── quizzes/       # Quiz CRUD and management
│   │   │   ├── quiz-attempts/ # Quiz submission and grading
│   │   │   ├── users/         # User management (admin)
│   │   │   ├── stats/         # Dashboard statistics
│   │   │   └── progress/      # Learning progress tracking
│   │   ├── globals.css        # Global styles and CSS variables
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   └── page.tsx           # Main application (SPA with view switching)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── theme-provider.tsx # Theme context provider
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       ├── auth.ts            # Authentication utilities
│       ├── db.ts              # Prisma client instance
│       └── utils.ts           # Utility functions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
└── package.json               # Dependencies and scripts
```

---

## 🌟 Features

### 1. Landing Page
A professional, modern SaaS landing page with:
- **Hero Section**: Eye-catching headline with gradient text
- **Problem Section**: Highlights common student challenges
- **Solution Section**: Three-pillar approach explanation
- **Feature Grid**: Six core features with icons
- **How It Works**: Four-step getting started guide
- **Testimonials**: User reviews and ratings
- **Pricing**: Three-tier pricing plans
- **CTA**: Final call-to-action section
- **Footer**: College and developer information

### 2. Authentication Module
Secure authentication system featuring:
- User registration with role selection
- Login with email/password
- Role-based route protection (student/admin)
- JWT token-based sessions
- HTTP-only cookie storage
- Automatic session persistence

### 3. Smart Study Planner
Comprehensive task management:
- **Subjects**: Create, edit, delete subjects with custom colors
- **Tasks**: Full CRUD with status tracking (pending, in_progress, completed)
- **Priority Levels**: Low, medium, high priority
- **Due Dates**: Track deadlines and exam dates
- **Completion Percentage**: Automatic calculation per subject
- **Calendar View**: Visual timeline (planned)

### 4. LMS Module
Learning management features:
- **Courses**: Admin can create, edit, delete courses
- **Modules**: Structured learning content within courses
- **Progress Tracking**: Automatic progress calculation
- **Course Categories**: Organize by category and level
- **Publish Status**: Draft/Published workflow

### 5. Quiz Module
Interactive assessment system:
- **MCQ Creation**: Admin creates quizzes with multiple questions
- **Auto-Grading**: Instant score calculation
- **Detailed Results**: Review answers with explanations
- **Pass/Fail Threshold**: Configurable passing scores
- **Time Limits**: Quiz duration settings

### 6. Dashboard & Analytics
Role-specific dashboards:

**Student Dashboard:**
- Total subjects count
- Task completion statistics
- Quiz score averages
- Progress charts
- Upcoming tasks

**Admin Dashboard:**
- Total users management
- Course statistics
- Quiz analytics
- System overview
- User activity tracking

### 7. Security Features
- Password hashing with bcryptjs (12 salt rounds)
- Secure JWT tokens with 7-day expiration
- HTTP-only cookies for session management
- Role-based middleware protection
- Input validation on all forms
- SQL injection prevention via Prisma

---

## 📊 Database Schema

### Core Models

```prisma
// User Management
User: id, name, email, password, role, createdAt
Account: OAuth accounts (future use)
Session: User sessions

// Study Planner
Subject: id, name, description, color, examDate, userId
Task: id, title, description, status, priority, dueDate, subjectId

// LMS
Course: id, title, description, category, level, isPublished
Module: id, title, content, videoUrl, duration, order
CourseProgress: userId, courseId, progress, completedAt
ModuleProgress: userId, moduleId, completed

// Quiz System
Quiz: id, title, duration, passingScore, isPublished
Question: id, question, options (A-D), correctAnswer, points
QuizAttempt: id, quizId, userId, score, answers, timeTaken
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studyplanner
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL="file:./db/custom.db"
   JWT_SECRET="your-super-secret-key-change-in-production"
   NODE_ENV="development"
   ```

4. **Initialize the database**
   ```bash
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open in browser**
   Navigate to `http://localhost:3000` (or use the Preview Panel in the sandbox)

### Default Access

No default users are created. Register a new account:
- For **Admin** access: Select "Admin" role during registration
- For **Student** access: Select "Student" role during registration

---

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/session` | Get current session |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | List user's subjects |
| POST | `/api/subjects` | Create subject |
| GET | `/api/subjects/:id` | Get single subject |
| PUT | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filterable) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses |
| POST | `/api/courses` | Create course (admin) |
| GET | `/api/courses/:id` | Get course with modules |
| PUT | `/api/courses/:id` | Update course (admin) |
| DELETE | `/api/courses/:id` | Delete course (admin) |

### Quizzes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | List quizzes |
| POST | `/api/quizzes` | Create quiz (admin) |
| GET | `/api/quizzes/:id` | Get quiz details |
| PUT | `/api/quizzes/:id` | Update quiz (admin) |
| DELETE | `/api/quizzes/:id` | Delete quiz (admin) |

### Quiz Attempts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quiz-attempts` | List user's attempts |
| POST | `/api/quiz-attempts` | Submit quiz answers |
| GET | `/api/quiz-attempts/:id` | Get attempt details |

---

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tablet-optimized layouts
- Desktop enhanced features
- Touch-friendly interactions
- Collapsible sidebar navigation

---

## 🎨 Theme Support

- Light/Dark mode toggle
- System preference detection
- Persistent theme selection
- CSS custom properties for easy customization

---

## 🧪 Testing

Run linting:
```bash
bun run lint
```

---

## 📦 Deployment

### Environment Variables for Production

```env
DATABASE_URL="file:./db/custom.db"
JWT_SECRET="your-production-secret-key-min-32-characters"
NODE_ENV="production"
```

### Build for Production

```bash
bun run build
```

### Start Production Server

```bash
bun run start
```

### Deployment Platforms

The application is configured for deployment on:
- **Vercel**: Zero-config deployment
- **Replit**: Compatible with Replit's environment
- **Docker**: Can be containerized for cloud deployment
- **Any Node.js hosting**: Standard Next.js production build

---

## 🔒 Security Considerations

1. **Change JWT_SECRET**: Use a strong, unique secret in production
2. **HTTPS**: Always use HTTPS in production
3. **Database**: Consider PostgreSQL for production
4. **Rate Limiting**: Implement rate limiting for API routes
5. **Input Validation**: All inputs are validated server-side
6. **CSRF Protection**: HTTP-only cookies provide CSRF protection

---

## 👥 User Roles

### Student
- Create and manage subjects and tasks
- View and enroll in courses
- Take quizzes
- Track personal progress

### Admin
- All student capabilities
- Create and manage courses
- Create and manage quizzes
- Manage all users
- View system analytics

---

## 📄 License

This project is developed as a final-year major college project.

---

## 👨‍💻 Developer Information

**Project**: Smart Study Planner & Learning Management System  
**Type**: Final Year Major Project  
**Department**: Computer Science  
**Academic Year**: 2024-2025

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for the beautiful component library
- Tailwind CSS for the utility-first styling
- Recharts for the charting library
- All open-source contributors

---

**Built with ❤️ for students worldwide**
