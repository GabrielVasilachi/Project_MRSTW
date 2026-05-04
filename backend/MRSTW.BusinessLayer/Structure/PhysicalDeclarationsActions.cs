using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.PhysicalDeclarations;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.PhysicalDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class PhysicalDeclarationsActions
{
    private readonly PhysicalDeclarationsDbContext _physicalDeclarationsContext;
    private readonly UsersDbContext _usersContext;

    public PhysicalDeclarationsActions()
    {
        _physicalDeclarationsContext = new PhysicalDeclarationsDbContext();
        _usersContext = new UsersDbContext();
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

        var declaration = new PhysicalDeclarationEntity
        {
            UserId = request.UserId,
            ProductName = request.ProductName.Trim(),
            ProductURL = request.ProductURL.Trim(),
            TrackingCode = request.TrackingCode.Trim(),
            Quantity = request.Quantity,
            TotalCost = request.TotalCost,
            Currency = request.Currency
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
            ProductName = declaration.ProductName,
            ProductURL = declaration.ProductURL,
            TrackingCode = declaration.TrackingCode,
            Quantity = declaration.Quantity,
            TotalCost = declaration.TotalCost,
            Currency = declaration.Currency,
            CreatedAt = declaration.CreatedAt
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = "PhysicalDeclaration a fost creata cu succes."
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
                ProductName = d.ProductName,
                ProductURL = d.ProductURL,
                TrackingCode = d.TrackingCode,
                Quantity = d.Quantity,
                TotalCost = d.TotalCost,
                Currency = d.Currency,
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
