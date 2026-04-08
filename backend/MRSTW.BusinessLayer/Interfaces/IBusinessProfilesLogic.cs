using MRSTW.Domain.Models.BusinessProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Interfaces;

public interface IBusinessProfilesLogic
{
    ServiceResponse GetBusinessProfileByUserId(int userId);
    ServiceResponse UpdateBusinessProfile(int userId, BusinessProfileUpdateRequestDto request);
}