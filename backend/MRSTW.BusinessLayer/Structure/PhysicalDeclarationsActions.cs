using Microsoft.EntityFrameworkCore;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.PhysicalDeclarations;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.AdminDeclarations;
using MRSTW.Domain.Models.PhysicalDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class PhysicalDeclarationsActions
{
    private readonly PhysicalDeclarationsDbContext _physicalDeclarationsContext;
    private readonly UsersDbContext _usersContext;
    private readonly PackagesDbContext _packagesContext;

    public PhysicalDeclarationsActions()
    {
        _physicalDeclarationsContext = new PhysicalDeclarationsDbContext();
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
    }

    public ServiceResponse CreatePhysicalDeclarationAction(PhysicalDeclarationCreateRequestDto request)
    {
        if (request.UserId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "UserId este obligatoriu."
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

        var declaration = new PhysicalDeclarationEntity
        {
            UserId = request.UserId,
            PackageId = packageId,
            ProductName = request.ProductName.Trim(),
            ProductURL = request.ProductURL.Trim(),
            TrackingCode = normalizedTrackingCode,
            Category = request.Category,
            Quantity = request.Quantity,
            TotalCost = request.TotalCost,
            Currency = request.Currency,
            Status = DeclarationStatus.UnderReview
        };

        try
        {
            _physicalDeclarationsContext.PhysicalDeclarations.Add(declaration);
            _physicalDeclarationsContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        var response = new PhysicalDeclarationResponseDto
        {
            Id = declaration.Id,
            UserId = declaration.UserId,
            PackageId = declaration.PackageId,
            ProductName = declaration.ProductName,
            ProductURL = declaration.ProductURL,
            TrackingCode = declaration.TrackingCode,
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
            Message = "PhysicalDeclaration a fost creata cu succes."
        };
    }

    public ServiceResponse GetAllPhysicalDeclarationsAction()
    {
        var declarations = _physicalDeclarationsContext.PhysicalDeclarations
            .Include(d => d.User)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new AdminDeclarationResponseDto
            {
                Id = d.Id,
                DeclarationType = "physical",
                PersonType = "individual",
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

    public ServiceResponse GetPhysicalDeclarationsByUserIdAction(int userId)
    {
        if (userId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "UserId este obligatoriu."
            };
        }

        var declarations = _physicalDeclarationsContext.PhysicalDeclarations
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .Select(d => new PhysicalDeclarationResponseDto
            {
                Id = d.Id,
                UserId = d.UserId,
                PackageId = d.PackageId,
                ProductName = d.ProductName,
                ProductURL = d.ProductURL,
                TrackingCode = d.TrackingCode,
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

    public ServiceResponse UpdatePhysicalDeclarationAction(int declarationId, PhysicalDeclarationUpdateRequestDto request, int userId, bool isAdmin)
    {
        if (declarationId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "DeclarationId este obligatoriu."
            };
        }

        var declaration = _physicalDeclarationsContext.PhysicalDeclarations.FirstOrDefault(d => d.Id == declarationId);

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

        var normalizedTrackingCode = request.TrackingCode.Trim();
        var packageValidation = ResolvePackageId(declaration.UserId, request.PackageId, normalizedTrackingCode, out var packageId);

        if (!packageValidation.IsSuccess)
        {
            return packageValidation;
        }

        declaration.PackageId = packageId;
        declaration.ProductName = request.ProductName.Trim();
        declaration.ProductURL = request.ProductURL.Trim();
        declaration.TrackingCode = normalizedTrackingCode;
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
            _physicalDeclarationsContext.SaveChanges();
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
            Data = new PhysicalDeclarationResponseDto
            {
                Id = declaration.Id,
                UserId = declaration.UserId,
                PackageId = declaration.PackageId,
                ProductName = declaration.ProductName,
                ProductURL = declaration.ProductURL,
                TrackingCode = declaration.TrackingCode,
                Category = declaration.Category,
                Quantity = declaration.Quantity,
                TotalCost = declaration.TotalCost,
                Currency = declaration.Currency,
                Status = declaration.Status,
                CreatedAt = declaration.CreatedAt
            },
            Message = "PhysicalDeclaration a fost modificata cu succes."
        };
    }

    public ServiceResponse DeletePhysicalDeclarationAction(int declarationId, int userId, bool isAdmin)
    {
        if (declarationId <= 0)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "DeclarationId este obligatoriu."
            };
        }

        var declaration = _physicalDeclarationsContext.PhysicalDeclarations.FirstOrDefault(d => d.Id == declarationId);

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
            _physicalDeclarationsContext.PhysicalDeclarations.Remove(declaration);
            _physicalDeclarationsContext.SaveChanges();
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
            Message = "PhysicalDeclaration a fost stearsa cu succes."
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
}
