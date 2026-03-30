using MRSTW.BusinessLayer.Core;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public IDeclarationLogic GetDeclarationLogic()
    {
        return new DeclarationLogic();
    }
}