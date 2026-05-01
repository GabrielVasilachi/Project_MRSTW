using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.AdminProfiles;

public class AdminProfileResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public UserRoleEnum RoleEnum { get; set; }
}
