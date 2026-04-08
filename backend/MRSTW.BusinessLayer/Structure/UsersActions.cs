using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Structure;

public class UsersActions
{
    private readonly UsersDbContext _usersContext;

    public UsersActions()
    {
        _usersContext = new UsersDbContext();
    }

    public ServiceResponse CreateUserAction(UserCreateRequestDto request)
    {
        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);

        if (existingUser != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un utilizator cu acest numar de telefon deja exista."
            };
        }

        var user = new UserEntity
        {
            FullName = request.FullName,
            PhoneNumber = request.PhoneNumber,
            Email = request.Email
        };

        try
        {
            _usersContext.Users.Add(user);
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

        var response = new UserResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            RoleEnum = user.RoleEnum,
            IsTemporary = user.IsTemporary
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = "Utilizatorul a fost creat cu succes."
        };
    }
}