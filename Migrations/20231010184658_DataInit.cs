using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RSSI_webAPI.Migrations
{
    /// <inheritdoc />
    public partial class DataInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReconnectionRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    BxGSM = table.Column<float>(type: "real", nullable: false),
                    ByGSM = table.Column<float>(type: "real", nullable: false),
                    BzGSM = table.Column<float>(type: "real", nullable: false),
                    Bt = table.Column<float>(type: "real", nullable: false),
                    Intensity = table.Column<float>(type: "real", nullable: false),
                    Declination = table.Column<float>(type: "real", nullable: false),
                    Inclination = table.Column<float>(type: "real", nullable: false),
                    North = table.Column<float>(type: "real", nullable: false),
                    East = table.Column<float>(type: "real", nullable: false),
                    Vertical = table.Column<float>(type: "real", nullable: false),
                    Horizontal = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReconnectionRecords", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReconnectionRecords");
        }
    }
}
