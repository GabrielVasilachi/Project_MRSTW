using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MRSTW.DataAccessLayer.Migrations.PackagesMigrations
{
    /// <inheritdoc />
    public partial class ChangePackageStatusToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Packages"
                ALTER COLUMN "Status" TYPE integer
                USING CASE
                    WHEN "Status" ~ '^[0-9]+$' THEN "Status"::integer
                    WHEN lower("Status") = 'pending' THEN 0
                    WHEN lower("Status") = 'waitingfordocuments' THEN 1
                    WHEN lower("Status") = 'inreview' THEN 2
                    WHEN lower("Status") = 'taxcalculated' THEN 3
                    WHEN lower("Status") = 'readyforpayment' THEN 4
                    WHEN lower("Status") = 'paid' THEN 5
                    WHEN lower("Status") = 'released' THEN 6
                    WHEN lower("Status") = 'rejected' THEN 7
                    ELSE 0
                END;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Packages"
                ALTER COLUMN "Status" TYPE character varying(50)
                USING CASE "Status"
                    WHEN 0 THEN 'Pending'
                    WHEN 1 THEN 'WaitingForDocuments'
                    WHEN 2 THEN 'InReview'
                    WHEN 3 THEN 'TaxCalculated'
                    WHEN 4 THEN 'ReadyForPayment'
                    WHEN 5 THEN 'Paid'
                    WHEN 6 THEN 'Released'
                    WHEN 7 THEN 'Rejected'
                    ELSE 'Pending'
                END;
                """);
        }
    }
}
