using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.BusinessDeclarations;

public class BusinessDeclarationUpdateRequestDto
{
    public int? PackageId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string ProductURL { get; set; } = string.Empty;
    public string TrackingCode { get; set; } = string.Empty;
    public string HSCode { get; set; } = string.Empty;
    public ProductCategoryEnum Category { get; set; } = ProductCategoryEnum.Altele;
    public int Quantity { get; set; }
    public decimal TotalCost { get; set; }
    public CurrencyEnum Currency { get; set; } = CurrencyEnum.EUR;
    public DeclarationStatus Status { get; set; } = DeclarationStatus.UnderReview;
}
