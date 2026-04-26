namespace LibraryCafe.Api.Services
{
    public class PendingVerificationStore
    {
        private readonly Dictionary<string, (string Code, DateTime Expires, string Fullname, string Password, string Role, string Phone, int Attempts)> _store = new();

        public void Save(string email, string code, string fullname, string password, string role, string phone)
        {
            _store[email.ToLower()] = (code, DateTime.UtcNow.AddMinutes(10), fullname, password, role, phone, 0);
        }

        public bool Verify(string email, string code, out string fullname, out string password, out string role, out string phone)
        {
            fullname = ""; password = ""; role = "Student"; phone = "";
            var key = email.ToLower();
            if (!_store.TryGetValue(key, out var entry)) return false;

            if (entry.Expires < DateTime.UtcNow)
            {
                _store.Remove(key);
                return false;
            }

            if (entry.Attempts >= 5)
            {
                _store.Remove(key);
                return false;
            }

            if (entry.Code != code)
            {
                _store[key] = entry with { Attempts = entry.Attempts + 1 };
                return false;
            }

            fullname = entry.Fullname;
            password = entry.Password;
            role = entry.Role;
            phone = entry.Phone;
            _store.Remove(key);
            return true;
        }
    }
}