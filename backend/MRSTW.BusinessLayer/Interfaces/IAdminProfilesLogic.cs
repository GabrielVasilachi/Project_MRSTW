using MRSTW.Domain.Models.AdminProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IAdminProfilesLogic
{
    ServiceResponse CreateAdminProfile(AdminProfileCreateRequestDto request);
}
