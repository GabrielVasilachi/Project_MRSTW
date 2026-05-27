using MRSTW.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.PhysicalDeclarationsMigrations
{
    /// <inheritdoc />
    [DbContext(typeof(PhysicalDeclarationsDbContext))]
    [Migration("20260526120000_AddPackageIdToPhysicalDeclaration")]
    public partial class AddPackageIdToPhysicalDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PackageId",
                table: "PhysicalDeclaration",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhysicalDeclaration_PackageId",
                table: "PhysicalDeclaration",
                column: "PackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_PhysicalDeclaration_Packages_PackageId",
                table: "PhysicalDeclaration",
                column: "PackageId",
                principalTable: "Packages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PhysicalDeclaration_Packages_PackageId",
                table: "PhysicalDeclaration");

            migrationBuilder.DropIndex(
                name: "IX_PhysicalDeclaration_PackageId",
                table: "PhysicalDeclaration");

            migrationBuilder.DropColumn(
                name: "PackageId",
                table: "PhysicalDeclaration");
        }
    }
}
