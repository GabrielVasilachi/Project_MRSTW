using MRSTW.Domain.Models.Declarations;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class DeclarationActions
{
    private static int _nextId = 1;
    private static readonly List<DeclarationInfoDto> Declarations = new();

    public ServiceResponse CreateDeclarationAction(DeclarationCreateDto declaration)
    {
        if (declaration == null || string.IsNullOrWhiteSpace(declaration.Name) || string.IsNullOrWhiteSpace(declaration.Description))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Date invalide pentru declaratie."
            };
        }

        var declarationInfo = new DeclarationInfoDto
        {
            Id = _nextId++,
            Name = declaration.Name,
            Description = declaration.Description
        };

        Declarations.Add(declarationInfo);

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Declaratia a fost creata.",
            Data = declarationInfo
        };
    }
    
    public ServiceResponse GetDeclarationByIdAction(int id)
    {
        var declaration = Declarations.Find(item => item.Id == id);

        if (declaration == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Declaratia nu a fost gasita."
            };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = declaration
        };
    }
    
    public ServiceResponse GetDeclarationListAction()
    {
        return new ServiceResponse
        {
            IsSuccess = true,
            Data = Declarations
        };
    }
}