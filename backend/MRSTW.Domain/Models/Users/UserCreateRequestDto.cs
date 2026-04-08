namespace MRSTW.Domain.Models.Users;

public class UserCreateRequestDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Email { get; set; }
}