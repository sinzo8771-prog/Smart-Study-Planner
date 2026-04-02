import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Smart Study Planner & LMS - Learn Smarter, Not Harder",
    template: "%s | Smart Study Planner",
  },
  description: "A comprehensive Learning Management System with smart study planning, AI-powered assistance, progress tracking, and interactive quizzes. Boost your productivity and achieve your learning goals.",
  keywords: [
    "study planner",
    "learning management system",
    "LMS",
    "online learning",
    "study schedule",
    "education platform",
    "course management",
    "quiz platform",
    "AI study assistant",
    "progress tracking",
    "task management",
    "student productivity",
    "exam preparation",
    "study timer",
    "learning analytics",
  ],
  authors: [{ name: "Smart Study Planner Team", url: "https://github.com/sinzo8771-prog" }],
  creator: "Smart Study Planner",
  publisher: "Smart Study Planner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Smart Study Planner",
    title: "Smart Study Planner & LMS - Learn Smarter, Not Harder",
    description: "A comprehensive Learning Management System with smart study planning, AI-powered assistance, progress tracking, and interactive quizzes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Study Planner - Learn Smarter, Not Harder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Study Planner & LMS",
    description: "Learn smarter, not harder with AI-powered study planning and comprehensive LMS features.",
    images: ["/og-image.png"],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
