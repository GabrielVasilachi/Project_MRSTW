namespace MRSTW.Domain.Models.Packages;

public class PackageScanPhysicalProfilesResponseDto
{
    public string TrackingCode { get; set; } = string.Empty;
    public int UserId { get; set; }
    public bool UserWasCreated { get; set; }
    public bool PhysicalProfileCreated { get; set; }
    public string? ActivationToken { get; set; }
    public string? ActivationLink { get; set; }
    public string Message { get; set; } = string.Empty;
}
