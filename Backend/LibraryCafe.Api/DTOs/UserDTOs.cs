namespace LibraryCafe.Api.DTOs
{
    public class RegisterDto
    {
        public string Fullname { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string? Role { get; set; }
    }

    public class VerifyCodeDto
    {
        public string Email { get; set; } = "";
        public string Code { get; set; } = "";
    }

    public class UserRegisterDto
    {
        public string Fullname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Role { get; set; } = "Student";
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