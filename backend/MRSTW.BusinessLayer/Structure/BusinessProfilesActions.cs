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
            PhoneNumber = profile.PhoneNumber,
            IdnoCode = profile.IdnoCode,
            LocationAdress = profile.LocationAdress,
            TvaCode = profile.TvaCode,
            Email = profile.Email,
            ContactPerson = profile.ContactPerson,
            ResponsiblePerson = profile.ResponsiblePerson,
            EoriCode = profile.EoriCode
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
        profile.PhoneNumber = request.PhoneNumber;
        profile.IdnoCode = request.IdnoCode;
        profile.LocationAdress = request.LocationAdress;
        profile.TvaCode = request.TvaCode;
        profile.Email = request.Email;
        profile.ContactPerson = request.ContactPerson;
        profile.ResponsiblePerson = request.ResponsiblePerson;
        profile.EoriCode = request.EoriCode;

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