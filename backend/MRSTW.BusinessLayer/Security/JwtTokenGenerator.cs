using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.BusinessLayer.Security;

public static class JwtTokenGenerator
{
    public static string Generate(UserEntity user)
    {
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET")
                     ?? throw new Exception("JWT_SECRET not configured.");

        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "mrstw";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "mrstw";

        var expiryMinutesValue = Environment.GetEnvironmentVariable("JWT_EXPIRE_MINUTES") ?? "120";
        if (!int.TryParse(expiryMinutesValue, out var expiryMinutes))
        {
            expiryMinutes = 120;
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
            new Claim(ClaimTypes.Role, user.RoleEnum.ToString())
        };

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            claims = claims.Append(new Claim(ClaimTypes.Email, user.Email)).ToArray();
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}