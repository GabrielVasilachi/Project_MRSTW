namespace MRSTW.Domain.Models.Auth;

public class AuthSetPasswordRequestDto
{
    public string Token { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}