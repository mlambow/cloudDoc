
namespace CloudDoc.Api.DTOs.Documents;

public class DocumentResponse
{
    public string Id { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string MimeType { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public DateTime UploadedAt { get; set; }

    public int? PageCount { get; set; }

    public List<string> Tags { get; set; } = [];

    public string? Description { get; set; }
}
