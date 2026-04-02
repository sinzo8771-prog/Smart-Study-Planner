# 🤝 Contributing to Smart Study Planner

<div align="center">

[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)]()
[![First Timers Friendly](https://img.shields.io/badge/First%20Timers-Friendly-blue?style=for-the-badge)]()
[![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=for-the-badge)]()

</div>

---

## 📋 Table of Contents

- [🎯 About Contributing](#-about-contributing)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Development Setup](#️-development-setup)
- [📝 Coding Standards](#-coding-standards)
- [🔄 Git Workflow](#-git-workflow)
- [📌 Pull Request Process](#-pull-request-process)
- [🐛 Reporting Bugs](#-reporting-bugs)
- [💡 Requesting Features](#-requesting-features)
- [📚 Documentation](#-documentation)
- [🏆 Recognition](#-recognition)

---

## 🎯 About Contributing

Thank you for your interest in contributing to **Smart Study Planner & LMS**! This project is a **First Year College Project** and we welcome contributions from everyone, whether you're a beginner or an experienced developer.

### Why Contribute?

- 🌟 **Learn** modern web development technologies
- 💪 **Gain** real-world open source experience
- 🎓 **Build** your portfolio with meaningful contributions
- 🤝 **Connect** with other developers
- 📱 **Impact** students worldwide

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Required |
|------|---------|----------|
| **Node.js** | 18+ | ✅ Yes |
| **Bun** | Latest | ⚡ Recommended |
| **Git** | 2.x | ✅ Yes |
| **Code Editor** | VS Code | 📝 Recommended |

### Fork and Clone

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Smart-Study-Planner.git
cd Smart-Study-Planner

# 3. Add upstream remote
git remote add upstream https://github.com/sinzo8771-prog/Smart-Study-Planner.git

# 4. Verify remotes
git remote -v
```

---

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-development-secret-key-min-32-characters"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Firebase (optional for development)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
```

### 3. Database Setup

```bash
# Push database schema
bun run db:push

# Seed with demo data (optional)
bun run db:seed
```

### 4. Start Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### 5. Run Linter

```bash
bun run lint
```

---

## 📝 Coding Standards

### TypeScript/JavaScript

```typescript
// ✅ Good - Use TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Good - Use async/await
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ❌ Bad - Avoid any type
const user: any = fetchData();

// ✅ Good - Use proper typing
const user: User = fetchData();
```

### React Components

```tsx
// ✅ Good - Functional component with props interface
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={cn("base-styles", variant === 'primary' && "primary-styles")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Hooks | camelCase with 'use' | `useAuth.ts` |
| API Routes | kebab-case | `auth/login/route.ts` |
| Constants | SCREAMING_SNAKE_CASE | `API_ENDPOINTS.ts` |

### CSS/Tailwind

```tsx
// ✅ Good - Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ✅ Good - Use cn() for conditional classes
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  isDisabled && "disabled-styles"
)}>

// ❌ Bad - Avoid inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### Code Comments

```typescript
// ✅ Good - Explain WHY, not WHAT
// Use bcrypt with 12 rounds for optimal security/performance balance
const hashedPassword = await bcrypt.hash(password, 12);

// ✅ Good - Document complex logic
/**
 * Calculates the completion percentage for a subject
 * based on completed tasks vs total tasks
 */
function calculateProgress(subject: Subject): number {
  // Implementation
}

// ❌ Bad - Obvious comments
// Set loading to true
setLoading(true);
```

---

## 🔄 Git Workflow

### Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-dark-mode` |
| Bug Fix | `fix/description` | `fix/login-validation` |
| Documentation | `docs/description` | `docs/api-documentation` |
| Refactor | `refactor/description` | `refactor/auth-service` |
| Style | `style/description` | `style/button-hover-effects` |

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, etc) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

#### Examples

```bash
# Feature
feat(auth): add password reset functionality

# Bug fix
fix(dashboard): resolve chart rendering issue on mobile

# Documentation
docs(readme): update installation instructions

# Breaking change
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: The auth endpoints now require Bearer token
```

### Syncing Your Fork

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your branch
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 📌 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All linting errors are resolved
- [ ] Changes are tested locally
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with upstream

### PR Template

Fill out the PR template completely:

1. **Description**: What changes does this PR introduce?
2. **Type of Change**: Bug fix, feature, breaking change, etc.
3. **Testing**: How was this tested?
4. **Screenshots**: If applicable, add screenshots
5. **Checklist**: Complete all items

### Review Process

1. **Automated Checks**: Linting and build checks run automatically
2. **Code Review**: At least one maintainer will review your PR
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, it will be merged

### After Merge

- Delete your feature branch
- Sync your fork with upstream
- Celebrate! 🎉

---

## 🐛 Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Test with latest version** to ensure bug still exists
3. **Gather information**: browser, OS, steps to reproduce

### Bug Report Template

Include the following:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device
- **Additional Context**: Any other relevant information

### Example

```markdown
## Bug: Login button not working on mobile

### Steps to Reproduce
1. Open app on mobile device
2. Navigate to login page
3. Enter credentials
4. Click login button
5. Nothing happens

### Expected
User should be logged in and redirected to dashboard

### Actual
Button click has no response

### Environment
- Device: iPhone 13
- Browser: Safari 16
- OS: iOS 16.4
```

---

## 💡 Requesting Features

### Before Requesting

1. **Search existing requests** to avoid duplicates
2. **Check roadmap** for planned features
3. **Consider scope** - is it within project goals?

### Feature Request Template

Include the following:

- **Problem**: What problem does this solve?
- **Solution**: How would you like it to work?
- **Alternatives**: Any alternatives considered?
- **Use Case**: How would this be used?
- **Priority**: How important is this feature?

---

## 📚 Documentation

### Types of Documentation

| Type | Location | Description |
|------|----------|-------------|
| **README** | `README.md` | Project overview, setup |
| **API Docs** | API routes | Endpoint documentation |
| **Code Comments** | Source files | Inline documentation |
| **Security** | `SECURITY.md` | Security policies |

### Improving Documentation

- Fix typos and grammar
- Add missing documentation
- Clarify confusing sections
- Add code examples
- Update screenshots

---

## 🏆 Recognition

### Contributors

All contributors are recognized in:

- **README.md**: Contributors section
- **Release Notes**: Mentions for significant contributions
- **GitHub**: Automatic contributor recognition

### Types of Contributions

We recognize all types of contributions:

- 💻 Code
- 📝 Documentation
- 🎨 Design
- 🐛 Bug reports
- 💡 Feature ideas
- 📢 Promotion
- 🤝 Code review

---

## 📞 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and discussions
- **Email**: sinzo8771@gmail.com (for private inquiries)

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing! 🎉**

Made with ❤️ by the Smart Study Planner community

[⬆ Back to Top](#-contributing-to-smart-study-planner)

</div>
