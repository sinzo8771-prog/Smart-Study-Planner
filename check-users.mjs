import { config } from 'dotenv';
config({ override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, emailVerified: true, createdAt: true }
    });
    console.log('Existing Users:');
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getUsers();
