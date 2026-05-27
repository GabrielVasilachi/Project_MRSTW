using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.Api.Extensions;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.PhysicalDeclarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/physical-declarations")]
[Authorize(Roles = "Individual,Admin")]
public class PhysicalDeclarationsController : ControllerBase
{
    private readonly IPhysicalDeclarationsLogic _physicalDeclarationsLogic;

    public PhysicalDeclarationsController()
    {
        var bl = new BusinessLogic();
        _physicalDeclarationsLogic = bl.GetPhysicalDeclarationsLogic();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllPhysicalDeclarations()
    {
        var response = _physicalDeclarationsLogic.GetAllPhysicalDeclarations();

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
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

    [HttpPut("{id}")]
    public IActionResult UpdatePhysicalDeclaration([FromRoute] int id, [FromBody] PhysicalDeclarationUpdateRequestDto request)
    {
        var userId = User.GetUserId();

        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var response = _physicalDeclarationsLogic.UpdatePhysicalDeclaration(
            id,
            request,
            userId.Value,
            User.IsInRole(UserRoleEnum.Admin.ToString()));

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpDelete("{id}")]
    public IActionResult DeletePhysicalDeclaration([FromRoute] int id)
    {
        var userId = User.GetUserId();

        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var response = _physicalDeclarationsLogic.DeletePhysicalDeclaration(
            id,
            userId.Value,
            User.IsInRole(UserRoleEnum.Admin.ToString()));

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
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
