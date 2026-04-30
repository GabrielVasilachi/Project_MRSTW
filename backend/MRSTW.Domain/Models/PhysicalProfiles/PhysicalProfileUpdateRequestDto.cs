namespace MRSTW.Domain.Models.PhysicalProfiles;

public class PhysicalProfileUpdateRequestDto
{
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string LocationAddress { get; set; } = string.Empty;
    public string? Idnp { get; set; }
    public string? Email { get; set; }
}
