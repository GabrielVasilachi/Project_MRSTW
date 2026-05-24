using System;
using MRSTW.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.BusinessDeclarationsMigrations
{
    /// <inheritdoc />
    [DbContext(typeof(BusinessDeclarationsDbContext))]
    [Migration("20260524130000_AddStatusAndReorderBusinessDeclaration")]
    public partial class AddStatusAndReorderBusinessDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusinessDeclaration_Temp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SenderName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductURL = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TrackingCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HSCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Currency = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessDeclaration_Temp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessDeclaration_Temp_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
INSERT INTO ""BusinessDeclaration_Temp"" (""Id"", ""UserId"", ""SenderName"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""HSCode"", ""Category"", ""Quantity"", ""TotalCost"", ""Currency"", ""Status"", ""CreatedAt"")
SELECT ""Id"", ""UserId"", ""SenderName"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""HSCode"", ""Category"", ""Quantity"", ""TotalCost"", ""Currency"", 0, ""CreatedAt""
FROM ""BusinessDeclaration"";
");

            migrationBuilder.DropTable(
                name: "BusinessDeclaration");

            migrationBuilder.RenameTable(
                name: "BusinessDeclaration_Temp",
                newName: "BusinessDeclaration");

            migrationBuilder.Sql("ALTER TABLE \"BusinessDeclaration\" RENAME CONSTRAINT \"PK_BusinessDeclaration_Temp\" TO \"PK_BusinessDeclaration\";");
            migrationBuilder.Sql("ALTER TABLE \"BusinessDeclaration\" RENAME CONSTRAINT \"FK_BusinessDeclaration_Temp_Users_UserId\" TO \"FK_BusinessDeclaration_Users_UserId\";");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessDeclaration_UserId",
                table: "BusinessDeclaration",
                column: "UserId");

            migrationBuilder.Sql(@"SELECT setval(pg_get_serial_sequence('""BusinessDeclaration""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""BusinessDeclaration""), 1), true);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusinessDeclaration_Temp",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SenderName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ProductURL = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TrackingCode = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    HSCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    TotalCost = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    Currency = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusinessDeclaration_Temp", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusinessDeclaration_Temp_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
INSERT INTO ""BusinessDeclaration_Temp"" (""Id"", ""UserId"", ""SenderName"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""HSCode"", ""Quantity"", ""TotalCost"", ""Currency"", ""Category"", ""CreatedAt"")
SELECT ""Id"", ""UserId"", ""SenderName"", ""ProductName"", ""ProductURL"", ""TrackingCode"", ""HSCode"", ""Quantity"", ""TotalCost"", ""Currency"", ""Category"", ""CreatedAt""
FROM ""BusinessDeclaration"";
");

            migrationBuilder.DropTable(
                name: "BusinessDeclaration");

            migrationBuilder.RenameTable(
                name: "BusinessDeclaration_Temp",
                newName: "BusinessDeclaration");

            migrationBuilder.Sql("ALTER TABLE \"BusinessDeclaration\" RENAME CONSTRAINT \"PK_BusinessDeclaration_Temp\" TO \"PK_BusinessDeclaration\";");
            migrationBuilder.Sql("ALTER TABLE \"BusinessDeclaration\" RENAME CONSTRAINT \"FK_BusinessDeclaration_Temp_Users_UserId\" TO \"FK_BusinessDeclaration_Users_UserId\";");

            migrationBuilder.CreateIndex(
                name: "IX_BusinessDeclaration_UserId",
                table: "BusinessDeclaration",
                column: "UserId");

            migrationBuilder.Sql(@"SELECT setval(pg_get_serial_sequence('""BusinessDeclaration""', 'Id'), COALESCE((SELECT MAX(""Id"") FROM ""BusinessDeclaration""), 1), true);");
        }
    }
}
