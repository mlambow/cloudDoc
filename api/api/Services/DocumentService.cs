using CloudDoc.Api;
using CloudDoc.Api.DTOs.Documents;
using CloudDoc.Api.Services.Interfaces;
using CloudDoc.Api.Repositories.Interfaces;
using CloudDoc.Api.Storage.Interfaces;

namespace CloudDoc.Api.Services;

public class DocumentService : IDocumentService
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IFileStorage _fileStorage;

    public DocumentService(IDocumentRepository documentRepository, IFileStorage fileStorage)
    {
        _documentRepository = documentRepository;
        _fileStorage = fileStorage;
    }

    // Get all documents with optional filtering and pagination
    public PagedResponse<DocumentResponse> GetAll(
        DocumentQueryParameters query)
    {
        IEnumerable<DocumentItem> documents = _documentRepository.GetAll();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            documents = documents.Where(document =>
                document.fileName.Contains(
                    query.Search,
                    StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            documents = documents.Where(document =>
                document.status.Equals(
                    query.Status,
                    StringComparison.OrdinalIgnoreCase));
        }

        var totalCount = documents.Count();

        var items = documents
            .OrderByDescending(document => document.uploadedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ToResponse)
            .ToList();

        return new PagedResponse<DocumentResponse>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount
        };
    }

    // Get a document by its ID
    public DocumentResponse? GetById(string id)
    {
        var document = _documentRepository.GetById(id);

        return document == null ? null : ToResponse(document);
    }

    // Upload a single document
    public async Task<DocumentResponse> UploadAsync(
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        await using var fileStream = file.OpenReadStream();

        var storageKey = await _fileStorage.SaveAsync(
            fileStream,
            file.FileName,
            cancellationToken);

        var document = new DocumentItem
        {
            id = $"doc-{Guid.NewGuid()}",
            fileName = file.FileName,
            fileSize = file.Length,
            mimeType = file.ContentType,
            status = "Processing",
            uploadedAt = DateTime.UtcNow,
            tags = ["Uploaded"],
            storageKey = storageKey
        };

        try
        {
            _documentRepository.Add(document);
        }
        catch
        {
            await _fileStorage.DeleteAsync(
                storageKey,
                CancellationToken.None);

            throw;
        }

        return ToResponse(document);
    }

    // Upload multiple documents in a batch
    public List<DocumentResponse> UploadBatch(List<IFormFile> files)
    {
        var uploadedDocuments = new List<DocumentResponse>();

        foreach (var file in files)
        {
            if (file.Length <= 0)
                continue;

            var document = new DocumentItem
            {
                id = $"doc-{Guid.NewGuid()}",
                fileName = file.FileName,
                fileSize = file.Length,
                mimeType = file.ContentType,
                status = "Processing",
                uploadedAt = DateTime.UtcNow,
                tags = ["BatchUpload"]
            };

            _documentRepository.Add(document);
            uploadedDocuments.Add(ToResponse(document));
        }

        return uploadedDocuments;
    }

    //Update a document's metadata by its ID
    public DocumentResponse? Update(
        string id,
        UpdateDocumentRequest request)
    {
        var document = _documentRepository.GetById(id);

        if (document == null)
            return null;

        document.fileName = request.FileName;
        document.description = request.Description;
        document.tags = request.Tags;

        var updated = _documentRepository.Update(document);

        if (!updated)
            return null;

        return ToResponse(document);
    }

    //Delete a document by its ID
    public bool Delete(string id)
    {
        return _documentRepository.Delete(id);
    }

    private static DocumentResponse ToResponse(DocumentItem document)
    {
        return new DocumentResponse
        {
            Id = document.id,
            FileName = document.fileName,
            FileSize = document.fileSize,
            MimeType = document.mimeType,
            Status = document.status,
            UploadedAt = document.uploadedAt,
            PageCount = document.pageCount,
            Tags = document.tags,
            Description = document.description
        };
    }
}