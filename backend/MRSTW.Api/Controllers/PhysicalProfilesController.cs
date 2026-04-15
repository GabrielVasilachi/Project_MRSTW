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

    [HttpGet("{phoneNumber}")]
    public IActionResult GetPhysicalProfileByPhoneNumber([FromRoute] string phoneNumber)
    {
        var response = _physicalProfilesLogic.GetPhysicalProfileByPhoneNumber(phoneNumber);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{phoneNumber}")]
    public IActionResult UpdatePhysicalProfileByPhoneNumber([FromRoute] string phoneNumber, [FromBody] PhysicalProfileUpdateRequestDto request)
    {
        var response = _physicalProfilesLogic.UpdatePhysicalProfileByPhoneNumber(phoneNumber, request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }
}
