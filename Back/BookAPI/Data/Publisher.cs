using System;
using System.Collections.Generic;

namespace BookAPI.Models;

public partial class Publisher
{
    public int PublisherId { get; set; }

    public Guid PublicherUuid { get; set; } = Guid.NewGuid();

    public string PublisherName { get; set; } = "";

    public string ImageUrl { get; set; } = "https://www.creativebookpublishing.ca/wp-content/uploads/2018/04/Major-Newfoundland-book-publishing-houses.jpg";

    public bool IsDeleted { get; set; } = false;

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdateAt { get; set; }
}
