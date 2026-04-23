namespace LibraryCafe.Api.Services
{
    public class PendingVerificationStore
    {
        private readonly Dictionary<string, (string Code, DateTime Expires, string Fullname, string Password, string Role, int Attempts)> _store = new();

        public void Save(string email, string code, string fullname, string password, string role)
        {
            _store[email.ToLower()] = (code, DateTime.UtcNow.AddMinutes(10), fullname, password, role, 0);
        }

        public bool Verify(string email, string code, out string fullname, out string password, out string role)
        {
            fullname = ""; password = ""; role = "Student";
            var key = email.ToLower();

            if (!_store.TryGetValue(key, out var entry)) return false;

            // Expired
            if (entry.Expires < DateTime.UtcNow)
            {
                _store.Remove(key);
                return false;
            }

            // Too many wrong attempts — invalidate
            if (entry.Attempts >= 5)
            {
                _store.Remove(key);
                return false;
            }

            // Wrong code — increment attempts
            if (entry.Code != code)
            {
                _store[key] = entry with { Attempts = entry.Attempts + 1 };
                return false;
            }

            // Correct
            fullname = entry.Fullname;
            password = entry.Password;
            role = entry.Role;
            _store.Remove(key);
            return true;
        }
    }
}