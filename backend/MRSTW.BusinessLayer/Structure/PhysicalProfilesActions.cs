using MRSTW.BusinessLayer.Security;
using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class PhysicalProfilesActions
{
    private readonly PhysicalProfilesDbContext _physicalProfilesContext;
    private readonly UsersDbContext _usersContext;
    private readonly PackagesDbContext _packagesContext;

    public PhysicalProfilesActions()
    {
        _physicalProfilesContext = new PhysicalProfilesDbContext();
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
    }

    public ServiceResponse GetPhysicalProfileByUserIdAction(int userId)
    {
        var profile = _physicalProfilesContext.PhysicalProfiles.FirstOrDefault(p => p.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhysicalProfile nu a fost gasit."
            };
        }

        var response = new PhysicalProfileResponseDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            FullName = profile.FullName,
            PhoneNumber = profile.PhoneNumber,
            Email = profile.Email,
            Idnp = profile.Idnp,
            LocationAddress = profile.LocationAddress
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response
        };
    }

    public ServiceResponse UpdatePhysicalProfileAction(int userId, PhysicalProfileUpdateRequestDto request, bool requirePassword = true)
    {
        var profile = _physicalProfilesContext.PhysicalProfiles.FirstOrDefault(p => p.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhysicalProfile nu a fost gasit."
            };
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "FullName este obligatoriu."
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

        if (string.IsNullOrWhiteSpace(request.LocationAddress))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "LocationAddress este obligatoriu."
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

        var normalizedFullName = request.FullName.Trim();
        var normalizedLocationAddress = request.LocationAddress.Trim();
        var normalizedEmail = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var normalizedIdnp = string.IsNullOrWhiteSpace(request.Idnp) ? null : request.Idnp.Trim();

        profile.FullName = normalizedFullName;
        profile.PhoneNumber = updatedPhoneNumber;
        profile.LocationAddress = normalizedLocationAddress;
        profile.Idnp = normalizedIdnp;
        profile.Email = normalizedEmail;

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
            package.LocationAdress = normalizedLocationAddress;
        }

        try
        {
            _physicalProfilesContext.SaveChanges();
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
            Message = "PhysicalProfile a fost actualizat cu succes."
        };
    }
}
