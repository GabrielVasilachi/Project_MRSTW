using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Accounts;
using MRSTW.Domain.Models.Accounts;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class AdminAccountCreationActions
{
    private static readonly Regex EmailRegex = new("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", RegexOptions.Compiled);
    private readonly UsersDbContext _db;

    public AdminAccountCreationActions()
    {
        _db = new UsersDbContext();
    }

    public ServiceResponse CreateAccountAction(AccountCreateDto account)
    {
        if (account == null)
        {
            return Fail("Date invalide pentru cont.");
        }

        var role = (account.Role ?? string.Empty).Trim().ToLowerInvariant();
        var email = (account.Email ?? string.Empty).Trim().ToLowerInvariant();
        var phoneNumber = (account.PhoneNumber ?? string.Empty).Trim();
        var packageId = (account.PackageId ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(role) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(phoneNumber) || string.IsNullOrWhiteSpace(packageId))
        {
            return Fail("Role, email, numar de telefon si package ID sunt obligatorii.");
        }

        if (!IsRoleValid(role))
        {
            return Fail("Role invalid.");
        }

        if (!EmailRegex.IsMatch(email))
        {
            return Fail("Email invalid.");
        }

        var exists = _db.Accounts.Any(a => a.Email == email);
        if (exists)
        {
            return Fail("Exista deja un cont cu acest email.");
        }

        var entity = new AccountEntity
        {
            Role = role,
            Email = email,
            PhoneNumber = phoneNumber,
            PackageId = packageId
        };

        _db.Accounts.Add(entity);

        try
        {
            _db.SaveChanges();
        }
        catch (DbUpdateException)
        {
            return Fail("Nu am putut salva contul.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Cont creat cu succes.",
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetAccountByIdAction(int id)
    {
        var entity = _db.Accounts.AsNoTracking().FirstOrDefault(a => a.Id == id);
        if (entity == null)
        {
            return Fail("Contul nu a fost gasit.");
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = MapToInfo(entity)
        };
    }

    public ServiceResponse GetAccountListAction()
    {
        var accounts = _db.Accounts.AsNoTracking()
            .Select(a => new AccountInfoDto
            {
                Id = a.Id,
                Role = a.Role,
                Email = a.Email,
                PhoneNumber = a.PhoneNumber,
                PackageId = a.PackageId
            })
            .ToList();

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = accounts
        };
    }

    private static bool IsRoleValid(string role)
    {
        return role == "admin" || role == "business" || role == "individual";
    }

    private static AccountInfoDto MapToInfo(AccountEntity entity)
    {
        return new AccountInfoDto
        {
            Id = entity.Id,
            Role = entity.Role,
            Email = entity.Email,
            PhoneNumber = entity.PhoneNumber,
            PackageId = entity.PackageId
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
