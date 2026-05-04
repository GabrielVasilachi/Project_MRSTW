namespace MRSTW.Domain.Models.AuditLogs;

public class AuditLogResponseDto
{
    public string Id { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int? ActorUserId { get; set; }
    public string? ActorName { get; set; }
    public string? ActorRole { get; set; }
    public int? UserId { get; set; }
    public string User { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string? UserPhoneNumber { get; set; }
    public string? UserEmail { get; set; }
    public bool? IsTemporary { get; set; }
    public bool? IsPhoneConfirmed { get; set; }
}
