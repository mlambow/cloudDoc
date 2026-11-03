
using System.ComponentModel.DataAnnotations;

namespace CloudDoc.Api.DTOs.Documents;

public class DocumentQueryParameters
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    [StringLength(100)]
    public string? Search { get; set; }

    [StringLength(30)]
    public string? Status { get; set; }
}
