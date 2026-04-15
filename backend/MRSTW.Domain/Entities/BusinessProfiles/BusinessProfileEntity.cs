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
    [StringLength(50)]
    public string FiscalCode { get; set; } = string.Empty;

    [StringLength(200)]
    public string? LegalAddress { get; set; }

    [StringLength(150)]
    public string? ContactPerson { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
}