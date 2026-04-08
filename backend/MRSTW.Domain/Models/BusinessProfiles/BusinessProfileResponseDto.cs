namespace MRSTW.Domain.Models.BusinessProfiles;

public class BusinessProfileResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string FiscalCode { get; set; } = string.Empty;
    public string? LegalAddress { get; set; }
    public string? ContactPerson { get; set; }
}