using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Accounts;

namespace MRSTW.DataAccessLayer.Context;

public sealed class UsersDbContext : DbContext
{
    public DbSet<AccountEntity> Accounts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }
}
