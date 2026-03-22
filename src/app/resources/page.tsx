'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { 
  BookOpen, Video, FileText, Download, ExternalLink, 
  ArrowLeft, ArrowRight, Play, Clock, Users, Star
} from 'lucide-react';

export default function ResourcesPage() {
  const resources = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      items: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes', type: 'Guide', duration: '5 min read' },
        { title: 'Setting Up Your Profile', description: 'Customize your study experience', type: 'Tutorial', duration: '3 min read' },
        { title: 'Adding Your First Subject', description: 'Learn how to organize your studies', type: 'Tutorial', duration: '4 min read' },
      ]
    },
    {
      category: 'Study Planning',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      items: [
        { title: 'Effective Study Scheduling', description: 'Best practices for creating study plans', type: 'Guide', duration: '10 min read' },
        { title: 'Task Prioritization', description: 'How to prioritize your study tasks', type: 'Article', duration: '7 min read' },
        { title: 'Exam Preparation Tips', description: 'Strategies for exam success', type: 'Guide', duration: '12 min read' },
      ]
    },
    {
      category: 'Video Tutorials',
      icon: Video,
      color: 'from-pink-500 to-pink-600',
      items: [
        { title: 'Dashboard Overview', description: 'Tour of the main features', type: 'Video', duration: '5:32' },
        { title: 'Creating Quizzes', description: 'Learn to generate AI-powered quizzes', type: 'Video', duration: '8:15' },
        { title: 'Analytics Deep Dive', description: 'Understanding your progress data', type: 'Video', duration: '6:45' },
      ]
    },
    {
      category: 'Downloads',
      icon: Download,
      color: 'from-green-500 to-green-600',
      items: [
        { title: 'Study Planner Template', description: 'Printable weekly planner', type: 'PDF', duration: 'Download' },
        { title: 'Goal Setting Worksheet', description: 'Set and track your academic goals', type: 'PDF', duration: 'Download' },
        { title: 'Study Session Tracker', description: 'Track your daily study sessions', type: 'PDF', duration: 'Download' },
      ]
    },
  ];

  const popularArticles = [
    { title: 'How to Use AI Quiz Generation', views: '2.5K', category: 'AI Features' },
    { title: 'Setting Up Study Reminders', views: '1.8K', category: 'Planning' },
    { title: 'Understanding Your Analytics', views: '1.5K', category: 'Insights' },
    { title: 'Best Study Techniques', views: '1.2K', category: 'Tips' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
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
            Resources
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Learn How to </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Study Smarter</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive guides, tutorials, and resources to help you make the most of StudyPlanner.
          </p>
        </motion.div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 px-4 -mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Popular Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium mb-1">{article.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <span>{article.views} views</span>
                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{article.category}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {resources.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${section.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{section.category}</h2>
                    </div>
                    <div className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div 
                          key={itemIndex}
                          className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        >
                          <div className="w-10 h-10 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm">
                            {item.type === 'Video' ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : item.type === 'PDF' ? (
                              <Download className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline" className="text-xs">{item.type}</Badge>
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                {item.type === 'Video' ? <Clock className="w-3 h-3" /> : null}
                                {item.duration}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Need More Help?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-10">
                Contact Support <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="rounded-full px-10">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
