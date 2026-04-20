namespace MRSTW.Domain.Models.Packages;

public class PackageScanRequestDto
{
    public string TrackingCode { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientPhoneNumber { get; set; } = string.Empty;
    public string LocationAddress { get; set; } = string.Empty;

    public string? CompanyName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? IdnoCode { get; set; }
    public string? Idno { get; set; }
    public string? TvaCode { get; set; }
    public string? Tva { get; set; }
    public string? Email { get; set; }
    public string? LocationAdress { get; set; }
    public string? ContactPerson { get; set; }
    public string? ResponsiblePerson { get; set; }
    public string? EoriCode { get; set; }
    public string? Eori { get; set; }

    public string? FiscalCode { get; set; }
    public string? LegalAddress { get; set; }
}