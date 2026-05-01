using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.PhysicalProfiles;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/physical-profiles")]
public class PhysicalProfilesController : ControllerBase
{
    private readonly IPhysicalProfilesLogic _physicalProfilesLogic;

    public PhysicalProfilesController()
    {
        var bl = new BusinessLogic();
        _physicalProfilesLogic = bl.GetPhysicalProfilesLogic();
    }

    [HttpGet("{userId}")]
    public IActionResult GetPhysicalProfileByUserId([FromRoute] int userId)
    {
        var response = _physicalProfilesLogic.GetPhysicalProfileByUserId(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{userId}")]
    public IActionResult UpdatePhysicalProfile([FromRoute] int userId, [FromBody] PhysicalProfileUpdateRequestDto request)
    {
        var response = _physicalProfilesLogic.UpdatePhysicalProfile(userId, request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }
}
