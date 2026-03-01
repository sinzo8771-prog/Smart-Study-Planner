'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { 
  ArrowLeft, ArrowRight, Search, HelpCircle, BookOpen, 
  MessageCircle, ChevronRight, ChevronDown, ExternalLink,
  Zap, Users, Shield, CreditCard, Settings, Globe,
  Smartphone, Mail, Clock, CheckCircle, Star, Send,
  FileText, Video, Download, Pen, X, Loader2
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: 'getting-started', icon: Zap, title: 'Getting Started', description: 'Learn the basics of StudyPlanner', articles: 12, color: 'from-blue-500 to-blue-600' },
    { id: 'account', icon: Users, title: 'Account & Profile', description: 'Manage your account settings', articles: 8, color: 'from-purple-500 to-purple-600' },
    { id: 'study-planner', icon: BookOpen, title: 'Study Planner', description: 'Organize your subjects and tasks', articles: 15, color: 'from-green-500 to-green-600' },
    { id: 'quizzes', icon: HelpCircle, title: 'Quizzes & AI', description: 'Quiz generation and AI features', articles: 10, color: 'from-pink-500 to-pink-600' },
    { id: 'billing', icon: CreditCard, title: 'Billing & Plans', description: 'Pricing, payments, and subscriptions', articles: 6, color: 'from-orange-500 to-orange-600' },
    { id: 'security', icon: Shield, title: 'Security & Privacy', description: 'Data protection and privacy', articles: 5, color: 'from-red-500 to-red-600' },
  ];

  const popularArticles = [
    { id: 1, title: 'How to create your first subject', category: 'Getting Started', views: '5.2K' },
    { id: 2, title: 'Understanding the dashboard', category: 'Getting Started', views: '4.8K' },
    { id: 3, title: 'How AI quiz generation works', category: 'Quizzes & AI', views: '3.9K' },
    { id: 4, title: 'Managing your subscription', category: 'Billing & Plans', views: '3.5K' },
    { id: 5, title: 'Exporting your data', category: 'Account & Profile', views: '2.8K' },
  ];

  const articles = {
    'getting-started': [
      { id: 1, title: 'Getting Started with StudyPlanner', content: 'Welcome to StudyPlanner! This guide will help you set up your account and start organizing your studies effectively. First, create an account using your email or Google. Once logged in, you\'ll see the dashboard where you can add subjects, create tasks, and track your progress.' },
      { id: 2, title: 'Creating Your First Subject', content: 'Subjects are the foundation of your study plan. To create a subject, click the "Add Subject" button, enter a name (like "Mathematics"), add an optional description, choose a color for easy identification, and optionally set an exam date. Each subject can contain multiple tasks.' },
      { id: 3, title: 'Adding and Managing Tasks', content: 'Tasks help you break down your subjects into manageable pieces. For each task, you can set a title, description, priority level (low, medium, high), due date, and status (pending, in progress, completed). Mark tasks as complete to track your progress.' },
      { id: 4, title: 'Understanding the Dashboard', content: 'The dashboard gives you an overview of your academic progress. You\'ll see stats like total subjects, completed tasks, average quiz scores, and courses in progress. The task progress chart shows your completion rate over time.' },
    ],
    'account': [
      { id: 1, title: 'Managing Your Profile', content: 'Update your profile by clicking on your avatar in the top right corner. You can change your name, profile picture, and other preferences. Your profile information is used to personalize your experience.' },
      { id: 2, title: 'Changing Your Password', content: 'To change your password, go to Settings > Security. Enter your current password and your new password. Make sure to use a strong password with a mix of letters, numbers, and symbols.' },
      { id: 3, title: 'Deleting Your Account', content: 'If you wish to delete your account, go to Settings > Account > Delete Account. This action is permanent and will remove all your data. Consider exporting your data first if you want to keep a record.' },
    ],
    'study-planner': [
      { id: 1, title: 'Calendar View', content: 'The calendar view shows all your tasks organized by due date. You can see tasks for the week or month, filter by subject, and quickly add new tasks for specific dates.' },
      { id: 2, title: 'Task Priorities', content: 'Tasks can have three priority levels: Low (green), Medium (yellow), and High (red). Use priorities to focus on what\'s most important. High priority tasks appear first in your list.' },
      { id: 3, title: 'Progress Tracking', content: 'Track your progress with visual indicators. Each subject shows a completion percentage based on completed tasks. The analytics dashboard provides detailed insights into your study patterns.' },
    ],
    'quizzes': [
      { id: 1, title: 'AI Quiz Generation', content: 'Our AI can generate quizzes on any topic. Simply enter a subject or topic, choose the difficulty level, and specify the number of questions. The AI will create multiple-choice questions with correct answers and explanations.' },
      { id: 2, title: 'Taking a Quiz', content: 'When taking a quiz, you\'ll see one question at a time. Select your answer and move to the next question. After completing all questions, you\'ll see your score and can review each question with explanations.' },
      { id: 3, title: 'Quiz History', content: 'All your quiz attempts are saved in your history. You can review past quizzes, see which questions you got wrong, and retake quizzes to improve your score.' },
    ],
    'billing': [
      { id: 1, title: 'Subscription Plans', content: 'We offer Free, Pro, and Premium plans. The Free plan includes basic features with limits. Pro unlocks AI quizzes and advanced analytics. Premium includes priority support and unlimited everything.' },
      { id: 2, title: 'Upgrading Your Plan', content: 'To upgrade, go to Settings > Billing and select your desired plan. You can pay with credit card or through our secure payment processor. Your new features will be available immediately.' },
      { id: 3, title: 'Canceling Your Subscription', content: 'You can cancel your subscription anytime from Settings > Billing. Your access continues until the end of your billing period. You won\'t be charged again unless you resubscribe.' },
    ],
    'security': [
      { id: 1, title: 'Data Security', content: 'We use industry-standard encryption to protect your data. All communications are secured with TLS, and your passwords are hashed and salted. We never share your personal information with third parties.' },
      { id: 2, title: 'Two-Factor Authentication', content: 'Enable 2FA for an extra layer of security. Go to Settings > Security > Two-Factor Authentication. You can use an authenticator app or receive codes via SMS.' },
    ],
  };

  const resources = [
    { icon: Video, title: 'Video Tutorials', description: 'Watch step-by-step guides', link: '/resources' },
    { icon: FileText, title: 'Documentation', description: 'Detailed feature guides', link: '/resources' },
    { icon: Download, title: 'Downloads', description: 'Templates and worksheets', link: '/resources' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const filteredArticles = searchQuery 
    ? Object.values(articles).flat().filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : selectedCategory 
      ? articles[selectedCategory as keyof typeof articles] || []
      : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/faq">
                <Button variant="ghost" size="sm">FAQ</Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" size="sm">Contact</Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Help Center
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">How Can We </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Help You?</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions, learn how to use StudyPlanner, and get support when you need it.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 px-4 -mt-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={resource.link}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <resource.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Categories */}
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Categories</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all ${
                        selectedCategory === category.id 
                          ? 'ring-2 ring-blue-500 shadow-lg' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shrink-0`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{category.description}</p>
                        </div>
                        <Badge variant="secondary">{category.articles}</Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Popular Articles */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" /> Popular Articles
                </h3>
                <div className="space-y-3">
                  {popularArticles.map((article, index) => (
                    <div 
                      key={article.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-400">{article.views} views</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="lg:col-span-2">
              {searchQuery && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Search Results for &quot;{searchQuery}&quot;
                  </h2>
                  <p className="text-gray-500">{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found</p>
                </div>
              )}

              {selectedCategory && !searchQuery && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {categories.find(c => c.id === selectedCategory)?.title}
                  </h2>
                  <p className="text-gray-500">{categories.find(c => c.id === selectedCategory)?.description}</p>
                </div>
              )}

              {!selectedCategory && !searchQuery && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Category</h2>
                  <p className="text-gray-500">Choose a category from the left to browse articles, or use the search above.</p>
                </div>
              )}

              {(selectedCategory || searchQuery) && (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="border-0 shadow-lg overflow-hidden">
                      <button
                        className="w-full text-left"
                        onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white pr-4">{article.title}</h3>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`} />
                          </div>
                          <AnimatePresence>
                            {expandedArticle === article.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <p className="text-gray-600 dark:text-gray-300 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                  {article.content}
                                </p>
                                <div className="flex items-center gap-4 mt-4">
                                  <Button variant="outline" size="sm">
                                    Was this helpful? 👍
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-gray-400">
                                    <ExternalLink className="w-4 h-4 mr-1" /> Share
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </button>
                    </Card>
                  ))}

                  {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                      <HelpCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No articles found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Try a different search term or category.</p>
                      <Button onClick={() => setShowTicketForm(true)}>
                        Contact Support
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support CTA */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Can&apos;t find what you&apos;re looking for?</h3>
                    <p className="text-gray-500 dark:text-gray-400">Our support team is here to help 24/7</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2" onClick={() => setShowTicketForm(true)}>
                    <Pen className="w-4 h-4" /> Submit Ticket
                  </Button>
                  <Link href="/contact">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 gap-2">
                      <Mail className="w-4 h-4" /> Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Ticket Modal */}
      <AnimatePresence>
        {showTicketForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowTicketForm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
              <div className="p-6">
                {ticketSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ticket Submitted!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">We&apos;ll respond within 24 hours.</p>
                    <Button onClick={() => { setShowTicketForm(false); setTicketSubmitted(false); }}>
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit a Support Ticket</h2>
                      <button onClick={() => setShowTicketForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); setTicketSubmitted(true); }} className="space-y-4">
                      <div>
                        <Label>Subject *</Label>
                        <Input placeholder="Brief description of your issue" required className="mt-1" />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" placeholder="your@email.com" required className="mt-1" />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <select className="w-full mt-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <option>Technical Issue</option>
                          <option>Billing Question</option>
                          <option>Feature Request</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <Label>Description *</Label>
                        <Textarea placeholder="Describe your issue in detail..." rows={4} required className="mt-1" />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        <Send className="w-4 h-4 mr-2" /> Submit Ticket
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StudyPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
