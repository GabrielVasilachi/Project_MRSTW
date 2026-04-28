using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.PhysicalProfiles;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class PhysicalProfilesDbContext : DbContext
{
    public DbSet<PhysicalProfileEntity> PhysicalProfiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .ToTable("Users", tableBuilder => tableBuilder.ExcludeFromMigrations());

        modelBuilder.Entity<PhysicalProfileEntity>()
            .HasIndex(profile => profile.UserId)
            .IsUnique();
    }
}
