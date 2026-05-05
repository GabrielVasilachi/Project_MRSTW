using MRSTW.BusinessLayer.Security;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Models.BusinessProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class BusinessProfilesActions
{
    private readonly BusinessProfilesDbContext _businessProfilesContext;
    private readonly UsersDbContext _usersContext;
    private readonly PackagesDbContext _packagesContext;

    public BusinessProfilesActions()
    {
        _businessProfilesContext = new BusinessProfilesDbContext();
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
    }

    public ServiceResponse GetBusinessProfileByUserIdAction(int userId)
    {
        var profile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "BusinessProfile nu a fost gasit."
            };
        }

        var response = new BusinessProfileResponseDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            CompanyName = profile.CompanyName,
            PhoneNumber = profile.PhoneNumber,
            IdnoCode = profile.IdnoCode,
            LocationAdress = profile.LocationAdress,
            TvaCode = profile.TvaCode,
            Email = profile.Email,
            ContactPerson = profile.ContactPerson,
            ResponsiblePerson = profile.ResponsiblePerson,
            EoriCode = profile.EoriCode
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response
        };
    }

    public ServiceResponse UpdateBusinessProfileAction(int userId, BusinessProfileUpdateRequestDto request, bool requirePassword = true)
    {
        var profile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "BusinessProfile nu a fost gasit."
            };
        }

        if (string.IsNullOrWhiteSpace(request.CompanyName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "CompanyName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        var user = _usersContext.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu a fost gasit."
            };
        }

        if (requirePassword && string.IsNullOrWhiteSpace(request.Password))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Password este obligatorie."
            };
        }

        var requiresHashUpdate = false;

        if (requirePassword && !PasswordHashService.VerifyPassword(user.PasswordHash, request.Password, out requiresHashUpdate))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Parola este incorecta."
            };
        }

        var updatedPhoneNumber = request.PhoneNumber.Trim();
        var existingUserWithPhoneNumber = _usersContext.Users
            .FirstOrDefault(u => u.PhoneNumber == updatedPhoneNumber && u.Id != user.Id);

        if (existingUserWithPhoneNumber != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un utilizator cu acest numar de telefon deja exista."
            };
        }

        var normalizedCompanyName = request.CompanyName.Trim();
        var normalizedContactPerson = string.IsNullOrWhiteSpace(request.ContactPerson)
            ? null
            : request.ContactPerson.Trim();
        var normalizedEmail = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var normalizedLocationAdress = string.IsNullOrWhiteSpace(request.LocationAdress)
            ? null
            : request.LocationAdress.Trim();
        var normalizedFullName = normalizedContactPerson ?? normalizedCompanyName;

        profile.CompanyName = normalizedCompanyName;
        profile.PhoneNumber = updatedPhoneNumber;
        profile.IdnoCode = string.IsNullOrWhiteSpace(request.IdnoCode)
            ? null
            : request.IdnoCode.Trim();
        profile.LocationAdress = normalizedLocationAdress;
        profile.TvaCode = string.IsNullOrWhiteSpace(request.TvaCode) ? null : request.TvaCode.Trim();
        profile.Email = normalizedEmail;
        profile.ContactPerson = normalizedContactPerson;
        profile.ResponsiblePerson = string.IsNullOrWhiteSpace(request.ResponsiblePerson)
            ? null
            : request.ResponsiblePerson.Trim();
        profile.EoriCode = string.IsNullOrWhiteSpace(request.EoriCode) ? null : request.EoriCode.Trim();

        user.FullName = normalizedFullName;
        user.PhoneNumber = updatedPhoneNumber;
        user.Email = normalizedEmail;

        if (requiresHashUpdate)
        {
            user.PasswordHash = PasswordHashService.HashPassword(request.Password);
        }

        var packages = _packagesContext.Packages.Where(p => p.UserId == user.Id).ToList();

        foreach (var package in packages)
        {
            package.FullName = normalizedFullName;
            package.PhoneNumber = updatedPhoneNumber;
            package.CompanyName = normalizedCompanyName;
            package.ContactPerson = normalizedContactPerson;

            if (!string.IsNullOrWhiteSpace(normalizedLocationAdress))
            {
                package.LocationAdress = normalizedLocationAdress;
            }
        }

        try
        {
            _businessProfilesContext.SaveChanges();
            _usersContext.SaveChanges();
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
            Message = "BusinessProfile a fost actualizat cu succes."
        };
    }
}
