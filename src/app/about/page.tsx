'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { 
  CheckCircle, Users, BookOpen, Target, Award, Heart, 
  Lightbulb, Rocket, ArrowRight, GraduationCap, ArrowLeft,
  Calendar, MapPin, TrendingUp, Star, Globe, Code, Palette,
  Brain, Shield, Zap, Coffee, Linkedin, Twitter, Mail,
  ChevronRight, Play
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { value: '10,000+', label: 'Active Students', icon: Users, trend: '+25%' },
    { value: '500+', label: 'Courses Created', icon: BookOpen, trend: '+18%' },
    { value: '150,000+', label: 'Tasks Completed', icon: CheckCircle, trend: '+32%' },
    { value: '98%', label: 'Satisfaction Rate', icon: Award, trend: '+5%' },
  ];

  const values = [
    { icon: Lightbulb, title: 'Innovation', description: 'Leveraging AI and modern technology to revolutionize learning experiences', color: 'from-yellow-500 to-orange-500' },
    { icon: Heart, title: 'Student-Centric', description: 'Every feature designed with students\' needs and success in mind', color: 'from-pink-500 to-rose-500' },
    { icon: Target, title: 'Goal-Oriented', description: 'Helping students set and achieve their academic objectives', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, title: 'Community', description: 'Building a supportive and collaborative learning community', color: 'from-purple-500 to-violet-500' },
  ];

  const team = [
    { 
      name: 'Sarah Chen', 
      role: 'CEO & Co-Founder', 
      initials: 'SC',
      bio: 'Former educator with 10+ years in EdTech',
      linkedin: '#',
      twitter: '#'
    },
    { 
      name: 'Michael Park', 
      role: 'CTO & Co-Founder', 
      initials: 'MP',
      bio: 'Ex-Google engineer passionate about AI',
      linkedin: '#',
      twitter: '#'
    },
    { 
      name: 'Emily Rodriguez', 
      role: 'Head of Product', 
      initials: 'ER',
      bio: 'Product leader from Coursera and Duolingo',
      linkedin: '#',
      twitter: '#'
    },
    { 
      name: 'David Kim', 
      role: 'Head of AI Research', 
      initials: 'DK',
      bio: 'PhD in Machine Learning from MIT',
      linkedin: '#',
      twitter: '#'
    },
    { 
      name: 'Lisa Thompson', 
      role: 'Head of Design', 
      initials: 'LT',
      bio: 'Award-winning UX designer',
      linkedin: '#',
      twitter: '#'
    },
    { 
      name: 'James Wilson', 
      role: 'Head of Engineering', 
      initials: 'JW',
      bio: 'Scaled systems serving 100M+ users',
      linkedin: '#',
      twitter: '#'
    },
  ];

  const timeline = [
    { year: '2021', title: 'Founded', description: 'StudyPlanner was born from a simple idea: make studying smarter, not harder.' },
    { year: '2022', title: 'AI Integration', description: 'Launched AI-powered quiz generation and personalized study recommendations.' },
    { year: '2023', title: 'Global Expansion', description: 'Reached 50,000 students across 100+ countries.' },
    { year: '2024', title: 'Enterprise Launch', description: 'Partnered with universities and schools worldwide.' },
  ];

  const achievements = [
    { icon: Award, title: 'EdTech Innovation Award 2023', organization: 'Global Education Summit' },
    { icon: Star, title: 'Top 10 Learning Platform', organization: 'TechCrunch' },
    { icon: Globe, title: 'Present in 100+ Countries', organization: 'Worldwide Reach' },
    { icon: Users, title: '50,000+ Active Users', organization: 'Growing Community' },
  ];

  const departments = [
    { name: 'Engineering', count: 25, icon: Code, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Design', count: 8, icon: Palette, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
    { name: 'AI Research', count: 12, icon: Brain, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { name: 'Product', count: 6, icon: Target, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { name: 'Security', count: 5, icon: Shield, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
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
            <div className="flex items-center gap-4">
              <Link href="/careers">
                <Button variant="ghost" size="sm">Careers</Button>
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            About Us
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Empowering Students to </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Achieve Excellence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            StudyPlanner was created with a simple mission: to help students organize their studies more effectively and achieve better academic results through intelligent, personalized learning tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full px-8">
                Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8 gap-2">
              <Play className="w-4 h-4" /> Watch Our Story
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
                <Badge variant="outline" className="mt-2 text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
                  <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4" variant="outline">Our Mission</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Transforming How Students Learn
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                StudyPlanner combines powerful planning tools with AI-powered features to create a personalized learning experience. We believe every student deserves access to tools that can help them succeed, regardless of their background or location.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our platform is designed to make studying more organized, efficient, and enjoyable. With features like intelligent quiz generation, progress analytics, and personalized study recommendations, we&apos;re helping students reach their full potential.
              </p>
              <div className="space-y-4">
                {[
                  'Make studying more organized and efficient',
                  'Provide AI-powered learning assistance',
                  'Track progress with detailed analytics',
                  'Create engaging quizzes and courses',
                  'Help students achieve academic excellence',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <GraduationCap className="w-16 h-16 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed mb-6">
                  To become the leading study planning platform that empowers millions of students worldwide to achieve their academic goals through intelligent, personalized learning tools.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <Globe className="w-6 h-6 mb-2" />
                    <div className="text-2xl font-bold">100+</div>
                    <div className="text-sm text-white/70">Countries</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <Coffee className="w-6 h-6 mb-2" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-white/70">Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Our Journey</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Got Here
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From a simple idea to a platform serving students worldwide, here&apos;s our story.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Badge className="mb-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                    {item.year}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white dark:border-gray-900" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Recognition & Achievements
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              We&apos;re proud of the impact we&apos;ve made in the education sector.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center bg-white/10 backdrop-blur-sm border-0 text-white hover:bg-white/20 transition-colors">
                  <CardContent className="p-6">
                    <achievement.icon className="w-10 h-10 mx-auto mb-4 opacity-90" />
                    <h3 className="font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-white/70">{achievement.organization}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Our Values</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What We Believe In
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our core values guide everything we do, from product development to customer support.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden group">
                  <div className={`h-2 bg-gradient-to-r ${value.color}`} />
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Our Team</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the People Behind StudyPlanner
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A dedicated team of developers, designers, and educators working together to improve student outcomes.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
                      {member.initials}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">{member.role}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{member.bio}</p>
                    <div className="flex justify-center gap-3">
                      <a href={member.linkedin} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </a>
                      <a href={member.twitter} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Twitter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Department Stats */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-8">Team by Department</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {departments.map((dept, index) => (
                <div key={index} className={`flex items-center gap-3 px-5 py-3 rounded-xl ${dept.color}`}>
                  <dept.icon className="w-5 h-5" />
                  <span className="font-medium">{dept.name}</span>
                  <Badge variant="secondary" className="bg-white/50 dark:bg-gray-800/50">{dept.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center overflow-hidden">
            <CardContent className="p-12 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
              <Rocket className="w-16 h-16 mx-auto mb-6 opacity-80 relative" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">Join Our Journey</h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto relative">
                Be part of the growing community of students who are transforming their learning experience with StudyPlanner.
              </p>
              <div className="flex flex-wrap justify-center gap-4 relative">
                <Link href="/">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-10">
                    Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/careers">
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-full px-10">
                    View Open Positions <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} StudyPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
