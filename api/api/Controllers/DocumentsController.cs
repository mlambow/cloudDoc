using CloudDoc.Api;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : Controller
{
    //Static in-memory collection acting as repository interface
    private static readonly List<DocumentItem> Documents = new()
    {
        new DocumentItem
        {
            id="doc-101",
            fileName="invoice_october_2026.pdf",
            fileSize="1.2 MB",
            mimeType="application/pdf",
            status="Completed",
            uploadedAt="10 mins ago",
            pageCount=4,
            tags=new List<string> {"Invoice", "Finance", "Accounting"},
            description="Monthly AWS & Azure infrastructure billing invoice",
            extractedText="INVOICE #INV-2026-09\nTotal Amount Due: R1,450.00",
        },
        new DocumentItem
        {
            id="doc-102",
            fileName="vendor_agreement_v2.pdf",
            fileSize="3.4 MB",
            mimeType="application/pdf",
            status="Processing",
            uploadedAt="Just now",
            tags=new List<string> {"Legal", "Contract"},
        }
    };

    //GET: api/documents
    [HttpGet]
    public ActionResult<IEnumerable<DocumentItem>> GetAll()
    {
        if (Documents.Count =< 0)
        {
            return NotFound(new { message = $"You currently have no documents to view." });
        }
        return Ok(Documents);
    }

    //GET: api/documents/{id}
    [HttpGet("{id}")]
    public ActionResult<DocumentItem> GetById(string id)
    {
        var document = Documents.FirstOrDefault(doc => doc.id == id);
        if (document == null)
        {
            return NotFound(new { message = $"Document with ID '{id}' was not found." });
        }
        return Ok(document);
    }

    //POST: api/documents/upload
    [HttpPost("upload")]
    public async Task<ActionResult<DocumentItem>> Upload(IFormFile file)
    {
        if (file == null)
        {
            return BadRequest("No file provided.");
        }

        var newDocument = new DocumentItem
        {
            id =$"doc-{Guid.NewGuid().ToString()}",
            fileName = file.FileName,
            fileSize = $"{Math.Round((double)file.Length / 1024 / 1024, 2)} MB",
            mimeType = file.ContentType,
            status = "Processing",
            uploadedAt = "Just now",
            tags = new List<string> { "Uploaded" },
        };
        Documents.Add(newDocument);

        //Later - trigger Azure Blob and functions
        return CreatedAtAction(nameof(GetById), new { id = newDocument.id }, newDocument);
    }

    // POST: api/documents/upload-batch
    [HttpPost("upload-batch")]
    public async Task<ActionResult<IEnumerable<DocumentItem>>> UploadBatch([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            return BadRequest("No files provided.");
        }

        var uploadedDocuments = new List<DocumentItem>();

        foreach (var file in files)
        {
            if (file.Length > 0)
            {
                var newDoc = new DocumentItem
                {
                    id = $"doc-{Guid.NewGuid().ToString()[..6]}",
                    fileName = file.FileName,
                    fileSize = $"{Math.Round((double)file.Length / 1024 / 1024, 2)} MB",
                    mimeType = file.ContentType,
                    status = "Processing",
                    uploadedAt = "Just now",
                    tags = new List<string> { "BatchUpload" }
                };

                Documents.Add(newDoc);
                uploadedDocuments.Add(newDoc);
            }
        }

        return Ok(uploadedDocuments);
    }

    //PUT: api/documents/{id}
    [HttpPut]
    public IActionResult Update(string id, [FromBody] DocumentItem updateDocument)
    {
        var existingDocument = Documents.FirstOrDefault(document => document.id == id);
        if (existingDocument == null)
        {
            return NotFound();
        }

        existingDocument.fileName = updateDocument.fileName;
        existingDocument.description = updateDocument.description;
        existingDocument.tags = updateDocument.tags;

        return Ok(existingDocument);
    }


    // DELETE: api/documents/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var document = Documents.FirstOrDefault(doc => doc.id == id);

        if (document == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Document not found.",
                documentId = id
            });
        }

        Documents.Remove(document);

        return Ok(new
        {
            success = true,
            message = "Document deleted successfully.",
            documentId = id
        });
    }

}
