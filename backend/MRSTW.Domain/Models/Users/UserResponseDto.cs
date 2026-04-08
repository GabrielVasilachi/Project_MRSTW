using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.Users;

public class UserResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
    public UserRoleEnum RoleEnum { get; set; }
    public bool IsTemporary { get; set; }
}