import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudyPlanner - Smart Study Planner & Learning Management System",
  description: "A smart way to plan, learn, and track progress. The all-in-one smart study planner and learning management system designed to help students organize their studies, track progress, and achieve academic excellence.",
  keywords: ["Study Planner", "LMS", "Learning Management", "Student", "Education", "Task Management", "Progress Tracking"],
  authors: [{ name: "StudyPlanner Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "StudyPlanner - Smart Study Planner & LMS",
    description: "Plan Smarter. Learn Better. Achieve More.",
    type: "website",
    images: ["/logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyPlanner - Smart Study Planner & LMS",
    description: "Plan Smarter. Learn Better. Achieve More.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
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
