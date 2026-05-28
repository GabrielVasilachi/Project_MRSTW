using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Documents;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.Documents;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class DocumentActions
{
    private readonly DocumentsDbContext _documentsContext;
    private readonly PhysicalDeclarationsDbContext _physicalDeclarationsContext;
    private readonly BusinessDeclarationsDbContext _businessDeclarationsContext;

    public DocumentActions()
    {
        _documentsContext = new DocumentsDbContext();
        _physicalDeclarationsContext = new PhysicalDeclarationsDbContext();
        _businessDeclarationsContext = new BusinessDeclarationsDbContext();
    }

    public ServiceResponse UploadDocumentAction(int userId, int declarationId, string fileName, string contentType, long fileSize, byte[] fileData)
    {
        if (declarationId <= 0)
            return new ServiceResponse { IsSuccess = false, Message = "DeclarationId este obligatoriu." };

        if (string.IsNullOrWhiteSpace(fileName))
            return new ServiceResponse { IsSuccess = false, Message = "Numele fișierului este obligatoriu." };

        if (fileData == null || fileData.Length == 0)
            return new ServiceResponse { IsSuccess = false, Message = "Fișierul este gol." };

        const long maxSize = 10 * 1024 * 1024; // 10 MB
        if (fileSize > maxSize)
            return new ServiceResponse { IsSuccess = false, Message = "Fișierul depășește limita de 10 MB." };

        var declarationType = ResolveDeclarationType(userId, declarationId);

        if (declarationType == null)
            return new ServiceResponse { IsSuccess = false, Message = "Declaratia nu a fost gasita pentru acest utilizator." };

        var document = new DocumentEntity
        {
            UserId = userId,
            DeclarationId = declarationId,
            DeclarationType = declarationType,
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
                DeclarationId = document.DeclarationId,
                DeclarationType = document.DeclarationType,
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
                DeclarationId = d.DeclarationId,
                DeclarationType = d.DeclarationType,
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

    public ServiceResponse GetAllDocumentsAction()
    {
        using var usersContext = new UsersDbContext();

        var users = usersContext.Users
            .Select(u => new { u.Id, u.FullName, u.RoleEnum })
            .ToList()
            .ToDictionary(u => u.Id);

        var documents = _documentsContext.Documents
            .OrderByDescending(d => d.UploadedAt)
            .Select(d => new { d.Id, d.UserId, d.DeclarationId, d.DeclarationType, d.FileName, d.ContentType, d.FileSize, d.UploadedAt })
            .ToList();

        var result = documents.Select(d =>
        {
            users.TryGetValue(d.UserId, out var user);
            return new DocumentInfoWithUserDto
            {
                Id = d.Id,
                UserId = d.UserId,
                DeclarationId = d.DeclarationId,
                DeclarationType = d.DeclarationType,
                FileName = d.FileName,
                ContentType = d.ContentType,
                FileSize = d.FileSize,
                UploadedAt = d.UploadedAt,
                UserFullName = user?.FullName ?? "Utilizator necunoscut",
                UserRole = user?.RoleEnum switch
                {
                    UserRoleEnum.Admin => "Administrator",
                    UserRoleEnum.Business => "Persoană juridică",
                    UserRoleEnum.Individual => "Persoană fizică",
                    _ => "Necunoscut"
                } ?? "Necunoscut"
            };
        }).ToList();

        return new ServiceResponse { IsSuccess = true, Data = result };
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

    private string? ResolveDeclarationType(int userId, int declarationId)
    {
        var physicalDeclarationExists = _physicalDeclarationsContext.PhysicalDeclarations
            .Any(declaration => declaration.Id == declarationId && declaration.UserId == userId);

        if (physicalDeclarationExists)
            return "physical";

        var businessDeclarationExists = _businessDeclarationsContext.BusinessDeclarations
            .Any(declaration => declaration.Id == declarationId && declaration.UserId == userId);

        if (businessDeclarationExists)
            return "business";

        return null;
    }
}
