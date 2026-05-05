using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPhysicalProfilesLogic
{
    ServiceResponse GetPhysicalProfileByUserId(int userId);
    ServiceResponse UpdatePhysicalProfile(int userId, PhysicalProfileUpdateRequestDto request, bool requirePassword = true);
}
