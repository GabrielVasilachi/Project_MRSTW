using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Accounts;
using MRSTW.Domain.Entities.Declarations;
using MRSTW.Domain.Entities.Invoices;

namespace MRSTW.DataAccessLayer.Context;

public sealed class UsersDbContext : DbContext
{
    public DbSet<AccountEntity> Accounts { get; set; }
    public DbSet<DeclarationEntity> Declarations { get; set; }
    public DbSet<InvoiceEntity> Invoices { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }
}
