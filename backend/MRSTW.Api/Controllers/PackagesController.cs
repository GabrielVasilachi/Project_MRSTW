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

    [HttpPost("scan")]
    public IActionResult ScanPackage([FromBody] PackageScanRequestDto request)
    {
        var response = _packagesLogic.ScanPackage(request);

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}