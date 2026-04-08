using MRSTW.BusinessLayer.Interfaces;
using MRSTW.BusinessLayer.Structure;
using MRSTW.Domain.Models.BusinessProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Core;

public class BusinessProfilesLogic : BusinessProfilesActions, IBusinessProfilesLogic
{
    public ServiceResponse GetBusinessProfileByUserId(int userId)
    {
        return GetBusinessProfileByUserIdAction(userId);
    }

    public ServiceResponse UpdateBusinessProfile(int userId, BusinessProfileUpdateRequestDto request)
    {
        return UpdateBusinessProfileAction(userId, request);
    }
}