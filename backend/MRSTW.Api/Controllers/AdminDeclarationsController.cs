using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;
using MRSTW.Domain.Models.AdminDeclarations;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/admin-declarations")]
[Authorize(Roles = "Admin")]
public class AdminDeclarationsController : ControllerBase
{
    private readonly IPhysicalDeclarationsLogic _physicalDeclarationsLogic;
    private readonly IBusinessDeclarationsLogic _businessDeclarationsLogic;

    public AdminDeclarationsController()
    {
        var bl = new BusinessLogic();
        _physicalDeclarationsLogic = bl.GetPhysicalDeclarationsLogic();
        _businessDeclarationsLogic = bl.GetBusinessDeclarationsLogic();
    }

    [HttpGet]
    public IActionResult GetDeclarations([FromQuery] string filter = "all")
    {
        var normalized = (filter ?? "all").Trim().ToLowerInvariant();

        if (normalized != "all" && normalized != "physical" && normalized != "legal")
        {
            return BadRequest("Filter invalid. Valori acceptate: all, physical, legal.");
        }

        var declarations = new List<AdminDeclarationResponseDto>();

        if (normalized == "all" || normalized == "physical")
        {
            var response = _physicalDeclarationsLogic.GetAllPhysicalDeclarations();

            if (!response.IsSuccess)
            {
                return BadRequest(response.Message);
            }

            if (response.Data is IEnumerable<AdminDeclarationResponseDto> physical)
            {
                declarations.AddRange(physical);
            }
        }

        if (normalized == "all" || normalized == "legal")
        {
            var response = _businessDeclarationsLogic.GetAllBusinessDeclarations();

            if (!response.IsSuccess)
            {
                return BadRequest(response.Message);
            }

            if (response.Data is IEnumerable<AdminDeclarationResponseDto> business)
            {
                declarations.AddRange(business);
            }
        }

        return Ok(declarations.OrderByDescending(d => d.CreatedAt));
    }

    [HttpPost("{id}/open")]
    public IActionResult OpenDeclaration([FromRoute] int id, [FromBody] AdminDeclarationActionRequestDto? request)
    {
        var action = string.IsNullOrWhiteSpace(request?.Action) ? "open" : request.Action.Trim();

        if (!string.Equals(action, "open", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Actiunea ceruta nu este implementata inca.");
        }

        return Ok(new
        {
            declarationId = id,
            action = action.ToLowerInvariant(),
            success = true
        });
    }
}
