using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace MRSTW.Api.Extensions;

public static class JwtServiceExtensions
{
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services)
    {
        var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
                        ?? throw new InvalidOperationException("JWT_SECRET is not set.");

        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
                        ?? throw new InvalidOperationException("JWT_ISSUER is not set.");

        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
                          ?? throw new InvalidOperationException("JWT_AUDIENCE is not set.");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAuthorization();

        return services;
    }
}