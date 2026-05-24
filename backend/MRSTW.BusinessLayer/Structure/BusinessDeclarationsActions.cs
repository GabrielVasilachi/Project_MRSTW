using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.BusinessDeclarations;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.BusinessDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class BusinessDeclarationsActions
{
    private readonly BusinessDeclarationsDbContext _businessDeclarationsContext;
    private readonly UsersDbContext _usersContext;

    public BusinessDeclarationsActions()
    {
        _businessDeclarationsContext = new BusinessDeclarationsDbContext();
        _usersContext = new UsersDbContext();
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

        var declaration = new BusinessDeclarationEntity
        {
            UserId = request.UserId,
            SenderName = request.SenderName.Trim(),
            ProductName = request.ProductName.Trim(),
            ProductURL = request.ProductURL.Trim(),
            TrackingCode = request.TrackingCode.Trim(),
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
            _businessDeclarationsContext.SaveChanges();
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
}
