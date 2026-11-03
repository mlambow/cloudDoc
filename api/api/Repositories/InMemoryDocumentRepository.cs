
using CloudDoc.Api;
using CloudDoc.Api.Repositories.Interfaces;

namespace CloudDoc.Api.Repositories;

public class InMemoryDocumentRepository : IDocumentRepository
{
    private readonly object _lock = new();

    private readonly Dictionary<string, DocumentItem> _documents = new()
    {
        ["doc-101"] = new DocumentItem
        {
                id = "doc-101",
                fileName = "invoice_october_2026.pdf",
                fileSize = 1_258_291,
                mimeType = "application/pdf",
                status = "Completed",
                uploadedAt = DateTime.UtcNow.AddMinutes(-10),
                pageCount = 4,
                tags = ["Invoice", "Finance", "Accounting"],
                description = "Monthly AWS & Azure infrastructure billing invoice",
                extractedText = "INVOICE #INV-2026-09\nTotal Amount Due: R1,450.00"
        },

        ["doc-102"] = new DocumentItem
        {
                id = "doc-102",
                fileName = "vendor_agreement_v2.pdf",
                fileSize = 3_565_158,
                mimeType = "application/pdf",
                status = "Processing",
                uploadedAt = DateTime.UtcNow,
                tags = ["Legal", "Contract"]
        }
    };

    public IReadOnlyList<DocumentItem> GetAll()
    {
        lock (_lock)
        {
            return _documents.Values
                .Select(CloneDocument)
                .ToList();
        }
    }

    public DocumentItem? GetById(string id)
    {
        lock (_lock)
        {
            return _documents.TryGetValue(id, out var document)
                ? CloneDocument(document)
                : null;
        }
    }

    public void Add(DocumentItem document)
    {
        lock (_lock)
        {
            if (!_documents.TryAdd(document.id, CloneDocument(document)))
            {
                throw new InvalidOperationException(
                    $"A document with ID '{document.id}' already exists.");
            }
        }
    }

    public bool Update(DocumentItem document)
    {
        lock (_lock)
        {
            if (!_documents.ContainsKey(document.id))
                return false;

            _documents[document.id] = CloneDocument(document);
            return true;
        }
    }

    public bool Delete(string id)
    {
        lock (_lock)
        {
            return _documents.Remove(id);
        }
    }

    private static DocumentItem CloneDocument(DocumentItem document)
    {
        return new DocumentItem
        {
            id = document.id,
            fileName = document.fileName,
            fileSize = document.fileSize,
            mimeType = document.mimeType,
            status = document.status,
            uploadedAt = document.uploadedAt,
            pageCount = document.pageCount,
            tags = [.. document.tags],
            description = document.description,
            extractedText = document.extractedText,
            storageKey = document.storageKey
        };
    }
}
