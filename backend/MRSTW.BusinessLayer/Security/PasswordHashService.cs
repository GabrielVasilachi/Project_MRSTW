using Microsoft.AspNetCore.Identity;

namespace MRSTW.BusinessLayer.Security;

public static class PasswordHashService
{
    private static readonly PasswordHasher<object> PasswordHasher = new();
    private static readonly object PasswordHasherUser = new();

    public static string HashPassword(string password)
    {
        return PasswordHasher.HashPassword(PasswordHasherUser, password);
    }

    public static bool VerifyPassword(string? storedPassword, string password, out bool requiresHashUpdate)
    {
        requiresHashUpdate = false;

        if (string.IsNullOrWhiteSpace(storedPassword))
        {
            return false;
        }

        if (IsPasswordHasherHash(storedPassword))
        {
            var result = PasswordHasher.VerifyHashedPassword(PasswordHasherUser, storedPassword, password);
            requiresHashUpdate = result == PasswordVerificationResult.SuccessRehashNeeded;

            return result == PasswordVerificationResult.Success ||
                   result == PasswordVerificationResult.SuccessRehashNeeded;
        }

        if (storedPassword == password)
        {
            requiresHashUpdate = true;
            return true;
        }

        return false;
    }

    public static bool IsPasswordHasherHash(string passwordHash)
    {
        return passwordHash.StartsWith("AQAAAA", StringComparison.Ordinal);
    }
}
