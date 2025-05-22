using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookAPI.Models
{
    public class BookImageTypeDto
    {
        public int ImageTypeId { get; set; }
        public Guid ImageTypeUuid { get; set; }
        public string Label { get; set; } = string.Empty;
    }
}
