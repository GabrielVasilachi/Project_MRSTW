using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Core;

public class UsersLogic : UsersActions, IUsersLogic
{
    public ServiceResponse GetUsers()
    {
        return GetUsersAction();
    }

    public ServiceResponse UpdateUser(int userId, UserUpdateRequestDto request)
    {
        return UpdateUserAction(userId, request);
    }

    public ServiceResponse RegenerateActivationToken(int userId)
    {
        return RegenerateActivationTokenAction(userId);
    }
}
