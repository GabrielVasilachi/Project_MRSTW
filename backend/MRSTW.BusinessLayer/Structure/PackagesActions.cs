using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.ActivationTokens;
using MRSTW.Domain.Entities.Packages;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Enums;
using MRSTW.Domain.Models.Packages;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class PackagesActions
{
    private readonly UsersDbContext _usersContext;
    private readonly PackagesDbContext _packagesContext;
    private readonly ActivationTokensDbContext _activationTokensContext;
    private readonly BusinessProfilesDbContext _businessProfilesContext;

    public PackagesActions()
    {
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
        _activationTokensContext = new ActivationTokensDbContext();
        _businessProfilesContext = new BusinessProfilesDbContext();
    }

    public ServiceResponse ScanPackageAction(PackageScanRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TrackingCode este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.RecipientName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "RecipientName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.RecipientPhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "RecipientPhoneNumber este obligatoriu."
            };
        }

        var existingPackage = _packagesContext.Packages.FirstOrDefault(p => p.TrackingCode == request.TrackingCode);

        if (existingPackage != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un colet cu acest TrackingCode deja exista."
            };
        }

        var isBusiness =
            !string.IsNullOrWhiteSpace(request.CompanyName) &&
            !string.IsNullOrWhiteSpace(request.FiscalCode);

        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.RecipientPhoneNumber);

        var userWasCreated = false;
        var businessProfileCreated = false;
        string? activationTokenValue = null;
        string? activationLink = null;

        if (existingUser == null)
        {
            existingUser = new UserEntity
            {
                FullName = isBusiness
                    ? (string.IsNullOrWhiteSpace(request.ContactPerson)
                        ? request.RecipientName
                        : request.ContactPerson!)
                    : request.RecipientName,
                PhoneNumber = request.RecipientPhoneNumber,
                IsTemporary = true,
                IsPhoneConfirmed = false,
                RoleEnum = isBusiness ? UserRoleEnum.Business : UserRoleEnum.Individual
            };

            try
            {
                _usersContext.Users.Add(existingUser);
                _usersContext.SaveChanges();
            }
            catch (Exception e)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = e.Message
                };
            }

            userWasCreated = true;

            if (isBusiness)
            {
                var businessProfile = new BusinessProfileEntity
                {
                    UserId = existingUser.Id,
                    CompanyName = request.CompanyName!,
                    FiscalCode = request.FiscalCode!,
                    LegalAddress = request.LegalAddress,
                    ContactPerson = string.IsNullOrWhiteSpace(request.ContactPerson)
                        ? request.RecipientName
                        : request.ContactPerson
                };

                try
                {
                    _businessProfilesContext.BusinessProfiles.Add(businessProfile);
                    _businessProfilesContext.SaveChanges();
                    businessProfileCreated = true;
                }
                catch (Exception e)
                {
                    return new ServiceResponse
                    {
                        IsSuccess = false,
                        Message = e.Message
                    };
                }
            }

            var activationToken = new ActivationTokenEntity
            {
                UserId = existingUser.Id,
                Token = Guid.NewGuid().ToString(),
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                IsUsed = false
            };

            try
            {
                _activationTokensContext.ActivationTokens.Add(activationToken);
                _activationTokensContext.SaveChanges();
            }
            catch (Exception e)
            {
                return new ServiceResponse
                {
                    IsSuccess = false,
                    Message = e.Message
                };
            }

            activationTokenValue = activationToken.Token;
            activationLink = $"http://localhost:5173/activate-account?token={activationTokenValue}";
        }
        else
        {
            if (isBusiness && existingUser.RoleEnum != UserRoleEnum.Business)
            {
                existingUser.RoleEnum = UserRoleEnum.Business;

                try
                {
                    _usersContext.SaveChanges();
                }
                catch (Exception e)
                {
                    return new ServiceResponse
                    {
                        IsSuccess = false,
                        Message = e.Message
                    };
                }
            }

            if (isBusiness)
            {
                var existingBusinessProfile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == existingUser.Id);

                if (existingBusinessProfile == null)
                {
                    var businessProfile = new BusinessProfileEntity
                    {
                        UserId = existingUser.Id,
                        CompanyName = request.CompanyName!,
                        FiscalCode = request.FiscalCode!,
                        LegalAddress = request.LegalAddress,
                        ContactPerson = string.IsNullOrWhiteSpace(request.ContactPerson)
                            ? request.RecipientName
                            : request.ContactPerson
                    };

                    try
                    {
                        _businessProfilesContext.BusinessProfiles.Add(businessProfile);
                        _businessProfilesContext.SaveChanges();
                        businessProfileCreated = true;
                    }
                    catch (Exception e)
                    {
                        return new ServiceResponse
                        {
                            IsSuccess = false,
                            Message = e.Message
                        };
                    }
                }
            }
        }

        var package = new PackageEntity
        {
            TrackingCode = request.TrackingCode,
            RecipientName = request.RecipientName,
            RecipientPhoneNumber = request.RecipientPhoneNumber,
            UserId = existingUser.Id,
            Status = PackageStatusEnum.Pending
        };

        try
        {
            _packagesContext.Packages.Add(package);
            _packagesContext.SaveChanges();
        }
        catch (Exception e)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = e.Message
            };
        }

        var response = new PackageScanResponseDto
        {
            PackageId = package.Id,
            UserId = existingUser.Id,
            TrackingCode = package.TrackingCode,
            UserWasCreated = userWasCreated,
            IsBusiness = isBusiness,
            BusinessProfileCreated = businessProfileCreated,
            ActivationToken = activationTokenValue,
            ActivationLink = activationLink,
            Message = userWasCreated
                ? (isBusiness
                    ? "Coletul a fost scanat, utilizatorul business a fost creat, profilul companiei a fost creat si linkul de activare a fost generat."
                    : "Coletul a fost scanat, utilizatorul temporar a fost creat si linkul de activare a fost generat.")
                : (isBusiness
                    ? "Coletul a fost scanat si a fost asociat cu utilizatorul business existent."
                    : "Coletul a fost scanat si a fost asociat cu utilizatorul existent.")
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = response.Message
        };
    }
}