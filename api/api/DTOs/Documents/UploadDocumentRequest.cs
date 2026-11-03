
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace CloudDoc.Api.DTOs.Documents;

public class UploadDocumentRequest
{
    [Required]
    public IFormFile? File { get; set; }
}
