using CloudDoc.Api;

namespace CloudDoc.Api.Repositories.Interfaces;

public interface IDocumentRepository
{
    IReadOnlyList<DocumentItem> GetAll();

    DocumentItem? GetById(string id);

    void Add(DocumentItem document);

    bool Update(DocumentItem document);

    bool Delete(string id);
}