namespace MRSTW.Domain.Models.PhysicalProfiles;

public class PhysicalProfileResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string LocationAddress { get; set; } = string.Empty;
    public string? Idnp { get; set; }
    public string? Email { get; set; }
}
