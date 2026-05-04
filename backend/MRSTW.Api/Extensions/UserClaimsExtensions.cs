using System.Security.Claims;
using MRSTW.Domain.Enums;

namespace MRSTW.Api.Extensions;

public static class UserClaimsExtensions
{
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var userIdValue = user.FindFirstValue(ClaimTypes.NameIdentifier)
                          ?? user.FindFirstValue("userId");

        if (int.TryParse(userIdValue, out var userId))
        {
            return userId;
        }

        return null;
    }

    public static string? GetRole(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.Role);
    }

    public static bool CanAccessUser(this ClaimsPrincipal user, int userId)
    {
        return user.IsInRole(UserRoleEnum.Admin.ToString()) || user.GetUserId() == userId;
    }
}
