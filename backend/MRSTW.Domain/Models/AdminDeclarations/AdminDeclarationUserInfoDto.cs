namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationUserInfoDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
}
