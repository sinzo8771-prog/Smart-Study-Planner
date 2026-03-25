import { config } from 'dotenv';
config({ override: true });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Check if test user exists
    const existing = await prisma.user.findUnique({
      where: { email: 'test@testsprite.com' }
    });
    
    if (existing) {
      // Update password and verify email
      const hashedPassword = await bcrypt.hash('TestSprite123!', 10);
      await prisma.user.update({
        where: { email: 'test@testsprite.com' },
        data: {
          password: hashedPassword,
          emailVerified: new Date()
        }
      });
      console.log('Test user updated!');
    } else {
      // Create new test user
      const hashedPassword = await bcrypt.hash('TestSprite123!', 10);
      await prisma.user.create({
        data: {
          email: 'test@testsprite.com',
          name: 'TestSprite User',
          password: hashedPassword,
          emailVerified: new Date()
        }
      });
      console.log('Test user created!');
    }
    
    console.log('\n=================================');
    console.log('TEST CREDENTIALS FOR TESTSPRITE');
    console.log('=================================');
    console.log('Website: https://smart-study-plannerr.vercel.app');
    console.log('Email: test@testsprite.com');
    console.log('Password: TestSprite123!');
    console.log('=================================\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
