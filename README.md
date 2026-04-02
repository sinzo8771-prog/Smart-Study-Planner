<div align="center">
  
  # 📚 Smart Study Planner & LMS
  
  **A Smart Way to Plan, Learn, and Track Progress**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  [![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)]()
  [![Security](https://img.shields.io/badge/Security-Hardened-green?style=for-the-badge)]()
  [![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)]()
  
  [🚀 Live Demo](https://smart-study-plannerr.vercel.app) · [🐛 Report Bug](https://github.com/sinzo8771-prog/Smart-Study-Planner/issues) · [✨ Request Feature](https://github.com/sinzo8771-prog/Smart-Study-Planner/issues)
  
</div>

---

## 📋 Table of Contents

- [🎯 About The Project](#-about-the-project)
- [🎮 Demo Credentials](#-demo-credentials)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📱 Responsive Design](#-mobile-responsive-design)
- [🔐 Security Features](#-security-features)
- [📊 Database Schema](#-database-schema)
- [🔧 API Documentation](#-api-documentation)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Developer](#-developer)

---

## 🎯 About The Project

The **Smart Study Planner & Learning Management System** is a comprehensive, production-ready web application designed to help students organize their studies, track progress, and achieve academic excellence. Built with modern technologies and best practices, it features a professional SaaS-like interface with role-based access control for students and administrators.

### 🎓 Academic Project

This is a **First Year Project** demonstrating:
- ✅ Full-stack development expertise
- ✅ Modern web technologies mastery
- ✅ Clean architecture and code quality
- ✅ Production-ready implementation
- ✅ Professional UI/UX design

---

## 🎮 Demo Credentials

### Admin Account
| Field | Value |
|-------|-------|
| **Email** | `admin@studyplanner.com` |
| **Password** | `Admin@123456` |

### Student Accounts
| Email | Password |
|-------|----------|
| `john@example.com` | `Student@123` |
| `jane@example.com` | `Student@123` |
| `bob@example.com` | `Student@123` |

> ⚠️ **Note**: Demo accounts are for testing purposes only. Passwords are reset periodically.

---

## ✨ Key Features

### 📖 Smart Study Planner
| Feature | Description |
|---------|-------------|
| 📚 **Subject Management** | Create, edit, delete subjects with custom colors and exam dates |
| ✅ **Task Tracking** | Full CRUD operations with status tracking (pending, in-progress, completed) |
| 🎯 **Priority Levels** | Low, medium, high priority for better task organization |
| 📅 **Due Dates** | Track deadlines and exam dates with calendar view |
| 📊 **Progress Tracking** | Automatic completion percentage calculation per subject |

### 🎓 Learning Management System (LMS)
| Feature | Description |
|---------|-------------|
| 📋 **Course Management** | Admin can create, edit, publish courses |
| 📑 **Module Structure** | Organized learning content within courses |
| 📈 **Progress Tracking** | Real-time progress calculation for enrolled courses |
| 🏷️ **Categories** | Organize courses by category and difficulty level |
| 🎬 **Video Support** | Embed video content in modules |

### 🧠 Quiz & Assessment System
| Feature | Description |
|---------|-------------|
| 📝 **MCQ Creation** | Admin creates quizzes with multiple choice questions |
| ⚡ **Auto-Grading** | Instant score calculation with detailed results |
| 📋 **Review System** | Review answers with correct explanations |
| 🎯 **Pass Threshold** | Configurable passing scores per quiz |
| ⏱️ **Time Limits** | Optional quiz duration settings |
| 🤖 **AI Quiz Generator** | Generate quizzes from course content using AI |

### 📊 Analytics Dashboard
| Student Dashboard | Admin Dashboard |
|-------------------|-----------------|
| Subject statistics | User management |
| Task completion rates | Course analytics |
| Quiz scores & history | Quiz performance metrics |
| Progress charts | System overview |

### 🔐 Authentication & Security
- 📧 **Email/Password** - Traditional authentication with secure password hashing
- 👥 **Role-based Access** - Student and Admin roles
- 🛡️ **JWT Sessions** - Secure token-based authentication
- 🍪 **HTTP-only Cookies** - Protected session storage
- 🔒 **NextAuth.js** - Industry-standard authentication

### 🎨 User Experience
- 🌙 **Dark/Light Mode** - Toggle with system preference detection
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- ⚡ **Fast Performance** - Optimized loading and smooth animations
- 🎭 **Beautiful Animations** - Framer Motion powered transitions

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) | React framework with App Router |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) | Type-safe JavaScript |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css) | Utility-first CSS |
| ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-New%20York-black) | Beautiful UI components |
| ![Recharts](https://img.shields.io/badge/Recharts-2-red) | Data visualization charts |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple) | Smooth animations |
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-orange) | Beautiful icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Next.js API](https://img.shields.io/badge/Next.js-API%20Routes-black?logo=next.js) | RESTful API endpoints |
| ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma) | Database ORM |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql) | Production database |
| ![JWT](https://img.shields.io/badge/JWT-Auth-red) | Secure authentication |
| ![NextAuth](https://img.shields.io/badge/NextAuth.js-Auth-blue) | Authentication solution |

### Development
| Tool | Purpose |
|------|---------|
| ![Bun](https://img.shields.io/badge/Bun-Runtime-black) | Fast JavaScript runtime |
| ![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?logo=eslint) | Code quality |
| ![Git](https://img.shields.io/badge/Git-Version%20Control-F05032?logo=git) | Source control |

---

## 📸 Screenshots

### Landing Page
A beautiful, modern landing page showcasing the product features with animated elements, demo modal, and responsive design.

### Dashboard
Clean and intuitive dashboard with real-time statistics and quick actions.

### Study Planner
Organized subject and task management with progress tracking.

### Courses
Browse and enroll in courses with structured learning modules.

### Quizzes
Interactive quiz system with instant grading and results.

### Analytics
Detailed progress charts and performance metrics.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, or **bun** package manager
- **Git** for version control
- **PostgreSQL** database (or use Supabase, Neon, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sinzo8771-prog/Smart-Study-Planner.git
   cd Smart-Study-Planner
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database (Required)
   DATABASE_URL="postgresql://user:password@host:5432/database"
   DIRECT_DATABASE_URL="postgresql://user:password@host:5432/database"
   
   # Authentication (Required)
   JWT_SECRET="your-super-secret-key-min-32-characters"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # AI Quiz Generator (Optional - for AI features)
   Z_API_KEY="your-z-ai-api-key"
   ```

4. **Initialize the database**
   ```bash
   bun run db:push
   # or
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   bun run db:seed
   # or
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

7. **Open in browser**
   
   Navigate to `http://localhost:3000`

### First-Time Setup

1. Click **"Get Started"** on the landing page
2. Register with your email
3. Choose your role (Student or Admin)
4. Start exploring the features!

---

## 📱 Responsive Design

The application is fully responsive with a mobile-first approach:

| Device | Features |
|--------|----------|
| 📱 **Mobile** | Collapsible sidebar, touch-friendly UI, optimized layouts |
| 📱 **Tablet** | Adaptive grid layouts, enhanced navigation |
| 💻 **Desktop** | Full feature access, multi-column layouts |

---

## 🔐 Security Features

| Feature | Implementation | Description |
|---------|---------------|-------------|
| 🔑 **Password Security** | bcryptjs with 12 salt rounds | Industry-standard password hashing |
| 🎫 **JWT Tokens** | 7-day expiration with secure signing | Secure session management |
| 🍪 **Cookie Security** | HTTP-only, Secure (production), SameSite=Lax | Prevents XSS and CSRF attacks |
| 🛡️ **SQL Injection** | Prisma ORM parameterized queries | All database queries are parameterized |
| ✅ **Input Validation** | Server-side validation on all endpoints | Prevents malicious input |
| 🚦 **Rate Limiting** | 5 login attempts/min, 3 registrations/hour | Prevents brute force attacks |
| 🔒 **CORS Protection** | Configured for secure cross-origin requests | Restricts API access |
| 🧹 **XSS Prevention** | Input sanitization and output encoding | Prevents cross-site scripting |

### Security Best Practices
- All sensitive routes require authentication
- Admin routes verify role before access
- User can only access their own resources
- Tokens are validated on each request
- Secure headers configured in production
- Cookies set with appropriate flags for dev/production

---

## 📊 Database Schema

### Entity Relationship

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│   Subject   │────<│    Task     │
└─────────────┘     └─────────────┘     └─────────────┘
       │
       │            ┌─────────────┐     ┌─────────────┐
       └───────────<│   Course    │────<│   Module    │
                    └─────────────┘     └─────────────┘
                          │
       ┌─────────────┐    │     ┌─────────────┐
       │    Quiz     │────<└────<│QuizAttempt  │
       └─────────────┘          └─────────────┘
             │
       ┌─────────────┐
       │  Question   │
       └─────────────┘
```

### Core Models

<details>
<summary>📋 View Schema Details</summary>

```prisma
// User Management
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?
  role          String    @default("student")
  image         String?
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  
  subjects      Subject[]
  tasks         Task[]
  courseProgress CourseProgress[]
  quizAttempts  QuizAttempt[]
}

// Study Planner
model Subject {
  id          String   @id @default(cuid())
  name        String
  description String?
  color       String   @default("#6366f1")
  examDate    DateTime?
  userId      String
  tasks       Task[]
}

model Task {
  id          String   @id @default(cuid())
  title       String
  status      String   @default("pending")
  priority    String   @default("medium")
  dueDate     DateTime?
  subjectId   String
}
```
</details>

---

## 🔧 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login user | ❌ |
| `POST` | `/api/auth/logout` | Logout user | ✅ |
| `GET` | `/api/auth/session` | Get current session | ❌ |

### Subject Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/subjects` | List user's subjects | ✅ |
| `POST` | `/api/subjects` | Create subject | ✅ |
| `PUT` | `/api/subjects/:id` | Update subject | ✅ |
| `DELETE` | `/api/subjects/:id` | Delete subject | ✅ |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tasks` | List tasks (filterable) | ✅ |
| `POST` | `/api/tasks` | Create task | ✅ |
| `PUT` | `/api/tasks/:id` | Update task | ✅ |
| `DELETE` | `/api/tasks/:id` | Delete task | ✅ |

### Course Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `GET` | `/api/courses` | List courses | ✅ | Any |
| `POST` | `/api/courses` | Create course | ✅ | Admin |
| `PUT` | `/api/courses/:id` | Update course | ✅ | Admin |
| `DELETE` | `/api/courses/:id` | Delete course | ✅ | Admin |

### Quiz Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| `GET` | `/api/quizzes` | List quizzes | ✅ | Any |
| `POST` | `/api/quizzes` | Create quiz | ✅ | Admin |
| `POST` | `/api/quiz-attempts` | Submit quiz | ✅ | Student |
| `GET` | `/api/quiz-attempts/:id` | Get attempt | ✅ | Any |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/ai/generate-quiz` | Generate quiz from content | ✅ |

---

## 📦 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sinzo8771-prog/Smart-Study-Planner)

1. Fork this repository
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
# Required
DATABASE_URL="your-postgresql-connection-string"
DIRECT_DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-production-secret-min-32-chars"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"

# Optional - AI Quiz Generator
Z_API_KEY="your-z-ai-api-key"
```

### Database Setup with Supabase

1. Create a Supabase project
2. Get your database connection string from Project Settings > Database
3. Use port `6543` for connection pooling (DATABASE_URL)
4. Use port `5432` for direct connections (DIRECT_DATABASE_URL)

### Build Commands

```bash
# Build for production
bun run build

# Start production server
bun run start

# Run linting
bun run lint

# Push database schema
bun run db:push
```

---

## 📁 Project Structure

```
smart-study-planner/
├── 📂 prisma/
│   ├── 📄 schema.prisma         # Database schema
│   └── 📄 seed.ts               # Database seeding
├── 📂 src/
│   ├── 📂 app/
│   │   ├── 📂 api/              # API routes
│   │   │   ├── 📂 auth/         # Authentication
│   │   │   ├── 📂 subjects/     # Subject CRUD
│   │   │   ├── 📂 tasks/        # Task management
│   │   │   ├── 📂 courses/      # Course management
│   │   │   ├── 📂 quizzes/      # Quiz system
│   │   │   ├── 📂 ai/           # AI features
│   │   │   └── 📂 stats/        # Analytics
│   │   ├── 📄 page.tsx          # Main application
│   │   ├── 📄 layout.tsx        # Root layout
│   │   └── 📄 globals.css       # Global styles
│   ├── 📂 components/
│   │   ├── 📂 ui/               # shadcn/ui components
│   │   └── 📄 logo.tsx          # Logo component
│   ├── 📂 hooks/                # Custom hooks
│   └── 📂 lib/                  # Utilities
│       ├── 📄 auth.ts           # Auth helpers
│       ├── 📄 auth.config.ts    # NextAuth config
│       ├── 📄 auth-helpers.ts   # Auth utilities
│       ├── 📄 db.ts             # Prisma client
│       ├── 📄 validation.ts     # Input validation
│       └── 📄 data-service.ts   # Data fetching
├── 📂 public/                   # Static assets
├── 📄 package.json              # Dependencies
├── 📄 tailwind.config.ts        # Tailwind config
└── 📄 tsconfig.json             # TypeScript config
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is developed as a **First Year College Project**.

---

## 👨‍💻 Developer

<div align="center">

| Project Info | Details |
|--------------|---------|
| **Project** | Smart Study Planner & Learning Management System |
| **Type** | First Year Project |
| **Department** | Computer Science |
| **Academic Year** | 2025-2026 |
| **Developer** | [@sinzo8771-prog](https://github.com/sinzo8771-prog) |

</div>

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Recharts](https://recharts.org/) - Charting library
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

## 📝 Recent Updates

### Latest Changes
- ✅ Fixed authentication cookie settings for development environment
- ✅ Added NEXTAUTH environment variables for proper session management
- ✅ Enhanced subject API with better logging for debugging
- ✅ Removed deprecated AI chatbot and study tips features
- ✅ Improved database connection handling for Supabase pooler

---

<div align="center">

### ⭐ Star this repo if you find it useful! ⭐

**Built with ❤️ for students worldwide**

[⬆ Back to Top](#-smart-study-planner--lms)

</div>
