
using System.ComponentModel.DataAnnotations;

namespace CloudDoc.Api.DTOs.Documents;

public class UpdateDocumentRequest
{
    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string FileName { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [MaxLength(10)]
    public List<string> Tags { get; set; } = [];
}
