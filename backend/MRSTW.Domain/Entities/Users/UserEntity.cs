using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Entities.Users;


public class UserEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(150)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? PasswordHash { get; set; }

    [Required]
    public UserRoleEnum RoleEnum { get; set; } = UserRoleEnum.Individual;

    [Required]
    public bool IsTemporary { get; set; } = true;

    [Required]
    public bool IsPhoneConfirmed { get; set; } = false;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}