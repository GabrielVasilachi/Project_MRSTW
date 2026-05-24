using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.PhysicalDeclarations;

public class PhysicalDeclarationResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductURL { get; set; } = string.Empty;
    public string TrackingCode { get; set; } = string.Empty;
    public ProductCategoryEnum Category { get; set; }
    public int Quantity { get; set; }
    public decimal TotalCost { get; set; }
    public CurrencyEnum Currency { get; set; }
    public DeclarationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
