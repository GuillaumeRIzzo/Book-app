using System.Security.Cryptography;
using System.Security.Cryptography.Xml;
using System.Text;

namespace BookAPI.Utils
{
    public class EncryptionHelper
    {
        private const string EncryptionKey = "bSpqb6G7fjXL8uowmX8LUZiiwdESV2uD"; // Should match client key

        public static string DecryptData(string encryptedData, string ivHex)
        {
            // Convert the IV from hex to bytes
            byte[] ivBytes = Convert.FromHexString(ivHex);

            // Create a key (ensure it's 32 bytes)
            byte[] keyBytes = Encoding.UTF8.GetBytes(EncryptionKey);
            if (keyBytes.Length != 32)
            {
                throw new ArgumentException("The encryption key must be 32 bytes long.");
            }

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = keyBytes; // Set the AES key
                aesAlg.IV = ivBytes; // Set the IV
                aesAlg.Mode = CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(encryptedData)))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            // Read and return the decrypted text
                            return srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
        }

        public static (string EncryptedData, string Iv) EncryptData(string plainText)
        {
            byte[] iv = RandomNumberGenerator.GetBytes(16); // Generate random IV
            byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);

            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(EncryptionKey);
            aes.IV = iv;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
            using var memoryStream = new MemoryStream();
            using var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);

            cryptoStream.Write(plainBytes, 0, plainBytes.Length);
            cryptoStream.FlushFinalBlock();

            return (Convert.ToBase64String(memoryStream.ToArray()), ToHex(iv));
        }

        private static string ToHex(byte[] bytes) => BitConverter.ToString(bytes).Replace("-", "").ToLower();

        private static byte[] FromHex(string hex)
        {
            int length = hex.Length / 2;
            byte[] bytes = new byte[length];
            for (int i = 0; i < length; i++)
                bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            return bytes;
        }
    }
}
