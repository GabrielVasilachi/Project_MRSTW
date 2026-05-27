using MRSTW.Domain.Models.PhysicalDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPhysicalDeclarationsLogic
{
    ServiceResponse CreatePhysicalDeclaration(PhysicalDeclarationCreateRequestDto request);
    ServiceResponse UpdatePhysicalDeclaration(int declarationId, PhysicalDeclarationUpdateRequestDto request, int userId, bool isAdmin);
    ServiceResponse DeletePhysicalDeclaration(int declarationId, int userId, bool isAdmin);
    ServiceResponse GetPhysicalDeclarationsByUserId(int userId);
    ServiceResponse GetAllPhysicalDeclarations();
}
