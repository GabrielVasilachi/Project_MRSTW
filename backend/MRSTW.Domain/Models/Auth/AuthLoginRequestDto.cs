namespace MRSTW.Domain.Models.Auth;

public class AuthLoginRequestDto
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}