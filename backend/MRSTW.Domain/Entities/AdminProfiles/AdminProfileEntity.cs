using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Entities.AdminProfiles;

public class AdminProfileEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    public UserRoleEnum RoleEnum { get; set; } = UserRoleEnum.Admin;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
