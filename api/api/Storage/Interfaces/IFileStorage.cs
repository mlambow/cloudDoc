
namespace CloudDoc.Api.Storage.Interfaces;

public interface IFileStorage
{
    Task<string> SaveAsync(
        Stream fileStream,
        string fileName,
        CancellationToken cancellationToken = default);

    Task<Stream?> GetAsync(
        string storageKey,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        string storageKey,
        CancellationToken cancellationToken = default);
}