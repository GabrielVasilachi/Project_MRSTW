using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.PhysicalDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class PhysicalDeclarationsLogic : PhysicalDeclarationsActions, IPhysicalDeclarationsLogic
{
    public ServiceResponse CreatePhysicalDeclaration(PhysicalDeclarationCreateRequestDto request)
    {
        return CreatePhysicalDeclarationAction(request);
    }

    public ServiceResponse UpdatePhysicalDeclaration(int declarationId, PhysicalDeclarationUpdateRequestDto request, int userId, bool isAdmin)
    {
        return UpdatePhysicalDeclarationAction(declarationId, request, userId, isAdmin);
    }

    public ServiceResponse DeletePhysicalDeclaration(int declarationId, int userId, bool isAdmin)
    {
        return DeletePhysicalDeclarationAction(declarationId, userId, isAdmin);
    }

    public ServiceResponse GetPhysicalDeclarationsByUserId(int userId)
    {
        return GetPhysicalDeclarationsByUserIdAction(userId);
    }

    public ServiceResponse GetAllPhysicalDeclarations()
    {
        return GetAllPhysicalDeclarationsAction();
    }
}
