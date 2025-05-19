using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BookAPI.Data;

[Table("READ_LISTS")]
[Index("ReadListUuid", Name = "UQ__READ_LIS__67AE94D0BD796F09", IsUnique = true)]
public partial class ReadList
{
    [Key]
    [Column("readList_id")]
    public int ReadListId { get; set; }

    [Column("readList_uuid")]
    public Guid ReadListUuid { get; set; } = Guid.NewGuid();

    [Column("user_uuid")]
    public Guid UserUuid { get; set; }

    [Column("read_list_name")]
    [StringLength(100)]
    [Unicode(false)]
    public string ReadListName { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("updated_at")]
    public DateTimeOffset UpdatedAt { get; set; }

    [InverseProperty("ReadListUu")]
    public virtual ICollection<ReadListBook> ReadListBooks { get; set; } = new List<ReadListBook>();

    [ForeignKey("UserUuid")]
    [InverseProperty("ReadLists")]
    public virtual User UserUu { get; set; } = null!;
}
