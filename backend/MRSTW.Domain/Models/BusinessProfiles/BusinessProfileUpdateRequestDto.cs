namespace MRSTW.Domain.Models.BusinessProfiles;

public class BusinessProfileUpdateRequestDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? IdnoCode { get; set; }
    public string? LocationAdress { get; set; }
    public string? TvaCode { get; set; }
    public string? Email { get; set; }
    public string? ContactPerson { get; set; }
    public string? ResponsiblePerson { get; set; }
    public string? EoriCode { get; set; }
}