using MRSTW.DataAccessLayer.Context;
using MRSTW.Domain.Models.Auth;
using MRSTW.Domain.Models.Service;

namespace MRSTW.BusinessLayer.Structure;

public class AuthActions
{
    private readonly UsersDbContext _usersContext;
    private readonly ActivationTokensDbContext _activationTokensContext;

    public AuthActions()
    {
        _usersContext = new UsersDbContext();
        _activationTokensContext = new ActivationTokensDbContext();
    }

    public ServiceResponse LoginAction(AuthLoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "PhoneNumber este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Password este obligatorie."
            };
        }

        var user = _usersContext.Users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu exista."
            };
        }

        if (user.PasswordHash != request.Password)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Parola este incorecta."
            };
        }

        var response = new AuthLoginResponseDto
        {
            Id = user.Id,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            RoleEnum = user.RoleEnum,
            IsTemporary = user.IsTemporary,
            IsPhoneConfirmed = user.IsPhoneConfirmed,
            Message = "Autentificare reusita."
        };

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Autentificare reusita.",
            Data = response
        };
    }

    public ServiceResponse SetPasswordAction(AuthSetPasswordRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Tokenul este obligatoriu."
            };
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Parola este obligatorie."
            };
        }

        var activationToken = _activationTokensContext.ActivationTokens.FirstOrDefault(t => t.Token == request.Token);

        if (activationToken == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Token invalid."
            };
        }

        if (activationToken.IsUsed)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Tokenul a fost deja utilizat."
            };
        }

        if (activationToken.ExpiresAt < DateTime.UtcNow)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Tokenul a expirat."
            };
        }

        var user = _usersContext.Users.FirstOrDefault(u => u.Id == activationToken.UserId);

        if (user == null)
        {
            return new ServiceResponse
            {
                IsSuccess = false,
                Message = "Utilizatorul nu a fost gasit."
            };
        }

        try
        {
            user.PasswordHash = request.Password;
            user.IsTemporary = false;
            user.IsPhoneConfirmed = true;

            activationToken.IsUsed = true;

            _usersContext.SaveChanges();
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

        return new ServiceResponse
        {
            IsSuccess = true,
            Message = "Parola a fost setata cu succes, iar contul a fost activat."
        };
    }
}