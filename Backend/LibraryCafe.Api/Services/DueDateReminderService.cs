using LibraryCafe.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Api.Services
{
    public class DueDateReminderService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly ILogger<DueDateReminderService> _logger;

        public DueDateReminderService(IServiceProvider services, ILogger<DueDateReminderService> logger)
        {
            _services = services;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CheckAndSendReminders();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error sending due date reminders");
                }

                // Run once every 24 hours
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CheckAndSendReminders()
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<LibraryCafeDbContext>();
            var emailSvc = scope.ServiceProvider.GetRequiredService<EmailService>();

            var now = DateTime.UtcNow;
            var in3Days = now.AddDays(3);

            // Find all active borrowings due within 3 days
            var upcoming = await context.Borrowings
                .Include(b => b.User)
                .Include(b => b.Book)
                .Where(b =>
                    b.ReturnDate == null &&
                    b.DueDate != null &&
                    b.DueDate > now &&
                    b.DueDate <= in3Days)
                .ToListAsync();

            foreach (var borrowing in upcoming)
            {
                var daysLeft = (int)(borrowing.DueDate!.Value - now).TotalDays + 1;
                await emailSvc.SendDueDateReminderAsync(
                    borrowing.User!.Email,
                    borrowing.User.Fullname,
                    borrowing.Book!.Title,
                    borrowing.DueDate.Value,
                    daysLeft
                );
                _logger.LogInformation(
                    "Sent due date reminder to {Email} for book {Book}",
                    borrowing.User.Email, borrowing.Book.Title);
            }
        }
    }
}