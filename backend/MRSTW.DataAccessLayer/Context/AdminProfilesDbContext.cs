using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.AdminProfiles;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class AdminProfilesDbContext : DbContext
{
    public DbSet<AdminProfileEntity> AdminProfiles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .ToTable("Users", tableBuilder => tableBuilder.ExcludeFromMigrations());

        modelBuilder.Entity<AdminProfileEntity>()
            .HasIndex(adminProfile => adminProfile.PhoneNumber)
            .IsUnique();

        modelBuilder.Entity<AdminProfileEntity>()
            .HasIndex(adminProfile => adminProfile.UserId)
            .IsUnique();
    }
}
