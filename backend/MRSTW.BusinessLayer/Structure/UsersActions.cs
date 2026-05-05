using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Entities.ActivationTokens;
using MRSTW.Domain.Models.Service;
using MRSTW.Domain.Models.Users;

namespace MRSTW.BusinessLayer.Structure;

public class UsersActions
{
    private readonly UsersDbContext _usersContext;
    private readonly ActivationTokensDbContext _activationTokensContext;
    private readonly AdminProfilesDbContext _adminProfilesContext;
    private readonly PackagesDbContext _packagesContext;

    public UsersActions()
    {
        _usersContext = new UsersDbContext();
        _activationTokensContext = new ActivationTokensDbContext();
        _adminProfilesContext = new AdminProfilesDbContext();
        _packagesContext = new PackagesDbContext();
    }

    public ServiceResponse GetUsersAction()
    {
        try
        {
            var now = DateTime.UtcNow;
            var activationTokensByUserId = _activationTokensContext.ActivationTokens
                .Where(t => !t.IsUsed)
                .ToList()
                .GroupBy(t => t.UserId)
                .ToDictionary(t => t.Key, t => t.ToList());

            var users = _usersContext.Users
                .OrderBy(u => u.Id)
                .ToList()
                .Select(user =>
                {
                    activationTokensByUserId.TryGetValue(user.Id, out var activationTokens);
                    var latestToken = activationTokens?
                        .OrderByDescending(t => t.CreatedAt)
                        .FirstOrDefault();
                    var hasExpiredActivationToken = latestToken != null && latestToken.ExpiresAt < now;

                    return new UserResponseDto
                    {
                        Id = user.Id,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        Email = user.Email,
                        RoleEnum = user.RoleEnum,
                        IsTemporary = user.IsTemporary,
                        IsPhoneConfirmed = user.IsPhoneConfirmed,
                        CreatedAt = user.CreatedAt,
                        HasExpiredActivationToken = hasExpiredActivationToken || (user.IsTemporary && latestToken == null),
                        ActivationTokenExpiresAt = latestToken?.ExpiresAt
                    };
                })
                .ToList();

            return new ServiceResponse
            {
                IsSuccess = true,
                Data = users
            };
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

    public ServiceResponse UpdateUserAction(int userId, UserUpdateRequestDto request)
    {
        var user = _usersContext.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu a fost gasit."
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

        var updatedPhoneNumber = request.PhoneNumber.Trim();
        var existingUserWithPhoneNumber = _usersContext.Users
            .FirstOrDefault(u => u.PhoneNumber == updatedPhoneNumber && u.Id != user.Id);

        if (existingUserWithPhoneNumber != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un utilizator cu acest numar de telefon deja exista."
            };
        }

        var adminProfileWithPhoneNumber = _adminProfilesContext.AdminProfiles
            .FirstOrDefault(a => a.PhoneNumber == updatedPhoneNumber && a.UserId != user.Id);

        if (adminProfileWithPhoneNumber != null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Un admin cu acest numar de telefon deja exista."
            };
        }

        var normalizedFullName = request.FullName.Trim();
        var normalizedEmail = string.IsNullOrWhiteSpace(request.Email) ? null : request.Email.Trim();

        user.FullName = normalizedFullName;
        user.PhoneNumber = updatedPhoneNumber;
        user.Email = normalizedEmail;

        var adminProfile = _adminProfilesContext.AdminProfiles.FirstOrDefault(a => a.UserId == user.Id);

        if (adminProfile != null)
        {
            adminProfile.PhoneNumber = updatedPhoneNumber;
        }

        var packages = _packagesContext.Packages.Where(p => p.UserId == user.Id).ToList();

        foreach (var package in packages)
        {
            package.FullName = normalizedFullName;
            package.PhoneNumber = updatedPhoneNumber;
        }

        try
        {
            _usersContext.SaveChanges();
            _adminProfilesContext.SaveChanges();
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

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Utilizatorul a fost actualizat cu succes."
        };
    }

    public ServiceResponse RegenerateActivationTokenAction(int userId)
    {
        var user = _usersContext.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu a fost gasit."
            };
        }

        var now = DateTime.UtcNow;
        var hasExpiredActivationToken = _activationTokensContext.ActivationTokens
            .Any(t => t.UserId == userId && !t.IsUsed && t.ExpiresAt < now);

        if (!user.IsTemporary && !hasExpiredActivationToken)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Contul este deja activ."
            };
        }

        var oldActivationTokens = _activationTokensContext.ActivationTokens
            .Where(t => t.UserId == userId && (!t.IsUsed || t.ExpiresAt < now))
            .ToList();
        var activationToken = new ActivationTokenEntity
        {
            UserId = userId,
            Token = Guid.NewGuid().ToString(),
            ExpiresAt = now.AddHours(24),
            IsUsed = false
        };

        try
        {
            _activationTokensContext.ActivationTokens.RemoveRange(oldActivationTokens);
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

        var response = new UserActivationTokenResponseDto
        {
            UserId = userId,
            ActivationToken = activationToken.Token,
            ActivationLink = $"http://localhost:5173/activate-account?token={activationToken.Token}",
            ExpiresAt = activationToken.ExpiresAt,
            Message = "Tokenul de activare a fost regenerat cu succes."
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Data = response,
            Message = response.Message
        };
    }
}
