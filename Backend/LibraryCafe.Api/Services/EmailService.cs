using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace LibraryCafe.Api.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config) => _config = config;

        public async Task<bool> DomainHasMailServerAsync(string email)
        {
            try
            {
                var domain = email.Split('@')[1];
                var hostEntry = await Dns.GetHostEntryAsync(domain);
                return hostEntry.AddressList.Length > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            try
            {
                var apiKey = _config["AbstractApi:Key"];
                var url = $"https://emailvalidation.abstractapi.com/v1/?api_key={apiKey}&email={Uri.EscapeDataString(email)}";
                using var http = new HttpClient();
                http.Timeout = TimeSpan.FromSeconds(10);
                var response = await http.GetStringAsync(url);
                var json = System.Text.Json.JsonDocument.Parse(response);
                var deliverability = json.RootElement.GetProperty("deliverability").GetString();
                return deliverability == "DELIVERABLE";
            }
            catch
            {
                return true;
            }
        }

        public async Task SendVerificationCodeAsync(string toEmail, string code)
        {
            var cfg = _config.GetSection("Email");

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(cfg["SenderEmail"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = "Library Café — Your verification code";
            message.Body = new TextPart("html")
            {
                Text = $"""
                    <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:2rem;border:1px solid #eee;border-radius:12px">
                        <h2 style="color:#2c2825">📚 Library Café</h2>
                        <p>Your verification code is:</p>
                        <div style="font-size:2.5rem;font-weight:800;letter-spacing:.4rem;color:#c9a84c;padding:1rem 0">{code}</div>
                        <p style="color:#888;font-size:.85rem">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
                    </div>
                """
            };

            using var smtp = new SmtpClient();
            smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
            await smtp.ConnectAsync(cfg["SmtpHost"], int.Parse(cfg["SmtpPort"]!), SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(cfg["SenderEmail"], cfg["SenderPassword"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }

        public async Task SendDueDateReminderAsync(string toEmail, string fullname, string bookTitle, DateTime dueDate, int daysLeft)
        {
            var cfg = _config.GetSection("Email");
            var firstName = fullname.Split(' ')[0];
            var urgency = daysLeft == 1 ? "⚠️ Due TOMORROW" : $"📅 Due in {daysLeft} days";
            var color = daysLeft == 1 ? "#e53935" : "#c9a84c";

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(cfg["SenderEmail"]));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = $"📚 Library Café — \"{bookTitle}\" is due {(daysLeft == 1 ? "tomorrow" : $"in {daysLeft} days")}";
            message.Body = new TextPart("html")
            {
                Text = $"""
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:2rem;border:1px solid #eee;border-radius:12px">
                <h2 style="color:#2c2825">📚 Library Café</h2>
                <p>Hi <strong>{firstName}</strong>,</p>
                <p>This is a friendly reminder that a book you borrowed is due soon:</p>
                <div style="background:#f9f6f0;border-left:4px solid {color};padding:1rem 1.2rem;border-radius:6px;margin:1.2rem 0">
                    <div style="font-size:1.1rem;font-weight:700;color:#2c2825">{bookTitle}</div>
                    <div style="font-size:.95rem;color:{color};font-weight:600;margin-top:.3rem">{urgency}</div>
                    <div style="font-size:.85rem;color:#888;margin-top:.2rem">Due date: {dueDate:MMMM dd, yyyy}</div>
                </div>
                <p>Please return the book to the library by the due date to avoid overdue fines.</p>
                <p style="color:#888;font-size:.8rem;margin-top:1.5rem">— Library Café Team</p>
            </div>
        """
            };

            using var smtp = new SmtpClient();
            smtp.ServerCertificateValidationCallback = (s, c, h, e) => true;
            await smtp.ConnectAsync(cfg["SmtpHost"], int.Parse(cfg["SmtpPort"]!), SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(cfg["SenderEmail"], cfg["SenderPassword"]);
            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}