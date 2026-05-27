namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationAuditEntryDto
{
    public string Action { get; set; } = string.Empty;
    public int? ActorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Comment { get; set; }
}
