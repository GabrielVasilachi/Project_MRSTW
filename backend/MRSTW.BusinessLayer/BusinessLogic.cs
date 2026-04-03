using MRSTW.BusinessLayer.Core;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IAdminAccountCreationLogic GetAdminAccountCreationLogic()
    {
        return new AdminAccountCreationLogic();
    }

    public IDeclarationLogic GetDeclarationLogic()
    {
        return new DeclarationLogic();
    }
}