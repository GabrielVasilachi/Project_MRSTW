using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Models.BusinessProfiles;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class BusinessProfilesActions
{
    private readonly BusinessProfilesDbContext _businessProfilesContext;

    public BusinessProfilesActions()
    {
        _businessProfilesContext = new BusinessProfilesDbContext();
    }

    public ServiceResponse GetBusinessProfileByUserIdAction(int userId)
    {
        var profile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "BusinessProfile nu a fost gasit."
            };
        }

        var response = new BusinessProfileResponseDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            CompanyName = profile.CompanyName,
            FiscalCode = profile.FiscalCode,
            LegalAddress = profile.LegalAddress,
            ContactPerson = profile.ContactPerson
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response
        };
    }

    public ServiceResponse UpdateBusinessProfileAction(int userId, BusinessProfileUpdateRequestDto request)
    {
        var profile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == userId);

        if (profile == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "BusinessProfile nu a fost gasit."
            };
        }

        profile.CompanyName = request.CompanyName;
        profile.FiscalCode = request.FiscalCode;
        profile.LegalAddress = request.LegalAddress;
        profile.ContactPerson = request.ContactPerson;

        try
        {
            _businessProfilesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "BusinessProfile a fost actualizat cu succes."
        };
    }
}