using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LibraryCafe.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoritesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookreviews_users_userid",
                table: "bookreviews");

            migrationBuilder.DropForeignKey(
                name: "FK_borrowings_users_userid",
                table: "borrowings");

            migrationBuilder.DropForeignKey(
                name: "FK_borrowrequests_users_userid",
                table: "borrowrequests");

            migrationBuilder.DropForeignKey(
                name: "FK_cafeorders_users_userid",
                table: "cafeorders");

            migrationBuilder.DropForeignKey(
                name: "FK_cafereviews_users_userid",
                table: "cafereviews");

            migrationBuilder.DropForeignKey(
                name: "FK_SeatReservations_users_UserId",
                table: "SeatReservations");

            migrationBuilder.AddColumn<bool>(
                name: "isapproved",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "phonenumber",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Favorites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ItemId = table.Column<int>(type: "integer", nullable: false),
                    ItemType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favorites_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "userid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "UQ_favorites_user_item",
                table: "Favorites",
                columns: new[] { "UserId", "ItemId", "ItemType" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_bookreviews_users_userid",
                table: "bookreviews",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_borrowings_users_userid",
                table: "borrowings",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_borrowrequests_users_userid",
                table: "borrowrequests",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cafeorders_users_userid",
                table: "cafeorders",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_cafereviews_users_userid",
                table: "cafereviews",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SeatReservations_users_UserId",
                table: "SeatReservations",
                column: "UserId",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bookreviews_users_userid",
                table: "bookreviews");

            migrationBuilder.DropForeignKey(
                name: "FK_borrowings_users_userid",
                table: "borrowings");

            migrationBuilder.DropForeignKey(
                name: "FK_borrowrequests_users_userid",
                table: "borrowrequests");

            migrationBuilder.DropForeignKey(
                name: "FK_cafeorders_users_userid",
                table: "cafeorders");

            migrationBuilder.DropForeignKey(
                name: "FK_cafereviews_users_userid",
                table: "cafereviews");

            migrationBuilder.DropForeignKey(
                name: "FK_SeatReservations_users_UserId",
                table: "SeatReservations");

            migrationBuilder.DropTable(
                name: "Favorites");

            migrationBuilder.DropColumn(
                name: "isapproved",
                table: "users");

            migrationBuilder.DropColumn(
                name: "phonenumber",
                table: "users");

            migrationBuilder.AddForeignKey(
                name: "FK_bookreviews_users_userid",
                table: "bookreviews",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_borrowings_users_userid",
                table: "borrowings",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_borrowrequests_users_userid",
                table: "borrowrequests",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_cafeorders_users_userid",
                table: "cafeorders",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_cafereviews_users_userid",
                table: "cafereviews",
                column: "userid",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SeatReservations_users_UserId",
                table: "SeatReservations",
                column: "UserId",
                principalTable: "users",
                principalColumn: "userid",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
