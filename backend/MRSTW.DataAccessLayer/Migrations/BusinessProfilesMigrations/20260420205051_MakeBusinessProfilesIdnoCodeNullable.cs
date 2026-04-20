using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.BusinessProfilesMigrations
{
    /// <inheritdoc />
    public partial class MakeBusinessProfilesIdnoCodeNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "IdnoCode",
                table: "BusinessProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

                        migrationBuilder.Sql(@"
                                UPDATE ""BusinessProfiles""
                                SET ""IdnoCode"" = NULL
                                WHERE ""IdnoCode"" IS NOT NULL
                                    AND btrim(""IdnoCode"") = '';
                        ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""BusinessProfiles""
                SET ""IdnoCode"" = ''
                WHERE ""IdnoCode"" IS NULL;
            ");

            migrationBuilder.AlterColumn<string>(
                name: "IdnoCode",
                table: "BusinessProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);
        }
    }
}
