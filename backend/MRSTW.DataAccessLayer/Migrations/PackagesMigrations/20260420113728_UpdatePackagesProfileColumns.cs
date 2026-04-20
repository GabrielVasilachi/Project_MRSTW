using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.PackagesMigrations
{
    /// <inheritdoc />
    public partial class UpdatePackagesProfileColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RecipientName",
                table: "Packages",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "RecipientPhoneNumber",
                table: "Packages",
                newName: "PhoneNumber");

            migrationBuilder.RenameColumn(
                name: "LocationAddress",
                table: "Packages",
                newName: "LocationAdress");

            migrationBuilder.AddColumn<string>(
                name: "CompanyName",
                table: "Packages",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactPerson",
                table: "Packages",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyName",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "ContactPerson",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "PhoneNumber",
                table: "Packages",
                newName: "RecipientPhoneNumber");

            migrationBuilder.RenameColumn(
                name: "LocationAdress",
                table: "Packages",
                newName: "LocationAddress");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Packages",
                newName: "RecipientName");
        }
    }
}
