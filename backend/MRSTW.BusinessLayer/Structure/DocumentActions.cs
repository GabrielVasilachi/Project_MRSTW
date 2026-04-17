using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Documents;
using MRSTW.Domain.Models.Documents;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class DocumentActions
{
    private readonly DocumentsDbContext _documentsContext;

    public DocumentActions()
    {
        _documentsContext = new DocumentsDbContext();
    }

    public ServiceResponse UploadDocumentAction(int userId, string fileName, string contentType, long fileSize, byte[] fileData)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return new ServiceResponse { IsSuccess = false, Message = "Numele fișierului este obligatoriu." };

        if (fileData == null || fileData.Length == 0)
            return new ServiceResponse { IsSuccess = false, Message = "Fișierul este gol." };

        const long maxSize = 10 * 1024 * 1024; // 10 MB
        if (fileSize > maxSize)
            return new ServiceResponse { IsSuccess = false, Message = "Fișierul depășește limita de 10 MB." };

        var document = new DocumentEntity
        {
            UserId = userId,
            FileName = fileName.Trim(),
            ContentType = contentType,
            FileSize = fileSize,
            FileData = fileData,
            UploadedAt = DateTime.UtcNow
        };

        try
        {
            _documentsContext.Documents.Add(document);
            _documentsContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Documentul a fost încărcat cu succes.",
            Data = new DocumentInfoDto
            {
                Id = document.Id,
                UserId = document.UserId,
                FileName = document.FileName,
                ContentType = document.ContentType,
                FileSize = document.FileSize,
                UploadedAt = document.UploadedAt
            }
        };
    }

    public ServiceResponse GetDocumentsByUserIdAction(int userId)
    {
        var documents = _documentsContext.Documents
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.UploadedAt)
            .Select(d => new DocumentInfoDto
            {
                Id = d.Id,
                UserId = d.UserId,
                FileName = d.FileName,
                ContentType = d.ContentType,
                FileSize = d.FileSize,
                UploadedAt = d.UploadedAt
            })
            .ToList();

        return new ServiceResponse { IsSuccess = true, Data = documents };
    }

    public ServiceResponse GetDocumentFileAction(int documentId)
    {
        var document = _documentsContext.Documents.FirstOrDefault(d => d.Id == documentId);

        if (document == null)
            return new ServiceResponse { IsSuccess = false, Message = "Documentul nu a fost găsit." };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = document
        };
    }

    public ServiceResponse DeleteDocumentAction(int documentId, int userId)
    {
        var document = _documentsContext.Documents.FirstOrDefault(d => d.Id == documentId && d.UserId == userId);

        if (document == null)
            return new ServiceResponse { IsSuccess = false, Message = "Documentul nu a fost găsit." };

        try
        {
            _documentsContext.Documents.Remove(document);
            _documentsContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse { IsSuccess = false, Message = e.Message };
        }

        return new ServiceResponse { IsSuccess = true, Message = "Documentul a fost șters." };
    }
}
