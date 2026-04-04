namespace MRSTW.Domain.Models.Invoices;

public class InvoiceInfoDto
{
    public int Id { get; set; }
    public string AccountEmail { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
