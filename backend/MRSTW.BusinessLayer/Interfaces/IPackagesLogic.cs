using MRSTW.Domain.Models.Packages;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPackagesLogic
{
    ServiceResponse ScanPhysicalProfiles(PackageScanPhysicalProfilesRequestDto request);
    ServiceResponse ScanBusinessProfiles(PackageScanBusinessProfilesRequestDto request);
}