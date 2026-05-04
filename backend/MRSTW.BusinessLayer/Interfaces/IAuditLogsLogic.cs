using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IAuditLogsLogic
{
    ServiceResponse GetAuditLogs();
}
