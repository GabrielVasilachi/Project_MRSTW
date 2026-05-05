using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class PhysicalProfilesLogic : PhysicalProfilesActions, IPhysicalProfilesLogic
{
    public ServiceResponse GetPhysicalProfileByUserId(int userId)
    {
        return GetPhysicalProfileByUserIdAction(userId);
    }

    public ServiceResponse UpdatePhysicalProfile(int userId, PhysicalProfileUpdateRequestDto request, bool requirePassword = true)
    {
        return UpdatePhysicalProfileAction(userId, request, requirePassword);
    }
}
