
using CloudDoc.Api.DTOs.Documents;
using CloudDoc.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    // GET: api/documents
    [HttpGet]
    public ActionResult<PagedResponse<DocumentResponse>> GetAll(
        [FromQuery] DocumentQueryParameters query)
    {
        var documents = _documentService.GetAll(query);

        return Ok(documents);
    }

    // GET: api/documents/{id}
    [HttpGet("{id}")]
    public ActionResult<DocumentResponse> GetById(string id)
    {
        var document = _documentService.GetById(id);

        if (document == null)
        {
            return NotFound(new
            {
                message = $"Document with ID '{id}' was not found."
            });
        }

        return Ok(document);
    }

    // POST: api/documents/upload
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<DocumentResponse>> Upload(
        [FromForm] UploadDocumentRequest request,
        CancellationToken cancellationToken)
    {
        var file = request.File;

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Please provide a non-empty file." });

        var document = await _documentService.UploadAsync(
            file,
            cancellationToken);

        return CreatedAtAction(
            nameof(GetById),
            new { id = document.Id },
            document
        );
    }

    // POST: api/documents/upload-batch
    [HttpPost("upload-batch")]
    [Consumes("multipart/form-data")]
    public ActionResult<List<DocumentResponse>> UploadBatch(
        [FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest(new
            {
                message = "Please provide at least one file."
            });
        }

        if (files.Any(file => file.Length == 0))
        {
            return BadRequest(new
            {
                message = "One or more files are empty."
            });
        }

        var documents = _documentService.UploadBatch(files);

        if (documents.Count == 0)
        {
            return BadRequest(new
            {
                message = "No documents were uploaded."
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            documents);
    }

    // PUT: api/documents/{id}
    [HttpPut("{id}")]
    public ActionResult<DocumentResponse> Update(
        string id,
        [FromBody] UpdateDocumentRequest request)
    {
        var document = _documentService.Update(id, request);

        if (document == null)
        {
            return NotFound(new
            {
                message = $"Document with ID '{id}' was not found."
            });
        }

        return Ok(document);
    }

    // DELETE: api/documents/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var deleted = _documentService.Delete(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = $"Document with ID '{id}' was not found."
            });
        }

        return NoContent();
    }
}
