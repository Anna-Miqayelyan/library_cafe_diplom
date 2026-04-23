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
    }
}