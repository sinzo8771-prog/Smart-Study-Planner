'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

// Custom hook for mounted state to avoid lint issues
function useMounted() {
  const mountedRef = useRef(false);
  const [mounted, setMountedState] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        setMountedState(true);
      }
    }, 0);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, []);

  return mounted;
}
import {
  Moon, Sun, Menu, X, CheckCircle, Clock, Target, TrendingUp, Users, BookOpen,
  Brain, Award, ChevronRight, Star, Zap, Shield, BarChart3, Play, ArrowRight,
  GraduationCap, Calendar, ClipboardList, LucideIcon, Home, Settings, LogOut,
  Plus, Edit, Trash2, Search, Filter, MoreVertical, Eye, Timer, AlertCircle,
  ChevronDown, ChevronLeft, PieChart, LineChart, Activity, Layers, FileText,
  Video, Check, XCircle, HelpCircle, RefreshCw, Download, Upload, UserCog,
  LayoutDashboard, ListTodo, GraduationCap as GradCap, Building2, Sparkles,
  MessageCircle, Send, Bot, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, Line, Area, AreaChart, Legend } from 'recharts';
import { Logo, LogoIcon } from '@/components/logo';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string;
  createdAt?: string;
}

interface Subject {
  id: string;
  name: string;
  description?: string;
  color: string;
  examDate?: string;
  createdAt: string;
  _count?: { tasks: number };
  tasks?: Task[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  subjectId: string;
  subject?: Subject;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  level: string;
  duration: number;
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  _count?: { modules: number };
  modules?: Module[];
  progress?: number;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration: number;
  order: number;
  courseId: string;
  completed?: boolean;
}

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  points: number;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  duration: number;
  passingScore: number;
  isPublished: boolean;
  courseId?: string;
  createdAt: string;
  questions?: Question[];
  _count?: { questions: number; quizAttempts: number };
}

interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  totalPoints: number;
  earnedPoints: number;
  answers: string;
  startedAt: string;
  completedAt?: string;
  timeTaken: number;
  quiz?: Quiz;
}

interface Stats {
  // Student stats (nested structure from API)
  subjects?: {
    total: number;
  };
  tasks?: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    completionRate: number;
  };
  quizzes?: {
    totalAttempts: number;
    passed: number;
    averageScore: number;
    bestScore: number;
    passRate: number;
    recentAttempts: Array<{
      quizTitle: string;
      score: number;
      passed: boolean;
      completedAt: string | null;
    }>;
  };
  courses?: {
    enrolled: number;
    completed: number;
    averageProgress: number;
  };
  upcomingTasks?: Array<{
    id: string;
    title: string;
    dueDate: string | null;
    priority: string;
    subject: { name: string; color: string } | null;
  }>;
  // Admin stats (nested structure from API)
  users?: {
    total: number;
    students: number;
    admins: number;
    recentNewUsers: number;
  };
  // Legacy flat structure for backwards compatibility
  subjectsCount?: number;
  tasksStats?: { total: number; completed: number; pending: number; inProgress: number };
  averageQuizScore?: number;
  quizPassRate?: number;
  coursesInProgress?: number;
  totalUsers?: number;
  totalStudents?: number;
  totalAdmins?: number;
  totalCourses?: number;
  totalQuizzes?: number;
  totalAttempts?: number;
  recentUsers?: User[];
}

// ============================================
// CONSTANTS
// ============================================

const SUBJECT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#1d4ed8'
];

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#22c55e', '#06b6d4'];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'pending': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// ============================================
// API HELPERS
// ============================================

const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
  async post<T>(url: string, data?: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'API Error');
    }
    return res.json();
  },
  async put<T>(url: string, data?: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'API Error');
    }
    return res.json();
  },
  async delete<T>(url: string): Promise<T> {
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  },
};

// ============================================
// LANDING PAGE COMPONENTS (Keep previous implementation)
// ============================================

