import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';

import camelCaseKeys from 'camelcase-keys';

import { login } from '@/api/authApi';
import { decryptPayload, encryptPayload } from '@/utils/encryptUtils';

export interface User {
  id: string;
  login: string;
  right: string;
  email: string;
  token: string;

  // Add this index signature to satisfy `Record<string, unknown>` constraint
  [key: string]: unknown;
}


const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        encryptedPayload: { label: 'Encrypted Payload', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.encryptedPayload) {
          throw new Error('No encrypted payload provided');
        }

        // Parse the encrypted payload sent by the client
        const { encryptedPayload } = credentials;

        try {
          // Call the login API with the encrypted payload
          const response = await login(JSON.parse(encryptedPayload));

          if (response.data) {
            // Decrypt the response from the server
            const user = camelCaseKeys(decryptPayload<User>(response.data.encryptedData, response.data.iv), {deep: true});

            // Return the user object for NextAuth
            return {
              id: user.id,
              login: user.login,
              right: user.right,
              email: user.email,
              token: user.token,
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
  secret: process.env.NEXTAUTH_SECRET, // Set a strong, random secret key in your environment variables
  session: {
    strategy: 'jwt', // Use JSON Web Token (JWT) for sessions
  },
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
        const sessionData = {
          id: token.id,
          login: token.login,
          right: token.right,
          email: token.email,
          token: token.token,
        };
  
        // Encrypt session data
        const encryptedSession = encryptPayload(sessionData);
        session.user = { encryptedSession }; // Replace user data with the encrypted payload
      }
      return session;
    },
  },
  // secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // console.log('Auth request received:', req.body);
  return await NextAuth(req, res, authOptions);
}
