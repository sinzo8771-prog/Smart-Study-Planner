import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file with override - use DIRECT_DATABASE_URL for this script
config({ path: resolve(process.cwd(), '.env'), override: true });

// Override DATABASE_URL with DIRECT_DATABASE_URL for this script to avoid pooler issues
if (process.env.DIRECT_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_DATABASE_URL;
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Video URLs from static data - YouTube courses
const videoUrls: Record<string, string> = {
  // HTML & CSS Course
  'Introduction to HTML': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=0s',
  'CSS Fundamentals': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=1800s',
  'Responsive Design with Flexbox': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=5400s',
  'CSS Grid Layout': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=9000s',
  'Build a Complete Website Project': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=12000s',
  
  // JavaScript Course
  'JavaScript Basics & Variables': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=0s',
  'Functions & Scope': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=2400s',
  'Arrays & Objects': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=5100s',
  'DOM Manipulation': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=8000s',
  'Async JavaScript & Promises': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=11000s',
  
  // React Course
  'React Fundamentals': 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=0s',
  'State & useState Hook': 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=3600s',
  'Effects & useEffect Hook': 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=7200s',
  'Forms & Events in React': 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=10800s',
  'Build a Complete React Project': 'https://www.youtube.com/watch?v=bMknfKXIFA8&t=14400s',
  
  // Python Course
  'Python Basics & Setup': 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=0s',
  'Variables & Data Types': 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=1800s',
  'Lists, Tuples & Dictionaries': 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=4500s',
  'Functions & Modules': 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=8100s',
  'File Handling & Exceptions': 'https://www.youtube.com/watch?v=rfscVS0vtbw&t=11700s',
  
  // Node.js Course
  'Introduction to Node.js': 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=0s',
  'Express.js Framework': 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=2700s',
  'REST API Development': 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=5400s',
  'MongoDB & Mongoose': 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=9000s',
  'Authentication & Deployment': 'https://www.youtube.com/watch?v=Oe421EPjeBE&t=12600s',
  
  // Git Course
  'Git Basics': 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=0s',
  'Branching & Merging': 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=2100s',
  'GitHub & Remote Repositories': 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=4500s',
  'Advanced Git Concepts': 'https://www.youtube.com/watch?v=RGOj5yH7evk&t=7200s',
  
  // TypeScript Course
  'TypeScript Fundamentals': 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=0s',
  'Interfaces & Types': 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=2400s',
  'Functions & Generics': 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=5400s',
  'TypeScript with React': 'https://www.youtube.com/watch?v=BwuLxPH8IDs&t=8400s',
  
  // SQL Course
  'Introduction to Databases': 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=0s',
  'SQL Queries & Clauses': 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=2100s',
  'Joins & Relationships': 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=4800s',
  'Database Design Best Practices': 'https://www.youtube.com/watch?v=HXV3zeQKqGY&t=8100s',
  
  // Web Development course modules
  'Getting Started with HTML': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=0s',
  'JavaScript Basics': 'https://www.youtube.com/watch?v=EfAl9bwzV7I&t=0s',
  'Building Your First Website': 'https://www.youtube.com/watch?v=pQN-pnXPaVg&t=12000s',
  
  // Mathematics course modules
  'Understanding Variables and Expressions': 'https://www.youtube.com/watch?v=xxPC-TYliK4&t=0s',
  'Solving Linear Equations': 'https://www.youtube.com/watch?v=xxPC-TYliK4&t=1800s',
  'Working with Inequalities': 'https://www.youtube.com/watch?v=xxPC-TYliK4&t=3600s',
  'Introduction to Functions': 'https://www.youtube.com/watch?v=xxPC-TYliK4&t=5400s',
  
  // Data Science course modules
  'Python for Data Science': 'https://www.youtube.com/watch?v=LHBE6Q9XlzI&t=0s',
  'NumPy Fundamentals': 'https://www.youtube.com/watch?v=LHBE6Q9XlzI&t=2400s',
  'Pandas for Data Analysis': 'https://www.youtube.com/watch?v=LHBE6Q9XlzI&t=4800s',
  'Data Visualization': 'https://www.youtube.com/watch?v=LHBE6Q9XlzI&t=7200s',
  
  // English course modules
  'Grammar Essentials': 'https://www.youtube.com/watch?v=I5f0l1P-haI&t=0s',
  'Essay Structure': 'https://www.youtube.com/watch?v=I5f0l1P-haI&t=1800s',
  'Creative Writing Basics': 'https://www.youtube.com/watch?v=I5f0l1P-haI&t=3600s',
  
  // Physics course modules
  'Motion and Kinematics': 'https://www.youtube.com/watch?v=XXh2LEfHJo4&t=0s',
  "Newton's Laws of Motion": 'https://www.youtube.com/watch?v=XXh2LEfHJo4&t=2400s',
  'Work, Energy, and Power': 'https://www.youtube.com/watch?v=XXh2LEfHJo4&t=4800s',
};

async function main() {
  console.log('🎬 Updating video URLs for modules...');
  
  // Get all modules
  const modules = await prisma.module.findMany();
  
  console.log(`Found ${modules.length} modules`);
  
  let updated = 0;
  
  for (const mod of modules) {
    const videoUrl = videoUrls[mod.title];
    
    if (videoUrl && !mod.videoUrl) {
      await prisma.module.update({
        where: { id: mod.id },
        data: { videoUrl }
      });
      console.log(`✅ Updated: ${mod.title}`);
      updated++;
    }
  }
  
  console.log(`\n🎉 Updated ${updated} modules with video URLs`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
