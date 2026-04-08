using MRSTW.Domain.Models.Auth;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IAuthLogic
{
    ServiceResponse Login(AuthLoginRequestDto request);
    ServiceResponse SetPassword(AuthSetPasswordRequestDto request);
}