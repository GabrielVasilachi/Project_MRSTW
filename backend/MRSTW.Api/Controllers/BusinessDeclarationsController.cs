using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.Api.Extensions;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.BusinessDeclarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/business-declarations")]
[Authorize(Roles = "Business,Admin")]
public class BusinessDeclarationsController : ControllerBase
{
    private readonly IBusinessDeclarationsLogic _businessDeclarationsLogic;

    public BusinessDeclarationsController()
    {
        var bl = new BusinessLogic();
        _businessDeclarationsLogic = bl.GetBusinessDeclarationsLogic();
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllBusinessDeclarations()
    {
        var response = _businessDeclarationsLogic.GetAllBusinessDeclarations();

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
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

    [HttpPut("{id}")]
    public IActionResult UpdateBusinessDeclaration([FromRoute] int id, [FromBody] BusinessDeclarationUpdateRequestDto request)
    {
        var userId = User.GetUserId();

        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var response = _businessDeclarationsLogic.UpdateBusinessDeclaration(
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
    public IActionResult DeleteBusinessDeclaration([FromRoute] int id)
    {
        var userId = User.GetUserId();

        if (!userId.HasValue)
        {
            return Unauthorized();
        }

        var response = _businessDeclarationsLogic.DeleteBusinessDeclaration(
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
