using Microsoft.AspNetCore.Mvc;

namespace MRSTW.Api.Controllers;


[ApiController]
[Route("api/health")]
public class HealthController:ControllerBase
{
    
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Test");
    }

    [HttpGet("test-500")]
    public IActionResult Test500()
    {
        return StatusCode(500, "Eroare interna simulata pentru test.");
    }
    
}