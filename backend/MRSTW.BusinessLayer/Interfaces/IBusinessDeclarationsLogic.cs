using MRSTW.Domain.Models.BusinessDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IBusinessDeclarationsLogic
{
    ServiceResponse CreateBusinessDeclaration(BusinessDeclarationCreateRequestDto request);
    ServiceResponse UpdateBusinessDeclaration(int declarationId, BusinessDeclarationUpdateRequestDto request, int userId, bool isAdmin);
    ServiceResponse DeleteBusinessDeclaration(int declarationId, int userId, bool isAdmin);
    ServiceResponse GetBusinessDeclarationsByUserId(int userId);
    ServiceResponse GetAllBusinessDeclarations();
}
