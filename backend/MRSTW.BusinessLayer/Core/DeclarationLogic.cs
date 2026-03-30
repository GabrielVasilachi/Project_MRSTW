using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Declarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class DeclarationLogic:DeclarationActions, IDeclarationLogic
{
    public ServiceResponse CreateDeclaration(DeclarationCreateDto declaration)
    {
        return CreateDeclarationAction(declaration);
    }
    
    public ServiceResponse GetDeclarationById(int id)
    {
        return GetDeclarationByIdAction(id);
    }
    
    public ServiceResponse GetDeclarationList()
    {
        return GetDeclarationListAction();
    }
}