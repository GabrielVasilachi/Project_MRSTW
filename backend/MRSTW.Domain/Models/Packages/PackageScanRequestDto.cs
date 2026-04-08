namespace MRSTW.Domain.Models.Packages;

public class PackageScanRequestDto
{
    public string TrackingCode { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientPhoneNumber { get; set; } = string.Empty;

    public string? CompanyName { get; set; }
    public string? FiscalCode { get; set; }
    public string? LegalAddress { get; set; }
    public string? ContactPerson { get; set; }
}