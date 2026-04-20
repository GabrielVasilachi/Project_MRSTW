namespace MRSTW.Domain.Models.Packages;

public class PackageScanBusinessProfilesRequestDto
{
    public string TrackingCode { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string LocationAdress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? ContactPerson { get; set; }
}
