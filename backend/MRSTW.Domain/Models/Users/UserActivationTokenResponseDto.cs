namespace MRSTW.Domain.Models.Users;

public class UserActivationTokenResponseDto
{
    public int UserId { get; set; }
    public string ActivationToken { get; set; } = string.Empty;
    public string ActivationLink { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
