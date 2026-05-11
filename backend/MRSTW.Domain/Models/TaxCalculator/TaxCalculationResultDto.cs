namespace MRSTW.Domain.Models.TaxCalculator;

public class TaxCalculationResultDto
{
    public decimal BaseValue { get; set; }

    public decimal VatRate { get; set; }
    public decimal CustomsDutyRate { get; set; }
    public decimal ExciseRate { get; set; }

    public decimal Vat { get; set; }
    public decimal CustomsDuty { get; set; }
    public decimal Excise { get; set; }
    public decimal TotalTaxes { get; set; }
    public decimal TotalAmount { get; set; }

    public string CategoryName { get; set; } = string.Empty;
}
