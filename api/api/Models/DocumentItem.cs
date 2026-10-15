namespace CloudDoc.Api;

public class DocumentItem
{
    public string id { get; set; } = Guid.NewGuid().ToString();
    public string fileName { get; set; } = string.Empty;
    public string fileSize { get; set; } = string.Empty;
    public string mimeType { get; set; } = string.Empty;
    public string status { get; set; } = "Pending";
    public string uploadedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
    public int? pageCount { get; set; }
    public List<string> tags { get; set; } = new();
    public string? description { get; set; }
    public string? extractedText { get; set; }
    public string? blobUrl { get; set; }
}