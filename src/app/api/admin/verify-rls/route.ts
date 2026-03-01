import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * API endpoint to verify RLS (Row Level Security) setup
 * This checks if RLS policies are properly configured
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const sessionHeader = request.headers.get('x-user-session');
    let user = null;
    
    if (sessionHeader) {
      try {
        user = JSON.parse(sessionHeader);
      } catch {
        // Ignore parse errors
      }
    }

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Query to check RLS status on all tables
    const rlsStatus = await db.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        rowsecurity as rls_enabled
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN (
        'User', 'Account', 'Session', 'VerificationToken',
        'Subject', 'Task', 'Course', 'Module',
        'CourseProgress', 'ModuleProgress', 'Quiz', 'Question',
        'QuizAttempt', 'UserActivity'
      )
      ORDER BY tablename;
    `;

    // Query to get all RLS policies
    const policies = await db.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;

    // Count policies per table
    const policyCounts = await db.$queryRaw<{ tablename: string; count: bigint }[]>`
      SELECT 
        tablename,
        COUNT(*) as count
      FROM pg_policies 
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename;
    `;

    // Check if helper functions exist
    const functions = await db.$queryRaw<{ proname: string }[]>`
      SELECT proname 
      FROM pg_proc 
      WHERE proname IN ('is_admin', 'current_user_id');
    `;

    const tablesWithoutRLS = (rlsStatus as { tablename: string; rls_enabled: boolean }[])
      .filter(t => !t.rls_enabled)
      .map(t => t.tablename);

    return NextResponse.json({
      success: true,
      rlsSetup: {
        allTablesHaveRLS: tablesWithoutRLS.length === 0,
        tablesWithoutRLS,
        tablesWithRLS: (rlsStatus as { tablename: string; rls_enabled: boolean }[])
          .filter(t => t.rls_enabled)
          .map(t => t.tablename),
      },
      policies: {
        totalPolicies: (policies as unknown[]).length,
        byTable: Object.fromEntries(
          policyCounts.map(p => [p.tablename, Number(p.count)])
        ),
        details: policies,
      },
      helperFunctions: {
        hasIsAdmin: functions.some(f => f.proname === 'is_admin'),
        hasCurrentUserId: functions.some(f => f.proname === 'current_user_id'),
      },
      instructions: tablesWithoutRLS.length > 0
        ? `Run the RLS policies SQL file in Supabase SQL Editor to enable RLS on: ${tablesWithoutRLS.join(', ')}`
        : 'RLS is properly configured on all tables.',
    });
  } catch (error) {
    console.error('Error verifying RLS:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify RLS setup',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
