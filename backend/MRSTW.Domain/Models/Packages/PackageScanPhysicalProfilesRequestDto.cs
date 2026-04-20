namespace MRSTW.Domain.Models.Packages;

public class PackageScanPhysicalProfilesRequestDto
{
    public string TrackingCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string LocationAdress { get; set; } = string.Empty;
}
