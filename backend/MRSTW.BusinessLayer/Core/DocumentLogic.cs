using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class DocumentLogic : DocumentActions, IDocumentLogic
{
    public ServiceResponse UploadDocument(int userId, string fileName, string contentType, long fileSize, byte[] fileData)
        => UploadDocumentAction(userId, fileName, contentType, fileSize, fileData);

    public ServiceResponse GetDocumentsByUserId(int userId)
        => GetDocumentsByUserIdAction(userId);

    public ServiceResponse GetDocumentFile(int documentId)
        => GetDocumentFileAction(documentId);

    public ServiceResponse DeleteDocument(int documentId, int userId)
        => DeleteDocumentAction(documentId, userId);
}
