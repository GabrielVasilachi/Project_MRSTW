using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.BusinessProfilesMigrations
{
    /// <inheritdoc />
    public partial class UpdateBusinessProfilesJuridicalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LegalAddress",
                table: "BusinessProfiles");

            migrationBuilder.RenameColumn(
                name: "FiscalCode",
                table: "BusinessProfiles",
                newName: "Idno");

            migrationBuilder.RenameColumn(
                name: "ContactPerson",
                table: "BusinessProfiles",
                newName: "ResponsiblePerson");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "BusinessProfiles",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Eori",
                table: "BusinessProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "BusinessProfiles",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Tva",
                table: "BusinessProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "BusinessProfiles");

            migrationBuilder.DropColumn(
                name: "Eori",
                table: "BusinessProfiles");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "BusinessProfiles");

            migrationBuilder.DropColumn(
                name: "Tva",
                table: "BusinessProfiles");

            migrationBuilder.RenameColumn(
                name: "ResponsiblePerson",
                table: "BusinessProfiles",
                newName: "ContactPerson");

            migrationBuilder.RenameColumn(
                name: "Idno",
                table: "BusinessProfiles",
                newName: "FiscalCode");

            migrationBuilder.AddColumn<string>(
                name: "LegalAddress",
                table: "BusinessProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }
    }
}
