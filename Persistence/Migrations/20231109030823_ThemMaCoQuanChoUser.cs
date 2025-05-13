using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ThemMaCoQuanChoUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrgUniqueCode",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {            

            migrationBuilder.DropColumn(
                name: "OrgUniqueCode",
                table: "Users");
        }
    }
}
