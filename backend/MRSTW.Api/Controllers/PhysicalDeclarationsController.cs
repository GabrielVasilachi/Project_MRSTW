using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.Api.Extensions;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.PhysicalDeclarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/physical-declarations")]
[Authorize]
public class PhysicalDeclarationsController : ControllerBase
{
    private readonly IPhysicalDeclarationsLogic _physicalDeclarationsLogic;

    public PhysicalDeclarationsController()
    {
        var bl = new BusinessLogic();
        _physicalDeclarationsLogic = bl.GetPhysicalDeclarationsLogic();
    }

    [HttpPost]
    public IActionResult CreatePhysicalDeclaration([FromBody] PhysicalDeclarationCreateRequestDto request)
    {
        if (!User.CanAccessUser(request.UserId))
        {
            return Forbid();
        }

        var response = _physicalDeclarationsLogic.CreatePhysicalDeclaration(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetPhysicalDeclarationsByUserId([FromRoute] int userId)
    {
        if (!User.CanAccessUser(userId))
        {
            return Forbid();
        }

        var response = _physicalDeclarationsLogic.GetPhysicalDeclarationsByUserId(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
