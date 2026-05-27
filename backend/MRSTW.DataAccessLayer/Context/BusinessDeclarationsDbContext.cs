using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.BusinessDeclarations;
using MRSTW.Domain.Entities.Packages;
using MRSTW.Domain.Entities.Users;

namespace MRSTW.DataAccessLayer.Context;

public sealed class BusinessDeclarationsDbContext : DbContext
{
    public DbSet<BusinessDeclarationEntity> BusinessDeclarations { get; set; }

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

        modelBuilder.Entity<BusinessDeclarationEntity>()
            .ToTable("BusinessDeclaration");

        modelBuilder.Entity<BusinessDeclarationEntity>()
            .HasIndex(declaration => declaration.UserId);

        modelBuilder.Entity<BusinessDeclarationEntity>()
            .HasIndex(declaration => declaration.PackageId);

        modelBuilder.Entity<BusinessDeclarationEntity>()
            .HasOne(declaration => declaration.Package)
            .WithMany()
            .HasForeignKey(declaration => declaration.PackageId);
    }
}
