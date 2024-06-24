import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    login: string;
    right: string;
    email: string;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      login: string;
      right: string;
      email: string;
      token: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    login: string;
    right: string;
    email: string;
    token: string;
  }
}
