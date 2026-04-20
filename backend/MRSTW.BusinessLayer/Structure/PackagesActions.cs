using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.ActivationTokens;
using MRSTW.Domain.Entities.BusinessProfiles;
using MRSTW.Domain.Entities.Packages;
using MRSTW.Domain.Entities.PhysicalProfiles;
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
    private readonly PhysicalProfilesDbContext _physicalProfilesContext;

    public PackagesActions()
    {
        _usersContext = new UsersDbContext();
        _packagesContext = new PackagesDbContext();
        _activationTokensContext = new ActivationTokensDbContext();
        _businessProfilesContext = new BusinessProfilesDbContext();
        _physicalProfilesContext = new PhysicalProfilesDbContext();
    }

    public ServiceResponse ScanPhysicalProfilesAction(PackageScanPhysicalProfilesRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TrackingCode este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "FullName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.LocationAdress))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "LocationAdress este obligatoriu."
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

        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);

        var userWasCreated = false;
        var physicalProfileCreated = false;
        string? activationTokenValue = null;
        string? activationLink = null;

        if (existingUser == null)
        {
            existingUser = new UserEntity
            {
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                IsTemporary = true,
                IsPhoneConfirmed = false,
                RoleEnum = UserRoleEnum.Individual
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

            var activationResult = TryGenerateActivationToken(existingUser.Id, out activationTokenValue, out activationLink);

            if (!activationResult.IsSuccess)
            {
                return activationResult;
            }
        }

        var existingPhysicalProfile = _physicalProfilesContext.PhysicalProfiles.FirstOrDefault(p => p.UserId == existingUser.Id);

        if (existingPhysicalProfile == null)
        {
            var physicalProfile = new PhysicalProfileEntity
            {
                UserId = existingUser.Id,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                LocationAddress = request.LocationAdress,
                Idnp = null,
                Email = null
            };

            try
            {
                _physicalProfilesContext.PhysicalProfiles.Add(physicalProfile);
                _physicalProfilesContext.SaveChanges();
                physicalProfileCreated = true;
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
        else
        {
            existingPhysicalProfile.FullName = request.FullName;
            existingPhysicalProfile.PhoneNumber = request.PhoneNumber;
            existingPhysicalProfile.LocationAddress = request.LocationAdress;

            try
            {
                _physicalProfilesContext.SaveChanges();
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

        var package = new PackageEntity
        {
            TrackingCode = request.TrackingCode,
            PhoneNumber = request.PhoneNumber,
            LocationAdress = request.LocationAdress,
            FullName = request.FullName,
            CompanyName = null,
            ContactPerson = null,
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

        var response = new PackageScanPhysicalProfilesResponseDto
        {
            TrackingCode = request.TrackingCode,
            UserId = existingUser.Id,
            UserWasCreated = userWasCreated,
            PhysicalProfileCreated = physicalProfileCreated,
            ActivationToken = activationTokenValue,
            ActivationLink = activationLink,
            Message = userWasCreated
                ? "Profilul fizic a fost scanat, utilizatorul temporar a fost creat si linkul de activare a fost generat."
                : "Profilul fizic a fost scanat si actualizat cu succes."
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = response.Message
        };
    }

    public ServiceResponse ScanBusinessProfilesAction(PackageScanBusinessProfilesRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.TrackingCode))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "TrackingCode este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.CompanyName))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "CompanyName este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.LocationAdress))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "LocationAdress este obligatoriu."
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

        var normalizedContactPerson = string.IsNullOrWhiteSpace(request.ContactPerson)
            ? null
            : request.ContactPerson.Trim();
        var businessDisplayName = normalizedContactPerson ?? request.CompanyName;

        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);

        var userWasCreated = false;
        var businessProfileCreated = false;
        string? activationTokenValue = null;
        string? activationLink = null;

        if (existingUser == null)
        {
            existingUser = new UserEntity
            {
                FullName = businessDisplayName,
                PhoneNumber = request.PhoneNumber,
                IsTemporary = true,
                IsPhoneConfirmed = false,
                RoleEnum = UserRoleEnum.Business
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

            var activationResult = TryGenerateActivationToken(existingUser.Id, out activationTokenValue, out activationLink);

            if (!activationResult.IsSuccess)
            {
                return activationResult;
            }
        }
        else if (existingUser.RoleEnum == UserRoleEnum.Individual)
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

        var existingBusinessProfile = _businessProfilesContext.BusinessProfiles.FirstOrDefault(b => b.UserId == existingUser.Id);

        if (existingBusinessProfile == null)
        {
            var businessProfile = new BusinessProfileEntity
            {
                UserId = existingUser.Id,
                CompanyName = request.CompanyName,
                PhoneNumber = request.PhoneNumber,
                IdnoCode = string.Empty,
                LocationAdress = request.LocationAdress,
                TvaCode = null,
                Email = null,
                ContactPerson = normalizedContactPerson,
                ResponsiblePerson = null,
                EoriCode = null
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
        else
        {
            existingBusinessProfile.CompanyName = request.CompanyName;
            existingBusinessProfile.PhoneNumber = request.PhoneNumber;
            existingBusinessProfile.LocationAdress = request.LocationAdress;
            existingBusinessProfile.ContactPerson = normalizedContactPerson;

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
        }

        var package = new PackageEntity
        {
            TrackingCode = request.TrackingCode,
            PhoneNumber = request.PhoneNumber,
            LocationAdress = request.LocationAdress,
            FullName = businessDisplayName,
            CompanyName = request.CompanyName,
            ContactPerson = normalizedContactPerson,
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

        var response = new PackageScanBusinessProfilesResponseDto
        {
            TrackingCode = request.TrackingCode,
            UserId = existingUser.Id,
            UserWasCreated = userWasCreated,
            BusinessProfileCreated = businessProfileCreated,
            ActivationToken = activationTokenValue,
            ActivationLink = activationLink,
            Message = userWasCreated
                ? "Profilul business a fost scanat, utilizatorul temporar a fost creat si linkul de activare a fost generat."
                : "Profilul business a fost scanat si actualizat cu succes."
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = response.Message
        };
    }

    private ServiceResponse TryGenerateActivationToken(int userId, out string? tokenValue, out string? activationLink)
    {
        tokenValue = null;
        activationLink = null;

        var activationToken = new ActivationTokenEntity
        {
            UserId = userId,
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

        tokenValue = activationToken.Token;
        activationLink = $"http://localhost:5173/activate-account?token={tokenValue}";

        return new ServiceResponse
        {
            IsSuccess = true
        };
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

        if (string.IsNullOrWhiteSpace(request.LocationAddress))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "LocationAddress este obligatoriu."
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

        var businessIdnoCode = string.IsNullOrWhiteSpace(request.IdnoCode)
            ? (string.IsNullOrWhiteSpace(request.Idno)
                ? request.FiscalCode
                : request.Idno)
            : request.IdnoCode;
        var businessContactPerson = string.IsNullOrWhiteSpace(request.ContactPerson)
            ? request.ResponsiblePerson
            : request.ContactPerson;
        var businessResponsiblePerson = request.ResponsiblePerson;
        var businessPhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber)
            ? request.RecipientPhoneNumber
            : request.PhoneNumber;
        var businessTvaCode = string.IsNullOrWhiteSpace(request.TvaCode)
            ? request.Tva
            : request.TvaCode;
        var businessEoriCode = string.IsNullOrWhiteSpace(request.EoriCode)
            ? request.Eori
            : request.EoriCode;
        var businessLocationAdress = string.IsNullOrWhiteSpace(request.LocationAdress)
            ? request.LegalAddress
            : request.LocationAdress;

        var isBusiness =
            !string.IsNullOrWhiteSpace(request.CompanyName) &&
            !string.IsNullOrWhiteSpace(businessIdnoCode);

        var existingUser = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.RecipientPhoneNumber);

        var userWasCreated = false;
        var businessProfileCreated = false;
        var physicalProfileCreated = false;
        string? activationTokenValue = null;
        string? activationLink = null;

        if (existingUser == null)
        {
            existingUser = new UserEntity
            {
                FullName = isBusiness
                    ? (string.IsNullOrWhiteSpace(businessContactPerson)
                        ? request.RecipientName
                        : businessContactPerson!)
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
                    PhoneNumber = businessPhoneNumber!,
                    IdnoCode = businessIdnoCode!,
                    LocationAdress = businessLocationAdress,
                    TvaCode = businessTvaCode,
                    Email = request.Email,
                    ContactPerson = string.IsNullOrWhiteSpace(businessContactPerson)
                        ? request.RecipientName
                        : businessContactPerson,
                    ResponsiblePerson = businessResponsiblePerson,
                    EoriCode = businessEoriCode
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
                        PhoneNumber = businessPhoneNumber!,
                        IdnoCode = businessIdnoCode!,
                        LocationAdress = businessLocationAdress,
                        TvaCode = businessTvaCode,
                        Email = request.Email,
                        ContactPerson = string.IsNullOrWhiteSpace(businessContactPerson)
                            ? request.RecipientName
                            : businessContactPerson,
                        ResponsiblePerson = businessResponsiblePerson,
                        EoriCode = businessEoriCode
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
            PhoneNumber = request.RecipientPhoneNumber,
            LocationAdress = request.LocationAddress,
            FullName = request.RecipientName,
            CompanyName = isBusiness ? request.CompanyName : null,
            ContactPerson = isBusiness
                ? (string.IsNullOrWhiteSpace(businessContactPerson)
                    ? request.RecipientName
                    : businessContactPerson)
                : null,
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

        if (!isBusiness)
        {
            var existingPhysicalProfile = _physicalProfilesContext.PhysicalProfiles.FirstOrDefault(p => p.UserId == existingUser.Id);

            if (existingPhysicalProfile == null)
            {
                var physicalProfile = new PhysicalProfileEntity
                {
                    UserId = existingUser.Id,
                    FullName = package.FullName ?? request.RecipientName,
                    PhoneNumber = package.PhoneNumber,
                    LocationAddress = package.LocationAdress,
                    Idnp = null,
                    Email = null
                };

                try
                {
                    _physicalProfilesContext.PhysicalProfiles.Add(physicalProfile);
                    _physicalProfilesContext.SaveChanges();
                    physicalProfileCreated = true;
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
            else
            {
                existingPhysicalProfile.FullName = package.FullName ?? request.RecipientName;
                existingPhysicalProfile.PhoneNumber = package.PhoneNumber;
                existingPhysicalProfile.LocationAddress = package.LocationAdress;

                try
                {
                    _physicalProfilesContext.SaveChanges();
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

        var response = new PackageScanResponseDto
        {
            PackageId = package.Id,
            UserId = existingUser.Id,
            TrackingCode = package.TrackingCode,
            UserWasCreated = userWasCreated,
            IsBusiness = isBusiness,
            BusinessProfileCreated = businessProfileCreated,
            PhysicalProfileCreated = physicalProfileCreated,
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