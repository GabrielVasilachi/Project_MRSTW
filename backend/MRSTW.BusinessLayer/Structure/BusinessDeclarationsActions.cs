using Microsoft.EntityFrameworkCore;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.BusinessDeclarations;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.AdminDeclarations;
using MRSTW.Domain.Models.BusinessDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class BusinessDeclarationsActions
{
    private readonly BusinessDeclarationsDbContext _businessDeclarationsContext;
    private readonly UsersDbContext _usersContext;
    private readonly PackagesDbContext _packagesContext;
    private readonly DocumentsDbContext _documentsContext;

    public BusinessDeclarationsActions()
    {
        _businessDeclarationsContext = new BusinessDeclarationsDbContext();
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
        _documentsContext = new DocumentsDbContext();
    }

    public ServiceResponse CreateBusinessDeclarationAction(BusinessDeclarationCreateRequestDto request)
    {
        if (request.UserId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "UserId este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.SenderName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "SenderName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "ProductName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.ProductURL))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "ProductURL este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TrackingCode este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.HSCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "HSCode este obligatoriu."
            };
        }

        if (request.Quantity <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Quantity trebuie sa fie mai mare ca 0."
            };
        }

        if (request.TotalCost < 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TotalCost trebuie sa fie mai mare sau egal cu 0."
            };
        }

        if (!Enum.IsDefined(typeof(CurrencyEnum), request.Currency))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Currency este invalid."
            };
        }

        var user = _usersContext.Users.FirstOrDefault(u => u.Id == request.UserId);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu a fost gasit."
            };
        }

        var normalizedTrackingCode = request.TrackingCode.Trim();
        var packageValidation = ResolvePackageId(request.UserId, request.PackageId, normalizedTrackingCode, out var packageId);

        if (!packageValidation.IsSuccess)
        {
            return packageValidation;
        }

        if (!packageId.HasValue)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declarația trebuie asociată unui colet existent."
            };
        }

        if (_businessDeclarationsContext.BusinessDeclarations.Any(d => d.PackageId == packageId.Value))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Pentru acest colet există deja o declarație."
            };
        }

        var declaration = new BusinessDeclarationEntity
        {
            UserId = request.UserId,
            PackageId = packageId,
            SenderName = request.SenderName.Trim(),
            ProductName = request.ProductName.Trim(),
            ProductURL = request.ProductURL.Trim(),
            TrackingCode = normalizedTrackingCode,
            HSCode = request.HSCode.Trim(),
            Category = request.Category,
            Quantity = request.Quantity,
            TotalCost = request.TotalCost,
            Currency = request.Currency,
            Status = DeclarationStatus.UnderReview
        };

        try
        {
            _businessDeclarationsContext.BusinessDeclarations.Add(declaration);
            UpdatePackageStatus(packageId.Value, PackageStatusEnum.InReview);
            _businessDeclarationsContext.SaveChanges();
            _packagesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        var response = new BusinessDeclarationResponseDto
        {
            Id = declaration.Id,
            UserId = declaration.UserId,
            PackageId = declaration.PackageId,
            SenderName = declaration.SenderName,
            ProductName = declaration.ProductName,
            ProductURL = declaration.ProductURL,
            TrackingCode = declaration.TrackingCode,
            HSCode = declaration.HSCode,
            Category = declaration.Category,
            Quantity = declaration.Quantity,
            TotalCost = declaration.TotalCost,
            Currency = declaration.Currency,
            Status = declaration.Status,
            CreatedAt = declaration.CreatedAt
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = "BusinessDeclaration a fost creata cu succes."
        };
    }

    public ServiceResponse GetAllBusinessDeclarationsAction()
    {
        var declarations = _businessDeclarationsContext.BusinessDeclarations
            .Include(d => d.User)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new AdminDeclarationResponseDto
            {
                Id = d.Id,
                DeclarationType = "legal",
                PersonType = "business",
                UserId = d.UserId,
                PackageId = d.PackageId,
                User = new AdminDeclarationUserInfoDto
                {
                    Id = d.UserId,
                    FullName = d.User.FullName,
                    Email = d.User.Email,
                    PhoneNumber = d.User.PhoneNumber
                },
                ProductName = d.ProductName,
                ProductURL = d.ProductURL,
                TrackingCode = d.TrackingCode,
                SenderName = d.SenderName,
                HsCode = d.HSCode,
                Category = d.Category,
                Quantity = d.Quantity,
                TotalCost = d.TotalCost,
                Currency = d.Currency,
                Status = d.Status,
                CreatedAt = d.CreatedAt,
                Review = null
            })
            .ToList();

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = declarations
        };
    }

    public ServiceResponse GetBusinessDeclarationsByUserIdAction(int userId)
    {
        if (userId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "UserId este obligatoriu."
            };
        }

        var declarations = _businessDeclarationsContext.BusinessDeclarations
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new BusinessDeclarationResponseDto
            {
                Id = d.Id,
                UserId = d.UserId,
                PackageId = d.PackageId,
                SenderName = d.SenderName,
                ProductName = d.ProductName,
                ProductURL = d.ProductURL,
                TrackingCode = d.TrackingCode,
                HSCode = d.HSCode,
                Category = d.Category,
                Quantity = d.Quantity,
                TotalCost = d.TotalCost,
                Currency = d.Currency,
                Status = d.Status,
                CreatedAt = d.CreatedAt
            })
            .ToList();

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = declarations
        };
    }

    public ServiceResponse UpdateBusinessDeclarationAction(int declarationId, BusinessDeclarationUpdateRequestDto request, int userId, bool isAdmin)
    {
        if (declarationId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "DeclarationId este obligatoriu."
            };
        }

        var declaration = _businessDeclarationsContext.BusinessDeclarations.FirstOrDefault(d => d.Id == declarationId);

        if (declaration == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declaratia nu a fost gasita."
            };
        }

        if (!isAdmin && declaration.UserId != userId)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Nu aveti acces la aceasta declaratie."
            };
        }

        if (string.IsNullOrWhiteSpace(request.SenderName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "SenderName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.ProductName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "ProductName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.ProductURL))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "ProductURL este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TrackingCode este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.HSCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "HSCode este obligatoriu."
            };
        }

        if (request.Quantity <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Quantity trebuie sa fie mai mare ca 0."
            };
        }

        if (request.TotalCost < 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TotalCost trebuie sa fie mai mare sau egal cu 0."
            };
        }

        if (!Enum.IsDefined(typeof(CurrencyEnum), request.Currency))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Currency este invalid."
            };
        }

        if (!Enum.IsDefined(typeof(DeclarationStatus), request.Status))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Status este invalid."
            };
        }

        if (isAdmin && request.Status == DeclarationStatus.Approved && !HasDeclarationDocuments(declaration.Id))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declarația nu poate fi aprobată fără documente atașate."
            };
        }

        var normalizedTrackingCode = request.TrackingCode.Trim();
        var packageValidation = ResolvePackageId(declaration.UserId, request.PackageId, normalizedTrackingCode, out var packageId);

        if (!packageValidation.IsSuccess)
        {
            return packageValidation;
        }

        if (!packageId.HasValue && declaration.PackageId.HasValue)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declarația nu poate fi dezasociată de coletul existent."
            };
        }

        if (packageId.HasValue && _businessDeclarationsContext.BusinessDeclarations.Any(d => d.PackageId == packageId.Value && d.Id != declaration.Id))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Pentru acest colet există deja o declarație."
            };
        }

        declaration.PackageId = packageId;
        declaration.SenderName = request.SenderName.Trim();
        declaration.ProductName = request.ProductName.Trim();
        declaration.ProductURL = request.ProductURL.Trim();
        declaration.TrackingCode = normalizedTrackingCode;
        declaration.HSCode = request.HSCode.Trim();
        declaration.Category = request.Category;
        declaration.Quantity = request.Quantity;
        declaration.TotalCost = request.TotalCost;
        declaration.Currency = request.Currency;
        if (isAdmin)
        {
            declaration.Status = request.Status;
        }

        try
        {
            if (packageId.HasValue)
            {
                UpdatePackageStatus(packageId.Value, MapDeclarationStatusToPackageStatus(declaration.Status));
            }
            _businessDeclarationsContext.SaveChanges();
            _packagesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = new BusinessDeclarationResponseDto
            {
                Id = declaration.Id,
                UserId = declaration.UserId,
                PackageId = declaration.PackageId,
                SenderName = declaration.SenderName,
                ProductName = declaration.ProductName,
                ProductURL = declaration.ProductURL,
                TrackingCode = declaration.TrackingCode,
                HSCode = declaration.HSCode,
                Category = declaration.Category,
                Quantity = declaration.Quantity,
                TotalCost = declaration.TotalCost,
                Currency = declaration.Currency,
                Status = declaration.Status,
                CreatedAt = declaration.CreatedAt
            },
            Message = "BusinessDeclaration a fost modificata cu succes."
        };
    }

    public ServiceResponse DeleteBusinessDeclarationAction(int declarationId, int userId, bool isAdmin)
    {
        if (declarationId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "DeclarationId este obligatoriu."
            };
        }

        var declaration = _businessDeclarationsContext.BusinessDeclarations.FirstOrDefault(d => d.Id == declarationId);

        if (declaration == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declaratia nu a fost gasita."
            };
        }

        if (!isAdmin && declaration.UserId != userId)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Nu aveti acces la aceasta declaratie."
            };
        }

        try
        {
            var documents = _documentsContext.Documents
                .Where(document => document.DeclarationId == declaration.Id && document.DeclarationType == "business")
                .ToList();

            _documentsContext.Documents.RemoveRange(documents);
            _businessDeclarationsContext.BusinessDeclarations.Remove(declaration);
            if (declaration.PackageId.HasValue)
            {
                UpdatePackageStatus(declaration.PackageId.Value, PackageStatusEnum.Pending);
            }
            _documentsContext.SaveChanges();
            _businessDeclarationsContext.SaveChanges();
            _packagesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "BusinessDeclaration a fost stearsa cu succes."
        };
    }

    private ServiceResponse ResolvePackageId(int userId, int? requestPackageId, string trackingCode, out int? packageId)
    {
        packageId = null;

        if (requestPackageId.HasValue && requestPackageId.Value <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PackageId este invalid."
            };
        }

        if (requestPackageId.HasValue)
        {
            var package = _packagesContext.Packages.FirstOrDefault(p => p.Id == requestPackageId.Value);

            if (package == null)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Coletul nu a fost gasit."
                };
            }

            if (package.UserId != userId)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "Coletul nu apartine utilizatorului."
                };
            }

            if (!string.Equals(package.TrackingCode, trackingCode, StringComparison.OrdinalIgnoreCase))
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = "TrackingCode nu corespunde coletului selectat."
                };
            }

            packageId = package.Id;

            return new ServiceResponse
            {
                IsSuccess = true
            };
        }

        var matchedPackage = _packagesContext.Packages
            .FirstOrDefault(p => p.UserId == userId && p.TrackingCode == trackingCode);

        packageId = matchedPackage?.Id;

        return new ServiceResponse
        {
            IsSuccess = true
        };
    }

    private void UpdatePackageStatus(int packageId, PackageStatusEnum status)
    {
        var package = _packagesContext.Packages.FirstOrDefault(p => p.Id == packageId);

        if (package != null)
        {
            package.Status = status;
        }
    }

    private bool HasDeclarationDocuments(int declarationId)
    {
        return _documentsContext.Documents.Any(document =>
            document.DeclarationId == declarationId &&
            document.DeclarationType == "business");
    }

    private PackageStatusEnum MapDeclarationStatusToPackageStatus(DeclarationStatus status)
    {
        return status switch
        {
            DeclarationStatus.Approved => PackageStatusEnum.Released,
            DeclarationStatus.Rejected => PackageStatusEnum.Rejected,
            DeclarationStatus.PendingDocuments => PackageStatusEnum.WaitingForDocuments,
            _ => PackageStatusEnum.InReview
        };
    }
}
