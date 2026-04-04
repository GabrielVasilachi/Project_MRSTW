using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MRSTW.Domain.Entities.Invoices;

public class InvoiceEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    public string AccountEmail { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public decimal Amount { get; set; }

    [Required]
    [StringLength(10)]
    public string Currency { get; set; } = "MDL";

    [Required]
    [StringLength(50)]
    public string Status { get; set; } = "pending";
}
