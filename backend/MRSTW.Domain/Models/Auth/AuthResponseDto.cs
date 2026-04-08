using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.Auth;

public class AuthLoginResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public UserRoleEnum RoleEnum { get; set; }
    public bool IsTemporary { get; set; }
    public bool IsPhoneConfirmed { get; set; }
    public string Message { get; set; } = string.Empty;
}