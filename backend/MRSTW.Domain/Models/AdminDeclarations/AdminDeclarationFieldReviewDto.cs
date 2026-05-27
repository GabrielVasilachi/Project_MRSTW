namespace MRSTW.Domain.Models.AdminDeclarations;

public class AdminDeclarationFieldReviewDto
{
    public string FieldKey { get; set; } = string.Empty;
    public bool? IsVerified { get; set; }
    public string? Comment { get; set; }
}
