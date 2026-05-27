using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.DocumentsMigrations
{
    public partial class AddDeclarationToDocuments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeclarationId",
                table: "Documents",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeclarationType",
                table: "Documents",
                type: "character varying(30)",
                maxLength: 30,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_DeclarationId",
                table: "Documents",
                column: "DeclarationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Documents_DeclarationId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "DeclarationId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "DeclarationType",
                table: "Documents");
        }
    }
}
