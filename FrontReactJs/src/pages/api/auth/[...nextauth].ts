import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';

import { login } from '@/api/authApi';

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Identifier', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        const { identifier, password } = credentials;

        try {
          const response = await login(identifier, password);

          if (response.data) {
            const user = response.data;
            return {
              id: user.id,
              login: user.login,
              right: user.right,
              email: user.email,
              token: user.token
            };
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.right = user.right;
        token.email = user.email;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.login = token.login;
        session.user.right = token.right;
        session.user.email = token.email;
        session.user.token = token.token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // console.log('Auth request received:', req.body);
  return await NextAuth(req, res, authOptions);
}
