'use client';

import { useState, useEffect, useCallback, useRef, Suspense, useSyncExternalStore, memo, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';

// Custom hook for mounted state - uses useSyncExternalStore for instant mounting
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
import {
  Moon, Sun, Menu, X, CheckCircle, Clock, Target, TrendingUp, Users, BookOpen,
  Brain, Award, ChevronRight, Star, Zap, Shield, BarChart3, Play, Pause, ArrowRight,
  GraduationCap, Calendar, ClipboardList, LucideIcon, Home, Settings, LogOut,
  Plus, Edit, Trash2, Search, Filter, MoreVertical, Eye, Timer, AlertCircle,
  ChevronDown, ChevronLeft, PieChart, LineChart, Activity, Layers, FileText,
  Video, Check, XCircle, HelpCircle, RefreshCw, Download, Upload, UserCog,
  LayoutDashboard, ListTodo, GraduationCap as GradCap, Building2, Sparkles,
  MessageCircle, Send, Bot, Loader2, Twitter, Github, Linkedin, Mail, ArrowUp,
  Heart, ExternalLink, Key, Bell, KeyRound, Lock, LogIn, UserPlus, CheckSquare
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
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart as RechartsLineChart, Line, Area, AreaChart, Legend } from 'recharts';
import { Logo, LogoIcon } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';

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
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
}

