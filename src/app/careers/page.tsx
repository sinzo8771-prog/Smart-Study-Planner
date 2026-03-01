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
  ArrowLeft, ArrowRight, Search, MapPin, Clock, Users, 
  Briefcase, DollarSign, Heart, ChevronRight, Filter,
  Building2, Globe, Star, Coffee, Zap, Target, Code,
  Palette, Brain, Shield, Megaphone, Pen, CheckCircle,
  X, Upload, Loader2, Calendar, Award
} from 'lucide-react';

export default function CareersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    { id: 'all', label: 'All Departments', icon: Building2 },
    { id: 'engineering', label: 'Engineering', icon: Code },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'product', label: 'Product', icon: Target },
    { id: 'ai', label: 'AI Research', icon: Brain },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
  ];

  const locations = [
    { id: 'all', label: 'All Locations' },
    { id: 'remote', label: 'Remote' },
    { id: 'sf', label: 'San Francisco' },
    { id: 'london', label: 'London' },
    { id: 'singapore', label: 'Singapore' },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'engineering',
      location: 'remote',
      type: 'Full-time',
      salary: '$140K - $180K',
      posted: '2 days ago',
      description: 'We\'re looking for an experienced full-stack developer to help build and scale our platform.',
      requirements: [
        '5+ years of experience with React, Node.js, and TypeScript',
        'Experience with PostgreSQL and database design',
        'Strong understanding of web performance and optimization',
        'Experience with cloud services (AWS/GCP)',
        'Excellent communication skills'
      ],
      benefits: ['Remote-first', 'Equity', 'Health insurance', 'Learning budget', 'Flexible hours']
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'design',
      location: 'sf',
      type: 'Full-time',
      salary: '$110K - $140K',
      posted: '1 week ago',
      description: 'Join our design team to create beautiful and intuitive user experiences for students worldwide.',
      requirements: [
        '3+ years of UI/UX design experience',
        'Proficiency in Figma and design systems',
        'Strong portfolio showcasing web and mobile designs',
        'Experience with user research and testing',
        'Understanding of accessibility standards'
      ],
      benefits: ['Hybrid work', 'Health insurance', 'Design tools budget', 'Conference attendance']
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'product',
      location: 'remote',
      type: 'Full-time',
      salary: '$130K - $160K',
      posted: '3 days ago',
      description: 'Lead product initiatives and work closely with engineering, design, and users to build amazing features.',
      requirements: [
        '4+ years of product management experience',
        'Experience in EdTech or SaaS products',
        'Strong analytical and data-driven mindset',
        'Excellent stakeholder management skills',
        'Technical background is a plus'
      ],
      benefits: ['Remote-first', 'Equity', 'Health insurance', 'Learning budget']
    },
    {
      id: 4,
      title: 'AI/ML Engineer',
      department: 'ai',
      location: 'sf',
      type: 'Full-time',
      salary: '$160K - $200K',
      posted: '1 day ago',
      description: 'Build and improve our AI-powered features including quiz generation and personalized recommendations.',
      requirements: [
        'MS/PhD in Computer Science, ML, or related field',
        '3+ years of experience with deep learning frameworks',
        'Experience with NLP and LLMs',
        'Strong Python programming skills',
        'Published research is a plus'
      ],
      benefits: ['Competitive salary', 'Equity', 'Research budget', 'Conference sponsorship']
    },
    {
      id: 5,
      title: 'Frontend Developer',
      department: 'engineering',
      location: 'london',
      type: 'Full-time',
      salary: '£80K - £100K',
      posted: '5 days ago',
      description: 'Build responsive and performant user interfaces for our web application.',
      requirements: [
        '3+ years of frontend development experience',
        'Expert in React and TypeScript',
        'Experience with state management (Zustand, Redux)',
        'Understanding of web accessibility',
        'Performance optimization skills'
      ],
      benefits: ['Hybrid work', 'Health insurance', 'Learning budget', 'Gym membership']
    },
    {
      id: 6,
      title: 'Content Writer',
      department: 'marketing',
      location: 'remote',
      type: 'Part-time',
      salary: '$40 - $60/hr',
      posted: '1 week ago',
      description: 'Create engaging content about study tips, productivity, and educational technology.',
      requirements: [
        '2+ years of content writing experience',
        'Background in education or EdTech',
        'Excellent writing and editing skills',
        'SEO knowledge is a plus',
        'Portfolio of published articles'
      ],
      benefits: ['Flexible hours', 'Remote work', 'Growth opportunities']
    },
    {
      id: 7,
      title: 'DevOps Engineer',
      department: 'engineering',
      location: 'remote',
      type: 'Full-time',
      salary: '$130K - $160K',
      posted: '2 weeks ago',
      description: 'Manage and improve our cloud infrastructure and CI/CD pipelines.',
      requirements: [
        '4+ years of DevOps experience',
        'Experience with AWS/GCP and Kubernetes',
        'Strong scripting skills (Python, Bash)',
        'Experience with monitoring and alerting',
        'Security best practices knowledge'
      ],
      benefits: ['Remote-first', 'Equity', 'Health insurance', 'Certification budget']
    },
    {
      id: 8,
      title: 'Security Engineer',
      department: 'engineering',
      location: 'sf',
      type: 'Full-time',
      salary: '$150K - $180K',
      posted: '3 days ago',
      description: 'Ensure the security of our platform and protect user data.',
      requirements: [
        '4+ years of security engineering experience',
        'Experience with security audits and penetration testing',
        'Knowledge of web application security',
        'Understanding of compliance frameworks',
        'Relevant certifications (CISSP, CEH) preferred'
      ],
      benefits: ['Competitive salary', 'Equity', 'Health insurance', 'Security conferences']
    },
  ];

  const perks = [
    { icon: Globe, title: 'Remote-First', description: 'Work from anywhere in the world' },
    { icon: DollarSign, title: 'Competitive Pay', description: 'Top-of-market compensation' },
    { icon: Heart, title: 'Health Benefits', description: 'Comprehensive medical, dental, vision' },
    { icon: Coffee, title: 'Flexible Hours', description: 'Work when you\'re most productive' },
    { icon: Award, title: 'Learning Budget', description: '$2,000/year for courses and books' },
    { icon: Zap, title: 'Equity', description: 'Own a piece of the company' },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesLocation && matchesSearch;
  });

  const getDepartmentIcon = (dept: string) => {
    const icon = departments.find(d => d.id === dept)?.icon || Building2;
    return icon;
  };

  const getDepartmentColor = (dept: string) => {
    const colors: Record<string, string> = {
      'engineering': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'design': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      'product': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'ai': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'marketing': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[dept] || 'bg-gray-100 text-gray-600';
  };

  const getLocationLabel = (loc: string) => {
    return locations.find(l => l.id === loc)?.label || loc;
  };

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
              <Link href="/about">
                <Button variant="ghost" size="sm">About Us</Button>
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
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            We&apos;re Hiring!
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Join Our </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Amazing Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Help us transform education and empower students worldwide. We&apos;re looking for passionate people to join our mission.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge variant="outline" className="py-2 px-4 text-base">
              <Users className="w-4 h-4 mr-2" /> 50+ Team Members
            </Badge>
            <Badge variant="outline" className="py-2 px-4 text-base">
              <Globe className="w-4 h-4 mr-2" /> 20+ Countries
            </Badge>
            <Badge variant="outline" className="py-2 px-4 text-base">
              <Briefcase className="w-4 h-4 mr-2" /> {jobs.length} Open Positions
            </Badge>
          </div>
        </motion.div>
      </section>

      {/* Perks Section */}
      <section className="py-16 px-4 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {perks.map((perk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                  <perk.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{perk.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-6">
            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {/* Department Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartment(dept.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedDepartment === dept.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <dept.icon className="w-4 h-4" />
                    {dept.label}
                  </button>
                ))}
              </div>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Showing {filteredJobs.length} open position{filteredJobs.length !== 1 ? 's' : ''}
          </p>

          {/* Job Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="h-full border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className={`h-2 bg-gradient-to-r ${
                    job.department === 'engineering' ? 'from-blue-500 to-blue-600' :
                    job.department === 'design' ? 'from-pink-500 to-pink-600' :
                    job.department === 'product' ? 'from-green-500 to-green-600' :
                    job.department === 'ai' ? 'from-purple-500 to-purple-600' :
                    'from-orange-500 to-orange-600'
                  }`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge className={getDepartmentColor(job.department)}>
                            {job.department.charAt(0).toUpperCase() + job.department.slice(1)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" /> {getLocationLabel(job.location)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" /> {job.type}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-600 dark:text-green-400 shrink-0">
                        {job.salary}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Posted {job.posted}</span>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No positions found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && !showApplicationForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-2 bg-gradient-to-r ${
                selectedJob.department === 'engineering' ? 'from-blue-500 to-blue-600' :
                selectedJob.department === 'design' ? 'from-pink-500 to-pink-600' :
                selectedJob.department === 'product' ? 'from-green-500 to-green-600' :
                selectedJob.department === 'ai' ? 'from-purple-500 to-purple-600' :
                'from-orange-500 to-orange-600'
              }`} />
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-4rem)]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={getDepartmentColor(selectedJob.department)}>
                        {selectedJob.department.charAt(0).toUpperCase() + selectedJob.department.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        <MapPin className="w-3 h-3 mr-1" /> {getLocationLabel(selectedJob.location)}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" /> {selectedJob.type}
                      </Badge>
                      <Badge variant="secondary" className="text-green-600">
                        {selectedJob.salary}
                      </Badge>
                    </div>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About the Role</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedJob(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplicationForm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-4rem)]">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Application Submitted!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">We&apos;ll be in touch soon.</p>
                    <Button onClick={() => { setShowApplicationForm(false); setSelectedJob(null); setIsSubmitted(false); }}>
                      Close
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Apply for {selectedJob.title}</h2>
                        <p className="text-sm text-gray-500">{getLocationLabel(selectedJob.location)}</p>
                      </div>
                      <button onClick={() => setShowApplicationForm(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>First Name *</Label>
                          <Input placeholder="John" required className="mt-1" />
                        </div>
                        <div>
                          <Label>Last Name *</Label>
                          <Input placeholder="Doe" required className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input type="email" placeholder="john@example.com" required className="mt-1" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input type="tel" placeholder="+1 (555) 123-4567" className="mt-1" />
                      </div>
                      <div>
                        <Label>LinkedIn Profile</Label>
                        <Input type="url" placeholder="https://linkedin.com/in/..." className="mt-1" />
                      </div>
                      <div>
                        <Label>Resume/CV *</Label>
                        <div className="mt-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                        </div>
                      </div>
                      <div>
                        <Label>Why do you want to join us?</Label>
                        <Textarea placeholder="Tell us about yourself..." rows={4} className="mt-1" />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Submit Application <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Culture Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Our Culture</Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Work With Us?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We&apos;re building more than just a product – we&apos;re building a community of learners and educators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mission-Driven</h3>
                <p className="text-gray-600 dark:text-gray-300">Every day, we work to make education more accessible and effective for students worldwide.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Collaborative</h3>
                <p className="text-gray-600 dark:text-gray-300">We believe in the power of teamwork and support each other to achieve our best work.</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast-Paced</h3>
                <p className="text-gray-600 dark:text-gray-300">We move quickly, iterate often, and are always looking for ways to improve.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
              <h2 className="text-3xl font-bold mb-4 relative">Don&apos;t See the Right Fit?</h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto relative">
                We&apos;re always looking for talented people. Send us your resume and we&apos;ll keep you in mind for future opportunities.
              </p>
              <Button size="lg" variant="secondary" className="rounded-full px-10 relative">
                Send General Application <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
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
