using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.BusinessDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class BusinessDeclarationsLogic : BusinessDeclarationsActions, IBusinessDeclarationsLogic
{
    public ServiceResponse CreateBusinessDeclaration(BusinessDeclarationCreateRequestDto request)
    {
        return CreateBusinessDeclarationAction(request);
    }

    public ServiceResponse GetBusinessDeclarationsByUserId(int userId)
    {
        return GetBusinessDeclarationsByUserIdAction(userId);
    }

    public ServiceResponse GetAllBusinessDeclarations()
    {
        return GetAllBusinessDeclarationsAction();
    }
}
