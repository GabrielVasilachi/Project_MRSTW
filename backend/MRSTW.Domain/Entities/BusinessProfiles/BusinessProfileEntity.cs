using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.Domain.Entities.BusinessProfiles;

public class BusinessProfileEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public UserEntity User { get; set; } = null!;

    [Required]
    [StringLength(200)]
    public string CompanyName { get; set; } = string.Empty;

    [Required]
    [StringLength(30)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string IdnoCode { get; set; } = string.Empty;

    [StringLength(200)]
    public string? LocationAdress { get; set; }

    [StringLength(50)]
    public string? TvaCode { get; set; }

    [EmailAddress]
    [StringLength(150)]
    public string? Email { get; set; }

    [StringLength(150)]
    public string? ContactPerson { get; set; }

    [StringLength(150)]
    public string? ResponsiblePerson { get; set; }

    [StringLength(50)]
    public string? EoriCode { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
}