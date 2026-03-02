-- ============================================================
-- Row Level Security (RLS) Policies for Smart Study Planner
-- ============================================================
-- Run this SQL in your Supabase SQL Editor to enable RLS
-- 
-- IMPORTANT: 
-- 1. Run this AFTER your tables are created (after prisma db push)
-- 2. This assumes you're using Supabase Auth with JWT tokens
-- 3. The auth.uid() function returns the authenticated user's ID
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role
  -- This works with Prisma-generated user IDs
  RETURN EXISTS (
    SELECT 1 FROM "User" 
    WHERE "id" = auth.uid()::text 
    AND "role" = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a function to get current user ID as text
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Module" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CourseProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ModuleProgress" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Quiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserActivity" ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USER TABLE POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON "User" FOR SELECT
  USING ("id" = current_user_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "User" FOR UPDATE
  USING ("id" = current_user_id());

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON "User" FOR SELECT
  USING (is_admin());

-- Admins can update all users
CREATE POLICY "Admins can update all users"
  ON "User" FOR UPDATE
  USING (is_admin());

-- Allow insert during registration (public access)
CREATE POLICY "Allow public registration"
  ON "User" FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- ACCOUNT TABLE POLICIES
-- ============================================================

-- Users can view their own accounts
CREATE POLICY "Users can view own accounts"
  ON "Account" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own accounts (OAuth)
CREATE POLICY "Users can insert own accounts"
  ON "Account" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can delete their own accounts
CREATE POLICY "Users can delete own accounts"
  ON "Account" FOR DELETE
  USING ("userId" = current_user_id());

-- ============================================================
-- SESSION TABLE POLICIES
-- ============================================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON "Session" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
  ON "Session" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON "Session" FOR DELETE
  USING ("userId" = current_user_id());

-- ============================================================
-- VERIFICATION TOKEN POLICIES
-- ============================================================

-- Allow verification by identifier (email) - needed for email verification
CREATE POLICY "Allow verification token lookup"
  ON "VerificationToken" FOR SELECT
  USING (true);

-- Allow insert for verification tokens
CREATE POLICY "Allow verification token insert"
  ON "VerificationToken" FOR INSERT
  WITH CHECK (true);

-- Allow delete after use
CREATE POLICY "Allow verification token delete"
  ON "VerificationToken" FOR DELETE
  USING (true);

-- ============================================================
-- SUBJECT TABLE POLICIES
-- ============================================================

-- Users can view only their own subjects
CREATE POLICY "Users can view own subjects"
  ON "Subject" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own subjects
CREATE POLICY "Users can insert own subjects"
  ON "Subject" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can update their own subjects
CREATE POLICY "Users can update own subjects"
  ON "Subject" FOR UPDATE
  USING ("userId" = current_user_id());

-- Users can delete their own subjects
CREATE POLICY "Users can delete own subjects"
  ON "Subject" FOR DELETE
  USING ("userId" = current_user_id());

-- Admins can view all subjects
CREATE POLICY "Admins can view all subjects"
  ON "Subject" FOR SELECT
  USING (is_admin());

-- ============================================================
-- TASK TABLE POLICIES
-- ============================================================

-- Users can view only their own tasks
CREATE POLICY "Users can view own tasks"
  ON "Task" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON "Task" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON "Task" FOR UPDATE
  USING ("userId" = current_user_id());

-- Users can delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON "Task" FOR DELETE
  USING ("userId" = current_user_id());

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks"
  ON "Task" FOR SELECT
  USING (is_admin());

-- ============================================================
-- COURSE TABLE POLICIES
-- ============================================================

-- All authenticated users can view published courses
CREATE POLICY "Users can view published courses"
  ON "Course" FOR SELECT
  USING ("isPublished" = true OR "createdBy" = current_user_id() OR is_admin());

-- Admins and creators can view all their courses
CREATE POLICY "Creators can view own courses"
  ON "Course" FOR SELECT
  USING ("createdBy" = current_user_id());

-- Admins can insert courses
CREATE POLICY "Admins can insert courses"
  ON "Course" FOR INSERT
  WITH CHECK (is_admin() OR "createdBy" = current_user_id());

-- Admins and creators can update courses
CREATE POLICY "Admins and creators can update courses"
  ON "Course" FOR UPDATE
  USING (is_admin() OR "createdBy" = current_user_id());

-- Admins and creators can delete courses
CREATE POLICY "Admins and creators can delete courses"
  ON "Course" FOR DELETE
  USING (is_admin() OR "createdBy" = current_user_id());

-- ============================================================
-- MODULE TABLE POLICIES
-- ============================================================

-- Users can view modules of published courses or their own courses
CREATE POLICY "Users can view course modules"
  ON "Module" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Course"
      WHERE "Course"."id" = "Module"."courseId"
      AND ("Course"."isPublished" = true OR "Course"."createdBy" = current_user_id() OR is_admin())
    )
  );

