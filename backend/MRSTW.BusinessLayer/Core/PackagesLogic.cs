using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Packages;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class PackagesLogic : PackagesActions, IPackagesLogic
{
    public ServiceResponse ScanPhysicalProfiles(PackageScanPhysicalProfilesRequestDto request)
    {
        return ScanPhysicalProfilesAction(request);
    }

    public ServiceResponse ScanBusinessProfiles(PackageScanBusinessProfilesRequestDto request)
    {
        return ScanBusinessProfilesAction(request);
    }
}