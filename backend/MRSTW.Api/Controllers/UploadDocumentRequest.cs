namespace MRSTW.Api.Controllers;

public class UploadDocumentRequest
{
    public IFormFile File { get; set; } = null!;
    public int UserId { get; set; }
}
