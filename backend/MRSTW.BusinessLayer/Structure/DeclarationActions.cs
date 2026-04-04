using Microsoft.EntityFrameworkCore;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Declarations;
using MRSTW.Domain.Models.Declarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class DeclarationActions
{
    private readonly UsersDbContext _db;

    public DeclarationActions()
    {
        _db = new UsersDbContext();
    }

    public ServiceResponse CreateDeclarationAction(DeclarationCreateDto declaration)
    {
        if (declaration == null || string.IsNullOrWhiteSpace(declaration.Name) || string.IsNullOrWhiteSpace(declaration.Description))
        {
            return Fail("Date invalide pentru declaratie.");
        }

        var entity = new DeclarationEntity
        {
            Name = declaration.Name.Trim(),
            Description = declaration.Description.Trim()
        };

        _db.Declarations.Add(entity);

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut salva declaratia.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Declaratia a fost creata.",
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetDeclarationByIdAction(int id)
    {
        var entity = _db.Declarations.AsNoTracking().FirstOrDefault(d => d.Id == id);
        if (entity == null)
        {
            return Fail("Declaratia nu a fost gasita.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetDeclarationListAction()
    {
        var declarations = _db.Declarations.AsNoTracking()
            .Select(d => new DeclarationInfoDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description
            })
            .ToList();

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = declarations
        };
    }

    public ServiceResponse UpdateDeclarationAction(int id, DeclarationUpdateDto declaration)
    {
        if (declaration == null || string.IsNullOrWhiteSpace(declaration.Name) || string.IsNullOrWhiteSpace(declaration.Description))
        {
            return Fail("Date invalide pentru declaratie.");
        }

        var entity = _db.Declarations.FirstOrDefault(d => d.Id == id);
        if (entity == null)
        {
            return Fail("Declaratia nu a fost gasita.");
        }

        entity.Name = declaration.Name.Trim();
        entity.Description = declaration.Description.Trim();

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut actualiza declaratia.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Declaratia a fost actualizata.",
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse DeleteDeclarationAction(int id)
    {
        var entity = _db.Declarations.FirstOrDefault(d => d.Id == id);
        if (entity == null)
        {
            return Fail("Declaratia nu a fost gasita.");
        }

        _db.Declarations.Remove(entity);

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut sterge declaratia.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Declaratia a fost stearsa."
        };
    }

    private static DeclarationInfoDto MapToInfo(DeclarationEntity entity)
    {
        return new DeclarationInfoDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description
        };
    }

    private static ServiceResponse Fail(string message)
    {
        return new ServiceResponse
        {
            IsSuccess = false,
            Message = message
        };
    }
}
