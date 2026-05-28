using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.Packages;

public class PackageResponseDto
{
    public int Id { get; set; }
    public string TrackingCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string LocationAdress { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? CompanyName { get; set; }
    public string? ContactPerson { get; set; }
    public PackageStatusEnum Status { get; set; }
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool HasDeclaration { get; set; }
    public int? DeclarationId { get; set; }
    public string? DeclarationType { get; set; }
    public string? DeclarationProductName { get; set; }
}
