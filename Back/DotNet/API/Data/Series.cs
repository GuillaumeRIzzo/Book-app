using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Data;

[Table("SERIES")]
[Index("SeriesUuid", Name = "UQ__SERIES__93F3FD60530CD707", IsUnique = true)]
public partial class Series
{
    [Key]
    [Column("series_id")]
    public int SeriesId { get; set; }

    [Column("series_uuid")]
    public Guid SeriesUuid { get; set; } = Guid.NewGuid();

    [Column("series_name")]
    [StringLength(255)]
    [Unicode(false)]
    public string SeriesName { get; set; } = string.Empty;

    [InverseProperty("SeriesUu")]
    public virtual ICollection<BookSeriesOrder> BookSeriesOrders { get; set; } = new List<BookSeriesOrder>();

    [InverseProperty("BookSeriesUu")]
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
