namespace BookAPI.Models
{
    public class ModelViewReadlist
    {
        public int BookId { get; set; }
        public int UserId { get; set; }
        public bool ReadListRead { get; set; }
        public DateTime ReadListDateAdd { get; set; }
        public DateTime ReadListDateUpdate { get; set; }
        public bool Read {  get; set; }
    }
}
