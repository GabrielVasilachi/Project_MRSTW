using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.Domain.Entities.PhysicalProfiles;

public class PhysicalProfileEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserEntity User { get; set; } = null!;

    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [StringLength(150)]
    public string? Email { get; set; }

    [StringLength(20)]
    public string? Idnp { get; set; }

    [Required]
    [StringLength(200)]
    public string LocationAddress { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}