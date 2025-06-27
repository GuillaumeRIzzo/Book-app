namespace API.Models
{
    public class OrderHistoryDto
    {
        public int OrderId { get; set; }
        public Guid OrderUuid { get; set; }
        public Guid UserUuid { get; set; }
        public DateTimeOffset OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
