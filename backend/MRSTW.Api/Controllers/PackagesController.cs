using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.Packages;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/packages")]
public class PackagesController : ControllerBase
{
    private readonly IPackagesLogic _packagesLogic;

    public PackagesController()
    {
        var bl = new BusinessLogic();
        _packagesLogic = bl.GetPackagesLogic();
    }

    [HttpPost("scan-physical-profiles")]
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