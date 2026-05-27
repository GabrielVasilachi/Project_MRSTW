using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationResponseDto
{
    public int Id { get; set; }
    public string DeclarationType { get; set; } = string.Empty;
    public string PersonType { get; set; } = string.Empty;
    public int UserId { get; set; }
    public int? PackageId { get; set; }
    public AdminDeclarationUserInfoDto User { get; set; } = new();
    public string ProductName { get; set; } = string.Empty;
    public string ProductURL { get; set; } = string.Empty;
    public string TrackingCode { get; set; } = string.Empty;
    public string? SenderName { get; set; }
    public string? HsCode { get; set; }
    public ProductCategoryEnum Category { get; set; }
    public int Quantity { get; set; }
    public decimal TotalCost { get; set; }
    public CurrencyEnum Currency { get; set; }
    public DeclarationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public AdminDeclarationReviewMetadataDto? Review { get; set; }
}
