using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Users;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUsersLogic _usersLogic;

    public UsersController()
    {
        var bl = new BusinessLogic();
        _usersLogic = bl.GetUsersLogic();
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        var response = _usersLogic.GetUsers();

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{userId}")]
    public IActionResult UpdateUser([FromRoute] int userId, [FromBody] UserUpdateRequestDto request)
    {
        var response = _usersLogic.UpdateUser(userId, request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    [HttpDelete("{userId}")]
    public IActionResult DeleteUser([FromRoute] int userId)
    {
        var response = _usersLogic.DeleteUser(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }

    [HttpPost("{userId}/activation-token/regenerate")]
    public IActionResult RegenerateActivationToken([FromRoute] int userId)
    {
        var response = _usersLogic.RegenerateActivationToken(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
