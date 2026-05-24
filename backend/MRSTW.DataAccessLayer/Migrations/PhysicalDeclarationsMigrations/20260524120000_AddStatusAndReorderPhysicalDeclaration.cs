using System;
using MRSTW.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.PhysicalDeclarationsMigrations
{
    /// <inheritdoc />
    [DbContext(typeof(PhysicalDeclarationsDbContext))]
    [Migration("20260524120000_AddStatusAndReorderPhysicalDeclaration")]
    public partial class AddStatusAndReorderPhysicalDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PhysicalDeclaration_Temp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ProductName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductURL = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TrackingCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Currency = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhysicalDeclaration_Temp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhysicalDeclaration_Temp_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
INSERT INTO ""PhysicalDeclaration_Temp"" (""Id"", ""UserId"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""Category"", ""Quantity"", ""TotalCost"", ""Currency"", ""Status"", ""CreatedAt"")
SELECT ""Id"", ""UserId"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""Category"", ""Quantity"", ""TotalCost"", ""Currency"", 0, ""CreatedAt""
FROM ""PhysicalDeclaration"";
");

            migrationBuilder.DropTable(
                name: "PhysicalDeclaration");

            migrationBuilder.RenameTable(
                name: "PhysicalDeclaration_Temp",
                newName: "PhysicalDeclaration");

            migrationBuilder.Sql("ALTER TABLE \"PhysicalDeclaration\" RENAME CONSTRAINT \"PK_PhysicalDeclaration_Temp\" TO \"PK_PhysicalDeclaration\";");
            migrationBuilder.Sql("ALTER TABLE \"PhysicalDeclaration\" RENAME CONSTRAINT \"FK_PhysicalDeclaration_Temp_Users_UserId\" TO \"FK_PhysicalDeclaration_Users_UserId\";");

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalDeclaration_UserId",
                table: "PhysicalDeclaration",
                column: "UserId");

            migrationBuilder.Sql(@"SELECT setval(pg_get_serial_sequence('""PhysicalDeclaration""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""PhysicalDeclaration""), 1), true);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PhysicalDeclaration_Temp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ProductName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductURL = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TrackingCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Currency = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhysicalDeclaration_Temp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhysicalDeclaration_Temp_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
INSERT INTO ""PhysicalDeclaration_Temp"" (""Id"", ""UserId"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""Quantity"", ""TotalCost"", ""Currency"", ""Category"", ""CreatedAt"")
SELECT ""Id"", ""UserId"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""Quantity"", ""TotalCost"", ""Currency"", ""Category"", ""CreatedAt""
FROM ""PhysicalDeclaration"";
");

            migrationBuilder.DropTable(
                name: "PhysicalDeclaration");

            migrationBuilder.RenameTable(
                name: "PhysicalDeclaration_Temp",
                newName: "PhysicalDeclaration");

            migrationBuilder.Sql("ALTER TABLE \"PhysicalDeclaration\" RENAME CONSTRAINT \"PK_PhysicalDeclaration_Temp\" TO \"PK_PhysicalDeclaration\";");
            migrationBuilder.Sql("ALTER TABLE \"PhysicalDeclaration\" RENAME CONSTRAINT \"FK_PhysicalDeclaration_Temp_Users_UserId\" TO \"FK_PhysicalDeclaration_Users_UserId\";");

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalDeclaration_UserId",
                table: "PhysicalDeclaration",
                column: "UserId");

            migrationBuilder.Sql(@"SELECT setval(pg_get_serial_sequence('""PhysicalDeclaration""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""PhysicalDeclaration""), 1), true);");
        }
    }
}
