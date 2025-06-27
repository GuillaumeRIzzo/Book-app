namespace API.Models
{
    public class GenderDto
    {
        public int GenderId { get; set; }
        public Guid GenderUuid { get; set; }
        public string GenderLabel { get; set; } = string.Empty;
    }
}
