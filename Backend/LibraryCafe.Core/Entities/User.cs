using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryCafe.Core.Entities
{
    [Table("users")]
    public class User
    {
        [Column("userid")]
        public int Id { get; set; }

        [Column("fullname")]
        public string Fullname { get; set; } = null!;

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("passwordhash")]
        public string PasswordHash { get; set; } = null!;

        [Column("role")]
        public string Role { get; set; } = null!;
    }
}
