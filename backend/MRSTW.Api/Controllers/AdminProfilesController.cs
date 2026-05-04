using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.AdminProfiles;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/admin-profiles")]
[Authorize(Roles = "Admin")]
public class AdminProfilesController : ControllerBase
{
    private readonly IAdminProfilesLogic _adminProfilesLogic;

    public AdminProfilesController()
    {
        var bl = new BusinessLogic();
        _adminProfilesLogic = bl.GetAdminProfilesLogic();
    }

    [HttpPost]
    public IActionResult CreateAdminProfile([FromBody] AdminProfileCreateRequestDto request)
    {
        var response = _adminProfilesLogic.CreateAdminProfile(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
