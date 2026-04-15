using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Packages;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class PackagesDbContext : DbContext
{
    public DbSet<PackageEntity> Packages { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

}