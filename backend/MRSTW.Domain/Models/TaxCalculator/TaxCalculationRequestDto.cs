using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.TaxCalculator;

public class TaxCalculationRequestDto
{
    public decimal BaseValue { get; set; }
    public ProductCategoryEnum Category { get; set; }
}
