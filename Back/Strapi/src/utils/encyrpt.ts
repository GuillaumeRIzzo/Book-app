import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // Must be 32 characters (256 bits)
const IV_LENGTH = 16; // AES block size

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long.');
}

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
}

/**
 * Encrypts a JavaScript object into an encrypted JSON string.
 * @param data - The data to encrypt
 * @returns EncryptedPayload with encryptedData and iv
 */
export const encryptData = (data: object): EncryptedPayload => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);

  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
  };
}

/**
 * Decrypts an encrypted string into a JavaScript object.
 * @param encryptedData - The encrypted data to decrypt
 * @param iv - The initialization vector (IV) used during encryption
 * @returns The decrypted JavaScript object
 */
export const decryptData = (encryptedData: string, iv: string): object => {
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf8'), ivBuffer);

  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return JSON.parse(decrypted);
};