-- Admins and course creators can insert modules
CREATE POLICY "Admins can insert modules"
  ON "Module" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Course"
      WHERE "Course"."id" = "Module"."courseId"
      AND (is_admin() OR "Course"."createdBy" = current_user_id())
    )
  );

-- Admins and course creators can update modules
CREATE POLICY "Admins can update modules"
  ON "Module" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Course"
      WHERE "Course"."id" = "Module"."courseId"
      AND (is_admin() OR "Course"."createdBy" = current_user_id())
    )
  );

-- Admins and course creators can delete modules
CREATE POLICY "Admins can delete modules"
  ON "Module" FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "Course"
      WHERE "Course"."id" = "Module"."courseId"
      AND (is_admin() OR "Course"."createdBy" = current_user_id())
    )
  );

-- ============================================================
-- COURSE PROGRESS POLICIES
-- ============================================================

-- Users can view their own progress
CREATE POLICY "Users can view own progress"
  ON "CourseProgress" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON "CourseProgress" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON "CourseProgress" FOR UPDATE
  USING ("userId" = current_user_id());

-- Admins can view all progress
CREATE POLICY "Admins can view all progress"
  ON "CourseProgress" FOR SELECT
  USING (is_admin());

-- ============================================================
-- MODULE PROGRESS POLICIES
-- ============================================================

-- Users can view their own module progress
CREATE POLICY "Users can view own module progress"
  ON "ModuleProgress" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own module progress
CREATE POLICY "Users can insert own module progress"
  ON "ModuleProgress" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can update their own module progress
CREATE POLICY "Users can update own module progress"
  ON "ModuleProgress" FOR UPDATE
  USING ("userId" = current_user_id());

-- Admins can view all module progress
CREATE POLICY "Admins can view all module progress"
  ON "ModuleProgress" FOR SELECT
  USING (is_admin());

-- ============================================================
-- QUIZ TABLE POLICIES
-- ============================================================

-- Users can view published quizzes
CREATE POLICY "Users can view published quizzes"
  ON "Quiz" FOR SELECT
  USING ("isPublished" = true OR "createdBy" = current_user_id() OR is_admin());

-- Admins can insert quizzes
CREATE POLICY "Admins can insert quizzes"
  ON "Quiz" FOR INSERT
  WITH CHECK (is_admin() OR "createdBy" = current_user_id());

-- Admins and creators can update quizzes
CREATE POLICY "Admins can update quizzes"
  ON "Quiz" FOR UPDATE
  USING (is_admin() OR "createdBy" = current_user_id());

-- Admins and creators can delete quizzes
CREATE POLICY "Admins can delete quizzes"
  ON "Quiz" FOR DELETE
  USING (is_admin() OR "createdBy" = current_user_id());

-- ============================================================
-- QUESTION TABLE POLICIES
-- ============================================================

