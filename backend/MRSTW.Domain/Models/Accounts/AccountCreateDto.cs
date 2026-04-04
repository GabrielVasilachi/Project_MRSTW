namespace MRSTW.Domain.Models.Accounts;

public class AccountCreateDto
{
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PackageId { get; set; } = string.Empty;
}
