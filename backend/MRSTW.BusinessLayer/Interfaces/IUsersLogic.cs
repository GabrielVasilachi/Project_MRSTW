using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IUsersLogic
{
    ServiceResponse GetUsers();
    ServiceResponse UpdateUser(int userId, UserUpdateRequestDto request);
    ServiceResponse DeleteUser(int userId);
    ServiceResponse RegenerateActivationToken(int userId);
}
