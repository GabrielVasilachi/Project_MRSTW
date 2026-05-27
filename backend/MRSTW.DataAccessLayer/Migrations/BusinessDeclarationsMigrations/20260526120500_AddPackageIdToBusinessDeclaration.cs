using MRSTW.DataAccessLayer.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.BusinessDeclarationsMigrations
{
    /// <inheritdoc />
    [DbContext(typeof(BusinessDeclarationsDbContext))]
    [Migration("20260526120500_AddPackageIdToBusinessDeclaration")]
    public partial class AddPackageIdToBusinessDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PackageId",
                table: "BusinessDeclaration",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BusinessDeclaration_PackageId",
                table: "BusinessDeclaration",
                column: "PackageId");

            migrationBuilder.AddForeignKey(
                name: "FK_BusinessDeclaration_Packages_PackageId",
                table: "BusinessDeclaration",
                column: "PackageId",
                principalTable: "Packages",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BusinessDeclaration_Packages_PackageId",
                table: "BusinessDeclaration");

            migrationBuilder.DropIndex(
                name: "IX_BusinessDeclaration_PackageId",
                table: "BusinessDeclaration");

            migrationBuilder.DropColumn(
                name: "PackageId",
                table: "BusinessDeclaration");
        }
    }
}
