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
  Mail, MapPin, Clock, Phone, Send, ArrowRight, 
  MessageCircle, HelpCircle, CheckCircle, ArrowLeft,
  Building2, Globe, Calendar, Users, Zap, Shield,
  X, Loader2, ChevronRight, Star, Clock3
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
    }, 5000);
  };

  const contactInfo = [
    { 
      icon: Mail, 
      title: 'Email Us', 
      value: 'contact@studyplanner.com',
      description: 'We\'ll respond within 24 hours',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: MapPin, 
      title: 'Headquarters', 
      value: 'San Francisco, CA',
      description: '123 Innovation Drive, Suite 100',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Clock, 
      title: 'Business Hours', 
      value: 'Mon-Fri 9AM-6PM PST',
      description: '24/7 online support available',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: Phone, 
      title: 'Phone Support', 
      value: '+1 (555) 123-4567',
      description: 'Priority support for Pro users',
      color: 'from-orange-500 to-orange-600'
    },
  ];

  const inquiryTypes = [
    { id: 'general', label: 'General Inquiry', icon: MessageCircle },
    { id: 'support', label: 'Technical Support', icon: HelpCircle },
    { id: 'sales', label: 'Sales & Pricing', icon: Zap },
    { id: 'partnership', label: 'Partnership', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: Star },
  ];

  const offices = [
    { city: 'San Francisco', country: 'USA', type: 'Headquarters', address: '123 Innovation Drive' },
    { city: 'London', country: 'UK', type: 'European Office', address: '45 Tech Lane' },
    { city: 'Singapore', country: 'Singapore', type: 'Asia Pacific', address: '78 Digital Street' },
  ];

  const faqs = [
    { q: 'How do I get started?', a: 'Simply sign up for a free account and start adding your subjects and tasks.' },
    { q: 'Is there a mobile app?', a: 'StudyPlanner is fully responsive and works on all devices. A dedicated app is coming soon!' },
    { q: 'How does AI quiz generation work?', a: 'Enter a topic and our AI will generate multiple-choice questions with answers and explanations.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your account settings.' },
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
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            Contact Us
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Get in </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions, feedback, or need help? We&apos;d love to hear from you. Our team is here to assist you 24/7.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 -mt-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white dark:bg-gray-800 overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${info.color}`} />
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <info.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{info.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">{info.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a Message</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Fill out the form and we&apos;ll get back to you shortly.</p>
                  
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-500 dark:text-gray-400">We&apos;ll get back to you as soon as possible.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Inquiry Type */}
                      <div>
                        <Label className="text-base font-medium">What can we help you with?</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                          {inquiryTypes.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, type: type.id })}
                              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                                formData.type === type.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}
                            >
                              <type.icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input 
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your name"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input 
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input 
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="How can we help?"
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea 
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Your message..."
                          rows={5}
                          required
                          className="mt-1"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 text-lg"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="w-5 h-5 mr-2" /> Send Message</>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Quick FAQ */}
              <div>
                <Badge className="mb-4" variant="outline">Quick Answers</Badge>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{faq.q}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{faq.a}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Link href="/faq">
                <Button variant="outline" className="w-full rounded-xl py-6">
                  View All FAQs <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              {/* Live Chat CTA */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                  <div className="flex items-start gap-4 relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Need instant help?</h3>
                      <p className="text-white/80 text-sm mb-4">
                        Our support team is available 24/7 via live chat.
                      </p>
                      <Button 
                        variant="secondary" 
                        className="bg-white text-blue-600 hover:bg-gray-100"
                        onClick={() => setIsChatOpen(true)}
                      >
                        Start Live Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4" variant="outline">Global Presence</Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Offices</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;re a global team dedicated to helping students worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">{office.type}</Badge>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{office.city}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{office.country}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{office.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Clock3 className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Support Hours</h3>
                    <p className="text-gray-500 dark:text-gray-400">We&apos;re here when you need us</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Support</p>
                    <p className="font-semibold text-gray-900 dark:text-white">Mon-Fri, 9AM-6PM PST</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Live Chat</p>
                    <p className="font-semibold text-gray-900 dark:text-white">24/7 Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">
            Join thousands of students already using StudyPlanner to improve their academic performance.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-10">
              Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Live Chat Widget */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Live Support</h3>
                  <p className="text-xs text-white/80">We typically reply within minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Hi there! 👋 How can we help you today?
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    I&apos;m a support assistant and I&apos;m here to help with any questions about StudyPlanner.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Just now</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button (when closed) */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white z-40 hover:shadow-xl transition-shadow"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StudyPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
