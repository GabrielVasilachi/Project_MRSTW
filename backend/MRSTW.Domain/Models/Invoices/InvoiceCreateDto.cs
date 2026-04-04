namespace MRSTW.Domain.Models.Invoices;

public class InvoiceCreateDto
{
    public string AccountEmail { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "MDL";
}
