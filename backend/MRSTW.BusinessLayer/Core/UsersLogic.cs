using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class UsersLogic : UsersActions, IUsersLogic
{
    public ServiceResponse GetUsers()
    {
        return GetUsersAction();
    }
}
