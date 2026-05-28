using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.Api.Extensions;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Packages;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/packages")]
[Authorize]
public class PackagesController : ControllerBase
{
    private readonly IPackagesLogic _packagesLogic;

    public PackagesController()
    {
        var bl = new BusinessLogic();
        _packagesLogic = bl.GetPackagesLogic();
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAllPackages()
    {
        var response = _packagesLogic.GetAllPackages();

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetPackagesByUserId([FromRoute] int userId)
    {
        if (!User.CanAccessUser(userId))
        {
            return Forbid();
        }

        var response = _packagesLogic.GetPackagesByUserId(userId);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPost("scan-physical-profiles")]
    [Authorize(Roles = "Admin")]
    public IActionResult ScanPhysicalProfiles([FromBody] PackageScanPhysicalProfilesRequestDto request)
    {
        var response = _packagesLogic.ScanPhysicalProfiles(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }

    [HttpPost("scan-business-profiles")]
    [Authorize(Roles = "Admin")]
    public IActionResult ScanBusinessProfiles([FromBody] PackageScanBusinessProfilesRequestDto request)
    {
        var response = _packagesLogic.ScanBusinessProfiles(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
