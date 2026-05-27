using MRSTW.Domain.Models.BusinessDeclarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IBusinessDeclarationsLogic
{
    ServiceResponse CreateBusinessDeclaration(BusinessDeclarationCreateRequestDto request);
    ServiceResponse GetBusinessDeclarationsByUserId(int userId);
    ServiceResponse GetAllBusinessDeclarations();
}
