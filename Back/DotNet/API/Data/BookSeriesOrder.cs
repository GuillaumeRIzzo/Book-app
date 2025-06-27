using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

[PrimaryKey("SeriesUuid", "BookUuid")]
[Table("BOOK_SERIES_ORDER")]
public partial class BookSeriesOrder
{
    [Key]
    [Column("series_uuid")]
    public Guid SeriesUuid { get; set; }

    [Key]
    [Column("book_uuid")]
    public Guid BookUuid { get; set; }

    [Column("series_order")]
    public int SeriesOrder { get; set; }

    [ForeignKey("BookUuid")]
    [InverseProperty("BookSeriesOrders")]
    public virtual Book BookUu { get; set; } = null!;

    [ForeignKey("SeriesUuid")]
    [InverseProperty("BookSeriesOrders")]
    public virtual Series SeriesUu { get; set; } = null!;
}
