using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class AuditLogsLogic : AuditLogsActions, IAuditLogsLogic
{
    public ServiceResponse GetAuditLogs()
    {
        return GetAuditLogsAction();
    }
}
