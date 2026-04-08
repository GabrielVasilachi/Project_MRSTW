using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.Packages;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class PackagesLogic : PackagesActions, IPackagesLogic
{
    public ServiceResponse ScanPackage(PackageScanRequestDto request)
    {
        return ScanPackageAction(request);
    }
}