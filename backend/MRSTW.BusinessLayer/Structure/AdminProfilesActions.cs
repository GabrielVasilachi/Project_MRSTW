using MRSTW.DataAccessLayer.Context;
using MRSTW.BusinessLayer.Security;
using MRSTW.Domain.Entities.AdminProfiles;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.AdminProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class AdminProfilesActions
{
    private readonly AdminProfilesDbContext _adminProfilesContext;
    private readonly UsersDbContext _usersContext;

    public AdminProfilesActions()
    {
        _adminProfilesContext = new AdminProfilesDbContext();
        _usersContext = new UsersDbContext();
    }

    public ServiceResponse CreateAdminProfileAction(AdminProfileCreateRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Password este obligatorie."
            };
        }

        var normalizedPhoneNumber = request.PhoneNumber.Trim();
        var passwordHash = PasswordHashService.HashPassword(request.Password);

        var existingAdminProfile = _adminProfilesContext.AdminProfiles
            .FirstOrDefault(a => a.PhoneNumber == normalizedPhoneNumber);

        if (existingAdminProfile != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un admin cu acest numar de telefon deja exista."
            };
        }

        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == normalizedPhoneNumber);

        if (existingUser != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un utilizator cu acest numar de telefon deja exista."
            };
        }

        var adminUser = new UserEntity
        {
            FullName = "Admin",
            PhoneNumber = normalizedPhoneNumber,
            PasswordHash = passwordHash,
            RoleEnum = UserRoleEnum.Admin,
            IsTemporary = false,
            IsPhoneConfirmed = true
        };

        try
        {
            _usersContext.Users.Add(adminUser);
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

        var adminProfile = new AdminProfileEntity
        {
            UserId = adminUser.Id,
            PhoneNumber = normalizedPhoneNumber,
            PasswordHash = passwordHash
        };

        try
        {
            _adminProfilesContext.AdminProfiles.Add(adminProfile);
            _adminProfilesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        var response = new AdminProfileResponseDto
        {
            Id = adminProfile.Id,
            UserId = adminUser.Id,
            PhoneNumber = adminProfile.PhoneNumber,
            RoleEnum = adminUser.RoleEnum
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = "AdminProfile a fost creat cu succes."
        };
    }
}
