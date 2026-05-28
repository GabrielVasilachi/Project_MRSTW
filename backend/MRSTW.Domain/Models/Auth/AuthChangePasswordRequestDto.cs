namespace MRSTW.Domain.Models.Auth;

public class AuthChangePasswordRequestDto
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
