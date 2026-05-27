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

    public ServiceResponse UpdateBusinessDeclaration(int declarationId, BusinessDeclarationUpdateRequestDto request, int userId, bool isAdmin)
    {
        return UpdateBusinessDeclarationAction(declarationId, request, userId, isAdmin);
    }

    public ServiceResponse DeleteBusinessDeclaration(int declarationId, int userId, bool isAdmin)
    {
        return DeleteBusinessDeclarationAction(declarationId, userId, isAdmin);
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
