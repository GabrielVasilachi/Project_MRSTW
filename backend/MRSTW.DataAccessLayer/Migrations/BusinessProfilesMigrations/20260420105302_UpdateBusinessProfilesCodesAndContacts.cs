using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.BusinessProfilesMigrations
{
    /// <inheritdoc />
    public partial class UpdateBusinessProfilesCodesAndContacts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Tva",
                table: "BusinessProfiles",
                newName: "TvaCode");

            migrationBuilder.RenameColumn(
                name: "Idno",
                table: "BusinessProfiles",
                newName: "IdnoCode");

            migrationBuilder.RenameColumn(
                name: "Eori",
                table: "BusinessProfiles",
                newName: "EoriCode");

            migrationBuilder.RenameColumn(
                name: "ResponsiblePerson",
                table: "BusinessProfiles",
                newName: "ContactPerson");

            migrationBuilder.AddColumn<string>(
                name: "ResponsiblePerson",
                table: "BusinessProfiles",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationAdress",
                table: "BusinessProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResponsiblePerson",
                table: "BusinessProfiles");

            migrationBuilder.DropColumn(
                name: "LocationAdress",
                table: "BusinessProfiles");

            migrationBuilder.RenameColumn(
                name: "ContactPerson",
                table: "BusinessProfiles",
                newName: "ResponsiblePerson");

            migrationBuilder.RenameColumn(
                name: "TvaCode",
                table: "BusinessProfiles",
                newName: "Tva");

            migrationBuilder.RenameColumn(
                name: "IdnoCode",
                table: "BusinessProfiles",
                newName: "Idno");

            migrationBuilder.RenameColumn(
                name: "EoriCode",
                table: "BusinessProfiles",
                newName: "Eori");
        }
    }
}
