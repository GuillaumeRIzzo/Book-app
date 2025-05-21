using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Models
{
    public class BookNoteDto
    {
        public int NoteId { get; set; }
        public Guid NoteUuid { get; set; }
        public decimal NoteValue { get; set; }
        public string? NoteComment { get; set; }
        public DateTimeOffset NoteDate { get; set; }
        public bool? IsModerated { get; set; }
        public bool IsDeleted { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public Guid BookUuid { get; set; }
        public Guid UserUuid { get; set; }
    }
}
