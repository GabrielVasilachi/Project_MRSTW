using MRSTW.Domain.Models.Packages;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPackagesLogic
{
    ServiceResponse ScanPackage(PackageScanRequestDto request);
}