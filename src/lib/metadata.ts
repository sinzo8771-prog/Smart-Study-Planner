import { Metadata } from 'next';


export const baseMetadata: Metadata = {
  title: {
    default: 'Smart Study Planner & LMS - Learn Smarter, Not Harder',
    template: '%s | Smart Study Planner',
  },
  description: 'A comprehensive Learning Management System with smart study planning, AI-powered assistance, progress tracking, and interactive quizzes. Boost your productivity and achieve your learning goals.',
  keywords: [
    'study planner',
    'learning management system',
    'LMS',
    'online learning',
    'study schedule',
    'education platform',
    'course management',
    'quiz platform',
    'AI study assistant',
    'progress tracking',
  ],
  authors: [{ name: 'Smart Study Planner Team' }],
  creator: 'Smart Study Planner',
  publisher: 'Smart Study Planner',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Smart Study Planner',
    title: 'Smart Study Planner & LMS - Learn Smarter, Not Harder',
    description: 'A comprehensive Learning Management System with smart study planning, AI-powered assistance, progress tracking, and interactive quizzes.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Smart Study Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Study Planner & LMS',
    description: 'Learn smarter, not harder with AI-powered study planning and comprehensive LMS features.',
    images: ['/og-image.png'],
    creator: '@smartstudyplanner',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
};


export function generatePageMetadata(options: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  return {
    title: options.title,
    description: options.description || baseMetadata.description,
    alternates: {
      canonical: options.path || '/',
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: options.path || '/',
      images: options.image ? [{ url: options.image }] : undefined,
    },
    twitter: {
      title: options.title,
      description: options.description,
      images: options.image ? [options.image] : undefined,
    },
  };
}


export function generateCourseStructuredData(course: {
  title: string;
  description?: string;
  category?: string;
  level: string;
  duration: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    educationalLevel: course.level,
    timeRequired: `PT${course.duration}M`,
    provider: {
      '@type': 'Organization',
      name: 'Smart Study Planner',
    },
    teaches: course.category,
  };
}


export function generateQuizStructuredData(quiz: {
  title: string;
  description?: string;
  passingScore: number;
  duration: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: quiz.title,
    description: quiz.description,
    timeRequired: `PT${quiz.duration}M`,
    assessment: {
      '@type': 'Assessment',
      name: quiz.title,
      passingScore: quiz.passingScore,
    },
  };
}

export default baseMetadata;
