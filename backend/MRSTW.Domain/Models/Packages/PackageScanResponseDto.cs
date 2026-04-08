namespace MRSTW.Domain.Models.Packages;

public class PackageScanResponseDto
{
    public int PackageId { get; set; }
    public int UserId { get; set; }
    public string TrackingCode { get; set; } = string.Empty;
    public bool UserWasCreated { get; set; }
    public bool IsBusiness { get; set; }
    public bool BusinessProfileCreated { get; set; }
    public string? ActivationToken { get; set; }
    public string? ActivationLink { get; set; }
    public string Message { get; set; } = string.Empty;
}