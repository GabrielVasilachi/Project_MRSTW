using Microsoft.EntityFrameworkCore;
using MRSTW.Domain.Entities.Documents;

namespace MRSTW.DataAccessLayer.Context;

public sealed class DocumentsDbContext : DbContext
{
    public DbSet<DocumentEntity> Documents { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }
}
