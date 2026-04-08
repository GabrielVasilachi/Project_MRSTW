using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.ActivationTokens;

namespace MRSTW.DataAccessLayer.Context;

public sealed class ActivationTokensDbContext : DbContext
{
    public DbSet<ActivationTokenEntity> ActivationTokens { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }
}