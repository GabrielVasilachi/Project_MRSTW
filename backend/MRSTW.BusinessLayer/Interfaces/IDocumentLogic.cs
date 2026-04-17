using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IDocumentLogic
{
    ServiceResponse UploadDocument(int userId, string fileName, string contentType, long fileSize, byte[] fileData);
    ServiceResponse GetDocumentsByUserId(int userId);
    ServiceResponse GetDocumentFile(int documentId);
    ServiceResponse DeleteDocument(int documentId, int userId);
}
