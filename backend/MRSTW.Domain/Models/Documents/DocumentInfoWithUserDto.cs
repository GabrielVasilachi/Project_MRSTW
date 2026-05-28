namespace MRSTW.Domain.Models.Documents;

public class DocumentInfoWithUserDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? DeclarationId { get; set; }
    public string? DeclarationType { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserRole { get; set; } = string.Empty;
}
