import { decryptPayload } from '@/utils/encryptUtils';
import { Session } from 'next-auth';

export const saveSessionLocally = (session: Session) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('session', JSON.stringify(session));
      const token = session.user.encryptedSession?.EncryptedData; // Extract token if required
      if (token) {
        localStorage.setItem('sessionToken', token);
      }
    } catch (error) {
      console.error('Failed to save session locally:', error);
    }
  }
};

export const loadSessionLocally = (): Session | null => {
  if (typeof window !== 'undefined') {
    try {
      const encryptedSession = localStorage.getItem('session');
      if (encryptedSession) {
        const { encryptedData, iv } = JSON.parse(encryptedSession); // Parse into components
        if (!encryptedData || !iv) {
          throw new Error('Invalid encrypted session format.');
        }

        // Decrypt the payload
        const decryptedSession = decryptPayload<Record<string, unknown>>(encryptedData, iv);

        // Validate that the decrypted session matches the `Session` type
        if (isValidSession(decryptedSession)) {
          return decryptedSession as Session; // TypeScript now trusts this
        } else {
          throw new Error('Decrypted session does not match the Session type.');
        }
      }
    } catch (error) {
      console.error('Failed to load session locally:', error);
    }
  }
  return null;
};

// Helper function to validate the structure of a Session
function isValidSession(data: unknown): data is Session {
  if (typeof data === 'object' && data !== null) {
    const session = data as Session;
    return (
      typeof session.user === 'object' &&
      session.user !== null &&
      typeof session.expires === 'string'
    );
  }
  return false;
}