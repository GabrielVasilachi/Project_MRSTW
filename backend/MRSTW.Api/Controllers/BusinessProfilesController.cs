using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.BusinessProfiles;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/business-profiles")]
public class BusinessProfilesController : ControllerBase
{
    private readonly IBusinessProfilesLogic _businessProfilesLogic;

    public BusinessProfilesController()
    {
        var bl = new BusinessLogic();
        _businessProfilesLogic = bl.GetBusinessProfilesLogic();
    }

    [HttpGet("{userId}")]
    public IActionResult GetBusinessProfileByUserId([FromRoute] int userId)
    {
        var response = _businessProfilesLogic.GetBusinessProfileByUserId(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPut("{userId}")]
    public IActionResult UpdateBusinessProfile([FromRoute] int userId, [FromBody] BusinessProfileUpdateRequestDto request)
    {
        var response = _businessProfilesLogic.UpdateBusinessProfile(userId, request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Message);
    }
}