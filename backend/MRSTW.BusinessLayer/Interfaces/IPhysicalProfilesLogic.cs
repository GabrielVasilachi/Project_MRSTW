using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IPhysicalProfilesLogic
{
    ServiceResponse GetPhysicalProfileByPhoneNumber(string phoneNumber);
    ServiceResponse UpdatePhysicalProfileByPhoneNumber(string phoneNumber, PhysicalProfileUpdateRequestDto request);
}
