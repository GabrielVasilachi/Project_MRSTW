using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/declarations")]
public class DeclarationController: ControllerBase
{
    private readonly IDeclarationLogic _declarationLogic;

    public DeclarationController()
    {
        var bl = new BusinessLogic();
        _declarationLogic  = bl.GetDeclarationLogic();
    }
}