-- Users can view questions of published quizzes
CREATE POLICY "Users can view quiz questions"
  ON "Question" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Quiz"
      WHERE "Quiz"."id" = "Question"."quizId"
      AND ("Quiz"."isPublished" = true OR "Quiz"."createdBy" = current_user_id() OR is_admin())
    )
  );

-- Admins and quiz creators can insert questions
CREATE POLICY "Admins can insert questions"
  ON "Question" FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "Quiz"
      WHERE "Quiz"."id" = "Question"."quizId"
      AND (is_admin() OR "Quiz"."createdBy" = current_user_id())
    )
  );

-- Admins and quiz creators can update questions
CREATE POLICY "Admins can update questions"
  ON "Question" FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "Quiz"
      WHERE "Quiz"."id" = "Question"."quizId"
      AND (is_admin() OR "Quiz"."createdBy" = current_user_id())
    )
  );

-- Admins and quiz creators can delete questions
CREATE POLICY "Admins can delete questions"
  ON "Question" FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "Quiz"
      WHERE "Quiz"."id" = "Question"."quizId"
      AND (is_admin() OR "Quiz"."createdBy" = current_user_id())
    )
  );

-- ============================================================
-- QUIZ ATTEMPT POLICIES
-- ============================================================

-- Users can view their own quiz attempts
CREATE POLICY "Users can view own attempts"
  ON "QuizAttempt" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own quiz attempts
CREATE POLICY "Users can insert own attempts"
  ON "QuizAttempt" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Users can update their own quiz attempts
CREATE POLICY "Users can update own attempts"
  ON "QuizAttempt" FOR UPDATE
  USING ("userId" = current_user_id());

-- Admins can view all quiz attempts
CREATE POLICY "Admins can view all attempts"
  ON "QuizAttempt" FOR SELECT
  USING (is_admin());

-- ============================================================
-- USER ACTIVITY POLICIES
-- ============================================================

-- Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON "UserActivity" FOR SELECT
  USING ("userId" = current_user_id());

-- Users can insert their own activity
CREATE POLICY "Users can insert own activity"
  ON "UserActivity" FOR INSERT
  WITH CHECK ("userId" = current_user_id());

-- Admins can view all activity
CREATE POLICY "Admins can view all activity"
  ON "UserActivity" FOR SELECT
  USING (is_admin());

-- ============================================================
-- GRANT NECESSARY PERMISSIONS
-- ============================================================

-- Grant execute permissions on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION current_user_id() TO authenticated;

-- Grant necessary table permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================
-- VERIFICATION QUERIES (Run these to verify RLS is working)
-- ============================================================

-- Check if RLS is enabled on all tables
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('User', 'Subject', 'Task', 'Course', 'Module', 'Quiz', 'Question', 'QuizAttempt', 'CourseProgress', 'ModuleProgress');

-- List all policies on a table
-- SELECT * FROM pg_policies WHERE tablename = 'User';

-- ============================================================
-- NOTES
-- ============================================================
/*
IMPORTANT CONSIDERATIONS:

1. SERVICE ROLE BYPASS:
   - The Supabase service_role key bypasses RLS
   - Use this only for backend/admin operations
   - NEVER expose this key to the client

2. ANON vs AUTHENTICATED:
   - anon key users are unauthenticated
   - authenticated users have a valid JWT
   - This setup assumes all app users are authenticated

3. PRISMA COMPATIBILITY:
   - Prisma uses prepared statements
   - The pgbouncer=true in your DATABASE_URL handles this
   - RLS policies work with Prisma's query patterns

4. TESTING RLS:
   - Always test with a real user JWT, not service_role
   - Use Supabase's SQL editor with "Run as role" feature
   - Verify that users can only see their own data

5. UPDATING POLICIES:
   - To modify a policy: DROP POLICY "policy_name" ON "table_name";
   - Then recreate with new definition

6. PERFORMANCE:
   - RLS adds minimal overhead
   - Indexes on userId columns help performance
   - Consider composite indexes for complex queries
*/
