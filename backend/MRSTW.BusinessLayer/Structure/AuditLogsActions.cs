using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.BusinessProfiles;
using MRSTW.Domain.Entities.PhysicalProfiles;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Models.AuditLogs;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class AuditLogsActions
{
    private readonly UsersDbContext _usersContext;
    private readonly DocumentsDbContext _documentsContext;
    private readonly ActivationTokensDbContext _activationTokensContext;
    private readonly PackagesDbContext _packagesContext;
    private readonly BusinessProfilesDbContext _businessProfilesContext;
    private readonly PhysicalProfilesDbContext _physicalProfilesContext;

    public AuditLogsActions()
    {
        _usersContext = new UsersDbContext();
        _documentsContext = new DocumentsDbContext();
        _activationTokensContext = new ActivationTokensDbContext();
        _packagesContext = new PackagesDbContext();
        _businessProfilesContext = new BusinessProfilesDbContext();
        _physicalProfilesContext = new PhysicalProfilesDbContext();
    }

    public ServiceResponse GetAuditLogsAction()
    {
        try
        {
            var users = _usersContext.Users.ToList();
            var usersById = users.ToDictionary(user => user.Id);
            var physicalProfilesByUserId = _physicalProfilesContext.PhysicalProfiles.ToDictionary(profile => profile.UserId);
            var businessProfilesByUserId = _businessProfilesContext.BusinessProfiles.ToDictionary(profile => profile.UserId);
            var auditLogs = new List<AuditLogResponseDto>();

            auditLogs.AddRange(users.Select(user => CreateUserAuditLog(
                user,
                physicalProfilesByUserId.GetValueOrDefault(user.Id),
                businessProfilesByUserId.GetValueOrDefault(user.Id))));

            auditLogs.AddRange(_documentsContext.Documents
                .Select(document => new
                {
                    document.Id,
                    document.UserId,
                    document.FileName,
                    document.ContentType,
                    document.FileSize,
                    document.UploadedAt
                })
                .ToList()
                .Select(document =>
                {
                    usersById.TryGetValue(document.UserId, out var user);
                    physicalProfilesByUserId.TryGetValue(document.UserId, out var physicalProfile);
                    businessProfilesByUserId.TryGetValue(document.UserId, out var businessProfile);

                    return CreateDocumentAuditLog(
                        document.Id,
                        document.UploadedAt,
                        document.UserId,
                        document.FileName,
                        document.ContentType,
                        document.FileSize,
                        user,
                        physicalProfile,
                        businessProfile);
                }));

            auditLogs.AddRange(_activationTokensContext.ActivationTokens
                .ToList()
                .Select(activationToken =>
                {
                    usersById.TryGetValue(activationToken.UserId, out var user);
                    physicalProfilesByUserId.TryGetValue(activationToken.UserId, out var physicalProfile);
                    businessProfilesByUserId.TryGetValue(activationToken.UserId, out var businessProfile);

                    return CreateActivationTokenAuditLog(
                        activationToken.Id,
                        activationToken.CreatedAt,
                        activationToken.UserId,
                        activationToken.ExpiresAt,
                        activationToken.IsUsed,
                        user,
                        physicalProfile,
                        businessProfile);
                }));

            auditLogs.AddRange(_packagesContext.Packages
                .ToList()
                .Select(package =>
                {
                    UserEntity? user = null;
                    PhysicalProfileEntity? physicalProfile = null;
                    BusinessProfileEntity? businessProfile = null;

                    if (package.UserId.HasValue)
                    {
                        usersById.TryGetValue(package.UserId.Value, out user);
                        physicalProfilesByUserId.TryGetValue(package.UserId.Value, out physicalProfile);
                        businessProfilesByUserId.TryGetValue(package.UserId.Value, out businessProfile);
                    }

                    return CreatePackageAuditLog(
                        package.Id,
                        package.CreatedAt,
                        package.UserId,
                        package.TrackingCode,
                        package.Status.ToString(),
                        package.LocationAdress,
                        user,
                        physicalProfile,
                        businessProfile);
                }));

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = auditLogs
                    .OrderByDescending(log => log.Timestamp)
                    .ThenByDescending(log => log.Id)
                    .ToList()
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }
    }

    private static AuditLogResponseDto CreateUserAuditLog(UserEntity user, PhysicalProfileEntity? physicalProfile, BusinessProfileEntity? businessProfile)
    {
        return CreateBaseAuditLog(
            id: $"user-{user.Id}",
            timestamp: user.CreatedAt,
            userId: user.Id,
            user: user,
            action: "Creare utilizator",
            target: $"User #{user.Id}",
            details: BuildUserDetails(user, physicalProfile, businessProfile));
    }

    private static AuditLogResponseDto CreateDocumentAuditLog(
        int documentId,
        DateTime uploadedAt,
        int userId,
        string fileName,
        string contentType,
        long fileSize,
        UserEntity? user,
        PhysicalProfileEntity? physicalProfile,
        BusinessProfileEntity? businessProfile)
    {
        return CreateBaseAuditLog(
            id: $"document-{documentId}",
            timestamp: uploadedAt,
            userId: userId,
            user: user,
            action: "Încărcare document",
            target: fileName,
            details: $"Document #{documentId}, fișier \"{fileName}\", tip {contentType}, dimensiune {FormatFileSize(fileSize)}. {BuildUserDetails(user, physicalProfile, businessProfile)}");
    }

    private static AuditLogResponseDto CreateActivationTokenAuditLog(
        int activationTokenId,
        DateTime createdAt,
        int userId,
        DateTime expiresAt,
        bool isUsed,
        UserEntity? user,
        PhysicalProfileEntity? physicalProfile,
        BusinessProfileEntity? businessProfile)
    {
        return CreateBaseAuditLog(
            id: $"activation-token-{activationTokenId}",
            timestamp: createdAt,
            userId: userId,
            user: user,
            action: "Creare token activare",
            target: $"ActivationToken #{activationTokenId}",
            details: $"Token de activare {(isUsed ? "utilizat" : "neutilizat")}, expiră la {expiresAt:u}. {BuildUserDetails(user, physicalProfile, businessProfile)}");
    }

    private static AuditLogResponseDto CreatePackageAuditLog(
        int packageId,
        DateTime createdAt,
        int? userId,
        string trackingCode,
        string status,
        string locationAddress,
        UserEntity? user,
        PhysicalProfileEntity? physicalProfile,
        BusinessProfileEntity? businessProfile)
    {
        return CreateBaseAuditLog(
            id: $"package-{packageId}",
            timestamp: createdAt,
            userId: userId,
            user: user,
            action: "Scanare colet",
            target: trackingCode,
            details: $"Colet #{packageId}, tracking code {trackingCode}, status {status}, adresă {locationAddress}. {BuildUserDetails(user, physicalProfile, businessProfile)}");
    }

    private static AuditLogResponseDto CreateBaseAuditLog(
        string id,
        DateTime timestamp,
        int? userId,
        UserEntity? user,
        string action,
        string target,
        string details)
    {
        return new AuditLogResponseDto
        {
            Id = id,
            Timestamp = timestamp,
            ActorUserId = userId,
            ActorName = user?.FullName ?? "Sistem",
            ActorRole = user?.RoleEnum.ToString(),
            UserId = userId,
            User = user?.FullName ?? "Utilizator necunoscut",
            Role = user?.RoleEnum.ToString() ?? "Necunoscut",
            Action = action,
            Target = target,
            Details = details,
            UserPhoneNumber = user?.PhoneNumber,
            UserEmail = user?.Email,
            IsTemporary = user?.IsTemporary,
            IsPhoneConfirmed = user?.IsPhoneConfirmed
        };
    }

    private static string BuildUserDetails(UserEntity? user, PhysicalProfileEntity? physicalProfile, BusinessProfileEntity? businessProfile)
    {
        if (user == null)
        {
            return "Utilizatorul asociat nu mai există.";
        }

        var details = $"Utilizator #{user.Id}: {user.FullName}, telefon {user.PhoneNumber}, rol {user.RoleEnum}, cont {(user.IsTemporary ? "temporar" : "activ")}, telefon {(user.IsPhoneConfirmed ? "confirmat" : "neconfirmat")}";

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            details += $", email {user.Email}";
        }

        if (physicalProfile != null)
        {
            details += $", profil fizic: {physicalProfile.FullName}, adresă {physicalProfile.LocationAddress}";
        }

        if (businessProfile != null)
        {
            details += $", profil business: {businessProfile.CompanyName}";

            if (!string.IsNullOrWhiteSpace(businessProfile.IdnoCode))
            {
                details += $", IDNO {businessProfile.IdnoCode}";
            }
        }

        return details + ".";
    }

    private static string FormatFileSize(long fileSize)
    {
        if (fileSize >= 1024 * 1024)
        {
            return $"{fileSize / 1024d / 1024d:0.##} MB";
        }

        if (fileSize >= 1024)
        {
            return $"{fileSize / 1024d:0.##} KB";
        }

        return $"{fileSize} B";
    }
}
