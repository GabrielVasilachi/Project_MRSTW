using MRSTW.Domain.Models.PhysicalDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPhysicalDeclarationsLogic
{
    ServiceResponse CreatePhysicalDeclaration(PhysicalDeclarationCreateRequestDto request);
    ServiceResponse GetPhysicalDeclarationsByUserId(int userId);
}
