import { DefaultSession, DefaultUser } from 'next-auth';
declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    uuid: string;
    login: string;
    right: string;
    email: string;
    token: string;
  }

  interface Session {
    user: {
      encryptedSession: EncryptedPayload; // Use the EncryptedPayload type
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    uuid: string;
    login: string;
    right: string;
    email: string;
    token: string;
  }
}
