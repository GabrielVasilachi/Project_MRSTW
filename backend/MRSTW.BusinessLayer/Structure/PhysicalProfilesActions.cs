using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class PhysicalProfilesActions
{
    private readonly PhysicalProfilesDbContext _physicalProfilesContext;
    private readonly UsersDbContext _usersContext;

    public PhysicalProfilesActions()
    {
        _physicalProfilesContext = new PhysicalProfilesDbContext();
        _usersContext = new UsersDbContext();
    }

    public ServiceResponse GetPhysicalProfileByPhoneNumberAction(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        var normalizedPhoneNumber = phoneNumber.Trim();

        var user = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == normalizedPhoneNumber);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhysicalProfile nu a fost gasit."
            };
        }

        var profile = _physicalProfilesContext.PhysicalProfiles
            .Where(p => p.UserId == user.Id)
            .FirstOrDefault();

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

    public ServiceResponse UpdatePhysicalProfileByPhoneNumberAction(string phoneNumber, PhysicalProfileUpdateRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        var normalizedPhoneNumber = phoneNumber.Trim();

        var user = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == normalizedPhoneNumber);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhysicalProfile nu a fost gasit."
            };
        }

        var profile = _physicalProfilesContext.PhysicalProfiles.FirstOrDefault(p => p.UserId == user.Id);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhysicalProfile nu a fost gasit."
            };
        }

        var normalizedEmail = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();
        var normalizedIdnp = string.IsNullOrWhiteSpace(request.Idnp) ? null : request.Idnp.Trim();

        profile.Idnp = normalizedIdnp;
        profile.Email = normalizedEmail;
        user.Email = normalizedEmail;

        try
        {
            _physicalProfilesContext.SaveChanges();
            _usersContext.SaveChanges();
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
