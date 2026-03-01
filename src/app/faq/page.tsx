'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { 
  ChevronDown, ArrowLeft, Search, HelpCircle, 
  MessageCircle, BookOpen, Users, Shield
} from 'lucide-react';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Get Started" button on the homepage and fill in your details. You can also sign up using your Google account for faster registration.'
        },
        {
          question: 'Is StudyPlanner free to use?',
          answer: 'Yes! StudyPlanner offers a free tier with essential features including subject management, task tracking, and basic analytics. Premium features are available with paid plans.'
        },
        {
          question: 'How do I add my first subject?',
          answer: 'After logging in, go to the Study Planner section and click "Add Subject". Enter the subject name, description, and optionally set an exam date. Choose a color to help identify it visually.'
        },
      ]
    },
    {
      category: 'Study Planning',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      faqs: [
        {
          question: 'How do I create a study schedule?',
          answer: 'Navigate to the Study Planner, create subjects for your courses, then add tasks with due dates. The system will help you organize and track your study sessions.'
        },
        {
          question: 'Can I set reminders for tasks?',
          answer: 'Yes! When creating or editing a task, you can set due dates and the system will remind you of upcoming deadlines through notifications.'
        },
        {
          question: 'How do I track my progress?',
          answer: 'Visit the Analytics section to see detailed insights about your task completion, quiz scores, and overall study progress with visual charts and statistics.'
        },
      ]
    },
    {
      category: 'AI Features',
      icon: MessageCircle,
      color: 'from-pink-500 to-pink-600',
      faqs: [
        {
          question: 'How does AI quiz generation work?',
          answer: 'Enter a topic or subject, and our AI will generate multiple-choice questions with answers and explanations. You can then take the quiz to test your knowledge.'
        },
        {
          question: 'Can I get study tips from AI?',
          answer: 'Yes! The AI Study Assistant can provide personalized study tips, explain concepts, and answer academic questions to help with your learning.'
        },
        {
          question: 'Is the AI always available?',
          answer: 'The AI features are available 24/7 to assist with your studies. Simply click the chat icon to start a conversation with the AI Study Assistant.'
        },
      ]
    },
    {
      category: 'Account & Security',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      faqs: [
        {
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a link to reset your password securely.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Absolutely! We use industry-standard encryption and security practices to protect your data. Your information is never shared with third parties.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account from the Settings page. This will permanently remove all your data from our systems.'
        },
      ]
    },
  ];

  const allFaqs = faqCategories.flatMap(cat => cat.faqs);
  const filteredFaqs = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

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
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            FAQ
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Frequently Asked </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about StudyPlanner and learn how to make the most of your study experience.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* Search Results */}
      {filteredFaqs && (
        <section className="py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Search Results ({filteredFaqs.length})
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 ml-8">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
              {filteredFaqs.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">No results found for your search.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Categories */}
      {!filteredFaqs && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, catIndex) => (
              <motion.div
                key={catIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.category}</h2>
                </div>
                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 100 + faqIndex;
                    return (
                      <Card key={faqIndex} className="border-0 shadow-md overflow-hidden">
                        <button
                          onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                          className="w-full text-left"
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <span className="font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === globalIndex ? 'rotate-180' : ''}`} />
                            </div>
                            <AnimatePresence>
                              {openIndex === globalIndex && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 pb-4 pt-0">
                                    <p className="text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-4">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </button>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-10">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
