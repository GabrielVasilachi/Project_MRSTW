using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MRSTW.Domain.Entities.Users;
using MRSTW.Domain.Enums;

namespace MRSTW.Domain.Entities.PhysicalDeclarations;

public class PhysicalDeclarationEntity
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
    public string ProductName { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string ProductURL { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string TrackingCode { get; set; } = string.Empty;

    [Required]
    public int Quantity { get; set; }

    [Required]
    [Column(TypeName = "numeric(18,2)")]
    public decimal TotalCost { get; set; }

    [Required]
    public CurrencyEnum Currency { get; set; } = CurrencyEnum.EUR;

    [Required]
    public ProductCategoryEnum Category { get; set; } = ProductCategoryEnum.Altele;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
