using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.AdminProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class AdminProfilesLogic : AdminProfilesActions, IAdminProfilesLogic
{
    public ServiceResponse CreateAdminProfile(AdminProfileCreateRequestDto request)
    {
        return CreateAdminProfileAction(request);
    }
}
