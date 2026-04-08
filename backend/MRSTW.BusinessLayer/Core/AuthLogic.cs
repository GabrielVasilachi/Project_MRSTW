using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Auth;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class AuthLogic : AuthActions, IAuthLogic
{
    public ServiceResponse Login(AuthLoginRequestDto request)
    {
        return LoginAction(request);
    }

    public ServiceResponse SetPassword(AuthSetPasswordRequestDto request)
    {
        return SetPasswordAction(request);
    }
} 