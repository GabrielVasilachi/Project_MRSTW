using MRSTW.BusinessLayer.Core;
using MRSTW.BusinessLayer.Interfaces;

namespace MRSTW.BusinessLayer;

public class BusinessLogic
{
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

    public IDocumentLogic GetDocumentLogic()
    {
        return new DocumentLogic();
    }
}