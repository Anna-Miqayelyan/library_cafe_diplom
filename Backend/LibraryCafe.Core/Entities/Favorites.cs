using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryCafe.Core.Entities
{
    [Table("favorites")]
    public class Favorite
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("userid")]
        public int UserId { get; set; }

        public User User { get; set; } = null!;

        [Column("itemid")]
        public int ItemId { get; set; }

        [Column("itemtype")]
        public string ItemType { get; set; } = "";
    }
}