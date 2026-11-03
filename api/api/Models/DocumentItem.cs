namespace CloudDoc.Api;

public class DocumentItem
{
    public string id { get; set; } = Guid.NewGuid().ToString();

    public string fileName { get; set; } = string.Empty;

    public long fileSize { get; set; }

    public string mimeType { get; set; } = string.Empty;

    public string status { get; set; } = "Pending";

    public DateTime uploadedAt { get; set; } = DateTime.UtcNow;

    public int? pageCount { get; set; }

    public List<string> tags { get; set; } = [];

    public string? description { get; set; }

    public string? extractedText { get; set; }

    public string? storageKey { get; set; }
}