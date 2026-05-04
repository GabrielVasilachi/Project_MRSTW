using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRSTW.BusinessLayer;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.Api.Controllers;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Roles = "Admin")]
public class AuditLogsController : ControllerBase
{
    private readonly IAuditLogsLogic _auditLogsLogic;

    public AuditLogsController()
    {
        var bl = new BusinessLogic();
        _auditLogsLogic = bl.GetAuditLogsLogic();
    }

    [HttpGet]
    public IActionResult GetAuditLogs()
    {
        var response = _auditLogsLogic.GetAuditLogs();

        if (!response.IsSuccess)
        {
            return BadRequest(response.Message);
        }

        return Ok(response.Data);
    }
}
