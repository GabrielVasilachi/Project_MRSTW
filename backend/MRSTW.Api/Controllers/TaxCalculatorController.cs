using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.Domain.Models.TaxCalculator;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/tax-calculator")]
public class TaxCalculatorController : ControllerBase
{
    private readonly MRSTW.BusinessLayer.Interfaces.ITaxCalculatorLogic _taxLogic;

    public TaxCalculatorController()
    {
        var bl = new BusinessLogic();
        _taxLogic = bl.GetTaxCalculatorLogic();
    }

    [HttpPost("calculate")]
    public IActionResult Calculate([FromBody] TaxCalculationRequestDto request)
    {
        var response = _taxLogic.CalculateTaxes(request);

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }

    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var response = _taxLogic.GetCategories();

        if (!response.IsSuccess)
            return BadRequest(response.Message);

        return Ok(response.Data);
    }
}
