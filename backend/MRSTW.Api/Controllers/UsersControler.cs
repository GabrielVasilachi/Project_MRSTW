using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Users;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUsersLogic _usersLogic;

    public UsersController()
    {
        var bl = new BusinessLogic();
        _usersLogic = bl.GetUsersLogic();
    }

    [HttpPost]
    public IActionResult CreateUser([FromBody] UserCreateRequestDto request)
    {
        var response = _usersLogic.CreateUser(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}