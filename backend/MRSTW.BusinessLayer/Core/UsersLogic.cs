using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Core;

public class UsersLogic : UsersActions, IUsersLogic
{
    public ServiceResponse CreateUser(UserCreateRequestDto request)
    {
        return CreateUserAction(request);
    }
}