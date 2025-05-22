using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Models
{
    public class BannedWordDto
    {
        public int BannedWordId { get; set; }
        public Guid BannedWordUuid { get; set; }
        public string Word { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public bool IsDeleted { get; set; }
        public Guid LanguageUuid { get; set; }
    }
}
