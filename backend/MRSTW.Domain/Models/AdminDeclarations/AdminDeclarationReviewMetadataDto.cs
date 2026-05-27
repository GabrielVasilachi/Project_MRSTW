namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationReviewMetadataDto
{
    public string? ReviewState { get; set; }
    public int? ReviewerId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Comment { get; set; }
    public List<AdminDeclarationFieldReviewDto> Fields { get; set; } = new();
    public List<AdminDeclarationAuditEntryDto> History { get; set; } = new();
}
