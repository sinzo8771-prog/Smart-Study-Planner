# 🔐 Security Policy

<div align="center">

[![Security](https://img.shields.io/badge/Security-Policy-green?style=for-the-badge)]()
[![Supported Versions](https://img.shields.io/badge/Supported-Versions-blue?style=for-the-badge)]()
[![Report Vulnerability](https://img.shields.io/badge/Report-Vulnerability-red?style=for-the-badge)]()

</div>

---

## 📋 Table of Contents

- [🛡️ Supported Versions](#️-supported-versions)
- [🔒 Security Features](#-security-features)
- [🚦 Rate Limiting](#-rate-limiting)
- [🔐 Authentication Security](#-authentication-security)
- [🛡️ Data Protection](#️-data-protection)
- [🍪 Cookie Security](#-cookie-security)
- [🌐 API Security](#-api-security)
- [🚨 Reporting a Vulnerability](#-reporting-a-vulnerability)
- [⚠️ Security Considerations](#️-security-considerations)
- [📊 Security Audit](#-security-audit)
- [🔧 Incident Response](#-incident-response)

---

## 🛡️ Supported Versions

| Version | Supported | Status |
| ------- | --------- | ------ |
| 1.0.x   | ✅ Yes    | Active Development |

> **Note**: This project is currently in active development as a First Year College Project. Security updates are provided for the latest version only.

---

## 🔒 Security Features

### Implemented Security Measures

| Category | Feature | Implementation | Status |
|----------|---------|---------------|--------|
| **Authentication** | Password Hashing | bcryptjs with 12 salt rounds | ✅ Implemented |
| **Authentication** | JWT Tokens | 7-day expiration with issuer/audience | ✅ Implemented |
| **Authentication** | Google OAuth | Firebase Authentication | ✅ Implemented |
| **Authentication** | Email Verification | Required before login | ✅ Implemented |
| **Authorization** | Role-Based Access | Student/Admin roles | ✅ Implemented |
| **Authorization** | Resource Ownership | User can only access own data | ✅ Implemented |
| **Protection** | Rate Limiting | Login & Registration endpoints | ✅ Implemented |
| **Protection** | SQL Injection | Prisma ORM parameterized queries | ✅ Implemented |
| **Protection** | XSS Prevention | Input sanitization + React escaping | ✅ Implemented |
| **Protection** | CSRF Protection | SameSite=Strict cookies | ✅ Implemented |
| **Session** | HTTP-Only Cookies | Prevents JavaScript access | ✅ Implemented |
| **Session** | Secure Flag | HTTPS-only in production | ✅ Implemented |

---

## 🚦 Rate Limiting

Rate limiting is implemented to prevent brute force attacks and abuse.

### Endpoint Limits

| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| `/api/auth/login` | 5 requests | 1 minute per IP | Prevent brute force login attempts |
| `/api/auth/register` | 3 requests | 1 hour per IP | Prevent automated account creation |
| `/api/auth/forgot-password` | 3 requests | 1 hour per IP | Prevent email flooding |

### Rate Limit Response

When rate limited, the API returns:
- **Status**: `429 Too Many Requests`
- **Headers**: `Retry-After: <seconds>`
- **Body**: `{ "error": "Too many attempts...", "retryAfter": <seconds> }`

### Implementation Details

```typescript
// In-memory rate limiting with automatic cleanup
import { checkRateLimit } from '@/lib/validation';

const rateLimit = checkRateLimit(`login:${ip}`, 5, 60000);
if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: 'Too many login attempts', retryAfter: ... },
    { status: 429 }
  );
}
```

---

## 🔐 Authentication Security

### Password Requirements

| Requirement | Description |
|-------------|-------------|
| Minimum Length | 8 characters |
| Uppercase Letter | At least 1 required |
| Lowercase Letter | At least 1 required |
| Number | At least 1 required |

### Password Hashing

```typescript
// Using bcryptjs with 12 salt rounds
import bcrypt from 'bcryptjs';

// Hashing
const hashedPassword = await bcrypt.hash(password, 12);

// Verification (timing-safe)
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Token Security

| Property | Value | Purpose |
|----------|-------|---------|
| Algorithm | HS256 | Secure signing |
| Expiration | 7 days | Balance security and UX |
| Issuer | `smart-study-planner` | Token validation |
| Audience | `smart-study-planner-users` | Token validation |
| Issued At (iat) | Included | Prevent token reuse |

### Token Validation Flow

1. Extract token from HTTP-only cookie
2. Verify signature with JWT_SECRET
3. Check issuer and audience match
4. Verify not expired
5. Fetch user from database (not token alone)
6. Verify user still exists and is active

---

## 🛡️ Data Protection

### SQL Injection Prevention

All database queries use Prisma ORM with parameterized queries:

```typescript
// ✅ SAFE - Prisma parameterizes queries
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// ❌ NEVER do this - raw string interpolation
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
```

### XSS Prevention

Multiple layers of XSS protection:

| Layer | Implementation |
|-------|---------------|
| React | Automatic escaping of JSX expressions |
| Input Sanitization | `sanitizeString()` removes dangerous patterns |
| CSP Headers | Restricts script sources |
| HTTP-Only Cookies | Prevents JavaScript access to session |

### Input Sanitization

```typescript
// Removes dangerous HTML/JS patterns
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '')           // Remove < and >
    .replace(/javascript:/gi, '')    // Remove javascript: protocol
    .replace(/on\w+=/gi, '')         // Remove event handlers
    .trim();
}
```

### Validation Utilities

```typescript
// Email validation
isValidEmail(email: string): boolean

// Password strength
isValidPassword(password: string): { valid: boolean; error?: string }

// Name validation
isValidName(name: string): { valid: boolean; error?: string }

// ID validation (CUID/UUID)
isValidId(id: string): boolean
```

---

## 🍪 Cookie Security

### Cookie Configuration

```typescript
{
  httpOnly: true,           // Prevents JavaScript access
  secure: true,             // HTTPS only (production)
  sameSite: 'strict',       // Prevents CSRF
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',                // Available site-wide
}
```

### Why These Settings Matter

| Setting | Threat Mitigated |
|---------|-----------------|
| `httpOnly: true` | XSS attacks cannot steal cookies |
| `secure: true` | Man-in-the-middle attacks on HTTP |
| `sameSite: 'strict'` | CSRF attacks from external sites |
| Short `maxAge` | Limits window if token is stolen |

---

## 🌐 API Security

### Request Validation

All API endpoints implement:

1. **Input Validation**: Check required fields and formats
2. **Authentication**: Verify user is logged in
3. **Authorization**: Verify user has permission
4. **Resource Ownership**: Verify user owns the resource

### Protected Routes

| Route Type | Protection |
|------------|------------|
| Public (`/api/auth/*`) | None or rate limiting |
| User (`/api/subjects/*`, etc.) | Authentication required |
| Admin (`/api/users/*`, etc.) | Authentication + Admin role |

### Error Handling

Errors are handled securely:

```typescript
// ✅ GOOD - Generic error message
if (!user) {
  return NextResponse.json(
    { error: 'Invalid email or password' },
    { status: 401 }
  );
}

// ❌ BAD - Reveals if email exists
if (!user) {
  return NextResponse.json({ error: 'Email not found' });
}
```

---

## 🚨 Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for the vulnerability
2. **Email** the developer directly at: `sinzo8771@gmail.com`
3. **Include** the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Proof of concept (if applicable)
   - Suggested fix (if any)

### Response Timeline

| Stage | Timeline | Description |
|-------|----------|-------------|
| **Acknowledgment** | Within 48 hours | Confirm receipt of report |
| **Triage** | Within 7 days | Assess severity and validity |
| **Fix Development** | 1-14 days | Depends on complexity |
| **Testing** | 1-3 days | Verify fix doesn't break functionality |
| **Release** | Within 24 hours of testing | Deploy patched version |

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| 🔴 **Critical** | Remote code execution, data breach | 24 hours |
| 🟠 **High** | Authentication bypass, privilege escalation | 48 hours |
| 🟡 **Medium** | XSS, CSRF, information disclosure | 7 days |
| 🟢 **Low** | Minor issues, best practice improvements | 14 days |

### What to Expect

- ✅ You will receive acknowledgment of your report
- ✅ We will investigate and assess the vulnerability
- ✅ A fix will be developed and tested
- ✅ You will be notified when the fix is released
- ✅ Credit will be given (if desired) in security advisories

---

## ⚠️ Security Considerations

### Current Limitations

| Consideration | Status | Recommendation |
|--------------|--------|----------------|
| **CAPTCHA** | ⚠️ Not implemented | Add for registration forms |
| **Two-Factor Auth** | ⚠️ Not implemented | Consider for sensitive operations |
| **Password Reset Tokens** | ✅ Implemented with expiration | Already secure |
| **Audit Logging** | ⚠️ Not implemented | Add for compliance requirements |
| **IP-based Blocking** | ⚠️ Basic rate limiting only | Consider for enhanced protection |

### Production Deployment Checklist

Before deploying to production, ensure:

- [ ] Change all default secrets and keys
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Generate strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure secure cookie settings (`secure: true`)
- [ ] Set NODE_ENV to `production`
- [ ] Review and update CORS policies
- [ ] Enable security headers (CSP, HSTS, X-Frame-Options)
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Configure database SSL connection
- [ ] Review rate limiting thresholds
- [ ] Remove or secure demo accounts
- [ ] Disable debug endpoints

### Environment Variables Security

```env
# Required - Generate with: openssl rand -base64 32
JWT_SECRET=your-32-character-minimum-secret-key
NEXTAUTH_SECRET=your-32-character-minimum-secret-key

# Database - Use SSL in production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Set production mode
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

---

## 📊 Security Audit

### Last Audit Information

| Field | Value |
|-------|-------|
| **Date** | January 2025 |
| **Type** | Self-audit |
| **Scope** | Authentication, Authorization, Data Protection |

### Security Checklist

#### Authentication & Authorization

| Item | Status | Notes |
|------|--------|-------|
| Password hashing (bcrypt) | ✅ Pass | 12 salt rounds |
| Password strength validation | ✅ Pass | Min 8 chars, mixed case, number |
| JWT token security | ✅ Pass | Signed, expiration, issuer/audience |
| Session management | ✅ Pass | HTTP-only, Secure, SameSite cookies |
| OAuth implementation | ✅ Pass | Firebase Google OAuth |
| Email verification | ✅ Pass | Required before login |
| Role-based access control | ✅ Pass | Student/Admin roles |
| Resource ownership checks | ✅ Pass | Users can only access own data |

#### Data Protection

| Item | Status | Notes |
|------|--------|-------|
| SQL injection prevention | ✅ Pass | Prisma ORM parameterized queries |
| XSS prevention | ✅ Pass | React escaping + input sanitization |
| CSRF protection | ✅ Pass | SameSite=Strict cookies |
| Input validation | ✅ Pass | Server-side validation on all endpoints |
| Error message security | ✅ Pass | Generic errors, no sensitive data exposed |

#### Network Security

| Item | Status | Notes |
|------|--------|-------|
| HTTPS enforcement | ✅ Pass | Required in production |
| Secure cookies | ✅ Pass | Secure flag set in production |
| Rate limiting | ✅ Pass | Login, register, password reset |
| CORS configuration | ⚠️ Review | Verify for production needs |
| Security headers | ⚠️ Review | CSP, HSTS recommended |

#### Dependencies

| Item | Status | Notes |
|------|--------|-------|
| No known vulnerabilities | ✅ Pass | Run `bun audit` regularly |
| Dependencies up to date | ✅ Pass | Regular updates |
| No deprecated packages | ✅ Pass | Monitored |

---

## 🔧 Incident Response

### Response Process

```
1. Detection → 2. Analysis → 3. Containment → 4. Eradication → 5. Recovery → 6. Lessons Learned
```

### Immediate Actions

If a security breach is suspected:

1. **Assess**: Determine scope and severity
2. **Contain**: Disable affected accounts/features
3. **Communicate**: Notify affected users
4. **Fix**: Patch the vulnerability
5. **Review**: Post-incident analysis

### Contact for Incidents

- **Security Issues**: sinzo8771@gmail.com
- **GitHub**: [@sinzo8771-prog](https://github.com/sinzo8771-prog)

---

## 🔗 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)
- [JWT Best Practices](https://auth0.com/blog/jwt-authentication-best-practices/)
- [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

---

## 📞 Contact

For security-related inquiries:

- **Security Issues**: sinzo8771@gmail.com
- **GitHub**: [@sinzo8771-prog](https://github.com/sinzo8771-prog)
- **Issues**: [GitHub Issues](https://github.com/sinzo8771-prog/Smart-Study-Planner/issues)

---

<div align="center">

**Thank you for helping keep Smart Study Planner secure! 🔐**

[⬆ Back to Top](#-security-policy)

</div>
