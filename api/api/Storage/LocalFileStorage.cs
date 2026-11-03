
using CloudDoc.Api.Storage.Interfaces;

namespace CloudDoc.Api.Storage;

public class LocalFileStorage : IFileStorage
{
    private readonly string _storageRoot;

    private const string StorageFolder = "documents";

    private static readonly HashSet<string> AllowedExtensions =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ".pdf",
            ".docx"
        };

    public LocalFileStorage(IHostEnvironment environment, IConfiguration configuration)
    {
        var configuredPath = configuration["DocumentStorage:RootPath"];

        _storageRoot = string.IsNullOrWhiteSpace(configuredPath)
            ? Path.Combine(environment.ContentRootPath, "App_Data")
            : Path.IsPathRooted(configuredPath)
                ? configuredPath
                : Path.Combine(environment.ContentRootPath, configuredPath);
    }

    public async Task<string> SaveAsync(
        Stream fileStream,
        string fileName,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(fileStream);

        if (!fileStream.CanRead)
            throw new ArgumentException("The file stream must be readable.");

        var extension = Path.GetExtension(fileName);

        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException("Only PDF and DOCX files are supported.");

        var generatedFileName = $"{Guid.NewGuid():N}{extension}";
        var storageKey = $"{StorageFolder}/{generatedFileName}";

        var directory = Path.Combine(_storageRoot, StorageFolder);
        Directory.CreateDirectory(directory);

        var filePath = Path.Combine(directory, generatedFileName);

        try
        {
            await using var destination = new FileStream(
                filePath,
                FileMode.CreateNew,
                FileAccess.Write,
                FileShare.None,
                bufferSize: 81920,
                options: FileOptions.Asynchronous);

            await fileStream.CopyToAsync(destination, cancellationToken);

            return storageKey;
        }
        catch
        {
            if (File.Exists(filePath))
                File.Delete(filePath);

            throw;
        }
    }

    public Task<Stream?> GetAsync(
        string storageKey,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var filePath = ResolvePath(storageKey);

        if (!File.Exists(filePath))
            return Task.FromResult<Stream?>(null);

        Stream fileStream = new FileStream(
            filePath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            bufferSize: 81920,
            options: FileOptions.Asynchronous);

        return Task.FromResult<Stream?>(fileStream);
    }

    public Task DeleteAsync(
        string storageKey,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var filePath = ResolvePath(storageKey);

        if (File.Exists(filePath))
            File.Delete(filePath);

        return Task.CompletedTask;
    }

    private string ResolvePath(string storageKey)
    {
        if (string.IsNullOrWhiteSpace(storageKey))
            throw new ArgumentException("Storage key cannot be empty.");

        var prefix = $"{StorageFolder}/";

        if (!storageKey.StartsWith(prefix, StringComparison.Ordinal))
            throw new ArgumentException("Invalid storage key.");

        var fileName = storageKey[prefix.Length..];

        if (fileName.Contains('/') || fileName.Contains('\\'))
            throw new ArgumentException("Invalid storage key.");

        var extension = Path.GetExtension(fileName);
        var nameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);

        if (!AllowedExtensions.Contains(extension) ||
            !Guid.TryParseExact(nameWithoutExtension, "N", out _))
        {
            throw new ArgumentException("Invalid storage key.");
        }

        return Path.Combine(_storageRoot, StorageFolder, fileName);
    }
}
