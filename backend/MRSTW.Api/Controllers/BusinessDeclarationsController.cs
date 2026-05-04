using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.Api.Extensions;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.BusinessDeclarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/business-declarations")]
[Authorize]
public class BusinessDeclarationsController : ControllerBase
{
    private readonly IBusinessDeclarationsLogic _businessDeclarationsLogic;

    public BusinessDeclarationsController()
    {
        var bl = new BusinessLogic();
        _businessDeclarationsLogic = bl.GetBusinessDeclarationsLogic();
    }

    [HttpPost]
    public IActionResult CreateBusinessDeclaration([FromBody] BusinessDeclarationCreateRequestDto request)
    {
        if (!User.CanAccessUser(request.UserId))
        {
            return Forbid();
        }

        var response = _businessDeclarationsLogic.CreateBusinessDeclaration(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetBusinessDeclarationsByUserId([FromRoute] int userId)
    {
        if (!User.CanAccessUser(userId))
        {
            return Forbid();
        }

        var response = _businessDeclarationsLogic.GetBusinessDeclarationsByUserId(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
