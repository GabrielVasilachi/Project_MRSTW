using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IUsersLogic
{
    ServiceResponse CreateUser(UserCreateRequestDto request);
}