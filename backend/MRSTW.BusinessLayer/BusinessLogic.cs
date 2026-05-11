using MRSTW.BusinessLayer.Core;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.BusinessLayer;

public class BusinessLogic
{
    public IAuditLogsLogic GetAuditLogsLogic()
    {
        return new AuditLogsLogic();
    }

    public IAdminProfilesLogic GetAdminProfilesLogic()
    {
        return new AdminProfilesLogic();
    }

    public IUsersLogic GetUsersLogic()
    {
        return new UsersLogic();
    }
    public IPackagesLogic GetPackagesLogic()
    {
        return new PackagesLogic();
    }
    public IAuthLogic GetAuthLogic()
    {
        return new AuthLogic();
    }
    public IBusinessProfilesLogic GetBusinessProfilesLogic()
    {
        return new BusinessProfilesLogic();
    }

    public IPhysicalProfilesLogic GetPhysicalProfilesLogic()
    {
        return new PhysicalProfilesLogic();
    }

    public IPhysicalDeclarationsLogic GetPhysicalDeclarationsLogic()
    {
        return new PhysicalDeclarationsLogic();
    }

    public IBusinessDeclarationsLogic GetBusinessDeclarationsLogic()
    {
        return new BusinessDeclarationsLogic();
    }

    public IDocumentLogic GetDocumentLogic()
    {
        return new DocumentLogic();
    }

    public ITaxCalculatorLogic GetTaxCalculatorLogic()
    {
        return new TaxCalculatorLogic();
    }
}