interface Recommendation {
  type: 'tip' | 'warning' | 'success' | 'info' | 'study' | 'reminder' | 'suggestion' | 'praise' | 'improvement' | 'alert' | 'motivation';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface SubjectProgress {
  subject: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
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
    overdueTasks: number;
    weeklyCompleted: number;
  };
  quizzes?: {
    totalAttempts: number;
    passed: number;
    averageScore: number;
    bestScore: number;
    passRate: number;
    improvement: number;
    averageTimePerQuiz: number;
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
    completionRate: number;
  };
  upcomingTasks?: Array<{
    id: string;
    title: string;
    dueDate: string | null;
    priority: string;
    subject: { name: string; color: string } | null;
  }>;
  // Enhanced student stats
  streak?: {
    current: number;
    best: number;
  };
  productivity?: {
    score: number;
    weeklyTrend: Array<{ day: string; tasks: number; hours: number }>;
    monthlyProgress: Array<{ week: string; completed: number; target: number }>;
    bestSubject: string | null;
    studyHoursThisWeek: number;
    averageDailyStudyTime: number;
  };
  achievements?: Achievement[];
  recommendations?: Recommendation[];
  learningInsights?: {
    peakStudyHours: number[];
    mostProductiveDay: string;
    averageQuizTime: number;
    subjectProgress: SubjectProgress[];
  };
  // Admin stats (nested structure from API)
  users?: {
    total: number;
    students: number;
    admins: number;
    recentNewUsers: number;
    growth: number;
  };
  engagement?: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
  };
  trends?: {
    userGrowth: Array<{ period: string; users: number }>;
    quizAttempts: Array<{ period: string; attempts: number }>;
    courseEnrollments: Array<{ period: string; enrollments: number }>;
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

const API_TIMEOUT = 20000; // 20 seconds timeout for slow connections

const api = {
  async get<T>(url: string, timeout = API_TIMEOUT): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const res = await fetch(url, { 
        signal: controller.signal,
        credentials: 'include', // Include cookies
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'API Error' }));
        throw new Error(errorData.error || `HTTP Error: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  },
  
  async post<T>(url: string, data?: unknown, timeout = API_TIMEOUT): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
        credentials: 'include', // Include cookies
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP Error: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  },
  
  async put<T>(url: string, data?: unknown, timeout = API_TIMEOUT): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
        credentials: 'include', // Include cookies
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP Error: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
  },
  
  async delete<T>(url: string, timeout = API_TIMEOUT): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const res = await fetch(url, { 
        method: 'DELETE',
        signal: controller.signal,
        credentials: 'include', // Include cookies
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'API Error' }));
        throw new Error(error.error || `HTTP Error: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }
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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Brain },
  ];

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
        <div className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen ? (
            <Logo size="sm" />
          ) : (
            <LogoIcon size="sm" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex w-9 h-9"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]">
          <nav className="p-2 sm:p-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg transition-colors min-h-[44px] sm:min-h-[48px] ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isSidebarOpen && <span className="font-medium text-sm sm:text-base">{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-10 h-10"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white capitalize truncate">
              {currentView === 'dashboard' ? 'Dashboard' : currentView}
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 hidden sm:flex"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-10 px-2 sm:px-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium text-sm">{user.name}</span>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
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
        <div className="p-3 sm:p-4 lg:p-6">{children}</div>
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
      className="fixed bottom-20 sm:bottom-24 right-2 sm:right-6 left-2 sm:left-auto sm:w-96 sm:h-[500px] w-[calc(100vw-1rem)] h-[70vh] sm:h-[500px] max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden"
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

// Mini Sparkline Chart Component - Memoized for performance
const MiniSparkline = memo(({ data, color = '#6366f1', height = 30 }: { data: number[]; color?: string; height?: number }) => {
  const max = Math.max(...data, 1);
  const points = useMemo(() => 
    data.map((v, i) => `${(i / (data.length - 1)) * 100},${height - (v / max) * height}`).join(' '),
    [data, height, max]
  );
  return (
    <svg width="100%" height={height} className="overflow-visible" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});
MiniSparkline.displayName = 'MiniSparkline';

// Progress Ring Component - Memoized for performance
const ProgressRing = memo(({ progress, size = 80, strokeWidth = 6, color = '#6366f1' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) => {
  const { radius, circumference, offset } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = r * 2 * Math.PI;
    const o = c - (progress / 100) * c;
    return { radius: r, circumference: c, offset: o };
  }, [size, strokeWidth, progress]);
  
  return (
    <div className="relative" style={{ width: size, height: size }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 dark:text-gray-700" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold">{Math.round(progress)}%</span>
      </div>
    </div>
  );
});
ProgressRing.displayName = 'ProgressRing';

const StudentDashboard = ({ user, onViewChange }: StudentDashboardProps) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month'>('week');
  const mounted = useMounted();

  // Default fallback stats
  const defaultStats: Stats = {
    subjects: { total: 0 },
    tasks: { total: 0, completed: 0, pending: 0, inProgress: 0, completionRate: 0, weeklyCompleted: 0, overdueTasks: 0 },
    quizzes: { totalAttempts: 0, passed: 0, averageScore: 0, bestScore: 0, passRate: 0, improvement: 0, averageTimePerQuiz: 0, recentAttempts: [] },
    courses: { enrolled: 0, completed: 0, averageProgress: 0, completionRate: 0 },
    streak: { current: 0, best: 0 },
    productivity: { score: 0, weeklyTrend: [], monthlyProgress: [], bestSubject: null, studyHoursThisWeek: 0, averageDailyStudyTime: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use Promise.allSettled to handle partial failures gracefully
        const [statsResult, subjectsResult, tasksResult] = await Promise.allSettled([
          api.get<Stats>('/api/stats', 30000), // 30s timeout for stats
          api.get<{ subjects: Subject[] }>('/api/subjects'),
          api.get<{ tasks: Task[] }>('/api/tasks?status=pending'),
        ]);

        // Handle stats result
        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value);
          if (statsResult.value.streak) {
            setStreak(statsResult.value.streak);
          }
        } else {
          console.error('Failed to fetch stats:', statsResult.reason);
          setStats(defaultStats);
        }

        // Handle subjects result
        if (subjectsResult.status === 'fulfilled') {
          setSubjects(subjectsResult.value.subjects || []);
        } else {
          console.error('Failed to fetch subjects:', subjectsResult.reason);
        }

        // Handle tasks result
        if (tasksResult.status === 'fulfilled') {
          setRecentTasks((tasksResult.value.tasks || []).slice(0, 5));
        } else {
          console.error('Failed to fetch tasks:', tasksResult.reason);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(defaultStats);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const taskCompletionRate = stats?.tasks?.completionRate || (stats?.tasksStats
    ? Math.round((stats.tasksStats.completed / stats.tasksStats.total) * 100) || 0
    : 0);

  // Calculate productivity score
  const productivityScore = stats?.productivity?.score || Math.min(100, Math.round(
    (taskCompletionRate * 0.4) +
    ((stats?.quizzes?.passRate || 0) * 0.3) +
    ((stats?.courses?.averageProgress || 0) * 0.3)
  ));

  // Weekly activity data for sparkline
  const weeklyActivity = stats?.productivity?.weeklyTrend?.map(d => d.tasks) || [2, 3, 1, 4, 2, 3, 1];

  // Upcoming deadlines (next 7 days)
  const upcomingDeadlines = recentTasks
    .filter(t => t.dueDate && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats Grid - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Total Subjects"
          value={stats?.subjects?.total || subjects.length || 0}
          icon={BookOpen}
          color="from-blue-500 to-blue-600"
          trend={{ value: 12, isPositive: true }}
          sparklineData={[1, 2, 2, 3, 3, 4, 4]}
        />
        <StatsCard
          title="Tasks Completed"
          value={stats?.tasks?.completed || 0}
          subtitle={`of ${stats?.tasks?.total || 0} total`}
          icon={CheckCircle}
          color="from-green-500 to-green-600"
          trend={{ value: taskCompletionRate > 50 ? 8 : -5, isPositive: taskCompletionRate > 50 }}
          sparklineData={weeklyActivity}
        />
        <StatsCard
          title="Quiz Score"
          value={`${Math.round(stats?.quizzes?.averageScore || 0)}%`}
          icon={Award}
          color="from-purple-500 to-purple-600"
          trend={{ value: stats?.quizzes?.improvement || 5, isPositive: true }}
          sparklineData={[70, 75, 72, 80, 78, 85, 82]}
        />
        <StatsCard
          title="Course Progress"
          value={`${Math.round(stats?.courses?.averageProgress || 0)}%`}
          icon={Layers}
          color="from-orange-500 to-orange-600"
          sparklineData={[20, 35, 45, 50, 55, 60, 65]}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Task Progress & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Progress Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Task Progress
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeRange('week')}
                      className="h-7 text-xs"
                    >
                      Week
                    </Button>
                    <Button
                      variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeRange('month')}
                      className="h-7 text-xs"
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                  {[
                    { label: 'Completed', value: stats?.tasks?.completed || 0, color: '#22c55e', icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'In Progress', value: stats?.tasks?.inProgress || 0, color: '#3b82f6', icon: Clock, bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Pending', value: stats?.tasks?.pending || 0, color: '#f59e0b', icon: AlertCircle, bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
                    { label: 'Overdue', value: stats?.tasks?.overdueTasks || 0, color: '#ef4444', icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-900/20' },
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className={`p-3 sm:p-4 rounded-xl ${item.bg} border border-gray-100 dark:border-gray-800`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2" style={{ color: item.color }} />
                      <p className="text-lg sm:text-2xl font-bold">{item.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                    <span className="font-semibold">{taskCompletionRate}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${taskCompletionRate}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Weekly Chart */}
                <div className="h-40 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.productivity?.weeklyTrend || [
                      { day: 'Mon', tasks: 2, hours: 1.5 },
                      { day: 'Tue', tasks: 3, hours: 2 },
                      { day: 'Wed', tasks: 1, hours: 1 },
                      { day: 'Thu', tasks: 4, hours: 3 },
                      { day: 'Fri', tasks: 2, hours: 1.5 },
                      { day: 'Sat', tasks: 3, hours: 2.5 },
                      { day: 'Sun', tasks: 1, hours: 1 },
                    ]}>
                      <defs>
                        <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} width={30} />
                      <ChartTooltip content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border text-sm">
                              <p className="font-medium">{label}</p>
                              <p className="text-green-600">{payload[0]?.value} tasks</p>
                              {payload[1] && <p className="text-blue-600">{payload[1].value} hours</p>}
                            </div>
                          );
                        }
                        return null;
                      }} />
                      <Area type="monotone" dataKey="tasks" stroke="#22c55e" strokeWidth={2} fill="url(#taskGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subjects Overview - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Your Subjects
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => onViewChange('planner')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {subjects.length === 0 ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    </motion.div>
                    <p className="text-gray-500 mb-4">No subjects yet. Start organizing your studies!</p>
                    <Button onClick={() => onViewChange('planner')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Subject
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subjects.slice(0, 6).map((subject, index) => (
                      <motion.div
                        key={subject.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="cursor-pointer"
                        onClick={() => onViewChange('planner')}
                      >
                        <Card className="overflow-hidden group border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                          <div className="h-1.5 transition-all group-hover:h-2" style={{ backgroundColor: subject.color }} />
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold group-hover:text-blue-600 transition-colors">{subject.name}</h3>
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: subject.color }}
                              >
                                {subject.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                              {subject.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <ClipboardList className="w-3.5 h-3.5" />
                                {subject._count?.tasks || 0} tasks
                              </div>
                              {subject.examDate && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {formatDate(subject.examDate)}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Upcoming Tasks & Insights */}
        <div className="space-y-6">
          {/* Upcoming Tasks - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Upcoming Tasks
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onViewChange('planner')}>
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    </motion.div>
                    <p className="text-gray-500 text-sm">All caught up! 🎉</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => onViewChange('planner')}
                    >
                      Add New Task
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-72">
                    <div className="space-y-2">
                      {recentTasks.map((task, index) => {
                        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                              isOverdue 
                                ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' 
                                : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                                style={{ backgroundColor: task.subject?.color || '#6366f1', ringColor: task.subject?.color || '#6366f1' }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                                  {task.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{task.subject?.name}</p>
                                {task.dueDate && (
                                  <p className={`text-xs mt-1 flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
                                    <Clock className="w-3 h-3" />
                                    {isOverdue ? 'Overdue: ' : 'Due: '}
                                    {formatDate(task.dueDate)}
                                  </p>
                                )}
                              </div>
                              <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                                {task.priority}
                              </Badge>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Productivity Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Productivity Score
                  </h3>
                  <span className="text-2xl font-bold">{productivityScore}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Task Completion</span>
                      <span>{taskCompletionRate}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-green-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${taskCompletionRate}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Quiz Performance</span>
                      <span>{stats?.quizzes?.passRate || 0}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.quizzes?.passRate || 0}%` }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/70">Course Progress</span>
                      <span>{Math.round(stats?.courses?.averageProgress || 0)}%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${stats?.courses?.averageProgress || 0}%` }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
                {stats?.productivity?.bestSubject && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-white/70">
                      🏆 Best performing: <span className="font-medium text-white">{stats.productivity.bestSubject}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Study Time Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-500" />
                  Study Time This Week
                </h3>
                <div className="text-center py-4">
                  <motion.p 
                    className="text-4xl font-bold text-blue-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    {stats?.productivity?.studyHoursThisWeek?.toFixed(1) || '0.0'}h
                  </motion.p>
                  <p className="text-sm text-gray-500 mt-1">
                    Avg {stats?.productivity?.averageDailyStudyTime?.toFixed(1) || '0.0'}h/day
                  </p>
                </div>
                <div className="grid grid-cols-7 gap-1 mt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                    const hours = stats?.productivity?.weeklyTrend?.[i]?.hours || Math.random() * 3;
                    const maxHours = 3;
                    return (
                      <div key={i} className="text-center">
                        <div 
                          className="h-12 rounded bg-blue-100 dark:bg-blue-900/30 relative overflow-hidden"
                          title={`${hours.toFixed(1)}h`}
                        >
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded"
                            initial={{ height: 0 }}
                            animate={{ height: `${(hours / maxHours) * 100}%` }}
                            transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{day}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATS CARD COMPONENT - Enhanced with animations
// ============================================

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  trend?: { value: number; isPositive: boolean };
  sparklineData?: number[];
}

const StatsCard = memo(({ title, value, subtitle, icon: Icon, color, onClick, trend, sparklineData }: StatsCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract gradient colors from the color prop
  const colors = useMemo(() => color.replace('from-', '').replace('to-', '').split(' '), [color]);
  const primaryColor = colors[0] || 'blue-500';
  
  // Map Tailwind color names to hex values for sparkline
  const colorMap: Record<string, string> = useMemo(() => ({
    'blue-500': '#3b82f6', 'blue-600': '#2563eb',
    'green-500': '#22c55e', 'green-600': '#16a34a',
    'purple-500': '#8b5cf6', 'purple-600': '#7c3aed',
    'orange-500': '#f97316', 'orange-600': '#ea580c',
    'pink-500': '#ec4899', 'pink-600': '#db2777',
    'indigo-500': '#6366f1', 'indigo-600': '#4f46e5',
  }), []);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className={`${onClick ? 'cursor-pointer' : ''} overflow-hidden group h-full card-hover touch-target`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`h-1 bg-gradient-to-r ${color} transition-transform duration-300`}
          style={{ transform: isHovered ? 'scaleX(1)' : 'scaleX(0.3)' }}
        />
        <CardContent className="p-3 sm:p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div 
            className={`absolute -right-4 -top-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${color} opacity-5 rounded-full blur-xl transition-transform duration-300`}
            style={{ transform: isHovered ? 'scale(1.5)' : 'scale(1)' }}
          />
          
          <div className="flex items-center justify-between relative mb-1 sm:mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-0.5 truncate">{title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-400 truncate">{subtitle}</p>
              )}
            </div>
            <div 
              className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg flex-shrink-0 transition-transform duration-200`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
            </div>
          </div>
          
          {/* Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-2 h-8 relative" aria-label={`Trend: ${title}`}>
              <MiniSparkline 
                data={sparklineData} 
                color={colorMap[primaryColor] || '#6366f1'} 
                height={24}
              />
            </div>
          )}
          
          {/* Trend indicator */}
          {trend && !sparklineData && (
            <div className={`flex items-center gap-1 mt-1 text-xs sm:text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${!trend.isPositive ? 'rotate-180' : ''}`} aria-hidden="true" />
              <span>{trend.value}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
StatsCard.displayName = 'StatsCard';

// ============================================
// STUDY PLANNER MODULE
// ============================================

interface StudyPlannerProps {
  user: User;
}

const StudyPlanner = ({ user: _user }: StudyPlannerProps) => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'subject' | 'task'; id: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for improvements
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'>('all');
  const [studyTimer, setStudyTimer] = useState<{ isRunning: boolean; seconds: number; subjectId: string | null }>({
    isRunning: false,
    seconds: 0,
    subjectId: null
  });
  const [showTimerDialog, setShowTimerDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form states
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    color: SUBJECT_COLORS[0],
    examDate: '',
  });
  const [taskForm, setTaskForm] = useState<{
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    subjectId: string;
  }>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
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
    setIsSaving(true);
    try {
      if (editingSubject) {
        await api.put(`/api/subjects/${editingSubject.id}`, subjectForm);
        toast({ title: 'Success', description: 'Subject updated successfully' });
      } else {
        await api.post('/api/subjects', subjectForm);
        toast({ title: 'Success', description: 'Subject created successfully' });
      }
      setIsSubjectDialogOpen(false);
      resetSubjectForm();
      fetchData();
    } catch (error) {
      console.error('Error saving subject:', error);
      const message = error instanceof Error ? error.message : 'Failed to save subject. Please try again.';
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await api.delete(`/api/subjects/${id}`);
      toast({ title: 'Success', description: 'Subject deleted successfully' });
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting subject:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete subject. Please try again.';
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
    }
  };

  const resetSubjectForm = () => {
    setSubjectForm({ name: '', description: '', color: SUBJECT_COLORS[0], examDate: '' });
    setEditingSubject(null);
  };

  // Task handlers
  const handleSaveTask = async () => {
    setIsSaving(true);
    try {
      if (editingTask) {
        await api.put(`/api/tasks/${editingTask.id}`, taskForm);
        toast({ title: 'Success', description: 'Task updated successfully' });
      } else {
        await api.post('/api/tasks', taskForm);
        toast({ title: 'Success', description: 'Task created successfully' });
      }
      setIsTaskDialogOpen(false);
      resetTaskForm();
      fetchData();
    } catch (error) {
      console.error('Error saving task:', error);
      const message = error instanceof Error ? error.message : 'Failed to save task. Please try again.';
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      toast({ title: 'Success', description: 'Task deleted successfully' });
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete task. Please try again.';
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await api.put(`/api/tasks/${task.id}`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
      const message = error instanceof Error ? error.message : 'Failed to update task status. Please try again.';
      toast({ 
        title: 'Error', 
        description: message,
        variant: 'destructive'
      });
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

  // Timer functions
  useEffect(() => {
    if (studyTimer.isRunning) {
      timerRef.current = setInterval(() => {
        setStudyTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [studyTimer.isRunning]);

  const formatTimeFromSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = (subjectId: string) => {
    setStudyTimer({ isRunning: true, seconds: 0, subjectId });
  };

  const pauseTimer = () => {
    setStudyTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setStudyTimer({ isRunning: false, seconds: 0, subjectId: null });
    setShowTimerDialog(false);
  };

  // Overdue detection
  const isOverdue = (task: Task) => {
    if (task.status === 'completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const getOverdueTasks = () => tasks.filter(isOverdue);
  
  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(t => {
      if (t.status === 'completed' || !t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  // Smart suggestions
  const getSmartSuggestions = () => {
    const suggestions: { task: Task; reason: string; urgency: 'high' | 'medium' | 'low' }[] = [];
    
    // Overdue tasks - highest priority
    getOverdueTasks().forEach(task => {
      suggestions.push({
        task,
        reason: 'Overdue - needs immediate attention',
        urgency: 'high'
      });
    });
    
    // High priority pending tasks
    tasks.filter(t => t.status !== 'completed' && t.priority === 'high' && !isOverdue(t))
      .forEach(task => {
        suggestions.push({
          task,
          reason: 'High priority task',
          urgency: 'high'
        });
      });
    
    // Tasks due in next 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    tasks.filter(t => {
      if (t.status === 'completed' || isOverdue(t)) return false;
      if (!t.dueDate) return false;
      return new Date(t.dueDate) <= threeDaysFromNow;
    }).forEach(task => {
      if (!suggestions.find(s => s.task.id === task.id)) {
        suggestions.push({
          task,
          reason: 'Due soon',
          urgency: 'medium'
        });
      }
    });
    
    return suggestions.slice(0, 5);
  };

  // Filtered tasks based on filter selection
  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'pending':
        return tasks.filter(t => t.status === 'pending' && !isOverdue(t));
      case 'in_progress':
        return tasks.filter(t => t.status === 'in_progress');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      case 'overdue':
        return tasks.filter(isOverdue);
      default:
        return tasks;
    }
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
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Planner</h2>
            <p className="text-gray-500">Organize your subjects and tasks</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Study Timer Quick Access */}
          {studyTimer.isRunning && studyTimer.subjectId && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
              <Timer className="w-4 h-4 animate-pulse" />
              <span className="font-mono font-bold">{formatTimeFromSeconds(studyTimer.seconds)}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 text-white hover:bg-white/20"
                onClick={() => setShowTimerDialog(true)}
              >
                <Pause className="w-3 h-3" />
              </Button>
            </div>
          )}
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

      {/* Overdue Alert Banner */}
      {getOverdueTasks().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    {getOverdueTasks().length} Overdue Task{getOverdueTasks().length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    {getOverdueTasks().map(t => t.title).slice(0, 3).join(', ')}
                    {getOverdueTasks().length > 3 && ` and ${getOverdueTasks().length - 3} more`}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => setTaskFilter('overdue')}
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Smart Suggestions */}
      {getSmartSuggestions().length > 0 && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Smart Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {getSmartSuggestions().map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                    suggestion.urgency === 'high' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : suggestion.urgency === 'medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium truncate max-w-[150px]">{suggestion.task.title}</span>
                  <span className="text-xs opacity-70">• {suggestion.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
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
          title="Overdue"
          value={getOverdueTasks().length}
          icon={AlertCircle}
          color="from-red-500 to-red-600"
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
                      
                      {/* Study Timer Button */}
                      <Button
                        variant="ghost"
                        className="w-full mt-2 text-sm"
                        onClick={() => {
                          startTimer(subject.id);
                          setShowTimerDialog(true);
                        }}
                      >
                        <Timer className="w-4 h-4 mr-2" />
                        Start Study Session
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
                <div className="flex flex-wrap gap-2">
                  {/* Task Filter */}
                  <Select
                    value={taskFilter}
                    onValueChange={(value) => setTaskFilter(value as typeof taskFilter)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Subject Filter */}
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
              ) : getFilteredTasks().filter(t => !selectedSubject || t.subjectId === selectedSubject.id).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks match the current filters.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getFilteredTasks()
                    .filter(t => !selectedSubject || t.subjectId === selectedSubject.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          isOverdue(task) 
                            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                            : 'bg-gray-50 dark:bg-gray-800'
                        }`}
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Calendar View
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const prevMonth = new Date(currentMonth);
                      prevMonth.setMonth(prevMonth.getMonth() - 1);
                      setCurrentMonth(prevMonth);
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[120px] text-center">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const nextMonth = new Date(currentMonth);
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      setCurrentMonth(nextMonth);
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                    className="text-xs"
                  >
                    Today
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="space-y-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                {(() => {
                  const today = new Date();
                  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                  const startPadding = firstDay.getDay();
                  const totalDays = lastDay.getDate();
                  
                  // Get tasks with due dates for this month
                  const tasksByDate: Record<string, typeof tasks> = {};
                  tasks.forEach(task => {
                    if (task.dueDate) {
                      const dateKey = new Date(task.dueDate).toDateString();
                      if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
                      tasksByDate[dateKey].push(task);
                    }
                  });
                  
                  // Get exam dates for this month
                  const examsByDate: Record<string, { name: string; color: string }[]> = {};
                  subjects.forEach(subject => {
                    if (subject.examDate) {
                      const dateKey = new Date(subject.examDate).toDateString();
                      if (!examsByDate[dateKey]) examsByDate[dateKey] = [];
                      examsByDate[dateKey].push({ name: subject.name, color: subject.color });
                    }
                  });
                  
                  const weeks: React.ReactNode[] = [];
                  let days: React.ReactNode[] = [];
                  
                  // Padding for first week
                  for (let i = 0; i < startPadding; i++) {
                    days.push(<div key={`pad-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg" />);
                  }
                  
                  // Days of month
                  for (let day = 1; day <= totalDays; day++) {
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const dateKey = date.toDateString();
                    const isToday = date.toDateString() === today.toDateString();
                    const dayTasks = tasksByDate[dateKey] || [];
                    const dayExams = examsByDate[dateKey] || [];
                    
                    days.push(
                      <motion.div 
                        key={day}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: day * 0.01 }}
                        className={`h-24 rounded-lg border p-1 overflow-hidden transition-colors ${
                          isToday 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className={`text-xs font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-500'}`}>
                          {day}
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                          {dayTasks.slice(0, 2).map((task, i) => (
                            <div 
                              key={i}
                              className="text-xs truncate px-1 py-0.5 rounded text-white"
                              style={{ backgroundColor: task.subject?.color || '#6366f1' }}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayExams.slice(0, dayTasks.length > 1 ? 0 : 1).map((exam, i) => (
                            <div 
                              key={i}
                              className="text-xs truncate px-1 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              title={`${exam.name} Exam`}
                            >
                              📝 {exam.name}
                            </div>
                          ))}
                          {(dayTasks.length > 2 || (dayTasks.length > 0 && dayExams.length > 0)) && (
                            <div className="text-xs text-gray-400 px-1">
                              +{dayTasks.length + dayExams.length - 2} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                    
                    if (days.length === 7) {
                      weeks.push(
                        <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
                          {days}
                        </div>
                      );
                      days = [];
                    }
                  }
                  
                  // Padding for last week
                  if (days.length > 0) {
                    while (days.length < 7) {
                      days.push(<div key={`pad-end-${days.length}`} className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-lg" />);
                    }
                    weeks.push(
                      <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
                        {days}
                      </div>
                    );
                  }
                  
                  return weeks;
                })()}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-100" />
                  <span className="text-xs text-gray-500">Exam</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span className="text-xs text-gray-500">Task Due</span>
                </div>
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
            <Button variant="outline" onClick={() => setIsSubjectDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveSubject} disabled={!subjectForm.name || isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={!taskForm.title || !taskForm.subjectId || isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
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

      {/* Study Timer Dialog */}
      <Dialog open={showTimerDialog} onOpenChange={setShowTimerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-indigo-500" />
              Study Timer
            </DialogTitle>
            <DialogDescription>
              {subjects.find(s => s.id === studyTimer.subjectId)?.name || 'Select a subject to start studying'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-8">
            {/* Timer Display */}
            <div className="text-6xl font-mono font-bold text-gray-900 dark:text-white mb-8">
              {formatTimeFromSeconds(studyTimer.seconds)}
            </div>
            
            {/* Timer Controls */}
            <div className="flex gap-4">
              {!studyTimer.isRunning ? (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  onClick={() => {
                    if (!studyTimer.subjectId && subjects.length > 0) {
                      setStudyTimer(prev => ({ ...prev, subjectId: subjects[0].id }));
                    }
                    setStudyTimer(prev => ({ ...prev, isRunning: true }));
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {studyTimer.seconds > 0 ? 'Resume' : 'Start'}
                </Button>
              ) : (
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={pauseTimer}
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              
              {studyTimer.seconds > 0 && (
                <Button 
                  size="lg"
                  variant="destructive"
                  onClick={resetTimer}
                >
                  Reset
                </Button>
              )}
            </div>
            
            {/* Subject Selection when not running */}
            {!studyTimer.isRunning && studyTimer.seconds === 0 && subjects.length > 0 && (
              <div className="mt-6 w-full">
                <Label className="mb-2 block">Select Subject</Label>
                <Select
                  value={studyTimer.subjectId || ''}
                  onValueChange={(value) => setStudyTimer(prev => ({ ...prev, subjectId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: s.color }}
                          />
                          {s.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimerDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const [viewingModule, setViewingModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'course' | 'module'; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [courseForm, setCourseForm] = useState<{
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    isPublished: boolean;
  }>({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
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
        const data = await api.get<{ course: Course }>(`/api/courses/${selectedCourse.id}`);
        setSelectedCourse(data.course);
        // Update viewingModule if it's the one being marked
        if (viewingModule && viewingModule.id === moduleId) {
          const updatedModule = data.course.modules?.find(m => m.id === moduleId);
          if (updatedModule) {
            setViewingModule(updatedModule);
          }
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
          {selectedCourse && (
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          )}
        </div>
      </div>

      {selectedCourse ? (
        // Course Detail View
        <div className="space-y-6">
          {viewingModule ? (
            // Module Learning View
            <div className="space-y-6">
              {/* Module Header */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingModule(null)}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Course
                </Button>
              </div>

              {/* Video Player */}
              {viewingModule.videoUrl ? (
                <Card className="overflow-hidden">
                  <div className="relative w-full bg-black rounded-t-lg">
                    <div className="aspect-video w-full">
                      <iframe
                        src={viewingModule.videoUrl}
                        title={viewingModule.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{viewingModule.title}</h2>
                    {viewingModule.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{viewingModule.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      {viewingModule.duration > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(viewingModule.duration)}
                        </Badge>
                      )}
                      <Button
                        onClick={() => handleModuleProgress(viewingModule.id, !viewingModule.completed)}
                        variant={viewingModule.completed ? "default" : "outline"}
                        className="flex items-center gap-2"
                      >
                        {viewingModule.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Module header when no video
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-2">{viewingModule.title}</h2>
                    {viewingModule.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{viewingModule.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      {viewingModule.duration > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(viewingModule.duration)}
                        </Badge>
                      )}
                      <Button
                        onClick={() => handleModuleProgress(viewingModule.id, !viewingModule.completed)}
                        variant={viewingModule.completed ? "default" : "outline"}
                        className="flex items-center gap-2"
                      >
                        {viewingModule.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                            Mark Complete
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Module Content */}
              {viewingModule.content && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Lesson Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {viewingModule.content.split('\n').map((line, idx) => {
                        // Handle headers
                        if (line.startsWith('# ')) {
                          return <h1 key={idx} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                        }
                        if (line.startsWith('## ')) {
                          return <h2 key={idx} className="text-xl font-bold mt-5 mb-3">{line.slice(3)}</h2>;
                        }
                        if (line.startsWith('### ')) {
                          return <h3 key={idx} className="text-lg font-bold mt-4 mb-2">{line.slice(4)}</h3>;
                        }
                        // Handle code blocks
                        if (line.startsWith('```')) {
                          return null; // Skip code fence markers for simplicity
                        }
                        // Handle list items
                        if (line.startsWith('- ') || line.startsWith('* ')) {
                          return <li key={idx} className="ml-4">{line.slice(2)}</li>;
                        }
                        if (line.match(/^\d+\.\s/)) {
                          return <li key={idx} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                        }
                        // Handle bold text
                        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        // Handle inline code
                        const codeText = boldText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>');
                        // Skip empty lines
                        if (line.trim() === '') {
                          return <br key={idx} />;
                        }
                        return <p key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: codeText }} />;
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center">
                {(() => {
                  const currentIndex = selectedCourse.modules?.findIndex(m => m.id === viewingModule.id) ?? -1;
                  const prevModule = currentIndex > 0 ? selectedCourse.modules?.[currentIndex - 1] : null;
                  const nextModule = selectedCourse.modules && currentIndex < selectedCourse.modules.length - 1
                    ? selectedCourse.modules[currentIndex + 1]
                    : null;

                  return (
                    <>
                      {prevModule ? (
                        <Button
                          variant="outline"
                          onClick={() => setViewingModule(prevModule)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Previous: {prevModule.title}
                        </Button>
                      ) : <div />}
                      {nextModule ? (
                        <Button
                          onClick={() => setViewingModule(nextModule)}
                        >
                          Next: {nextModule.title}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          onClick={() => setViewingModule(null)}
                        >
                          Finish Course
                        </Button>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            // Course Overview
            <>
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
                  <CardTitle>Course Modules</CardTitle>
                  <CardDescription>Click on a module to start learning</CardDescription>
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
                          onClick={() => setViewingModule(module)}
                          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all hover:shadow-md border border-transparent hover:border-primary/20"
                        >
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white font-bold shadow-sm">
                            {module.completed ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-lg">{module.title}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              {module.duration > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(module.duration)}
                                </span>
                              )}
                              {module.videoUrl && (
                                <span className="flex items-center gap-1 text-primary">
                                  <Play className="w-3 h-3" />
                                  Video Lesson
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      ) : (
        // Course List View
        <div className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Economics">Economics</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Psychology">Psychology</SelectItem>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="Developer Tools">Developer Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="rounded-full"
            >
              All
            </Button>
            {['Mathematics', 'Science', 'Programming', 'Language', 'History', 'Finance'].map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Course Grid */}
          {(() => {
            const filteredCourses = courses.filter((course) => {
              const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
              const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            if (filteredCourses.length === 0) {
              return (
                <Card className="col-span-full">
                  <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery || selectedCategory !== 'all' ? 'No courses found' : 'No courses available'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || selectedCategory !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Check back later for new courses!'}
                    </p>
                  </CardContent>
                </Card>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-md" onClick={() => handleViewCourse(course)}>
                      {/* Course Thumbnail */}
                      <div className="relative h-40 overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                          course.category === 'Mathematics' ? 'from-blue-500 to-indigo-600' :
                          course.category === 'Science' ? 'from-green-500 to-indigo-600' :
                          course.category === 'Programming' ? 'from-purple-500 to-pink-600' :
                          course.category === 'Web Development' ? 'from-orange-500 to-red-600' :
                          course.category === 'Language' ? 'from-pink-500 to-rose-600' :
                          course.category === 'History' ? 'from-amber-500 to-orange-600' :
                          course.category === 'Economics' ? 'from-cyan-500 to-blue-600' :
                          course.category === 'Finance' ? 'from-indigo-500 to-green-600' :
                          course.category === 'Psychology' ? 'from-violet-500 to-purple-600' :
                          'from-gray-500 to-gray-600'
                        } ${course.thumbnail ? 'opacity-0 group-hover:opacity-30' : ''} transition-opacity flex items-center justify-center`}>
                          <BookOpen className="w-12 h-12 text-white/50" />
                        </div>
                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-gray-900 hover:bg-white/90 backdrop-blur-sm">
                            {course.category}
                          </Badge>
                        </div>
                        {/* Level Badge */}
                        <div className="absolute top-3 right-3">
                          <Badge className={`${getLevelColor(course.level)} border-0`}>
                            {course.level}
                          </Badge>
                        </div>
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-primary ml-1" />
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Layers className="w-4 h-4" />
                            {course._count?.modules || 0} lessons
                          </span>
                          {course.duration > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDuration(course.duration)}
                            </span>
                          )}
                        </div>
                        
                        {/* Progress Bar (if enrolled) */}
                        {course.progress !== undefined && course.progress > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{Math.round(course.progress)}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        )}
                        
                        <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 border-0">
                          {course.progress !== undefined && course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
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
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  
  // AI Quiz Generator states
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiQuestionCount, setAiQuestionCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [aiCategory, setAiCategory] = useState('General');
  const [aiInstructions, setAiInstructions] = useState('');
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
    category: 'General',
    difficulty: 'beginner',
    questions: [{ id: 'temp-init', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1, order: 0 }],
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

  // Timer effect for quiz
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      category: 'General',
      difficulty: 'beginner',
      questions: [{ id: `temp-${Date.now()}`, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1, order: 0 }],
    });
    setEditingQuiz(null);
  };

  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      const data = await api.get<{ quiz: Quiz }>(`/api/quizzes/${quiz.id}`);
      setSelectedQuiz(data.quiz);
      setIsTakingQuiz(true);
      setAnswers({});
      setCurrentQuestionIndex(0);
      // Set timer based on quiz duration (convert minutes to seconds)
      const durationInSeconds = (quiz.duration || 30) * 60;
      setTimeLeft(durationInSeconds);
      setIsTimerRunning(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (!selectedQuiz) return;
    setIsTimerRunning(false);
    
    // Calculate time taken (total duration - remaining time)
    const totalDuration = (selectedQuiz.duration || 30) * 60;
    const timeTaken = totalDuration - timeLeft;
    
    try {
      const data = await api.post<{ attempt: QuizAttempt }>('/api/quiz-attempts', {
        quizId: selectedQuiz.id,
        answers,
        timeTaken,
      });
      setAttempt(data.attempt);
      setIsTakingQuiz(false);
      toast({
        title: 'Quiz Submitted!',
        description: `Your score: ${Math.round(data.attempt.score)}%`,
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    }
  }, [selectedQuiz, answers, timeLeft, toast]);

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { id: `temp-${Date.now()}`, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', explanation: '', points: 1, order: quizForm.questions.length }],
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
          category: aiCategory,
          instructions: aiInstructions,
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
        id: `temp-ai-${Date.now()}-${index}`,
        question: String(q.question || ''),
        optionA: String(q.optionA || ''),
        optionB: String(q.optionB || ''),
        optionC: String(q.optionC || ''),
        optionD: String(q.optionD || ''),
        correctAnswer: ['A', 'B', 'C', 'D'].includes(String(q.correctAnswer)) ? String(q.correctAnswer) : 'A',
        explanation: String(q.explanation || ''),
        points: Number(q.points) || 1,
        order: index,
      }));
      
      setQuizForm(prev => ({
        ...prev,
        questions: formattedQuestions,
        title: prev.title || `${aiTopic} Quiz`,
        description: prev.description || `AI-generated quiz about ${aiTopic} at ${aiDifficulty} difficulty level.`,
        category: aiCategory,
        difficulty: aiDifficulty,
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
    setAiCategory('General');
    setAiInstructions('');
    setGeneratedQuestions(null);
    setAiError('');
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const passed = attempt && attempt.score >= (selectedQuiz?.passingScore || 60);
  
  // Filter quizzes based on search, category, and difficulty
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = searchQuery === '' || 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Get unique categories from quizzes (filter out null, undefined, and empty strings)
  const categories = ['all', ...new Set(quizzes.map(q => q.category).filter(c => c && c.trim()))];
  
  // Count quizzes by category
  const quizCounts = {
    all: quizzes.length,
    ...Object.fromEntries([...new Set(quizzes.map(q => q.category).filter(c => c && c.trim()))].map(cat => 
      [cat, quizzes.filter(q => q.category === cat).length]
    ))
  };

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
              <Button type="button" onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < (selectedQuiz?.questions?.length || 0)}>
                Submit Quiz
              </Button>
            </>
          ) : attempt ? (
            <Button onClick={() => { setAttempt(null); setSelectedQuiz(null); }}>
              Back to Quizzes
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>

      {isTakingQuiz && selectedQuiz ? (
        // Quiz Taking View - Enhanced with Timer
        <div className="space-y-6">
          {/* Timer and Progress Bar */}
          <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Time Remaining</p>
                    <motion.p 
                      className={`text-2xl font-bold font-mono ${timeLeft < 60 ? 'text-red-300' : ''}`}
                      animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {formatTime(timeLeft)}
                    </motion.p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/80">Progress</p>
                  <p className="text-xl font-bold">
                    {Object.keys(answers).length} / {selectedQuiz.questions?.length}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={(Object.keys(answers).length / (selectedQuiz.questions?.length || 1)) * 100} 
                  className="h-2 bg-white/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Question Navigation Pills */}
          <div className="flex flex-wrap gap-2">
            {selectedQuiz.questions?.map((q, index) => (
              <motion.button
                key={q.id || index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  currentQuestionIndex === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : answers[q.id]
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>

          {/* Current Question */}
          {selectedQuiz.questions?.[currentQuestionIndex] && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="outline" className="text-sm">
                      Question {currentQuestionIndex + 1} of {selectedQuiz.questions?.length}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedQuiz.questions[currentQuestionIndex].points} pts
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
                    {selectedQuiz.questions[currentQuestionIndex].question}
                  </h3>
                  
                  <div className="space-y-3">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const optionKey = `option${opt}` as keyof Question;
                      const optionValue = selectedQuiz.questions![currentQuestionIndex][optionKey] as string;
                      const isSelected = answers[selectedQuiz.questions![currentQuestionIndex].id] === opt;
                      
                      return (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setAnswers({ 
                            ...answers, 
                            [selectedQuiz.questions![currentQuestionIndex].id]: opt 
                          })}
                          className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/20'
                              : 'bg-gray-50 dark:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}>
                              {opt}
                            </div>
                            <span className="flex-1 text-gray-700 dark:text-gray-200">{optionValue}</span>
                            {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    {currentQuestionIndex === (selectedQuiz.questions?.length || 0) - 1 ? (
                      <Button 
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(answers).length < (selectedQuiz.questions?.length || 0)}
                        className="bg-gradient-to-r from-green-500 to-indigo-600 hover:from-green-600 hover:to-indigo-700"
                      >
                        Submit Quiz <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
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
                  // Parse the graded answers - each answer is an object with userAnswer, correctAnswer, isCorrect, etc.
                  let gradedAnswer: { userAnswer?: string; correctAnswer?: string; isCorrect?: boolean; explanation?: string } | null = null;
                  let userAnswerLetter = '';
                  let isCorrect = false;
                  
                  try {
                    const parsedAnswers = JSON.parse(attempt.answers);
                    gradedAnswer = parsedAnswers[q.id];
                    if (gradedAnswer && typeof gradedAnswer === 'object') {
                      userAnswerLetter = gradedAnswer.userAnswer || '';
                      isCorrect = gradedAnswer.isCorrect ?? (userAnswerLetter === q.correctAnswer);
                    } else if (typeof parsedAnswers[q.id] === 'string') {
                      // Fallback for old format where answers were just strings
                      userAnswerLetter = parsedAnswers[q.id];
                      isCorrect = userAnswerLetter === q.correctAnswer;
                    }
                  } catch {
                    // If parsing fails, use defaults
                  }

                  return (
                    <div key={q.id || index} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                        <p className="font-medium">{index + 1}. {q.question}</p>
                      </div>
                      <p className="ml-7 text-sm">
                        Your answer: <strong>{userAnswerLetter}. {q[`option${userAnswerLetter}` as keyof Question] as string}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="ml-7 text-sm text-green-600">
                          Correct answer: <strong>{q.correctAnswer}. {q[`option${q.correctAnswer}` as keyof Question] as string}</strong>
                        </p>
                      )}
                      {(gradedAnswer?.explanation || q.explanation) && (
                        <p className="ml-7 text-sm text-gray-500 mt-2">{typeof gradedAnswer?.explanation === 'string' ? gradedAnswer.explanation : (typeof q.explanation === 'string' ? q.explanation : '')}</p>
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
        <>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-gradient-to-r from-blue-500 to-purple-600' : ''}
              >
                {cat === 'all' ? 'All' : cat}
                <Badge variant="secondary" className="ml-2">
                  {quizCounts[cat] || 0}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {quizzes.length === 0 ? 'No quizzes available' : 'No quizzes match your filters'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {quizzes.length === 0 
                    ? 'Check back later for new quizzes!'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuizzes.map((quiz) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden group">
                  {/* Category Banner */}
                  <div className={`h-2 ${
                    quiz.category === 'Programming' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    quiz.category === 'Mathematics' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                    quiz.category === 'Data Science' ? 'bg-gradient-to-r from-green-500 to-indigo-500' :
                    quiz.category === 'Language' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                    quiz.category === 'Science' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    quiz.category === 'Business' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                    'bg-gradient-to-r from-gray-400 to-gray-500'
                  }`} />
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {quiz.category && (
                            <Badge variant="secondary" className="text-xs">
                              {quiz.category}
                            </Badge>
                          )}
                          <Badge className={`text-xs ${
                            quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            quiz.difficulty === 'advanced' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {quiz.difficulty || 'beginner'}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                          {quiz.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-1 line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Quiz Stats */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Timer className="w-4 h-4" />
                        <span>{quiz.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <HelpCircle className="w-4 h-4" />
                        <span>{quiz._count?.questions || quiz.questions?.length || 0} Q</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Target className="w-4 h-4" />
                        <span>{quiz.passingScore}% pass</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Passing Score</span>
                        <span>{quiz.passingScore}%</span>
                      </div>
                      <Progress value={quiz.passingScore} className="h-1.5" />
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
                      onClick={() => handleStartQuiz(quiz)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
        </>
      )}

      {/* Quiz Creation Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* AI Quiz Generator Dialog - Enhanced */}
      <Dialog open={isAIGeneratorOpen} onOpenChange={(open) => {
        setIsAIGeneratorOpen(open);
        if (!open) resetAIGenerator();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 text-white">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              AI Quiz Generator
            </DialogTitle>
            <DialogDescription className="text-white/80 mt-2">
              Generate quiz questions automatically using AI. Enter a topic and customize the settings.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Topic Input with Suggestions */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Topic / Subject *
              </Label>
              <Input
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., JavaScript fundamentals, World War II, Photosynthesis..."
                className="text-base h-12 border-2 focus:border-blue-500"
              />
              
              {/* Quick Topic Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'JavaScript', icon: '💻' },
                    { label: 'Python', icon: '🐍' },
                    { label: 'World History', icon: '🌍' },
                    { label: 'Biology', icon: '🧬' },
                    { label: 'Physics', icon: '⚛️' },
                    { label: 'Chemistry', icon: '🧪' },
                    { label: 'Mathematics', icon: '📐' },
                    { label: 'Geography', icon: '🗺️' },
                  ].map((topic) => (
                    <motion.button
                      key={topic.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAiTopic(topic.label)}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                        aiTopic === topic.label
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{topic.icon}</span>
                      {topic.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500" />
                  Questions
                </Label>
                <Select value={String(aiQuestionCount)} onValueChange={(v) => setAiQuestionCount(parseInt(v))}>
                  <SelectTrigger className="h-11">
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
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Difficulty
                </Label>
                <Select value={aiDifficulty} onValueChange={setAiDifficulty}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">🟢 Easy</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="hard">🔴 Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-orange-500" />
                  Category
                </Label>
                <Select value={aiCategory} onValueChange={setAiCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">📚 General</SelectItem>
                    <SelectItem value="Programming">💻 Programming</SelectItem>
                    <SelectItem value="Mathematics">📐 Mathematics</SelectItem>
                    <SelectItem value="Science">🔬 Science</SelectItem>
                    <SelectItem value="History">📜 History</SelectItem>
                    <SelectItem value="Geography">🗺️ Geography</SelectItem>
                    <SelectItem value="Language">📖 Language</SelectItem>
                    <SelectItem value="Business">💼 Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                Additional Instructions (optional)
              </Label>
              <Textarea
                value={aiInstructions}
                onChange={(e) => setAiInstructions(e.target.value)}
                placeholder="e.g., Focus on practical applications, Include code examples, Avoid multiple-choice questions about dates..."
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Error Message */}
            {aiError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{aiError}</span>
              </motion.div>
            )}

            {/* Generate Button */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={handleGenerateAIQuestions}
                disabled={isGenerating || !aiTopic.trim()}
                className="w-full h-14 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    <span>Generating Questions...</span>
                    <motion.span
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Generate {aiQuestionCount} Questions</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      AI Powered
                    </Badge>
                  </div>
                )}
              </Button>
            </motion.div>

            {/* Generated Questions Preview */}
            {generatedQuestions && generatedQuestions.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Generated {generatedQuestions.length} Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white">{aiDifficulty}</Badge>
                    <Badge variant="outline">{aiCategory}</Badge>
                  </div>
                </div>

                <ScrollArea className="h-72 w-full border rounded-xl">
                  <div className="p-4 space-y-3">
                    {generatedQuestions.map((q, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {index + 1}
                          </div>
                          <p className="font-medium pt-1">
                            {String(q.question)}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm ml-11">
                          {['A', 'B', 'C', 'D'].map((opt) => {
                            const optionKey = `option${opt}`;
                            const isCorrect = q.correctAnswer === opt;
                            return (
                              <div
                                key={opt}
                                className={`px-3 py-2 rounded-lg ${
                                  isCorrect 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium border border-green-200 dark:border-green-800' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                <span className="font-medium">{opt}:</span> {String(q[optionKey])}
                                {isCorrect && <Check className="w-3 h-3 inline ml-1" />}
                              </div>
                            );
                          })}
                        </div>
                        {typeof q.explanation === 'string' && q.explanation && (
                          <div className="mt-3 ml-11 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-600 dark:text-blue-400">
                            💡 {q.explanation}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={resetAIGenerator}
                    className="flex-1 h-11"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={handleUseGeneratedQuestions}
                    className="flex-1 h-11 bg-gradient-to-r from-green-500 to-indigo-600 hover:from-green-600 hover:to-indigo-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Use These Questions
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
            <Button 
              variant="ghost" 
              onClick={() => {
                setIsAIGeneratorOpen(false);
                resetAIGenerator();
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// SKELETON LOADER - Lightweight for faster rendering
// ============================================

const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Welcome Banner Skeleton */}
    <Card className="bg-gradient-to-br from-blue-500/50 to-purple-600/50 border-0 h-32" />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-28">
          <CardContent className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 h-64">
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
          <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded" />
        </CardContent>
      </Card>
      <Card className="h-64">
        <CardContent className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================

const AnimatedCounter = ({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ============================================
// FLOATING PARTICLES COMPONENT (Optimized)
// ============================================

const FloatingParticles = () => {
  // Reduced particles for better performance
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 will-change-transform"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// MOUSE GLOW EFFECT (Optimized with throttle)
// ============================================

const MouseGlow = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      
      // Throttle using requestAnimationFrame
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition({ ...targetRef.current });
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 will-change-[background]"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.04), transparent 40%)`,
      }}
    />
  );
};

// ============================================
// INTERACTIVE FEATURE CARD (Optimized)
// ============================================

const InteractiveFeatureCard = ({ icon: Icon, title, description, color, index, image }: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
  image?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
      className="relative group h-full"
    >
      <div className="feature-card h-full">
        {image && (
          <div className="relative h-44 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
            )}
            <Image
              src={image}
              alt={title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-800 via-white/50 dark:via-slate-800/50 to-transparent" />
          </div>
        )}
        <div className={`p-6 sm:p-8 relative z-10 ${image ? '-mt-16' : ''}`}>
          <div className="feature-icon">
            <Icon className="w-6 h-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// TESTIMONIAL CAROUSEL
// ============================================

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    { name: 'Sarah Johnson', role: 'Computer Science Student', content: 'StudyPlanner helped me organize my entire semester. The quiz feature is a game-changer for exam prep!', rating: 5, avatar: 'SJ' },
    { name: 'Michael Chen', role: 'Medical Student', content: 'The analytics feature showed me exactly where I needed to focus. My grades improved significantly!', rating: 5, avatar: 'MC' },
    { name: 'Emily Davis', role: 'Business Student', content: 'Finally a study app that actually helps! The task management keeps me on track every day.', rating: 5, avatar: 'ED' },
    { name: 'Alex Thompson', role: 'Engineering Student', content: 'The study assistant is helpful for understanding complex concepts.', rating: 5, avatar: 'AT' },
    { name: 'Jessica Wang', role: 'Law Student', content: 'Managing my study schedule has never been easier. The progress tracking keeps me motivated!', rating: 5, avatar: 'JW' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          className="flex transition-transform duration-500 ease-out"
          animate={{ x: `-${activeIndex * 100}%` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div className="testimonial-card max-w-2xl mx-auto">
                <div className="flex gap-1 mb-4 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 text-center italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="testimonial-avatar">
                    <AvatarFallback className="bg-slate-700 text-white font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-200 ${
              index === activeIndex
                ? 'bg-indigo-500 w-8'
                : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================
// DEMO VIDEO MODAL
// ============================================

const DemoVideoModal = ({ onClose }: { onClose: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const SLIDE_DURATION = 6000; // 6 seconds per slide

  const demoSlides = [
    {
      title: 'Welcome to StudyPlanner',
      description: 'Your all-in-one smart study companion',
      icon: '🎓',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      content: (
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
          <div className="relative p-8 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-7xl mb-6"
            >
              🎓
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Smart Study Planner
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 text-lg"
            >
              Plan, learn, and achieve your academic goals with AI-powered tools
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-4 mt-6"
            >
              {[
                { icon: '📚', label: 'Courses' },
                { icon: '🧠', label: 'AI Quizzes' },
                { icon: '📊', label: 'Analytics' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex flex-col items-center gap-2 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: 'Smart Dashboard',
      description: 'Everything you need at a glance',
      icon: '📊',
      gradient: 'from-indigo-500 via-blue-500 to-cyan-500',
      content: (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
          {/* Mock Dashboard Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Dashboard</span>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full" />
              <div className="w-8 h-8 bg-white/20 rounded-full" />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="p-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Courses', value: '12', change: '+2', color: 'bg-blue-500' },
              { label: 'Tasks Done', value: '48', change: '+8', color: 'bg-green-500' },
              { label: 'Study Hours', value: '36h', change: '+5h', color: 'bg-purple-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-xs text-green-500 font-medium">{stat.change}</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Progress Section */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
                <Badge className="bg-green-500 text-white text-xs">On Track</Badge>
              </div>
              <div className="flex items-end gap-1 h-16">
                {[40, 65, 50, 80, 70, 55, 90].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Course Management',
      description: 'Organize your subjects and track progress',
      icon: '📚',
      gradient: 'from-indigo-500 via-indigo-500 to-cyan-500',
      content: (
        <div className="space-y-3">
          {[
            { name: 'Mathematics', progress: 85, color: 'from-blue-500 to-indigo-600', icon: '📐', modules: '12/14' },
            { name: 'Physics', progress: 72, color: 'from-purple-500 to-violet-600', icon: '⚛️', modules: '8/11' },
            { name: 'Chemistry', progress: 58, color: 'from-indigo-500 to-indigo-600', icon: '🧪', modules: '7/12' },
            { name: 'Biology', progress: 45, color: 'from-pink-500 to-rose-600', icon: '🧬', modules: '5/11' },
          ].map((subject, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-2xl">
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{subject.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{subject.modules}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                        className={`h-full bg-gradient-to-r ${subject.color} rounded-full`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{subject.progress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: 'AI Quiz Generator',
      description: 'Create intelligent quizzes in seconds',
      icon: '🤖',
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      content: (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* AI Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-white font-semibold">AI Quiz Generator</p>
              <p className="text-white/70 text-sm">Powered by advanced AI</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto"
            >
              <span className="px-3 py-1 bg-white/20 rounded-full text-white text-xs">Live</span>
            </motion.div>
          </div>
          
          {/* Quiz Content */}
          <div className="p-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">Question 1 of 5</Badge>
                <Badge className="bg-violet-500 text-xs">Multiple Choice</Badge>
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-lg">
                What is the derivative of x³ + 2x²?
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { text: 'A) 3x² + 4x', correct: false },
                { text: 'B) 3x² + 4x', correct: true },
                { text: 'C) x³ + 4x', correct: false },
                { text: 'D) 3x² + 2x', correct: false },
              ].map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-xl text-left text-sm font-medium transition-all ${
                    opt.correct
                      ? 'bg-gradient-to-r from-green-500 to-indigo-500 text-white border-2 border-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {opt.correct && <CheckCircle className="w-4 h-4" />}
                    {opt.text}
                  </span>
                </motion.button>
              ))}
            </div>
            
            {/* AI Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-4 p-3 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl"
            >
              <div className="flex items-start gap-2">
                <Brain className="w-4 h-4 text-violet-500 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">AI Explanation:</span> Using the power rule, the derivative of x³ is 3x² and 2x² is 4x.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: 'Study Schedule',
      description: 'Plan your study sessions smartly',
      icon: '📅',
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      content: (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="font-semibold">January 2024</p>
                <p className="text-sm text-white/70">Your study calendar</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-xs font-medium text-gray-500 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const isCurrentMonth = day >= 1 && day <= 31;
                const hasEvent = [5, 8, 12, 15, 18, 22, 25].includes(day);
                const isToday = day === 15;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`aspect-square flex items-center justify-center text-sm rounded-lg relative ${
                      isCurrentMonth
                        ? isToday
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold'
                          : hasEvent
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  >
                    {isCurrentMonth ? day : ''}
                    {hasEvent && !isToday && (
                      <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 space-y-2"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upcoming</p>
              {[
                { time: '10:00 AM', title: 'Math Study Session', color: 'bg-blue-500' },
                { time: '2:00 PM', title: 'Physics Quiz', color: 'bg-purple-500' },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`w-2 h-8 ${event.color} rounded-full`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      title: 'Analytics & Insights',
      description: 'Track your learning journey',
      icon: '📈',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      content: (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 text-white"
            >
              <p className="text-sm text-white/80">Total Study Time</p>
              <p className="text-2xl font-bold">127h</p>
              <p className="text-xs text-white/60">+12% this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white"
            >
              <p className="text-sm text-white/80">Quizzes Completed</p>
              <p className="text-2xl font-bold">34</p>
              <p className="text-xs text-white/60">85% avg score</p>
            </motion.div>
          </div>
          
          {/* Chart */}
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', hours: 3, goal: 4 },
                { day: 'Tue', hours: 4, goal: 4 },
                { day: 'Wed', hours: 2.5, goal: 4 },
                { day: 'Thu', hours: 5, goal: 4 },
                { day: 'Fri', hours: 3.5, goal: 4 },
                { day: 'Sat', hours: 6, goal: 4 },
                { day: 'Sun', hours: 4.5, goal: 4 },
              ]}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="hours" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Achievement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl flex items-center gap-3"
          >
            <div className="text-3xl">🏆</div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">7-Day Streak!</p>
              <p className="text-sm text-gray-500">Keep up the great work!</p>
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      title: 'Get Started Today!',
      description: 'Join thousands of successful students',
      icon: '🚀',
      gradient: 'from-green-500 via-indigo-500 to-indigo-500',
      content: (
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-7xl mb-6"
          >
            🚀
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-3 text-gray-900 dark:text-white"
          >
            Ready to Transform Your Learning?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-300 mb-6"
          >
            Join 10,000+ students who improved their grades with StudyPlanner
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button className="bg-gradient-to-r from-green-500 to-indigo-600 hover:from-green-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-green-500/30">
              <Sparkles className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" className="px-8 py-6 text-lg rounded-xl">
              Learn More
            </Button>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < demoSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setProgress(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setProgress(0);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && currentSlide < demoSlides.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => prev + 1);
        setProgress(0);
      }, SLIDE_DURATION);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentSlide, demoSlides.length]);

  // Progress bar animation
  useEffect(() => {
    if (isPlaying) {
      const interval = 50;
      const increment = (interval / SLIDE_DURATION) * 100;
      
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + increment;
        });
      }, interval);
    } else {
      if (progressRef.current) clearInterval(progressRef.current);
    }
    
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      else if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${demoSlides[currentSlide].gradient} p-4 sm:p-5 text-white relative overflow-hidden flex-shrink-0`}>
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            }}
          />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                key={currentSlide}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl"
              >
                {demoSlides[currentSlide].icon}
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">{demoSlides[currentSlide].title}</h3>
                <p className="text-sm text-white/80">{demoSlides[currentSlide].description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Play/Pause Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 relative">
            <div className="flex gap-1.5">
              {demoSlides.map((slide, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setCurrentSlide(i);
                    setProgress(0);
                  }}
                >
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: i < currentSlide ? '100%' : i === currentSlide ? `${progress}%` : '0%',
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              ))}
            </div>
            {/* Step Labels */}
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>Step {currentSlide + 1} of {demoSlides.length}</span>
              <span className="hidden sm:block">Use arrow keys to navigate</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 min-h-[260px] sm:min-h-[320px] md:min-h-[380px] overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {demoSlides[currentSlide].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 gap-3 sm:gap-0 flex-shrink-0">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          
          {/* Dots Navigation */}
          <div className="flex items-center gap-2">
            {demoSlides.map((slide, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setProgress(0);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full transition-all min-w-[24px] min-h-[24px] flex items-center justify-center ${
                  i === currentSlide
                    ? `w-8 h-2.5 bg-gradient-to-r ${slide.gradient}`
                    : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
          
          {currentSlide < demoSlides.length - 1 ? (
            <Button
              onClick={nextSlide}
              className={`bg-gradient-to-r ${demoSlides[currentSlide + 1]?.gradient || demoSlides[currentSlide].gradient} text-white gap-2 w-full sm:w-auto min-h-[44px]`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-green-500 to-indigo-600 text-white gap-2 w-full sm:w-auto min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" /> Get Started
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// FOOTER PAGE MODALS
// ============================================

interface FooterPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// About Us Modal
const AboutUsModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">About Us</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              At StudyPlanner, we believe every student deserves the tools to succeed. Our mission is to transform how students learn, plan, and achieve their academic goals through intelligent, personalized study management.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Story</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Founded in 2024, StudyPlanner was born from the frustration of juggling multiple subjects, deadlines, and study materials. We created an all-in-one platform that combines smart planning, AI-powered quizzes, and comprehensive analytics to help students study smarter, not harder.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { icon: Calendar, title: 'Smart Planning', desc: 'Organize subjects and tasks with intelligent scheduling' },
                { icon: Brain, title: 'AI Quizzes', desc: 'Generate personalized quizzes automatically' },
                { icon: BarChart3, title: 'Analytics', desc: 'Track progress with detailed insights' },
                { icon: BookOpen, title: 'Courses', desc: 'Access comprehensive learning materials' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Team</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're a passionate team of educators, developers, and designers committed to making education more accessible and effective. Together, we're building the future of learning.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Contact Modal
const ContactModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Contact Us</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-500">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="How can we help?"
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <>Send Message <Send className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </form>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <a href="mailto:support@studyplanner.com" className="flex items-center gap-1 hover:text-blue-500">
                <Mail className="w-4 h-4" /> support@studyplanner.com
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// FAQ/Help Center Modal
const FAQModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How do I get started with StudyPlanner?',
      answer: 'Simply click the "Get Started" button, sign up with your Google account, and you can immediately start adding subjects and tasks. Our intuitive interface makes it easy to organize your studies.',
    },
    {
      question: 'Is StudyPlanner free to use?',
      answer: 'Yes! We offer a free plan with up to 5 subjects and basic features. For unlimited access to AI quizzes, advanced analytics, and more, check out our Pro and Premium plans.',
    },
    {
      question: 'How does the AI Quiz Generator work?',
      answer: 'Our AI analyzes your subjects and learning materials to automatically generate relevant quiz questions. It adapts to your progress and focuses on areas where you need more practice.',
    },
    {
      question: 'Can I track my progress over time?',
      answer: 'Absolutely! Our Analytics dashboard shows detailed charts of your task completion, quiz scores, and study patterns. You can see weekly, monthly, and overall trends.',
    },
    {
      question: 'Is my data secure?',
      answer: 'We take security seriously. All data is encrypted, and we never share your personal information. Your study data remains private and secure on our servers.',
    },
    {
      question: 'Can I access StudyPlanner on mobile?',
      answer: 'Yes! StudyPlanner is fully responsive and works great on all devices - desktop, tablet, and mobile. Access your studies anywhere, anytime.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from your account settings. No hidden fees, no questions asked. Your access continues until the end of your billing period.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 14-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.',
    },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Help Center</h2>
                <p className="text-sm text-white/80">Frequently Asked Questions</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Privacy Policy Modal
const PrivacyPolicyModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[60vh] prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 mb-4">Last updated: January 2024</p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">1. Information We Collect</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We collect information you provide directly, such as your name, email, and study data. We also automatically collect usage data to improve our services.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2. How We Use Your Information</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your information is used to provide and improve our services, personalize your experience, and communicate with you about your account.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">3. Data Security</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We implement industry-standard security measures to protect your data. Your information is encrypted and stored securely on our servers.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">4. Information Sharing</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We do not sell or share your personal information with third parties, except as required by law or to provide our services.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">5. Your Rights</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have the right to access, correct, or delete your personal data. Contact us at privacy@studyplanner.com for any requests.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6. Cookies</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">7. Changes to This Policy</h3>
          <p className="text-gray-600 dark:text-gray-300">
            We may update this policy periodically. Continued use of our service constitutes acceptance of any changes.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Terms of Service Modal
const TermsOfServiceModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Terms of Service</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[60vh] prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 mb-4">Last updated: January 2024</p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">1. Acceptance of Terms</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            By accessing and using StudyPlanner, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">2. Use License</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Permission is granted to temporarily use StudyPlanner for personal, non-commercial purposes. This is the grant of a license, not a transfer of title.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">3. User Accounts</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all activities under your account. You must notify us immediately of any unauthorized use.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">4. Prohibited Uses</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You may not use StudyPlanner for any unlawful purpose, to solicit others to perform unlawful acts, or to violate any international, federal, or local regulations.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">5. Disclaimer</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            StudyPlanner is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any content.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">6. Limitations</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            In no event shall StudyPlanner or its operators be liable for any damages arising out of the use or inability to use the service.
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">7. Revisions</h3>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to revise these terms at any time. Continued use of the service after changes constitutes acceptance of the revised terms.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Careers Modal
const CareersModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  const jobs = [
    { title: 'Full-Stack Developer', type: 'Full-time', location: 'Remote', department: 'Engineering' },
    { title: 'UI/UX Designer', type: 'Full-time', location: 'Remote', department: 'Design' },
    { title: 'Product Manager', type: 'Full-time', location: 'Remote', department: 'Product' },
    { title: 'Content Writer', type: 'Part-time', location: 'Remote', department: 'Content' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Join Our Team</h2>
                <p className="text-sm text-white/80">Open Positions</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're always looking for talented individuals who are passionate about education and technology. Join us in building the future of learning!
          </p>
          
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{job.type}</Badge>
                      <Badge variant="outline" className="text-xs">{job.location}</Badge>
                      <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">Apply</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Don't see a fit?</h4>
            <p className="text-sm text-gray-500 mb-3">Send us your resume and we'll keep you in mind for future opportunities.</p>
            <Button variant="outline" size="sm">Send Resume</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Help Center Modal
const HelpCenterModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-green-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold">Help Center</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Getting Started</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Create your free account to get started with StudyPlanner</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Set up your subjects and courses in the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Create your first study schedule and track progress</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📚 Course Management</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Organize your courses, track modules, and monitor completion progress.</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📝 Smart Quizzes</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Test your knowledge with AI-generated quizzes and track your scores.</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📅 Study Schedule</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Plan your study sessions and get reminders for upcoming tasks.</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📊 Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">View detailed insights about your learning progress and performance.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Need More Help?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.open('mailto:support@studyplanner.com', '_blank')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-indigo-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Blog Modal
const BlogModal = ({ isOpen, onClose }: FooterPageModalProps) => {
  const posts = [
    { title: '10 Study Techniques Backed by Science', date: 'Jan 15, 2024', readTime: '5 min', category: 'Study Tips' },
    { title: 'How to Build a Study Schedule That Works', date: 'Jan 10, 2024', readTime: '7 min', category: 'Planning' },
    { title: 'The Benefits of Spaced Repetition', date: 'Jan 5, 2024', readTime: '4 min', category: 'Learning' },
    { title: 'AI in Education: What to Expect in 2024', date: 'Dec 28, 2023', readTime: '6 min', category: 'Technology' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Blog</h2>
                <p className="text-sm text-white/80">Study Tips & Insights</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="outline" className="text-xs mb-2">{post.category}</Badge>
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{post.title}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} read</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline">View All Posts</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// LANDING PAGE COMPONENTS (Continued from before)
// ============================================

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingPage = ({ onLogin, onRegister }: LandingPageProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // Footer modal states
  const [activeFooterModal, setActiveFooterModal] = useState<string | null>(null);
  
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Handle scroll for navbar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);
      
      // Detect active section
      const sections = ['features', 'how-it-works'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 overflow-x-hidden">
      
      {/* Demo Video Modal */}
      <AnimatePresence>
        {showDemoModal && <DemoVideoModal onClose={() => setShowDemoModal(false)} />}
      </AnimatePresence>
      
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-200 dark:border-slate-800' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Left */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center flex-shrink-0"
            >
              <Logo size="sm" className="hidden sm:flex" />
              <LogoIcon size="sm" className="sm:hidden" />
            </motion.div>
            
            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1">
                {[
                  { id: 'features', label: 'Features' },
                  { id: 'how-it-works', label: 'How It Works' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg min-h-[44px] ${
                      activeSection === item.id
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    {item.label}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle - Desktop */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex hover:bg-slate-100 dark:hover:bg-slate-800 w-10 h-10 lg:w-11 lg:h-11"
                >
                  <motion.div
                    initial={false}
                    animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.div>
                </Button>
              )}
              
              {/* Login Button - Desktop */}
              <Button 
                variant="ghost" 
                onClick={onLogin} 
                className="hidden md:flex text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 h-10 lg:h-11 px-3 lg:px-4"
              >
                Login
              </Button>
              
              {/* Get Started Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium h-10 lg:h-11 px-4 lg:px-5 text-sm" 
                  onClick={onRegister}
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Button>
              </motion.div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden w-10 h-10 flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Navigation Items */}
                {[
                  { id: 'features', label: 'Features', icon: Calendar },
                  { id: 'how-it-works', label: 'How It Works', icon: Target },
                ].map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl transition-colors min-h-[48px] ${
                      activeSection === item.id
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
                
                {/* Divider */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-700"
                >
                  {/* Theme Toggle - Mobile */}
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[48px]"
                    >
                      {theme === 'dark' ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                      <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                  )}
                  
                  {/* Login - Mobile */}
                  <button
                    onClick={onLogin}
                    className="flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[48px]"
                  >
                    <Users className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">Login</span>
                  </button>
                  
                  {/* Get Started - Mobile */}
                  <Button 
                    onClick={onRegister} 
                    className="w-full mt-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 text-base font-medium"
                  >
                    Get Started Free
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 px-4 overflow-hidden">
        {/* Clean Background */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white dark:border-slate-800 ${
                      i === 1 ? 'bg-indigo-500' :
                      i === 2 ? 'bg-slate-600' :
                      i === 3 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                <span className="text-indigo-600 font-bold">2,500+</span> students already learning
              </span>
              <div className="hidden sm:flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            <span className="text-slate-900 dark:text-white">Study planning,</span>
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">simplified.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 text-center mb-6 sm:mb-8 max-w-2xl leading-relaxed"
          >
            A straightforward study planner that helps you organize subjects, track assignments, and stay on top of deadlines. Built by students, for students.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-medium transition-all duration-200 min-h-[48px] sm:min-h-[56px]"
                    onClick={onRegister}
                  >
                    Get Started <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto rounded-lg px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-medium border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 min-h-[48px] sm:min-h-[56px]"
                    onClick={() => setShowDemoModal(true)}
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Watch Demo
                  </Button>
                </motion.div>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8"
              >
                {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((text, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 rounded-full text-xs sm:text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500" />
                    {text}
                  </motion.div>
                ))}
              </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { value: 2500, suffix: '+', label: 'Active Students', icon: Users },
              { value: 150, suffix: '+', label: 'Courses Created', icon: BookOpen },
              { value: 50000, suffix: '+', label: 'Tasks Completed', icon: CheckCircle },
              { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-indigo-500" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 sm:py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4">
              Everything you need
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
              A complete toolkit to organize your studies and stay on track
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Calendar, title: 'Study Planner', description: 'Organize subjects, set exam dates, and manage tasks with a clear overview of your schedule.', color: 'bg-indigo-500', image: '/images/landing/feature-planner.png' },
              { icon: ClipboardList, title: 'Task Management', description: 'Create, edit, and track tasks with priority levels and due dates.', color: 'bg-slate-600', image: '/images/landing/feature-tasks.png' },
              { icon: BookOpen, title: 'Course Library', description: 'Access comprehensive courses with structured modules and learning materials.', color: 'bg-amber-500', image: '/images/landing/feature-courses.png' },
              { icon: Brain, title: 'Quiz Generator', description: 'Create quizzes to test your knowledge and track your progress.', color: 'bg-rose-500', image: '/images/landing/feature-quiz.png' },
              { icon: BarChart3, title: 'Progress Analytics', description: 'Visualize your learning journey with detailed charts and statistics.', color: 'bg-indigo-500', image: '/images/landing/feature-analytics.png' },
              { icon: MessageCircle, title: 'Study Assistant', description: 'Get help with your study questions whenever you need it.', color: 'bg-cyan-500', image: '/images/landing/feature-assistant.png' },
            ].map((feature, index) => (
              <InteractiveFeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-24 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 px-4">
              Get started in 4 steps
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
              Up and running in minutes
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { step: '01', title: 'Create Account', description: 'Sign up for free and set up your profile', icon: Users },
              { step: '02', title: 'Add Subjects', description: 'Create subjects and set exam dates', icon: BookOpen },
              { step: '03', title: 'Plan & Study', description: 'Create tasks, track progress, access courses', icon: Calendar },
              { step: '04', title: 'Track Results', description: 'Monitor progress with detailed analytics', icon: BarChart3 },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center relative group"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What students are saying
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Honest feedback from our community
            </p>
          </motion.div>
          
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 px-4 relative overflow-hidden">
        <div className="cta-section max-w-6xl mx-auto py-16 sm:py-20 px-6 sm:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 text-center"
          >
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Ready to get started?
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of students who use StudyPlanner to stay organized.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  className="cta-button-primary" 
                  onClick={onRegister}
                >
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="cta-button-secondary" 
                  onClick={onLogin}
                >
                  Login
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 text-white">
        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
          {/* Newsletter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800 rounded-xl p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 md:mb-16 border border-slate-700"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Stay Updated</h3>
                <p className="text-sm sm:text-base text-slate-400">Get the latest updates and tips delivered to your inbox.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-indigo-500 w-full sm:w-64 md:w-72 h-12 sm:h-11 min-h-[48px]"
                />
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white whitespace-nowrap h-12 sm:h-11 min-h-[48px]">
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Brand Section */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <Logo size="md" className="mb-4" />
                <p className="text-slate-400 leading-relaxed max-w-sm mb-6">
                  A straightforward study planner that helps you stay organized and on track.
                </p>
                {/* Social Links */}
                <div className="flex gap-3">
                  {[
                    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                    { icon: Github, href: 'https://github.com', label: 'GitHub' },
                    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-slate-800 hover:bg-indigo-500 rounded-lg flex items-center justify-center transition-colors group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Product Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Features', href: '#features', onClick: () => scrollToSection('features') },
                  { label: 'Courses', onClick: onRegister },
                  { label: 'Quizzes', onClick: onRegister },
                ].map((link) => (
                  <li key={link.label}>
                    <button 
                      onClick={link.onClick}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: 'About Us', modal: 'about' as const },
                  { label: 'Blog', modal: 'blog' as const },
                  { label: 'Careers', modal: 'careers' as const },
                  { label: 'Contact', modal: 'contact' as const },
                ].map((link) => (
                  <li key={link.label}>
                    <button 
                      onClick={() => setActiveFooterModal(link.modal)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Help Center', modal: 'help' as const },
                  { label: 'FAQ', modal: 'faq' as const },
                  { label: 'Privacy Policy', modal: 'privacy' as const },
                  { label: 'Terms of Service', modal: 'terms' as const },
                ].map((link) => (
                  <li key={link.label}>
                    <button 
                      onClick={() => setActiveFooterModal(link.modal)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>© {new Date().getFullYear()} StudyPlanner.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Page Modals */}
      <AnimatePresence>
        <AboutUsModal isOpen={activeFooterModal === 'about'} onClose={() => setActiveFooterModal(null)} />
        <ContactModal isOpen={activeFooterModal === 'contact'} onClose={() => setActiveFooterModal(null)} />
        <FAQModal isOpen={activeFooterModal === 'faq'} onClose={() => setActiveFooterModal(null)} />
        <PrivacyPolicyModal isOpen={activeFooterModal === 'privacy'} onClose={() => setActiveFooterModal(null)} />
        <TermsOfServiceModal isOpen={activeFooterModal === 'terms'} onClose={() => setActiveFooterModal(null)} />
        <CareersModal isOpen={activeFooterModal === 'careers'} onClose={() => setActiveFooterModal(null)} />
        <BlogModal isOpen={activeFooterModal === 'blog'} onClose={() => setActiveFooterModal(null)} />
        <HelpCenterModal isOpen={activeFooterModal === 'help'} onClose={() => setActiveFooterModal(null)} />
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 bg-indigo-500 text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
};

// ============================================
// AUTH MODAL - ENHANCED VERSION
// ============================================

interface AuthModalProps {
  mode: 'login' | 'register' | 'forgot-password';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot-password') => void;
  onSuccess: (user: User) => void;
  initialError?: string;
}

// Floating shapes for background animation (Optimized)
const AuthFloatingShapes = () => {
  // Reduced from 6 to 3 shapes for better performance
  const shapes = [
    { size: 80, left: 10, top: 20, duration: 8 },
    { size: 60, left: 80, top: 60, duration: 10 },
    { size: 40, left: 50, top: 80, duration: 12 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full will-change-transform ${
            i % 2 === 0
              ? 'bg-gradient-to-br from-blue-400/15 to-purple-400/15'
              : 'bg-gradient-to-br from-pink-400/15 to-orange-400/15'
          }`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.left}%`,
            top: `${shape.top}%`,
          }}
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

// Password strength calculator
const calculatePasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const getPasswordStrengthColor = (strength: number) => {
  if (strength <= 1) return { bar: 'bg-red-500', text: 'text-red-500', label: 'Weak' };
  if (strength <= 2) return { bar: 'bg-orange-500', text: 'text-orange-500', label: 'Fair' };
  if (strength <= 3) return { bar: 'bg-yellow-500', text: 'text-yellow-500', label: 'Good' };
  if (strength <= 4) return { bar: 'bg-lime-500', text: 'text-lime-500', label: 'Strong' };
  return { bar: 'bg-green-500', text: 'text-green-500', label: 'Excellent' };
};

// FloatingInput component - defined OUTSIDE AuthModal to prevent re-renders
const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  required = true,
  minLength,
  placeholder,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  focusedField,
  onFocus,
  onBlur,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  focusedField: string | null;
  onFocus: (id: string) => void;
  onBlur: () => void;
}) => {
  const isFocused = focusedField === id;
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <div
        className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none ${
          isFocused || hasValue ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      <Input
        id={id}
        type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocus(id)}
        onBlur={onBlur}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className={`pl-10 sm:pl-12 py-4 sm:py-5 md:py-6 h-auto text-base sm:text-lg transition-all duration-200 min-h-[48px] ${
          showPasswordToggle ? 'pr-10 sm:pr-12' : 'pr-3 sm:pr-4'
        } ${
          isFocused
            ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-500/10'
            : 'hover:border-gray-400'
        }`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />}
        </button>
      )}
    </div>
  );
};

const AuthModal = ({ mode, onClose, onSwitchMode, onSuccess, initialError }: AuthModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialError || '');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  
  // New states for email auth
  const [emailLoading, setEmailLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  // Verification code states
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verifyCodeLoading, setVerifyCodeLoading] = useState(false);
  const [verifyCodeError, setVerifyCodeError] = useState('');

  // Reset password states
  const [resetPasswordData, setResetPasswordData] = useState({ password: '', confirmPassword: '' });
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  // Pre-cache Firebase auth instance
  const firebaseAuthRef = useRef<{ auth: typeof import('firebase/auth').Auth | null; googleProvider: typeof import('firebase/auth').GoogleAuthProvider | null }>({ auth: null, googleProvider: null });

  useEffect(() => {
    setMounted(true);
    // Check Firebase configuration and pre-initialize on mount
    if (isFirebaseConfigured()) {
      // Pre-load Firebase in the background
      getFirebaseAuth().then(async ({ auth, googleProvider }) => {
        firebaseAuthRef.current = { auth, googleProvider };
        setFirebaseReady(!!auth && !!googleProvider);
        
        // Check for redirect result (when returning from Google sign-in)
        if (auth) {
          try {
            const { getRedirectResult } = await import('firebase/auth');
            const result = await getRedirectResult(auth);
            
            if (result && result.user) {
              console.log('🔥 Google redirect result received:', result.user.email);
              const user = result.user;
              
              if (!user.email) {
                throw new Error('Could not get email from Google account.');
              }
              
              // Send the user info to our backend to create a session
              const response = await fetch('/api/auth/firebase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  idToken: await user.getIdToken(),
                  name: user.displayName,
                  email: user.email,
                  picture: user.photoURL,
                }),
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Failed to create session.');
              }

              if (data.success && data.user) {
                // Show success animation
                setShowSuccess(true);
                setTimeout(() => {
                  onSuccess(data.user);
                }, 800);
              }
            }
          } catch (redirectError) {
            console.error('🔥 Redirect result error:', redirectError);
            // Don't show error if it's just "no redirect result"
            const errorCode = (redirectError as { code?: string })?.code || '';
            if (errorCode !== 'auth/no-auth-event') {
              setError(redirectError instanceof Error ? redirectError.message : 'Google sign-in failed');
            }
          }
        }
      }).catch((err) => {
        console.error('Firebase pre-initialization error:', err);
        setFirebaseReady(false);
      });
    }
  }, [onSuccess]);
  
  // Reset states when mode changes
  useEffect(() => {
    setError('');
    setRegistrationSuccess(false);
    setForgotPasswordSuccess(false);
    setRequiresVerification(false);
    setResendSuccess(false);
  }, [mode]);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    
    try {
      // Use cached auth instance or get it
      let { auth, googleProvider, error: firebaseError } = firebaseAuthRef.current;
      
      if (!auth || !googleProvider) {
        const result = await getFirebaseAuth();
        auth = result.auth;
        googleProvider = result.googleProvider;
        firebaseError = result.error;
      }
      
      if (firebaseError) {
        throw new Error(firebaseError);
      }
      
      if (!auth || !googleProvider) {
        throw new Error('Firebase authentication could not be initialized.');
      }
      
      // Try popup first, fall back to redirect if popup fails
      try {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        if (!user.email) {
          throw new Error('Could not get email from Google account.');
        }
        
        // Send the user info to our backend to create a session
        const response = await fetch('/api/auth/firebase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            idToken: await user.getIdToken(),
            name: user.displayName,
            email: user.email,
            picture: user.photoURL,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create session.');
        }

        if (!data.success || !data.user) {
          throw new Error(data.error || 'Authentication failed.');
        }

        // Show success animation
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess(data.user);
        }, 800);
      } catch (popupError) {
        const errorCode = (popupError as { code?: string })?.code || '';
        
        // If popup is blocked or closed, use redirect method
        if (errorCode === 'auth/popup-blocked' || 
            errorCode === 'auth/popup-closed-by-user' ||
            errorCode === 'auth/unauthorized-domain') {
          console.log('🔥 Popup failed, trying redirect method...');
          
          const { signInWithRedirect } = await import('firebase/auth');
          await signInWithRedirect(auth, googleProvider);
          // Page will redirect, so we don't need to handle success here
          return;
        }
        
        throw popupError;
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      
      // Handle specific Firebase errors
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      const errorCode = (err as { code?: string })?.code || '';
      
      if (errorCode === 'auth/popup-blocked' || errorMessage.includes('auth/popup-blocked')) {
        setError('Popup was blocked. Redirecting to Google sign-in...');
      } else if (errorCode === 'auth/popup-closed-by-user' || errorMessage.includes('auth/popup-closed-by-user')) {
        setError('Sign-in popup was closed. This usually means the domain is not authorized in Firebase.\n\nPlease add this domain to Firebase Console:\n1. Go to Firebase Console > Authentication > Settings\n2. Add your domain to "Authorized domains"');
      } else if (errorCode === 'auth/unauthorized-domain' || errorMessage.includes('unauthorized-domain')) {
        setError('This domain is not authorized for Google sign-in.\n\nPlease add this domain to Firebase Console:\n1. Go to Firebase Console > Authentication > Settings\n2. Add your domain to "Authorized domains"');
      } else if (errorCode === 'auth/invalid-api-key' || errorMessage.includes('invalid-api-key')) {
        setError('Invalid Firebase API Key. Please check your Firebase configuration.');
      } else if (errorCode === 'auth/network-request-failed' || errorMessage.includes('network-request-failed')) {
        setError('Network error. Please check your internet connection.');
      } else if (errorMessage.includes('Firebase configuration incomplete')) {
        setError('Firebase is not configured. Please try email login instead.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailLoading(true);
    setRequiresVerification(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresVerification) {
          setRequiresVerification(true);
          setError('Please verify your email address before logging in.');
        } else {
          throw new Error(data.error || 'Login failed');
        }
        return;
      }

      if (!data.success || !data.user) {
        throw new Error(data.error || 'Login failed');
      }

      setShowSuccess(true);
      setTimeout(() => {
        onSuccess(data.user);
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle email/password registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Check if user was auto-verified and logged in
      if (data.autoVerified && data.user) {
        // User is automatically logged in (development/demo mode)
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess(data.user);
        }, 800);
      } else {
        // Show success message asking user to check email (production mode)
        setRegistrationSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setForgotPasswordSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    setError('');
    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification email');
      }

      setResendSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle verification code input change
  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setVerifyCodeError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle verification code key down (for backspace navigation)
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle verification code paste
  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...verificationCode];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setVerificationCode(newCode);
    }
  };

  // Handle verify code submission
  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setVerifyCodeError('Please enter a 6-digit code');
      return;
    }

    setVerifyCodeLoading(true);
    setVerifyCodeError('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      // Success - show success animation and log in
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess(data.user);
      }, 800);
    } catch (err) {
      setVerifyCodeError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setVerifyCodeLoading(false);
    }
  };

  // Handle reset password with code submission
  const handleResetPassword = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setResetPasswordError('Please enter a 6-digit code');
      return;
    }

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      setResetPasswordError('Passwords do not match');
      return;
    }

    if (resetPasswordData.password.length < 8) {
      setResetPasswordError('Password must be at least 8 characters');
      return;
    }

    setResetPasswordLoading(true);
    setResetPasswordError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: code,
          password: resetPasswordData.password,
          confirmPassword: resetPasswordData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      // Success - show success animation and log in
      setResetPasswordSuccess(true);
      setShowSuccess(true);
      setTimeout(() => {
        onSuccess(data.user);
      }, 800);
    } catch (err) {
      setResetPasswordError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Get password strength info
  const passwordStrength = calculatePasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthColor(passwordStrength);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl pointer-events-none" />

      {/* Floating particles */}
      {mounted && <AuthFloatingShapes />}

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Animation Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 bg-white dark:bg-gray-900 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-semibold text-gray-900 dark:text-white"
                >
                  {mode === 'login' ? 'Welcome Back!' : 'Account Created!'}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header with decorative elements */}
        <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-5 sm:p-6 md:p-8 text-white overflow-hidden flex-shrink-0">
          {/* Animated circles in header */}
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2"
            >
              <motion.div
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                {mode === 'login' ? (
                  <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : mode === 'forgot-password' ? (
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </motion.div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold truncate">
                  {mode === 'login' ? 'Welcome Back!' : mode === 'forgot-password' ? 'Reset Password' : 'Join StudyPlanner'}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm truncate">
                  {mode === 'login' ? 'Sign in to continue learning' : mode === 'forgot-password' ? 'Enter your email to receive a reset link' : 'Start your learning journey today'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Registration Success Message */}
          {registrationSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 sm:py-6"
            >
              {!showSuccess ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Verify Your Email</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 px-2">
                    We've sent a 6-digit verification code to <strong className="break-all">{formData.email}</strong>
                  </p>
                  
                  {/* 6-digit code input */}
                  <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={verificationCode[index]}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={handleCodePaste}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {verifyCodeError && (
                    <p className="text-red-500 text-xs sm:text-sm mb-3">{verifyCodeError}</p>
                  )}

                  <Button
                    onClick={handleVerifyCode}
                    disabled={verifyCodeLoading || verificationCode.join('').length !== 6}
                    className="w-full sm:w-auto px-8 h-10 sm:h-11 text-sm bg-gradient-to-r from-green-500 to-indigo-600 hover:from-green-600 hover:to-indigo-700"
                  >
                    {verifyCodeLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Continue'
                    )}
                  </Button>

                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>Didn't receive the code?</span>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                    >
                      {resendLoading ? 'Sending...' : resendSuccess ? 'Code sent!' : 'Resend code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Email Verified!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Your email has been verified. You're now being logged in...
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* Forgot Password Success Message */}
          {forgotPasswordSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 sm:py-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
              >
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Email Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 px-2">
                If an account exists for <strong className="break-all">{formData.email}</strong>, you'll receive a password reset link shortly.
              </p>
              <Button
                variant="outline"
                onClick={() => onSwitchMode('login')}
                className="mt-2 h-10 sm:h-11 text-sm"
              >
                Back to Login
              </Button>
            </motion.div>
          )}

          {/* Show forms only if not in success state */}
          {!registrationSuccess && !forgotPasswordSuccess && (
            <>
              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <span>{error}</span>
                      {requiresVerification && !resendSuccess && (
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={resendLoading}
                          className="block mt-2 text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                        >
                          {resendLoading ? 'Sending...' : 'Resend verification email'}
                        </button>
                      )}
                      {resendSuccess && (
                        <p className="mt-2 text-green-500">Verification email sent! Check your inbox.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot Password Form */}
              {mode === 'forgot-password' && (
                <>
                  {!forgotPasswordSuccess ? (
                    // Step 1: Enter email
                    <form onSubmit={handleForgotPassword} className="space-y-3 sm:space-y-4">
                      <FloatingInput
                        id="forgot-email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        icon={Mail}
                        placeholder="Enter your email"
                        focusedField={focusedField}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                      />
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          type="submit"
                          disabled={emailLoading || !formData.email}
                          className="w-full py-4 sm:py-5 md:py-6 h-auto rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 text-sm sm:text-base min-h-[48px]"
                        >
                          {emailLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            'Send Reset Code'
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Remember your password?{' '}
                        <button
                          type="button"
                          onClick={() => onSwitchMode('login')}
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Back to Login
                        </button>
                      </p>
                    </form>
                  ) : (
                    // Step 2: Enter code + new password
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-4"
                    >
                      {!resetPasswordSuccess && (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                          >
                            <KeyRound className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </motion.div>
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Reset Your Password</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-4 px-2">
                            We've sent a 6-digit code to <strong className="break-all">{formData.email}</strong>
                          </p>
                          
                          {/* 6-digit code input */}
                          <div className="flex justify-center gap-2 sm:gap-3 mb-4">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                              <input
                                key={index}
                                id={`reset-code-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={verificationCode[index]}
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                onPaste={handleCodePaste}
                                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                                autoFocus={index === 0}
                              />
                            ))}
                          </div>

                          {/* New Password Fields */}
                          <div className="space-y-3 mt-4">
                            <div className="relative">
                              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              </div>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={resetPasswordData.password}
                                onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                                placeholder="New Password"
                                className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-4 sm:py-5 h-auto text-base sm:text-lg min-h-[48px]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                              >
                                {showPassword ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />}
                              </button>
                            </div>

                            {/* Password strength indicator */}
                            {resetPasswordData.password && (
                              <div className="px-1">
                                <div className="flex gap-1 mb-1">
                                  {[1, 2, 3, 4, 5].map((level) => (
                                    <div
                                      key={level}
                                      className={`h-1 flex-1 rounded-full transition-all ${
                                        level <= calculatePasswordStrength(resetPasswordData.password)
                                          ? getPasswordStrengthColor(calculatePasswordStrength(resetPasswordData.password)).bar
                                          : 'bg-gray-200 dark:bg-gray-700'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className={`text-xs ${getPasswordStrengthColor(calculatePasswordStrength(resetPasswordData.password)).text}`}>
                                  {getPasswordStrengthColor(calculatePasswordStrength(resetPasswordData.password)).label}
                                </p>
                              </div>
                            )}

                            <div className="relative">
                              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              </div>
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                value={resetPasswordData.confirmPassword}
                                onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                                placeholder="Confirm New Password"
                                className="pl-10 sm:pl-12 py-4 sm:py-5 h-auto text-base sm:text-lg min-h-[48px]"
                              />
                            </div>
                          </div>

                          {resetPasswordError && (
                            <p className="text-red-500 text-xs sm:text-sm">{resetPasswordError}</p>
                          )}

                          <Button
                            onClick={handleResetPassword}
                            disabled={resetPasswordLoading || verificationCode.join('').length !== 6 || !resetPasswordData.password || !resetPasswordData.confirmPassword}
                            className="w-full sm:w-auto px-8 h-10 sm:h-11 text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                          >
                            {resetPasswordLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Resetting...
                              </>
                            ) : (
                              'Reset Password'
                            )}
                          </Button>

                          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                            Didn't receive the code?{' '}
                            <button
                              type="button"
                              onClick={async () => {
                                setResendLoading(true);
                                try {
                                  const response = await fetch('/api/auth/forgot-password', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: formData.email }),
                                  });
                                  if (response.ok) {
                                    setResendSuccess(true);
                                    setTimeout(() => setResendSuccess(false), 3000);
                                  }
                                } catch {
                                  // Silent fail
                                } finally {
                                  setResendLoading(false);
                                }
                              }}
                              disabled={resendLoading}
                              className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
                            >
                              {resendLoading ? 'Sending...' : 'Resend code'}
                            </button>
                          </p>
                          {resendSuccess && (
                            <p className="text-green-500 text-xs sm:text-sm">New code sent!</p>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </>
              )}

              {/* Login and Register Forms */}
              {mode !== 'forgot-password' && (
                <>
                  {/* Google Login Button */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full py-4 sm:py-5 md:py-6 h-auto rounded-xl font-semibold flex items-center justify-center gap-2 sm:gap-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group text-sm sm:text-base min-h-[48px]"
                    >
                      {googleLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="hidden xs:inline">Continue with Google</span>
                          <span className="xs:hidden">Google</span>
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                      <span className="px-3 sm:px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with email</span>
                    </div>
                  </div>

                  {/* Login Form */}
                  {mode === 'login' && (
                    <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4">
                      <FloatingInput
                        id="login-email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        icon={Mail}
                        placeholder="Enter your email"
                        focusedField={focusedField}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="relative">
                        <FloatingInput
                          id="login-password"
                          label="Password"
                          type="password"
                          value={formData.password}
                          onChange={(v) => setFormData({ ...formData, password: v })}
                          icon={Shield}
                          showPasswordToggle
                          showPassword={showPassword}
                          onTogglePassword={() => setShowPassword(!showPassword)}
                          placeholder="Enter your password"
                          focusedField={focusedField}
                          onFocus={setFocusedField}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <label className="flex items-center gap-2 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-gray-500 dark:text-gray-400 truncate">Remember me</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => onSwitchMode('forgot-password')}
                          className="text-blue-500 hover:text-blue-600 font-medium whitespace-nowrap flex-shrink-0"
                        >
                          Forgot?
                        </button>
                      </div>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          type="submit"
                          disabled={emailLoading || !formData.email || !formData.password}
                          className="w-full py-4 sm:py-5 md:py-6 h-auto rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 text-sm sm:text-base min-h-[48px]"
                        >
                          {emailLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                              Signing in...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={() => onSwitchMode('register')}
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  )}

                  {/* Register Form */}
                  {mode === 'register' && (
                    <form onSubmit={handleEmailRegister} className="space-y-3 sm:space-y-4">
                      <FloatingInput
                        id="register-name"
                        label="Full Name"
                        type="text"
                        value={formData.name}
                        onChange={(v) => setFormData({ ...formData, name: v })}
                        icon={GraduationCap}
                        placeholder="Enter your full name"
                        focusedField={focusedField}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                      />
                      <FloatingInput
                        id="register-email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                        icon={Mail}
                        placeholder="Enter your email"
                        focusedField={focusedField}
                        onFocus={setFocusedField}
                        onBlur={() => setFocusedField(null)}
                      />
                      <div className="space-y-2">
                        <FloatingInput
                          id="register-password"
                          label="Password"
                          type="password"
                          value={formData.password}
                          onChange={(v) => setFormData({ ...formData, password: v })}
                          icon={Shield}
                          showPasswordToggle
                          showPassword={showPassword}
                          onTogglePassword={() => setShowPassword(!showPassword)}
                          minLength={6}
                          placeholder="Create a password"
                          focusedField={focusedField}
                          onFocus={setFocusedField}
                          onBlur={() => setFocusedField(null)}
                        />
                        {formData.password && (
                          <div className="px-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-500">Password strength</span>
                              <span className={`text-xs ${passwordStrengthInfo.text}`}>{passwordStrengthInfo.label}</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                                    passwordStrength >= level ? passwordStrengthInfo.bar : 'bg-gray-200 dark:bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Button
                          type="submit"
                          disabled={emailLoading || !formData.name || !formData.email || !formData.password}
                          className="w-full py-4 sm:py-5 md:py-6 h-auto rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 text-sm sm:text-base min-h-[48px]"
                        >
                          {emailLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                              Creating account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </motion.div>
                      <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => onSwitchMode('login')}
                          className="text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  )}
                </>
              )}
            </>
          )}

          {/* Features */}
          <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
              By signing in, you agree to our{' '}
              <a href="#" className="text-blue-500 hover:underline">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-blue-500 hover:underline">Privacy</a>
            </p>
            
            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span>Free</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

// Verification Modal Component
interface VerificationModalProps {
  token: string;
  type: 'verify-email' | 'reset-password';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const VerificationModal = ({ token, type, onClose, onSuccess }: VerificationModalProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [resetPasswordData, setResetPasswordData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const passwordStrength = calculatePasswordStrength(resetPasswordData.password);
  const strengthInfo = getPasswordStrengthColor(passwordStrength);

  useEffect(() => {
    if (type === 'verify-email') {
      handleVerifyEmail();
    }
  }, [type]);

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess(data.user);
        }, 2000);
      } else {
        setStatus('error');
        setError(data.error || 'Verification failed');
      }
    } catch {
      setStatus('error');
      setError('An error occurred during verification');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (resetPasswordData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setResetLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: resetPasswordData.password,
          confirmPassword: resetPasswordData.confirmPassword,
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess(data.user);
        }, 2000);
      } else {
        setStatus('error');
        setError(data.error || 'Password reset failed');
      }
    } catch {
      setError('An error occurred during password reset');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              {type === 'verify-email' ? <Mail className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {type === 'verify-email' ? 'Verifying Email' : 'Reset Password'}
              </h2>
              <p className="text-white/80 text-sm">
                {type === 'verify-email' ? 'Please wait while we verify your email' : 'Enter your new password'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {status === 'loading' && type === 'verify-email' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-gray-500">Verifying your email...</p>
            </div>
          )}

          {status === 'loading' && type === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={resetPasswordData.password}
                    onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                    placeholder="Enter new password"
                    className="pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                {resetPasswordData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            passwordStrength >= level ? strengthInfo.bar : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${strengthInfo.text}`}>{strengthInfo.label}</p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="mt-1"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resetting...</>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 bg-gradient-to-br from-green-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {type === 'verify-email' ? 'Email Verified!' : 'Password Reset!'}
              </h3>
              <p className="text-gray-500">
                {type === 'verify-email' ? 'Your email has been verified successfully.' : 'Your password has been reset successfully.'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Redirecting to dashboard...</p>
            </motion.div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

function PageContent() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot-password' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [verificationToken, setVerificationToken] = useState<{ token: string; type: 'verify-email' | 'reset-password' } | null>(null);
  const searchParams = useSearchParams();

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
    const verifyToken = searchParams.get('verify_token');
    const resetToken = searchParams.get('reset_token');

    if (view) {
      setCurrentView(view);
    }
    if (auth === 'login' || auth === 'register' || auth === 'forgot-password') {
      setAuthMode(auth);
    } else if (!auth) {
      setAuthMode(null);
    }
    if (error === 'google') {
      setOauthError('Google authentication failed. Please make sure the redirect URI is configured in Google Cloud Console.');
    } else {
      setOauthError('');
    }
    
    // Handle verification tokens
    if (verifyToken) {
      setVerificationToken({ token: verifyToken, type: 'verify-email' });
    } else if (resetToken) {
      setVerificationToken({ token: resetToken, type: 'reset-password' });
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

  // Verify session after login to ensure cookie is properly set
  const verifySession = async () => {
    try {
      const data = await api.get<{ user: User | null }>('/api/auth/session');
      if (data.user) {
        setUser(data.user);
        return true;
      }
    } catch {
      // Session verification failed
    }
    return false;
  };

  const handleViewChange = (view: string) => {
    if (view !== currentView) {
      setCurrentView(view);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    url.searchParams.delete('auth');
    window.history.replaceState({}, '', url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Dashboard if logged in
  if (user) {
    const renderContent = () => {
      // Settings view for all users
      if (currentView === 'settings') {
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
      }

      // Student views
      if (currentView === 'planner') {
        return <StudyPlanner user={user} />;
      }

      // Shared views
      switch (currentView) {
        case 'courses':
          return <CoursesModule user={user} />;
        case 'quizzes':
          return <QuizModule user={user} />;
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
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg z-40"
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
      <LandingPage 
        onLogin={() => setAuthMode('login')}
        onRegister={() => setAuthMode('register')}
      />
      <AnimatePresence>
        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSwitchMode={setAuthMode}
            onSuccess={async (_u) => {
              // Verify the session was actually established (cookie set correctly)
              // before showing the dashboard
              setIsLoading(true);
              const success = await verifySession();
              setIsLoading(false);
              if (success) {
                setAuthMode(null);
                handleViewChange('dashboard');
              } else {
                // Session verification failed - show error
                setAuthMode(null);
              }
            }}
            initialError={oauthError}
          />
        )}
        {verificationToken && (
          <VerificationModal
            token={verificationToken.token}
            type={verificationToken.type}
            onClose={() => {
              setVerificationToken(null);
              // Clear URL params
              const url = new URL(window.location.href);
              url.searchParams.delete('verify_token');
              url.searchParams.delete('reset_token');
              window.history.replaceState({}, '', url);
            }}
            onSuccess={async (_u) => {
              // Verify session after verification
              const success = await verifySession();
              if (success) {
                setVerificationToken(null);
                handleViewChange('dashboard');
              }
            }}
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
