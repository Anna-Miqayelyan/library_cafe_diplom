namespace LibraryCafe.Api.DTOs
{
    public class UserRegisterDto
    {
        public string Fullname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "User"; // Default role
    }

    public class UserLoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Fullname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
    }

    public class UserUpdateDto
    {
        public string? Fullname { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}