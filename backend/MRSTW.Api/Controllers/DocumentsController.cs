using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Entities.Documents;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/documents")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentLogic _documentLogic;

    public DocumentsController()
    {
        var bl = new BusinessLogic();
        _documentLogic = bl.GetDocumentLogic();
    }

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] UploadDocumentRequest request)
    {
        var file = request.File;
        var userId = request.UserId;

        if (file == null || file.Length == 0)
            return BadRequest("Niciun fișier selectat.");

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var response = _documentLogic.UploadDocument(userId, file.FileName, file.ContentType, file.Length, bytes);

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetByUser([FromRoute] int userId)
    {
        var response = _documentLogic.GetDocumentsByUserId(userId);
        return Ok(response.Data);
    }

    [HttpGet("{id}/file")]
    public IActionResult GetFile([FromRoute] int id)
    {
        var response = _documentLogic.GetDocumentFile(id);

        if (!response.IsSuccess)
            return NotFound(response.Message);

        var document = (DocumentEntity)response.Data!;
        return File(document.FileData, document.ContentType, document.FileName);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete([FromRoute] int id, [FromQuery] int userId)
    {
        var response = _documentLogic.DeleteDocument(id, userId);

        if (!response.IsSuccess)
            return NotFound(response.Message);

        return Ok(response.Message);
    }
}
