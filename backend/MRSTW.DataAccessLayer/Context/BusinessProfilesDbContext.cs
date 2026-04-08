using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class BusinessProfilesDbContext : DbContext
{
    public DbSet<BusinessProfileEntity> BusinessProfiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BusinessProfileEntity>()
            .HasIndex(b => b.UserId)
            .IsUnique();
    }
}