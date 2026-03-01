'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { 
  ArrowLeft, Shield, ChevronRight, Clock, Mail, 
  CheckCircle, Database, Lock, Users, Eye,
  Cookie, Globe, AlertCircle, FileText
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('information-collection');

  const sections = [
    { id: 'information-collection', title: 'Information We Collect', icon: Database },
    { id: 'how-we-use', title: 'How We Use Your Information', icon: Eye },
    { id: 'data-sharing', title: 'Data Sharing & Third Parties', icon: Users },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Cookie },
    { id: 'your-rights', title: 'Your Rights', icon: CheckCircle },
    { id: 'children', title: 'Children\'s Privacy', icon: Users },
    { id: 'changes', title: 'Changes to This Policy', icon: AlertCircle },
    { id: 'contact', title: 'Contact Us', icon: Mail },
  ];

  const content: Record<string, { title: string; content: React.ReactNode }> = {
    'information-collection': {
      title: 'Information We Collect',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We collect information you provide directly to us, as well as information that is collected automatically when you use our services.
          </p>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Account Information:</strong> Name, email address, and profile picture when you create an account.</li>
              <li><strong>Study Data:</strong> Subjects, tasks, quiz results, and course progress that you create or complete.</li>
              <li><strong>Communication Data:</strong> Messages, feedback, and support requests you send to us.</li>
              <li><strong>Payment Information:</strong> Billing address and payment details for premium subscriptions (processed securely by Stripe).</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Automatically Collected Information</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the platform, and interactions.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution.</li>
              <li><strong>Location Data:</strong> General geographic location based on IP address (country/city level).</li>
              <li><strong>Log Data:</strong> Access times, pages viewed, and referring URLs.</li>
            </ul>
          </div>
        </div>
      )
    },
    'how-we-use': {
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We use the information we collect to provide, improve, and personalize our services:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Service Delivery', desc: 'To operate and maintain our platform, process your requests, and provide customer support.' },
              { title: 'Personalization', desc: 'To customize your learning experience, provide relevant recommendations, and improve our AI features.' },
              { title: 'Communication', desc: 'To send you updates about your account, respond to your inquiries, and provide technical support.' },
              { title: 'Analytics', desc: 'To analyze usage patterns, identify trends, and improve our services and user experience.' },
              { title: 'Security', desc: 'To detect and prevent fraud, abuse, and security issues, and protect your account.' },
              { title: 'Legal', desc: 'To comply with legal obligations and enforce our terms of service.' },
            ].map((item, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    },
    'data-sharing': {
      title: 'Data Sharing & Third Parties',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We do not sell your personal information. We may share your data in the following circumstances:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Service Providers</h5>
                <p className="text-gray-600 dark:text-gray-300">We work with trusted third-party companies that help us operate our platform, including:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-300">
                  <li>Cloud hosting providers (for data storage and processing)</li>
                  <li>Payment processors (Stripe) for secure transactions</li>
                  <li>Email service providers for communications</li>
                  <li>Analytics services to improve our platform</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Legal Requirements</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  We may disclose your information if required by law, court order, or government request, or to protect our rights and the safety of users.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Business Transfers</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    'data-security': {
      title: 'Data Security',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <div className="space-y-4">
            {[
              { icon: Lock, title: 'Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.' },
              { icon: Shield, title: 'Access Controls', desc: 'Strict access controls limit employee access to personal data based on job requirements.' },
              { icon: Database, title: 'Secure Infrastructure', desc: 'Our servers are hosted on secure cloud infrastructure with regular security audits.' },
              { icon: Eye, title: 'Monitoring', desc: '24/7 monitoring and intrusion detection systems protect against unauthorized access.' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">{item.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            While we take extensive measures to protect your data, no method of transmission over the internet is 100% secure. We recommend using strong passwords and enabling two-factor authentication.
          </p>
        </div>
      )
    },
    'cookies': {
      title: 'Cookies & Tracking',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We use cookies and similar technologies to operate our platform and improve your experience:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Essential Cookies</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Required for the platform to function properly. These include session cookies for authentication and security.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Cookies</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Help us understand how users interact with our platform, which pages are most popular, and identify areas for improvement.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Preference Cookies</h5>
                <p className="text-gray-600 dark:text-gray-300">
                  Remember your preferences such as theme (dark/light mode), language, and other settings.
                </p>
              </CardContent>
            </Card>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            You can manage cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
          </p>
        </div>
      )
    },
    'your-rights': {
      title: 'Your Rights',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            You have certain rights regarding your personal information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Access', desc: 'Request a copy of your personal data.' },
              { title: 'Correction', desc: 'Request correction of inaccurate data.' },
              { title: 'Deletion', desc: 'Request deletion of your account and data.' },
              { title: 'Portability', desc: 'Request your data in a portable format.' },
              { title: 'Opt-out', desc: 'Opt out of marketing communications.' },
              { title: 'Restriction', desc: 'Request restriction of processing.' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white">{item.title}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            To exercise these rights, contact us at <a href="mailto:privacy@studyplanner.com" className="text-blue-600 hover:underline">privacy@studyplanner.com</a>. We will respond within 30 days.
          </p>
        </div>
      )
    },
    'children': {
      title: 'Children\'s Privacy',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            StudyPlanner is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.
          </p>
          <Card className="border-0 shadow-md bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" /> Parental Consent
              </h5>
              <p className="text-gray-600 dark:text-gray-300">
                If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information. Parents who believe their child has provided personal information to us should contact us immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    'changes': {
      title: 'Changes to This Policy',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Posting the updated policy on this page</li>
            <li>Sending an email notification to registered users</li>
            <li>Displaying an in-app notification</li>
          </ul>
          <p className="text-gray-600 dark:text-gray-300">
            Your continued use of StudyPlanner after any changes indicates your acceptance of the updated policy.
          </p>
        </div>
      )
    },
    'contact': {
      title: 'Contact Us',
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <a href="mailto:privacy@studyplanner.com" className="text-blue-600 hover:underline">privacy@studyplanner.com</a>
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
                  <p className="text-gray-600 dark:text-gray-300">123 Innovation Drive, Suite 100, San Francisco, CA 94105</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4">
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Contact Form <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline">
                Help Center
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
            <span className="text-gray-900 dark:text-white">Privacy </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
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
            <Link href="/terms" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Terms of Service</Link>
            <Link href="/contact" className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
