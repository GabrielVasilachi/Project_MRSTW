using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.PhysicalProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class PhysicalProfilesLogic : PhysicalProfilesActions, IPhysicalProfilesLogic
{
    public ServiceResponse GetPhysicalProfileByPhoneNumber(string phoneNumber)
    {
        return GetPhysicalProfileByPhoneNumberAction(phoneNumber);
    }

    public ServiceResponse UpdatePhysicalProfileByPhoneNumber(string phoneNumber, PhysicalProfileUpdateRequestDto request)
    {
        return UpdatePhysicalProfileByPhoneNumberAction(phoneNumber, request);
    }
}
