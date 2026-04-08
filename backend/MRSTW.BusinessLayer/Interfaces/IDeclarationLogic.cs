using MRSTW.Domain.Models.Declarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IDeclarationLogic
{
    ServiceResponse CreateDeclaration(DeclarationCreateDto declaration);
    ServiceResponse GetDeclarationById(int id);
    ServiceResponse GetDeclarationList();
    ServiceResponse UpdateDeclaration(int id, DeclarationUpdateDto declaration);
    ServiceResponse DeleteDeclaration(int id);
}