const GradientIcon = ({ icon: Icon, className = '' }: { icon: LucideIcon; className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50" />
    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

// ============================================
// DASHBOARD LAYOUT
// ============================================

interface DashboardLayoutProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ user, currentView, onViewChange, onLogout, children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const navItems = user.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Logo size="sm" />
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {currentView === 'dashboard' ? 'Dashboard' : currentView}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge variant="outline" className="mt-1 capitalize">{user.role}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onViewChange('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
};

// ============================================
// AI CHAT WIDGET
// ============================================

interface AIChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChatWidget = ({ isOpen, onClose }: AIChatWidgetProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI Study Assistant. How can I help you today? I can help with study tips, explain concepts, or answer academic questions.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t connect to the AI service. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Study Assistant</h3>
            <p className="text-xs text-white/80">Powered by AI</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// STUDENT DASHBOARD
// ============================================

interface StudentDashboardProps {
  user: User;
  onViewChange: (view: string) => void;
}

const StudentDashboard = ({ user, onViewChange }: StudentDashboardProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, subjectsData, tasksData] = await Promise.all([
          api.get<Stats>('/api/stats'),
          api.get<{ subjects: Subject[] }>('/api/subjects'),
          api.get<{ tasks: Task[] }>('/api/tasks?status=pending'),
        ]);
        setStats(statsData);
        setSubjects(subjectsData.subjects || []);
        setRecentTasks((tasksData.tasks || []).slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const taskCompletionRate = stats?.tasksStats
    ? Math.round((stats.tasksStats.completed / stats.tasksStats.total) * 100) || 0
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
            <p className="text-white/80 mb-4">Continue your learning journey. Here&apos;s your progress overview.</p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => onViewChange('planner')}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Subject
              </Button>
              <Button
                variant="outline"
                onClick={() => onViewChange('courses')}
                className="text-white border-white/30 hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Courses
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Subjects"
          value={stats?.subjectsCount || 0}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Tasks Completed"
          value={stats?.tasksStats?.completed || 0}
          subtitle={`of ${stats?.tasksStats?.total || 0} total`}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
        />
        <StatsCard
          title="Avg Quiz Score"
          value={`${Math.round(stats?.averageQuizScore || 0)}%`}
          icon={Award}
          color="from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Courses in Progress"
          value={stats?.coursesInProgress || 0}
          icon={Layers}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Task Progress</span>
              <Badge variant="secondary">{taskCompletionRate}% Complete</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={taskCompletionRate} className="h-3" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{stats?.tasksStats?.completed || 0} Completed</span>
                <span>{stats?.tasksStats?.inProgress || 0} In Progress</span>
                <span>{stats?.tasksStats?.pending || 0} Pending</span>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="mt-6 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Completed', value: stats?.tasksStats?.completed || 0, fill: '#22c55e' },
                  { name: 'In Progress', value: stats?.tasksStats?.inProgress || 0, fill: '#3b82f6' },
                  { name: 'Pending', value: stats?.tasksStats?.pending || 0, fill: '#f59e0b' },
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <Button variant="ghost" size="sm" onClick={() => onViewChange('planner')}>
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: task.subject?.color || '#6366f1' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.subject?.name}</p>
                        {task.dueDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            Due: {formatDate(task.dueDate)}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 mb-4">No subjects yet. Start by adding your first subject.</p>
              <Button onClick={() => onViewChange('planner')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <Card key={subject.id} className="overflow-hidden">
                  <div
                    className="h-2"
                    style={{ backgroundColor: subject.color }}
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{subject.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {subject.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {subject._count?.tasks || 0} tasks
                      </span>
                      {subject.examDate && (
                        <Badge variant="outline">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(subject.examDate)}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// STATS CARD COMPONENT
// ============================================

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, color, onClick }: StatsCardProps) => (
  <Card className={onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''} onClick={onClick}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ============================================
// STUDY PLANNER MODULE
// ============================================

interface StudyPlannerProps {
  user: User;
}

const StudyPlanner = ({ user: _user }: StudyPlannerProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'subject' | 'task'; id: string } | null>(null);

  // Form states
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    color: SUBJECT_COLORS[0],
    examDate: '',
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: '',
    subjectId: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [subjectsRes, tasksRes] = await Promise.all([
        api.get<{ subjects: Subject[] }>('/api/subjects'),
        api.get<{ tasks: Task[] }>('/api/tasks'),
      ]);
      setSubjects(subjectsRes.subjects || []);
      setTasks(tasksRes.tasks || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subject handlers
  const handleSaveSubject = async () => {
    try {
      if (editingSubject) {
        await api.put(`/api/subjects/${editingSubject.id}`, subjectForm);
      } else {
        await api.post('/api/subjects', subjectForm);
      }
      setIsSubjectDialogOpen(false);
      resetSubjectForm();
      fetchData();
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await api.delete(`/api/subjects/${id}`);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const resetSubjectForm = () => {
    setSubjectForm({ name: '', description: '', color: SUBJECT_COLORS[0], examDate: '' });
    setEditingSubject(null);
  };

  // Task handlers
  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, taskForm);
      } else {
        await api.post('/api/tasks', taskForm);
      }
      setIsTaskDialogOpen(false);
      resetTaskForm();
      fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/api/tasks/${task.id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      subjectId: selectedSubject?.id || '',
    });
    setEditingTask(null);
  };

  // Calculate completion percentage
  const getCompletionPercentage = (subjectId: string) => {
    const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
    if (subjectTasks.length === 0) return 0;
    const completed = subjectTasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / subjectTasks.length) * 100);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Planner</h2>
          <p className="text-gray-500">Organize your subjects and tasks</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              resetTaskForm();
              setIsTaskDialogOpen(true);
            }}
            disabled={subjects.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              resetSubjectForm();
              setIsSubjectDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Subjects"
          value={subjects.length}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          icon={ClipboardList}
          color="from-purple-500 to-purple-600"
        />
        <StatsCard
          title="Completed"
          value={tasks.filter(t => t.status === 'completed').length}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
        />
        <StatsCard
          title="Pending"
          value={tasks.filter(t => t.status === 'pending').length}
          icon={Clock}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="subjects" className="w-full">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="tasks">All Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-6">
          {subjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No subjects yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your first subject to organize your studies</p>
                <Button onClick={() => setIsSubjectDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Subject
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => {
                const completion = getCompletionPercentage(subject.id);
                const subjectTasks = tasks.filter(t => t.subjectId === subject.id);

                return (
                  <Card key={subject.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-2" style={{ backgroundColor: subject.color }} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{subject.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {subject.description || 'No description'}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingSubject(subject);
                                setSubjectForm({
                                  name: subject.name,
                                  description: subject.description || '',
                                  color: subject.color,
                                  examDate: subject.examDate ? new Date(subject.examDate).toISOString().split('T')[0] : '',
                                });
                                setIsSubjectDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm({ type: 'subject', id: subject.id })}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500">Completion</span>
                          <span className="font-medium">{completion}%</span>
                        </div>
                        <Progress value={completion} className="h-2" />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{subjectTasks.length} tasks</span>
                        <span>{subjectTasks.filter(t => t.status === 'completed').length} completed</span>
                      </div>

                      {/* Exam Date */}
                      {subject.examDate && (
                        <Badge variant="outline" className="mb-4">
                          <Calendar className="w-3 h-3 mr-1" />
                          Exam: {formatDate(subject.examDate)}
                        </Badge>
                      )}

                      {/* Recent Tasks */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Recent Tasks</p>
                        {subjectTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800"
                          >
                            <button
                              onClick={() => handleToggleTaskStatus(task)}
                              className="shrink-0"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                              )}
                            </button>
                            <span className={`text-sm truncate ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setTaskForm(prev => ({ ...prev, subjectId: subject.id }));
                          setIsTaskDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Tasks</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={selectedSubject?.id || 'all'}
                    onValueChange={(value) => setSelectedSubject(value === 'all' ? null : subjects.find(s => s.id === value) || null)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks yet. Add your first task to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter(t => !selectedSubject || t.subjectId === selectedSubject.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <button
                          onClick={() => handleToggleTaskStatus(task)}
                          className="shrink-0"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-colors" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: task.subject?.color }}
                            />
                            <span className="text-sm text-gray-500">{task.subject?.name}</span>
                            {task.dueDate && (
                              <span className="text-sm text-gray-400">
                                Due: {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingTask(task);
                                setTaskForm({
                                  title: task.title,
                                  description: task.description || '',
                                  status: task.status,
                                  priority: task.priority,
                                  dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                                  subjectId: task.subjectId,
                                });
                                setIsTaskDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm({ type: 'task', id: task.id })}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Calendar view coming soon!</p>
                <p className="text-sm mt-2">View your tasks and exam dates in a calendar format.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Subject Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
            <DialogDescription>
              {editingSubject ? 'Update subject details' : 'Create a new subject to organize your tasks'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Subject Name *</Label>
              <Input
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                placeholder="e.g., Mathematics"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {SUBJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      subjectForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSubjectForm({ ...subjectForm, color })}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Exam Date</Label>
              <Input
                type="date"
                value={subjectForm.examDate}
                onChange={(e) => setSubjectForm({ ...subjectForm, examDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSubject} disabled={!subjectForm.name}>
              {editingSubject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Task Title *</Label>
              <Input
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                placeholder="e.g., Complete Chapter 5 exercises"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                placeholder="Task details..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject *</Label>
                <Select
                  value={taskForm.subjectId}
                  onValueChange={(value) => setTaskForm({ ...taskForm, subjectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setTaskForm({ ...taskForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setTaskForm({ ...taskForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={!taskForm.title || !taskForm.subjectId}>
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. {deleteConfirm?.type === 'subject'
                ? 'This will permanently delete the subject and all its tasks.'
                : 'This will permanently delete this task.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirm?.type === 'subject') {
                  handleDeleteSubject(deleteConfirm.id);
                } else if (deleteConfirm?.type === 'task') {
                  handleDeleteTask(deleteConfirm.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ============================================
// COURSES MODULE (LMS)
// ============================================

interface CoursesModuleProps {
  user: User;
}

const CoursesModule = ({ user }: CoursesModuleProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'course' | 'module'; id: string } | null>(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as const,
    duration: 0,
    isPublished: false,
  });

  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: 0,
    order: 0,
    courseId: '',
  });

  const fetchCourses = useCallback(async () => {
    try {
      const data = await api.get<{ courses: Course[] }>('/api/courses');
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSaveCourse = async () => {
    try {
      if (editingCourse) {
        await api.put(`/api/courses/${editingCourse.id}`, courseForm);
      } else {
        await api.post('/api/courses', courseForm);
      }
      setIsCourseDialogOpen(false);
      resetCourseForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await api.delete(`/api/courses/${id}`);
      setDeleteConfirm(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: '',
      level: 'beginner',
      duration: 0,
      isPublished: false,
    });
    setEditingCourse(null);
  };

  const handleViewCourse = async (course: Course) => {
    try {
      const data = await api.get<{ course: Course }>(`/api/courses/${course.id}`);
      setSelectedCourse(data.course);
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleModuleProgress = async (moduleId: string, completed: boolean) => {
    try {
      await api.post('/api/progress', { moduleId, completed });
      if (selectedCourse) {
        handleViewCourse(selectedCourse);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedCourse ? selectedCourse.title : 'Courses'}
          </h2>
          <p className="text-gray-500">
            {selectedCourse ? selectedCourse.description : 'Browse and learn from our course library'}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCourse ? (
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          ) : isAdmin && (
            <Button onClick={() => setIsCourseDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          )}
        </div>
      </div>

      {selectedCourse ? (
        // Course Detail View
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Your Progress</p>
                  <p className="text-2xl font-bold">{Math.round(selectedCourse.progress || 0)}%</p>
                </div>
                <Badge className={getLevelColor(selectedCourse.level)}>{selectedCourse.level}</Badge>
              </div>
              <Progress value={selectedCourse.progress || 0} className="h-3" />
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Modules</CardTitle>
                {isAdmin && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setModuleForm({ ...moduleForm, courseId: selectedCourse.id });
                      setIsModuleDialogOpen(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCourse.modules?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No modules yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedCourse.modules?.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{module.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {module.duration > 0 && (
                            <span><Clock className="w-3 h-3 inline mr-1" />{formatDuration(module.duration)}</span>
                          )}
                          {module.videoUrl && <span><Video className="w-3 h-3 inline mr-1" />Video</span>}
                        </div>
                      </div>
                      {module.completed !== undefined && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleModuleProgress(module.id, !module.completed)}
                        >
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                          )}
                        </Button>
                      )}
                      {isAdmin && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setEditingModule(module);
                              setModuleForm({
                                title: module.title,
                                description: module.description || '',
                                content: module.content || '',
                                videoUrl: module.videoUrl || '',
                                duration: module.duration,
                                order: module.order,
                                courseId: selectedCourse.id,
                              });
                              setIsModuleDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm({ type: 'module', id: module.id })}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // Course List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No courses available</h3>
                <p className="text-gray-500 mb-4">
                  {isAdmin ? 'Create your first course to get started.' : 'Check back later for new courses!'}
                </p>
                {isAdmin && (
                  <Button onClick={() => setIsCourseDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-white/50" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setEditingCourse(course);
                            setCourseForm({
                              title: course.title,
                              description: course.description || '',
                              category: course.category || '',
                              level: course.level as 'beginner' | 'intermediate' | 'advanced',
                              duration: course.duration,
                              isPublished: course.isPublished,
                            });
                            setIsCourseDialogOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm({ type: 'course', id: course.id })}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                    {course.category && <Badge variant="outline">{course.category}</Badge>}
                    {!course.isPublished && <Badge variant="secondary">Draft</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course._count?.modules || 0} modules</span>
                    {course.duration > 0 && <span>{formatDuration(course.duration)}</span>}
                  </div>
                  <Button className="w-full" onClick={() => handleViewCourse(course)}>
                    View Course
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Course Dialog */}
      <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Course Title *</Label>
              <Input
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="e.g., Introduction to Web Development"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Course description..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                  placeholder="e.g., Programming"
                />
              </div>
              <div>
                <Label>Level</Label>
                <Select
                  value={courseForm.level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                    setCourseForm({ ...courseForm, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseForm.isPublished}
                    onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Publish immediately</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCourse} disabled={!courseForm.title}>
              {editingCourse ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingModule ? 'Edit Module' : 'Add Module'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Module Title *</Label>
              <Input
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                placeholder="e.g., Introduction to HTML"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={moduleForm.content}
                onChange={(e) => setModuleForm({ ...moduleForm, content: e.target.value })}
                placeholder="Module content (markdown supported)..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Video URL</Label>
                <Input
                  value={moduleForm.videoUrl}
                  onChange={(e) => setModuleForm({ ...moduleForm, videoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={moduleForm.duration}
                  onChange={(e) => setModuleForm({ ...moduleForm, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              try {
                if (editingModule) {
                  await api.put(`/api/modules/${editingModule.id}`, moduleForm);
                } else {
                  await api.post('/api/modules', moduleForm);
                }
                setIsModuleDialogOpen(false);
                setEditingModule(null);
                if (selectedCourse) handleViewCourse(selectedCourse);
              } catch (error) {
                console.error('Error saving module:', error);
              }
            }} disabled={!moduleForm.title}>
              {editingModule ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this {deleteConfirm?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteConfirm?.type === 'course') {
                  await handleDeleteCourse(deleteConfirm.id);
                } else if (deleteConfirm?.type === 'module') {
                  await api.delete(`/api/modules/${deleteConfirm.id}`);
                  if (selectedCourse) handleViewCourse(selectedCourse);
                }
                setDeleteConfirm(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ============================================
// QUIZ MODULE
// ============================================

interface QuizModuleProps {
  user: User;
}

const QuizModule = ({ user }: QuizModuleProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // AI Quiz Generator states
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Record<string, unknown>[] | null>(null);
  const [aiError, setAiError] = useState('');

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    courseId: '',
    duration: 30,
    passingScore: 60,
    isPublished: false,
    questions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1 }],
  });

  const fetchQuizzes = useCallback(async () => {
    try {
      const data = await api.get<{ quizzes: Quiz[] }>('/api/quizzes');
      setQuizzes(data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleSaveQuiz = async () => {
    try {
      if (editingQuiz) {
        await api.put(`/api/quizzes/${editingQuiz.id}`, quizForm);
      } else {
        await api.post('/api/quizzes', quizForm);
      }
      setIsQuizDialogOpen(false);
      resetQuizForm();
      fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    try {
      await api.delete(`/api/quizzes/${id}`);
      setDeleteConfirm(null);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const resetQuizForm = () => {
    setQuizForm({
      title: '',
      description: '',
      courseId: '',
      duration: 30,
      passingScore: 60,
      isPublished: false,
      questions: [{ question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1 }],
    });
    setEditingQuiz(null);
  };

  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      const data = await api.get<{ quiz: Quiz }>(`/api/quizzes/${quiz.id}`);
      setSelectedQuiz(data.quiz);
      setIsTakingQuiz(true);
      setAnswers({});
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;
    try {
      const data = await api.post<{ attempt: QuizAttempt }>('/api/quiz-attempts', {
        quizId: selectedQuiz.id,
        answers,
      });
      setAttempt(data.attempt);
      setIsTakingQuiz(false);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1 }],
    });
  };

  const updateQuestion = (index: number, field: string, value: string | number) => {
    const updated = [...quizForm.questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuizForm({ ...quizForm, questions: updated });
  };

  const removeQuestion = (index: number) => {
    if (quizForm.questions.length > 1) {
      setQuizForm({ ...quizForm, questions: quizForm.questions.filter((_, i) => i !== index) });
    }
  };

  // AI Quiz Generation Functions
  const handleGenerateAIQuestions = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setAiError('');
    setGeneratedQuestions(null);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          count: aiQuestionCount,
          difficulty: aiDifficulty,
        }),
      });

      const data = await response.json();

      if (data.success && data.questions) {
        setGeneratedQuestions(data.questions);
      } else {
        setAiError(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setAiError('Failed to connect to AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseGeneratedQuestions = () => {
    if (generatedQuestions && generatedQuestions.length > 0) {
      const formattedQuestions = generatedQuestions.map((q: Record<string, unknown>, index: number) => ({
        question: String(q.question || ''),
        optionA: String(q.optionA || ''),
        optionB: String(q.optionB || ''),
        optionC: String(q.optionC || ''),
        optionD: String(q.optionD || ''),
        correctAnswer: ['A', 'B', 'C', 'D'].includes(String(q.correctAnswer)) ? String(q.correctAnswer) : 'A',
        explanation: String(q.explanation || ''),
        points: Number(q.points) || 1,
      }));
      
      setQuizForm(prev => ({
        ...prev,
        questions: formattedQuestions,
        title: prev.title || `${aiTopic} Quiz`,
        description: prev.description || `AI-generated quiz about ${aiTopic} at ${aiDifficulty} difficulty level.`,
      }));
      
      setIsAIGeneratorOpen(false);
      setGeneratedQuestions(null);
      setAiTopic('');
    }
  };

  const resetAIGenerator = () => {
    setAiTopic('');
    setAiQuestionCount(5);
    setAiDifficulty('medium');
    setGeneratedQuestions(null);
    setAiError('');
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const isAdmin = user.role === 'admin';
  const passed = attempt && attempt.score >= (selectedQuiz?.passingScore || 60);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isTakingQuiz ? selectedQuiz?.title : attempt ? 'Quiz Results' : 'Quizzes'}
          </h2>
          <p className="text-gray-500">
            {isTakingQuiz ? 'Answer all questions to complete the quiz' : attempt ? 'Your quiz attempt results' : 'Test your knowledge with interactive quizzes'}
          </p>
        </div>
        <div className="flex gap-2">
          {isTakingQuiz ? (
            <>
              <Button variant="outline" onClick={() => setIsTakingQuiz(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < (selectedQuiz?.questions?.length || 0)}>
                Submit Quiz
              </Button>
            </>
          ) : attempt ? (
            <Button onClick={() => { setAttempt(null); setSelectedQuiz(null); }}>
              Back to Quizzes
            </Button>
          ) : isAdmin && (
            <Button onClick={() => setIsQuizDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
          )}
        </div>
      </div>

      {isTakingQuiz && selectedQuiz ? (
        // Quiz Taking View
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions</CardTitle>
              <Badge variant="outline">
                {Object.keys(answers).length} / {selectedQuiz.questions?.length} answered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {selectedQuiz.questions?.map((q, index) => (
                <div key={q.id || index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="font-medium mb-4">
                    {index + 1}. {q.question}
                    <span className="text-sm text-gray-500 ml-2">({q.points} pts)</span>
                  </p>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          answers[q.id] === opt
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        <span className="font-medium mr-2">{opt}.</span>
                        {q[`option${opt}` as keyof Question] as string}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : attempt ? (
        // Results View
        <div className="space-y-6">
          <Card className={passed ? 'border-green-500' : 'border-red-500'}>
            <CardContent className="p-8 text-center">
              {passed ? (
                <CheckCircle className="w-20 h-20 mx-auto mb-4 text-green-500" />
              ) : (
                <XCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
              )}
              <h3 className="text-2xl font-bold mb-2">
                {passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h3>
              <p className="text-gray-500 mb-4">
                {passed ? 'You passed the quiz!' : `You need ${selectedQuiz?.passingScore}% to pass.`}
              </p>
              <div className="flex items-center justify-center gap-8">
                <div>
                  <p className="text-3xl font-bold">{Math.round(attempt.score)}%</p>
                  <p className="text-sm text-gray-500">Score</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">{attempt.earnedPoints}/{attempt.totalPoints}</p>
                  <p className="text-sm text-gray-500">Points</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Answers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedQuiz?.questions?.map((q, index) => {
                  const userAnswer = JSON.parse(attempt.answers)[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div key={q.id || index} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                        <p className="font-medium">{index + 1}. {q.question}</p>
                      </div>
                      <p className="ml-7 text-sm">
                        Your answer: <strong>{userAnswer}. {q[`option${userAnswer}` as keyof Question] as string}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="ml-7 text-sm text-green-600">
                          Correct answer: <strong>{q.correctAnswer}. {q[`option${q.correctAnswer}` as keyof Question] as string}</strong>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="ml-7 text-sm text-gray-500 mt-2">{q.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Quiz List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
                <p className="text-gray-500 mb-4">
                  {isAdmin ? 'Create your first quiz to test your students.' : 'Check back later for new quizzes!'}
                </p>
                {isAdmin && (
                  <Button onClick={() => setIsQuizDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {isAdmin && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setEditingQuiz(quiz);
                            setQuizForm({
                              title: quiz.title,
                              description: quiz.description || '',
                              courseId: quiz.courseId || '',
                              duration: quiz.duration,
                              passingScore: quiz.passingScore,
                              isPublished: quiz.isPublished,
                              questions: quiz.questions?.map(q => ({
                                question: q.question,
                                optionA: q.optionA,
                                optionB: q.optionB,
                                optionC: q.optionC,
                                optionD: q.optionD,
                                correctAnswer: q.correctAnswer,
                                explanation: q.explanation || '',
                                points: q.points,
                              })) || [],
                            });
                            setIsQuizDialogOpen(true);
                          }}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteConfirm(quiz.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">
                      <Timer className="w-3 h-3 mr-1" />
                      {quiz.duration} min
                    </Badge>
                    <Badge variant="outline">
                      {quiz._count?.questions || 0} questions
                    </Badge>
                    <Badge variant="outline">
                      Pass: {quiz.passingScore}%
                    </Badge>
                  </div>
                  <Button className="w-full" onClick={() => handleStartQuiz(quiz)}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Quiz Creation Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quiz Title *</Label>
                <Input
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g., JavaScript Basics Quiz"
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={quizForm.duration}
                  onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={quizForm.description}
                onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) || 60 })}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={quizForm.isPublished}
                    onChange={(e) => setQuizForm({ ...quizForm, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Publish immediately</span>
                </label>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">Questions</Label>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                    onClick={() => setIsAIGeneratorOpen(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> AI Generate
                  </Button>
                  <Button size="sm" variant="outline" onClick={addQuestion}>
                    <Plus className="w-4 h-4 mr-2" /> Add Question
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {quizForm.questions.map((q, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">Question {index + 1}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeQuestion(index)}
                          disabled={quizForm.questions.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Textarea
                          value={q.question}
                          onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                          placeholder="Enter question..."
                          rows={2}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={q.optionA}
                            onChange={(e) => updateQuestion(index, 'optionA', e.target.value)}
                            placeholder="Option A"
                          />
                          <Input
                            value={q.optionB}
                            onChange={(e) => updateQuestion(index, 'optionB', e.target.value)}
                            placeholder="Option B"
                          />
                          <Input
                            value={q.optionC}
                            onChange={(e) => updateQuestion(index, 'optionC', e.target.value)}
                            placeholder="Option C"
                          />
                          <Input
                            value={q.optionD}
                            onChange={(e) => updateQuestion(index, 'optionD', e.target.value)}
                            placeholder="Option D"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Correct Answer</Label>
                            <Select
                              value={q.correctAnswer}
                              onValueChange={(value) => updateQuestion(index, 'correctAnswer', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A</SelectItem>
                                <SelectItem value="B">B</SelectItem>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="D">D</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Points</Label>
                            <Input
                              type="number"
                              value={q.points}
                              onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </div>
                        <Textarea
                          value={q.explanation}
                          onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                          placeholder="Explanation (optional)..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveQuiz} disabled={!quizForm.title || quizForm.questions.some(q => !q.question || !q.optionA || !q.optionB)}>
              {editingQuiz ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this quiz and all attempts.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDeleteQuiz(deleteConfirm)} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Quiz Generator Dialog */}
      <Dialog open={isAIGeneratorOpen} onOpenChange={(open) => {
        setIsAIGeneratorOpen(open);
        if (!open) resetAIGenerator();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Quiz Generator
            </DialogTitle>
            <DialogDescription>
              Generate quiz questions automatically using AI. Enter a topic and customize the settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Topic / Subject *</Label>
              <Input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., JavaScript fundamentals, World War II, Photosynthesis..."
                className="text-base"
              />
              <p className="text-xs text-gray-500">
                Be specific for better results. Examples: "JavaScript ES6 features", "American Civil War", "Organic Chemistry basics"
              </p>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={String(aiQuestionCount)} onValueChange={(v) => setAiQuestionCount(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 10, 15, 20].map(n => (
                      <SelectItem key={n} value={String(n)}>{n} questions</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy - Basic concepts</SelectItem>
                    <SelectItem value="medium">Medium - Intermediate</SelectItem>
                    <SelectItem value="hard">Hard - Advanced topics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Message */}
            {aiError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {aiError}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerateAIQuestions}
              disabled={isGenerating || !aiTopic.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate {aiQuestionCount} Questions
                </>
              )}
            </Button>

            {/* Generated Questions Preview */}
            {generatedQuestions && generatedQuestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-green-600 dark:text-green-400">
                    ✓ Generated {generatedQuestions.length} Questions
                  </Label>
                  <Badge variant="secondary">{aiDifficulty} difficulty</Badge>
                </div>

                <ScrollArea className="h-64 w-full border rounded-lg">
                  <div className="p-4 space-y-4">
                    {generatedQuestions.map((q, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium mb-2">
                          {index + 1}. {String(q.question)}
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-sm">
                          <p className={q.correctAnswer === 'A' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                            A: {String(q.optionA)} {q.correctAnswer === 'A' && '✓'}
                          </p>
                          <p className={q.correctAnswer === 'B' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                            B: {String(q.optionB)} {q.correctAnswer === 'B' && '✓'}
                          </p>
                          <p className={q.correctAnswer === 'C' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                            C: {String(q.optionC)} {q.correctAnswer === 'C' && '✓'}
                          </p>
                          <p className={q.correctAnswer === 'D' ? 'text-green-600 font-medium' : 'text-gray-600'}>
                            D: {String(q.optionD)} {q.correctAnswer === 'D' && '✓'}
                          </p>
                        </div>
                        {q.explanation && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            💡 {String(q.explanation)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetAIGenerator}
                    className="flex-1"
                  >
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleUseGeneratedQuestions}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use These Questions
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAIGeneratorOpen(false);
              resetAIGenerator();
            }}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// ANALYTICS MODULE
// ============================================

interface AnalyticsModuleProps {
  user: User;
}

const AnalyticsModule = ({ user }: AnalyticsModuleProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, subjectsData, tasksData] = await Promise.all([
          api.get<Stats>('/api/stats'),
          api.get<{ subjects: Subject[] }>('/api/subjects'),
          api.get<{ tasks: Task[] }>('/api/tasks'),
        ]);
        setStats(statsData);
        setSubjects(subjectsData.subjects || []);
        setTasks(tasksData.tasks || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const isAdmin = user.role === 'admin';

  // Generate real task status data for charts
  const taskStatusData = [
    { name: 'Completed', value: stats?.tasks?.completed || stats?.tasksStats?.completed || 0, fill: '#22c55e', icon: CheckCircle },
    { name: 'In Progress', value: stats?.tasks?.inProgress || stats?.tasksStats?.inProgress || 0, fill: '#3b82f6', icon: Clock },
    { name: 'Pending', value: stats?.tasks?.pending || stats?.tasksStats?.pending || 0, fill: '#f59e0b', icon: AlertCircle },
  ];

  // Generate subject distribution data from real subjects
  const subjectDistribution = subjects.map((subject, index) => ({
    name: subject.name,
    value: subject._count?.tasks || 0,
    color: subject.color || SUBJECT_COLORS[index % SUBJECT_COLORS.length],
  }));

  // Generate weekly activity data from recent tasks
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + mondayOffset + index);
      const dateStr = date.toDateString();

      const dayTasks = tasks.filter(t => new Date(t.createdAt).toDateString() === dateStr);
      const completed = dayTasks.filter(t => t.status === 'completed').length;
      const created = dayTasks.length;

      return {
        name: day,
        date: formatDate(date),
        completed,
        created,
        total: dayTasks.length,
      };
    });
  };

  const weeklyData = generateWeeklyData();

  // Generate monthly trend data
  const generateMonthlyTrend = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });

      const monthTasks = tasks.filter(t => {
        const taskDate = new Date(t.createdAt);
        return taskDate.getMonth() === date.getMonth() &&
               taskDate.getFullYear() === date.getFullYear();
      });

      months.push({
        name: monthName,
        tasks: monthTasks.length,
        completed: monthTasks.filter(t => t.status === 'completed').length,
      });
    }

    return months;
  };

  const monthlyTrend = generateMonthlyTrend();

  // Calculate insights
  const completionRate = stats?.tasks?.completionRate ||
    (stats?.tasksStats ? (stats.tasksStats.completed / (stats.tasksStats.total || 1)) * 100 : 0);
  const productivityScore = Math.min(100, Math.round(
    (completionRate * 0.4) +
    ((stats?.quizzes?.passRate || 0) * 0.3) +
    ((stats?.courses?.averageProgress || 0) * 0.3)
  ));

  // Quiz performance data
  const quizPerformance = stats?.quizzes?.recentAttempts?.map(attempt => ({
    name: attempt.quizTitle.substring(0, 15) + (attempt.quizTitle.length > 15 ? '...' : ''),
    score: Math.round(attempt.score),
    passed: attempt.passed,
  })) || [];

  // Admin specific data
  const userDistribution = [
    { name: 'Students', value: stats?.users?.students || stats?.totalStudents || 0, color: '#22c55e' },
    { name: 'Admins', value: stats?.users?.admins || stats?.totalAdmins || 0, color: '#6366f1' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-500">Track your learning progress and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {isAdmin ? (
        // ==========================================
        // ADMIN ANALYTICS
        // ==========================================
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Users"
              value={stats?.users?.total || stats?.totalUsers || 0}
              subtitle={`+${stats?.users?.recentNewUsers || 0} this week`}
              icon={Users}
              color="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Active Students"
              value={stats?.users?.students || stats?.totalStudents || 0}
              subtitle={`${Math.round((stats?.users?.students || 0) / Math.max(1, stats?.users?.total || 1) * 100)}% of users`}
              icon={GraduationCap}
              color="from-green-500 to-green-600"
            />
            <StatsCard
              title="Total Courses"
              value={stats?.courses?.total || stats?.totalCourses || 0}
              subtitle="Published content"
              icon={BookOpen}
              color="from-purple-500 to-purple-600"
            />
            <StatsCard
              title="Quiz Attempts"
              value={stats?.quizzes?.totalAttempts || stats?.totalAttempts || 0}
              subtitle={`Avg: ${Math.round(stats?.quizzes?.averageScore || 0)}%`}
              icon={Brain}
              color="from-orange-500 to-orange-600"
            />
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Distribution */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  User Distribution
                </CardTitle>
                <CardDescription>Breakdown of user roles</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {userDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="ml-auto text-sm text-gray-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Platform Activity
                </CardTitle>
                <CardDescription>Tasks created vs completed this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-green-600">Completed: {payload[0]?.value}</p>
                              <p className="text-sm text-blue-600">Created: {payload[1]?.value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} name="Completed" />
                    <Bar dataKey="created" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Created" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                  Task Status Overview
                </CardTitle>
                <CardDescription>All tasks across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {taskStatusData.map((item, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: item.fill }} />
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.name}</p>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={taskStatusData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quiz Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Quiz Statistics
                </CardTitle>
                <CardDescription>Platform-wide quiz performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {Math.round(stats?.quizzes?.averageScore || 0)}%
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Pass Rate</p>
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round(stats?.quizzes?.passRate || 0)}%
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Quizzes</span>
                    <span className="font-semibold">{stats?.quizzes?.total || stats?.totalQuizzes || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Attempts</span>
                    <span className="font-semibold">{stats?.quizzes?.totalAttempts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Recent Attempts (7d)</span>
                    <span className="font-semibold">{stats?.quizzes?.recentAttempts || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        // ==========================================
        // STUDENT ANALYTICS
        // ==========================================
        <>
          {/* Productivity Score Banner */}
          <Card className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white border-0 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Your Productivity Score</h3>
                  <p className="text-white/80 text-sm mb-4">Based on task completion, quiz performance, and course progress</p>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">{productivityScore}</div>
                    <div className="text-sm">
                      <p className="text-white/80">out of 100</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Keep it up!</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-32 h-32 relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="white"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${productivityScore * 3.52} 352`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatsCard
              title="Subjects"
              value={stats?.subjects?.total || stats?.subjectsCount || 0}
              icon={BookOpen}
              color="from-blue-500 to-blue-600"
            />
            <StatsCard
              title="Tasks Completed"
              value={stats?.tasks?.completed || stats?.tasksStats?.completed || 0}
              subtitle={`${Math.round(completionRate)}% rate`}
              icon={CheckCircle}
              color="from-green-500 to-green-600"
            />
            <StatsCard
              title="Quiz Average"
              value={`${Math.round(stats?.quizzes?.averageScore || stats?.averageQuizScore || 0)}%`}
              icon={Award}
              color="from-purple-500 to-purple-600"
            />
            <StatsCard
              title="Courses Enrolled"
              value={stats?.courses?.enrolled || stats?.coursesInProgress || 0}
              subtitle={`${stats?.courses?.completed || 0} completed`}
              icon={Layers}
              color="from-orange-500 to-orange-600"
            />
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>Your task activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                              <p className="font-medium">{label}</p>
                              {payload.map((p, i) => (
                                <p key={i} className="text-sm" style={{ color: p.color }}>
                                  {p.name}: {p.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                      name="Completed"
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCreated)"
                      name="Created"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Task Status
                </CardTitle>
                <CardDescription>Current task breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <RechartsPieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {taskStatusData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-orange-600" />
                  Tasks by Subject
                </CardTitle>
                <CardDescription>Distribution of your tasks across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                {subjectDistribution.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No subjects yet</p>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPieChart>
                        <Pie
                          data={subjectDistribution.filter(s => s.value > 0)}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${name.substring(0, 8)} ${(percent * 100).toFixed(0)}%`}
                        >
                          {subjectDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {subjectDistribution.slice(0, 4).map((subject, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                          <span className="text-sm truncate">{subject.name}</span>
                          <span className="ml-auto text-sm font-medium">{subject.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quiz Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-600" />
                  Quiz Performance
                </CardTitle>
                <CardDescription>Your recent quiz scores</CardDescription>
              </CardHeader>
              <CardContent>
                {quizPerformance.length === 0 ? (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No quiz attempts yet</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats?.quizzes?.totalAttempts || 0}</p>
                        <p className="text-xs text-gray-500">Attempts</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats?.quizzes?.passed || 0}</p>
                        <p className="text-xs text-gray-500">Passed</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{Math.round(stats?.quizzes?.bestScore || 0)}%</p>
                        <p className="text-xs text-gray-500">Best Score</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {stats?.quizzes?.recentAttempts?.slice(0, 4).map((attempt, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {attempt.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{attempt.quizTitle}</p>
                            {attempt.completedAt && (
                              <p className="text-xs text-gray-500">{formatDate(attempt.completedAt)}</p>
                            )}
                          </div>
                          <Badge variant={attempt.passed ? 'default' : 'destructive'}>
                            {Math.round(attempt.score)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                6-Month Activity Trend
              </CardTitle>
              <CardDescription>Your learning journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsLineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-blue-600">Tasks: {payload[0]?.value}</p>
                            <p className="text-sm text-green-600">Completed: {payload[1]?.value}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    name="Tasks Created"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2 }}
                    name="Completed"
                  />
                  <Legend />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          {stats?.upcomingTasks && stats.upcomingTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  Upcoming Deadlines
                </CardTitle>
                <CardDescription>Tasks due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: task.subject?.color || '#6366f1' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.subject?.name || 'No subject'}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        {task.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">{formatDate(task.dueDate)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Learning Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Learning Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <BookOpen className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold mb-1">Study Consistency</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {completionRate >= 70
                      ? 'Great job! You\'re completing tasks consistently. Keep up the momentum!'
                      : completionRate >= 40
                      ? 'You\'re making progress. Try to complete more tasks to improve your consistency.'
                      : 'Consider breaking down larger tasks into smaller ones for better completion rates.'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-100 dark:border-green-800">
                  <Award className="w-8 h-8 text-green-600 mb-3" />
                  <h4 className="font-semibold mb-1">Quiz Performance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {(stats?.quizzes?.averageScore || 0) >= 80
                      ? 'Excellent quiz performance! You\'re mastering the material well.'
                      : (stats?.quizzes?.averageScore || 0) >= 60
                      ? 'Good progress on quizzes. Review missed questions for improvement.'
                      : 'Consider spending more time studying before taking quizzes.'}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                  <Target className="w-8 h-8 text-orange-600 mb-3" />
                  <h4 className="font-semibold mb-1">Focus Areas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {subjectDistribution.length > 0
                      ? `Focus more on ${subjectDistribution.sort((a, b) => a.value - b.value)[0]?.name || 'your subjects'} to balance your study load.`
                      : 'Add subjects to get personalized focus area recommendations.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// ============================================
// USER MANAGEMENT (Admin Only)
// ============================================

interface UserManagementProps {
  user: User;
}

const UserManagement = ({ user: _user }: UserManagementProps) => {
  const [users, setUsers] = useState<(User & { _count?: { subjects: number; tasks: number } })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get<{ users: (User & { _count?: { subjects: number; tasks: number } })[] }>(`/api/users?search=${search}&role=${roleFilter}`);
        setUsers(data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [search, roleFilter]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
          <p className="text-gray-500">Manage all registered users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Subjects</th>
                  <th className="text-left p-4 font-medium">Tasks</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {u.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-sm text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>{u.role}</Badge>
                    </td>
                    <td className="p-4">{u._count?.subjects || 0}</td>
                    <td className="p-4">{u._count?.tasks || 0}</td>
                    <td className="p-4 text-gray-500">{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// SKELETON LOADER
// ============================================

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  </div>
);

// ============================================
// LANDING PAGE COMPONENTS (Continued from before)
// ============================================

const LandingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      setShowSuccess(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const handlePayment = async (planId: string) => {
    setIsProcessingPayment(planId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId: 'guest',
          userEmail: null,
        }),
      });
      
      const data = await response.json();
      console.log('Checkout response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
      setIsProcessingPayment(null);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Payment Success Banner */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-green-500 text-white py-3 px-4 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Payment successful! Welcome to StudyPlanner Pro!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">How It Works</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push('/?auth=login')}>Login</Button>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full" onClick={() => router.push('/?auth=register')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        <div className="absolute top-32 left-[15%] w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl rotate-12 opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-48 right-[20%] w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-[25%] w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg opacity-60 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
        <div className="absolute top-64 left-[10%] w-6 h-6 bg-yellow-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-48 right-[15%] w-6 h-6 bg-blue-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.8s' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          {/* Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br ${
                    i === 1 ? 'from-blue-500 to-blue-600' :
                    i === 2 ? 'from-purple-500 to-purple-600' :
                    i === 3 ? 'from-pink-500 to-pink-600' :
                    'from-orange-500 to-orange-600'
                  }`} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 font-bold">2,500+</span> students already learning
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Badge className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0" variant="default">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Learning Platform
              <Sparkles className="w-4 h-4 ml-2" />
            </Badge>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 leading-tight"
          >
            <span className="text-gray-900 dark:text-white">Plan Smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Learn Better.</span>
            <br />
            <span className="text-gray-900 dark:text-white">Achieve More.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 dark:text-gray-300 text-center mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            The all-in-one smart study planner and learning management system designed to help students organize their studies, track progress, and achieve academic excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-10 py-7 text-lg font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105" 
              onClick={() => router.push('/?auth=register')}
            >
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-10 py-7 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300" 
              onClick={() => router.push('/?auth=login')}
            >
              <Play className="w-5 h-5 mr-2" /> Watch Demo
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((text, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2,500+', label: 'Active Students', icon: Users },
              { value: '150+', label: 'Courses Created', icon: BookOpen },
              { value: '50,000+', label: 'Tasks Completed', icon: CheckCircle },
              { value: '98%', label: 'Satisfaction Rate', icon: Star },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience and help you achieve your academic goals
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: 'Smart Study Planner', description: 'Organize subjects, set exam dates, and manage tasks with intelligent scheduling.', color: 'from-blue-500 to-blue-600' },
              { icon: ClipboardList, title: 'Task Management', description: 'Create, edit, and track tasks with priority levels and completion status.', color: 'from-purple-500 to-purple-600' },
              { icon: BookOpen, title: 'Course Library', description: 'Access comprehensive courses with structured modules and learning materials.', color: 'from-pink-500 to-pink-600' },
              { icon: Brain, title: 'AI Quiz Generator', description: 'Generate quizzes automatically with AI-powered question creation and explanations.', color: 'from-orange-500 to-orange-600' },
              { icon: BarChart3, title: 'Progress Analytics', description: 'Visualize your learning journey with detailed charts and statistics.', color: 'from-green-500 to-green-600' },
              { icon: MessageCircle, title: 'AI Study Assistant', description: 'Get instant help with an AI-powered chatbot for all your study questions.', color: 'from-cyan-500 to-cyan-600' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    <div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">How It Works</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Start Learning in{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">4 Simple Steps</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in minutes and transform your study experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            
            {[
              { step: '01', title: 'Create Account', description: 'Sign up for free and set up your profile in seconds', icon: Users, color: 'from-blue-500 to-blue-600' },
              { step: '02', title: 'Add Subjects', description: 'Create subjects and set exam dates for better planning', icon: BookOpen, color: 'from-purple-500 to-purple-600' },
              { step: '03', title: 'Plan & Study', description: 'Create tasks, track progress, and access courses', icon: Calendar, color: 'from-pink-500 to-pink-600' },
              { step: '04', title: 'Track Results', description: 'Monitor progress with detailed analytics', icon: BarChart3, color: 'from-orange-500 to-orange-600' },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative"
              >
                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300`}>
                    <item.icon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Testimonials</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See what our users have to say about their experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Computer Science Student', content: 'StudyPlanner helped me organize my entire semester. The AI quiz generator is a game-changer for exam prep!', rating: 5 },
              { name: 'Michael Chen', role: 'Medical Student', content: 'The analytics feature showed me exactly where I needed to focus. My grades improved significantly!', rating: 5 },
              { name: 'Emily Davis', role: 'Business Student', content: 'Finally a study app that actually helps! The task management keeps me on track every day.', rating: 5 },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Pricing</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent</span>{' '}
              Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Choose the plan that works best for you
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                id: 'free',
                name: 'Free', 
                price: '$0', 
                period: 'forever', 
                features: ['5 subjects', 'Basic task management', 'Limited analytics', 'Community support'], 
                cta: 'Get Started',
                color: 'from-gray-500 to-gray-600'
              },
              { 
                id: 'pro',
                name: 'Pro', 
                price: '$9.99', 
                period: '/month', 
                features: ['Unlimited subjects', 'Full analytics dashboard', 'AI quiz generator', 'Priority support', 'Course access'], 
                popular: true, 
                cta: 'Subscribe Now',
                color: 'from-blue-500 to-purple-600'
              },
              { 
                id: 'premium',
                name: 'Premium', 
                price: '$19.99', 
                period: '/month', 
                features: ['Everything in Pro', 'AI study assistant', 'Custom themes', 'API access', 'Team collaboration', 'Dedicated support'], 
                cta: 'Subscribe Now',
                color: 'from-purple-500 to-pink-600'
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={plan.popular ? 'md:-mt-4 md:mb-4' : ''}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-2 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'border border-gray-200 dark:border-gray-700 shadow-lg'} bg-white dark:bg-gray-800 overflow-hidden`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                  )}
                  {plan.popular && (
                    <div className="absolute -top-0 right-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-b-lg rounded-t-none px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 pt-12">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                      <div className="flex items-end justify-center gap-1">
                        <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{plan.price}</span>
                        <span className="text-gray-500 mb-2">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.popular ? 'from-blue-500 to-purple-600' : 'from-green-500 to-green-600'} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-300">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                      onClick={() => {
                        if (plan.id === 'free') {
                          router.push('/?auth=register');
                        } else {
                          handlePayment(plan.id);
                        }
                      }}
                      disabled={isProcessingPayment === plan.id}
                    >
                      {isProcessingPayment === plan.id ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        plan.cta
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoMnY0aC0yem0tNiA2di00aDJ2NGgtMnptMC02di00aDJ2NGgtMnptLTYgNnYtNGgydjRoLTJ6bTAtNnYtNGgydjRoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of students who have improved their academic performance with StudyPlanner.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-10 py-7 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105" 
              onClick={() => router.push('/?auth=register')}
            >
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white/50 hover:bg-white/10 rounded-full px-10 py-7 text-lg font-semibold" 
              onClick={() => router.push('/?auth=login')}
            >
              Login to Dashboard
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <Logo size="md" className="mb-4" />
              <p className="text-gray-400 text-sm max-w-md">
                Your all-in-one smart study planner and learning management system. Plan smarter, learn better, achieve more.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="/resources" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StudyPlanner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

// ============================================
// AUTH MODAL
// ============================================

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: (user: User) => void;
  initialError?: string;
}

const AuthModal = ({ mode, onClose, onSwitchMode, onSuccess, initialError }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError || '');

  const handleGoogleLogin = () => {
    // Clear any previous errors
    setError('');
    // Redirect to NextAuth Google sign-in
    window.location.href = '/api/auth/signin/google?callbackUrl=/';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onSuccess(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="text-white/80 mt-1">{mode === 'login' ? 'Login to access your dashboard' : 'Start your learning journey today'}</p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full py-6 rounded-xl font-semibold flex items-center justify-center gap-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            {mode === 'register' && (
              <div>
                <Label>I am a</Label>
                <div className="flex gap-4 mt-2">
                  {['student', 'admin'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role })}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                        formData.role === role
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl font-semibold"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button type="button" onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')} className="text-blue-600 font-medium hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

function PageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await api.get<{ user: User | null }>('/api/auth/session');
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        // Not logged in
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Listen for URL param changes
  const [oauthError, setOauthError] = useState('');

  useEffect(() => {
    const view = searchParams.get('view');
    const auth = searchParams.get('auth');
    const error = searchParams.get('error');

    if (view) {
      setCurrentView(view);
    }
    if (auth === 'login' || auth === 'register') {
      setAuthMode(auth);
    } else if (!auth) {
      setAuthMode(null);
    }
    if (error === 'google') {
      setOauthError('Google authentication failed. Please make sure the redirect URI is configured in Google Cloud Console.');
    } else {
      setOauthError('');
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      setCurrentView('dashboard');
    } catch {
      // Ignore
    }
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    url.searchParams.delete('auth');
    window.history.replaceState({}, '', url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // Show Dashboard if logged in
  if (user) {
    const renderContent = () => {
      switch (currentView) {
        case 'planner':
          return <StudyPlanner user={user} />;
        case 'courses':
          return <CoursesModule user={user} />;
        case 'quizzes':
          return <QuizModule user={user} />;
        case 'analytics':
          return <AnalyticsModule user={user} />;
        case 'users':
          return user.role === 'admin' ? <UserManagement user={user} /> : <StudentDashboard user={user} onViewChange={handleViewChange} />;
        case 'settings':
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500">Settings page coming soon...</p>
                </CardContent>
              </Card>
            </div>
          );
        default:
          return <StudentDashboard user={user} onViewChange={handleViewChange} />;
      }
    };

    return (
      <>
        <DashboardLayout
          user={user}
          currentView={currentView}
          onViewChange={handleViewChange}
          onLogout={handleLogout}
        >
          {renderContent()}
        </DashboardLayout>
        
        {/* AI Chat Button */}
        <Button
          onClick={() => setIsAIChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-40"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </Button>
        
        {/* AI Chat Widget */}
        <AnimatePresence>
          {isAIChatOpen && (
            <AIChatWidget isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Show Landing Page with Auth Modal
  return (
    <>
      <LandingPage />
      <AnimatePresence>
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitchMode={setAuthMode}
            onSuccess={(u) => {
              setUser(u);
              setAuthMode(null);
              handleViewChange('dashboard');
            }}
            initialError={oauthError}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Wrap PageContent in Suspense to handle useSearchParams
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
