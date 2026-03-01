'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { 
  ArrowLeft, FileText, ChevronRight, Clock, Mail, 
  CheckCircle, Scale, CreditCard, AlertTriangle,
  Shield, Zap, Users, Globe, Ban, RefreshCw
} from 'lucide-react';

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'use-license', title: 'Use License', icon: FileText },
    { id: 'user-accounts', title: 'User Accounts', icon: Users },
    { id: 'acceptable-use', title: 'Acceptable Use Policy', icon: Shield },
    { id: 'prohibited', title: 'Prohibited Activities', icon: Ban },
    { id: 'subscriptions', title: 'Subscriptions & Payments', icon: CreditCard },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: Scale },
    { id: 'user-content', title: 'User Content', icon: Zap },
    { id: 'disclaimer', title: 'Disclaimer', icon: AlertTriangle },
    { id: 'limitation', title: 'Limitation of Liability', icon: Shield },
    { id: 'changes', title: 'Changes to Terms', icon: RefreshCw },
    { id: 'contact', title: 'Contact Information', icon: Mail },
  ];

  const content: Record<string, { title: string; content: React.ReactNode }> = {
    'acceptance': {
      title: 'Acceptance of Terms',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Welcome to StudyPlanner. By accessing and using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
          <Card className="border-0 shadow-md bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Agreement to Terms</h5>
              <p className="text-gray-600 dark:text-gray-300">
                By creating an account or using StudyPlanner, you represent that you are at least 13 years old and have the legal capacity to enter into these terms. If you are using StudyPlanner on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    'use-license': {
      title: 'Use License',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            Subject to your compliance with these Terms, StudyPlanner grants you a limited, non-exclusive, non-transferable, revocable license to access and use our platform for personal, non-commercial purposes.
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Permitted Uses:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Create and manage your personal study schedules and tasks</li>
              <li>Use AI-powered features for generating quizzes and study materials</li>
              <li>Track your learning progress and view analytics</li>
              <li>Access courses and educational content as made available</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Restrictions:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>You may not copy, modify, or distribute any part of the platform</li>
              <li>You may not use automated systems to access the platform</li>
              <li>You may not reverse engineer or attempt to extract source code</li>
              <li>You may not use the platform for any commercial purpose without authorization</li>
            </ul>
          </div>
        </div>
      )
    },
    'user-accounts': {
      title: 'User Accounts',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            To access certain features of StudyPlanner, you must create an account. You are responsible for:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Account Security', desc: 'Maintaining the confidentiality of your login credentials and for all activities under your account.' },
              { title: 'Accurate Information', desc: 'Providing accurate and complete information during registration and keeping it updated.' },
              { title: 'Prompt Notification', desc: 'Notifying us immediately if you discover any unauthorized use of your account.' },
              { title: 'Account Activity', desc: 'Ensuring all activity under your account complies with these Terms.' },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
          </p>
        </div>
      )
    },
    'acceptable-use': {
      title: 'Acceptable Use Policy',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            You agree to use StudyPlanner only for lawful purposes and in accordance with these Terms. You agree not to use StudyPlanner:
          </p>
          <div className="space-y-4">
            {[
              'In any way that violates any applicable law or regulation',
              'To transmit any advertising or promotional material without our prior consent',
              'To impersonate or attempt to impersonate StudyPlanner or any other person',
              'To engage in any conduct that restricts or inhibits anyone\'s use of the platform',
              'To introduce any viruses, trojan horses, worms, or other harmful material',
              'To attempt to gain unauthorized access to any part of the platform',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-gray-600 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'prohibited': {
      title: 'Prohibited Activities',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            The following activities are strictly prohibited and may result in immediate account termination:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Ban, title: 'Fraud', desc: 'Using the platform for fraudulent purposes or misrepresentation' },
              { icon: Shield, title: 'Hacking', desc: 'Attempting to breach security or access unauthorized data' },
              { icon: AlertTriangle, title: 'Harassment', desc: 'Harassing, abusing, or harming other users' },
              { icon: FileText, title: 'Copyright', desc: 'Uploading or distributing copyrighted material without permission' },
              { icon: Zap, title: 'Spam', desc: 'Sending unsolicited messages or advertisements' },
              { icon: Users, title: 'Impersonation', desc: 'Impersonating others or creating false identities' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">{item.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'subscriptions': {
      title: 'Subscriptions & Payments',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            StudyPlanner offers both free and paid subscription plans. By subscribing to a paid plan, you agree to the following:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" /> Billing & Payments
                </h5>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>You will be billed at the beginning of each billing period</li>
                  <li>Payments are processed securely through Stripe</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>Prices are subject to change with 30 days notice</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" /> Cancellation & Refunds
                </h5>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>You may cancel your subscription at any time from your account settings</li>
                  <li>Cancellation takes effect at the end of your current billing period</li>
                  <li>We offer a 14-day money-back guarantee for first-time subscribers</li>
                  <li>No prorated refunds for partial billing periods</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    'intellectual-property': {
      title: 'Intellectual Property',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            StudyPlanner and its original content, features, and functionality are owned by StudyPlanner Inc. and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Our Rights:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>The StudyPlanner name, logo, and all related names and designs are our trademarks</li>
              <li>All content, features, and functionality are our exclusive property</li>
              <li>You may not use our trademarks without prior written consent</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">License to Use:</h4>
            <p className="text-gray-600 dark:text-gray-300">
              We grant you a limited, non-exclusive license to use our platform and content for personal, non-commercial purposes only. This license does not include any right to reproduce, modify, or distribute our content.
            </p>
          </div>
        </div>
      )
    },
    'user-content': {
      title: 'User Content',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            You retain ownership of the content you create on StudyPlanner, including subjects, tasks, notes, and other materials. However, by using our platform, you grant us certain rights:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">License Grant</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  You grant StudyPlanner a worldwide, non-exclusive, royalty-free license to use, store, and display your content solely for the purpose of providing our services to you.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Content Responsibility</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  You are solely responsible for the content you create. You represent that you have all necessary rights to upload and share your content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    'disclaimer': {
      title: 'Disclaimer',
      content: (
        <div className="space-y-6">
          <Card className="border-0 shadow-md bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" /> Important Notice
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                STUDYPLANNER IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </CardContent>
          </Card>
          <p className="text-gray-600 dark:text-gray-300">
            We do not guarantee that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>The platform will be uninterrupted, secure, or error-free</li>
            <li>Results from using the platform will be accurate or reliable</li>
            <li>AI-generated content will be correct or appropriate for your needs</li>
            <li>Any errors will be corrected</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            Use of StudyPlanner is at your own risk. We are not responsible for any decisions made based on information provided by our platform.
          </p>
        </div>
      )
    },
    'limitation': {
      title: 'Limitation of Liability',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            To the maximum extent permitted by law:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">No Consequential Damages</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  StudyPlanner, its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Maximum Liability</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Our total liability for any claims arising from your use of StudyPlanner shall not exceed the amount you paid us in the 12 months preceding the claim, or $100 if you have not paid us.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    'changes': {
      title: 'Changes to Terms',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to modify these Terms at any time. When we make material changes, we will:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Post the updated Terms on this page</li>
            <li>Update the &quot;Last updated&quot; date</li>
            <li>Send you an email notification if you have an account</li>
            <li>Display a prominent notice within the platform</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            Your continued use of StudyPlanner after any changes indicates your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the platform.
          </p>
        </div>
      )
    },
    'contact': {
      title: 'Contact Information',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <a href="mailto:legal@studyplanner.com" className="text-blue-600 hover:underline">legal@studyplanner.com</a>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Address</p>
                  <p className="text-gray-600 dark:text-gray-300">StudyPlanner Inc., 123 Innovation Drive, Suite 100, San Francisco, CA 94105, USA</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Contact Us <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline">
                Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      )
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      for (const el of sectionElements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(el.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

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
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Legal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gray-900 dark:text-white">Terms of </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" /> Last updated: January 2024
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Table of Contents</h3>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      const el = document.getElementById(section.id);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <section.icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-12">
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="scroll-mt-24"
                >
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        {content[section.id]?.title}
                      </h2>
                      {content[section.id]?.content}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} StudyPlanner. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Privacy Policy</Link>
            <Link href="/contact" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
