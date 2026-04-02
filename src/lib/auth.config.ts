import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { db } from './db';
import bcrypt from 'bcryptjs';

const providers: NextAuthOptions['providers'] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await db.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user || !user.password) {
        return null;
      }

      const passwordMatch = await bcrypt.compare(
        credentials.password,
        user.password
      );

      if (!passwordMatch) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/?auth=login',
    error: '/?auth=login',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || 'student';
      }

      if (!token.role && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  events: {
    async signIn({ user }) {
      if (user.email) {
        const existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser && !existingUser.emailVerified) {
          await db.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          });
        }
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
