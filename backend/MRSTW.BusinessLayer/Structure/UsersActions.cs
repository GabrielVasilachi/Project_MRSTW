using MRSTW.DataAccessLayer.Context;
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

    public ServiceResponse GetUsersAction()
    {
        try
        {
            var users = _usersContext.Users
                .OrderBy(u => u.Id)
                .Select(user => new UserResponseDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Email = user.Email,
                    RoleEnum = user.RoleEnum,
                    IsTemporary = user.IsTemporary,
                    IsPhoneConfirmed = user.IsPhoneConfirmed,
                    CreatedAt = user.CreatedAt
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = users
            };
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }
    }
}
