namespace BookAPI.Models
{
    public class ModelViewBook
    {
        public int BookId { get; set; }

        public string BookTitle { get; set; } = null!;

        public string BookDescription { get; set; } = null!;

        public DateTime BookPublishDate { get; set; }

        public int BookPageCount { get; set; }

        public double BookAverageRating { get; set; }

        public int BookRatingCount { get; set; }

        public string BookImageLink { get; set; } = null!;

        public string BookLanguage { get; set; } = null!;

        public int PublisherId { get; set; }

        public int AuthorId { get; set; }

        public bool Read { get; set; } = false;

        public bool InList { get; set; } = false;

        public List<ModelViewBookCategory> Categories { get; set; } = new List<ModelViewBookCategory>();
    }
}
