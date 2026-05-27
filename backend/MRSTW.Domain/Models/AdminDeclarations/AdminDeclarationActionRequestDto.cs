using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationActionRequestDto
{
    public string Action { get; set; } = "open";
    public string DeclarationType { get; set; } = string.Empty;
    public DeclarationStatus? TargetStatus { get; set; }
    public string? Comment { get; set; }
    public List<AdminDeclarationFieldReviewDto>? FieldReviews { get; set; }
}
