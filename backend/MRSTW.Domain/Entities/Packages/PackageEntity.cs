using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Entities.Packages;

public class PackageEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string TrackingCode { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string LocationAdress { get; set; } = string.Empty;

    [StringLength(150)]
    public string? FullName { get; set; }

    [StringLength(200)]
    public string? CompanyName { get; set; }

    [StringLength(150)]
    public string? ContactPerson { get; set; }

    [Required]
    [StringLength(50)]
    public PackageStatusEnum Status { get; set; }

    public int? UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserEntity? User { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}