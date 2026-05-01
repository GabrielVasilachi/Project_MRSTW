using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;

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
}
