namespace BookAPI.Utils
{
    public class EncryptedPayload
    {
        public string EncryptedData { get; set; } = string.Empty;
        public string Iv { get; set; } = string.Empty;
    }
}
