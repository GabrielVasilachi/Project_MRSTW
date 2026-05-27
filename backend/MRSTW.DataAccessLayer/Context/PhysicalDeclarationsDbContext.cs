using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Packages;
using MRSTW.Domain.Entities.PhysicalDeclarations;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class PhysicalDeclarationsDbContext : DbContext
{
    public DbSet<PhysicalDeclarationEntity> PhysicalDeclarations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>()
            .ToTable("Users", tableBuilder => tableBuilder.ExcludeFromMigrations());

        modelBuilder.Entity<PackageEntity>()
            .ToTable("Packages", tableBuilder => tableBuilder.ExcludeFromMigrations());

        modelBuilder.Entity<PhysicalDeclarationEntity>()
            .ToTable("PhysicalDeclaration");

        modelBuilder.Entity<PhysicalDeclarationEntity>()
            .HasIndex(declaration => declaration.UserId);

        modelBuilder.Entity<PhysicalDeclarationEntity>()
            .HasIndex(declaration => declaration.PackageId);

        modelBuilder.Entity<PhysicalDeclarationEntity>()
            .HasOne(declaration => declaration.Package)
            .WithMany()
            .HasForeignKey(declaration => declaration.PackageId);
    }
}
