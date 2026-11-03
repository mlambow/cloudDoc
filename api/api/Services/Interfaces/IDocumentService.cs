using CloudDoc.Api.DTOs.Documents;

namespace CloudDoc.Api.Services.Interfaces;

public interface IDocumentService
{
    PagedResponse<DocumentResponse> GetAll(
        DocumentQueryParameters query);

    DocumentResponse? GetById(string id);

    Task<DocumentResponse> UploadAsync(
        IFormFile file, 
        CancellationToken cancellationToken = default
    );

    List<DocumentResponse> UploadBatch(List<IFormFile> files);

    DocumentResponse? Update(
        string id,
        UpdateDocumentRequest request
    );

    bool Delete(string id);
}