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

    public ServiceResponse GetPhysicalDeclarationsByUserId(int userId)
    {
        return GetPhysicalDeclarationsByUserIdAction(userId);
    }

    public ServiceResponse GetAllPhysicalDeclarations()
    {
        return GetAllPhysicalDeclarationsAction();
    }
}
