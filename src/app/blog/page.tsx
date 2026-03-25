'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { 
  ArrowLeft, ArrowRight, Search, Calendar, Clock, User, 
  BookOpen, Bookmark, TrendingUp, Filter, Grid, List,
  ChevronRight, Star, Eye, Heart, Share2, MessageCircle,
  Lightbulb, Target, Zap, Brain, GraduationCap, Coffee,
  Pen
} from 'lucide-react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', label: 'All Posts', icon: Grid, count: 24 },
    { id: 'study-tips', label: 'Study Tips', icon: BookOpen, count: 8 },
    { id: 'productivity', label: 'Productivity', icon: Zap, count: 6 },
    { id: 'ai-learning', label: 'AI & Learning', icon: Brain, count: 5 },
    { id: 'career', label: 'Career', icon: GraduationCap, count: 3 },
    { id: 'news', label: 'News & Updates', icon: TrendingUp, count: 2 },
  ];

  const featuredPost = {
    title: '10 Study Techniques Backed by Science: A Complete Guide',
    excerpt: 'Discover evidence-based study methods that actually work. From spaced repetition to active recall, learn how to study smarter, not harder.',
    author: 'Dr. Sarah Chen',
    date: 'Jan 15, 2024',
    readTime: '12 min read',
    category: 'Study Tips',
    image: '/blog/study-techniques.jpg',
    views: '12.5K',
    likes: 842
  };

  const posts = [
    {
      title: 'How to Build a Study Schedule That Actually Works',
      excerpt: 'Learn the fundamentals of creating an effective study schedule that adapts to your learning style and helps you achieve your goals.',
      author: 'Michael Park',
      date: 'Jan 10, 2024',
      readTime: '8 min read',
      category: 'Productivity',
      views: '8.2K',
      likes: 523,
      featured: true
    },
    {
      title: 'The Benefits of Spaced Repetition for Long-term Memory',
      excerpt: 'Understand how spaced repetition works and how you can use it to remember information for longer periods.',
      author: 'Emily Rodriguez',
      date: 'Jan 5, 2024',
      readTime: '6 min read',
      category: 'Study Tips',
      views: '6.8K',
      likes: 412
    },
    {
      title: 'AI in Education: What to Expect in 2024',
      excerpt: 'Explore the latest trends in AI-powered learning and how they will transform education in the coming year.',
      author: 'David Kim',
      date: 'Dec 28, 2023',
      readTime: '10 min read',
      category: 'AI & Learning',
      views: '15.3K',
      likes: 892,
      featured: true
    },
    {
      title: 'Mastering Time Management for Students',
      excerpt: 'Practical tips and techniques for managing your time effectively while balancing studies, work, and personal life.',
      author: 'Lisa Thompson',
      date: 'Dec 20, 2023',
      readTime: '7 min read',
      category: 'Productivity',
      views: '5.4K',
      likes: 378
    },
    {
      title: 'How to Use Quiz Generation to Improve Learning',
      excerpt: 'Learn how AI-powered quiz generation can help you test your knowledge and identify areas that need improvement.',
      author: 'James Wilson',
      date: 'Dec 15, 2023',
      readTime: '5 min read',
      category: 'AI & Learning',
      views: '4.9K',
      likes: 295
    },
    {
      title: 'Building a Career in Tech: A Student\'s Guide',
      excerpt: 'Everything you need to know about starting a successful career in technology, from skills to develop to job hunting tips.',
      author: 'Sarah Chen',
      date: 'Dec 10, 2023',
      readTime: '9 min read',
      category: 'Career',
      views: '7.1K',
      likes: 456
    },
    {
      title: 'The Pomodoro Technique: A Complete Guide',
      excerpt: 'Master the Pomodoro Technique and boost your productivity with this simple but powerful time management method.',
      author: 'Michael Park',
      date: 'Dec 5, 2023',
      readTime: '6 min read',
      category: 'Productivity',
      views: '9.3K',
      likes: 612
    },
    {
      title: 'Note-Taking Strategies That Actually Work',
      excerpt: 'Compare different note-taking methods and find the one that works best for your learning style.',
      author: 'Emily Rodriguez',
      date: 'Nov 28, 2023',
      readTime: '8 min read',
      category: 'Study Tips',
      views: '6.7K',
      likes: 445
    },
  ];

  const popularTags = [
    'Study Tips', 'Productivity', 'AI', 'Time Management', 
    'Memory', 'Focus', 'Learning', 'Exams', 'Career', 'Motivation'
  ];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, typeof BookOpen> = {
      'Study Tips': BookOpen,
      'Productivity': Zap,
      'AI & Learning': Brain,
      'Career': GraduationCap,
      'News & Updates': TrendingUp,
    };
    return icons[category] || BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Study Tips': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'Productivity': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'AI & Learning': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      'Career': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'News & Updates': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
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
              <Link href="/resources">
                <Button variant="ghost" size="sm">Resources</Button>
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
            Blog
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Study Smarter, </span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learn Better</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Expert insights, study tips, and the latest trends in education technology.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-gray-200 dark:border-gray-800 sticky top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
                <Badge variant="secondary" className={`text-xs ${selectedCategory === cat.id ? 'bg-white/20 text-white' : ''}`}>
                  {cat.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Posts */}
            <div className="lg:col-span-3 space-y-8">
              {/* Featured Post */}
              {selectedCategory === 'all' && searchQuery === '' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-xl overflow-hidden group cursor-pointer">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                        </div>
                        <div className="relative">
                          <Badge className="mb-4 bg-white/20 text-white border-0">
                            <Star className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-100 transition-colors">
                            {featuredPost.title}
                          </h2>
                          <p className="text-white/80 mb-6 line-clamp-2">{featuredPost.excerpt}</p>
                          <div className="flex items-center gap-4 text-white/70 text-sm">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" /> {featuredPost.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> {featuredPost.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {featuredPost.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-white dark:bg-gray-800 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={getCategoryColor(featuredPost.category)}>
                            {featuredPost.category}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{featuredPost.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" /> {featuredPost.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" /> {featuredPost.likes}
                            </span>
                          </div>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 group-hover:shadow-lg transition-shadow">
                            Read More <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                  Showing {filteredPosts.length} articles
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Posts Grid/List */}
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                : 'space-y-4'
              }>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden ${
                      viewMode === 'list' ? '' : 'h-full'
                    }`}>
                      <CardContent className={`p-0 ${viewMode === 'list' ? 'flex' : ''}`}>
                        {/* Thumbnail placeholder */}
                        <div className={`bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 ${
                          viewMode === 'grid' ? 'h-48' : 'w-32 h-32 shrink-0'
                        } flex items-center justify-center`}>
                          {(() => {
                            const Icon = getCategoryIcon(post.category);
                            return <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />;
                          })()}
                        </div>
                        
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category}
                            </Badge>
                            {post.featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-800">
                                <Star className="w-3 h-3 mr-1" /> Featured
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" /> {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {post.date}
                              </span>
                              <span className="hidden sm:flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {post.readTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {post.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center pt-8">
                <Button variant="outline" size="lg" className="rounded-full px-10">
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Newsletter */}
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                    <Pen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Subscribe to Newsletter</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Get the latest articles and tips delivered to your inbox.
                  </p>
                  <div className="space-y-2">
                    <Input placeholder="your@email.com" />
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Most Read */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Most Read
                  </h3>
                  <div className="space-y-4">
                    {posts.slice(0, 4).map((post, index) => (
                      <div key={index} className="flex gap-3 cursor-pointer group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">{post.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Write for Us */}
              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
                  <Lightbulb className="w-10 h-10 mb-4 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Write for Us</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Have expertise to share? Contribute to our blog.
                  </p>
                  <Button variant="secondary" size="sm">
                    Learn More <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
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
