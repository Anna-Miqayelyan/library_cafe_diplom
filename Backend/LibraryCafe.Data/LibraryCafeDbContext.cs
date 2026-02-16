using LibraryCafe.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryCafe.Data
{
    public class LibraryCafeDbContext : DbContext
    {
        public LibraryCafeDbContext(DbContextOptions<LibraryCafeDbContext> options)
            : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<Book> Books => Set<Book>();
        public DbSet<User> Users => Set<User>();
        public DbSet<MenuItem> MenuItems => Set<MenuItem>();
        public DbSet<Borrowing> Borrowings => Set<Borrowing>();
        public DbSet<BookReview> BookReviews => Set<BookReview>();
        public DbSet<CafeOrder> CafeOrders => Set<CafeOrder>();
        public DbSet<CafeOrderItem> CafeOrderItems => Set<CafeOrderItem>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<CafeReview> CafeReviews => Set<CafeReview>();
        public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships

            // Borrowing relationships
            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.User)
                .WithMany(u => u.Borrowings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.Book)
                .WithMany(bk => bk.Borrowings)
                .HasForeignKey(b => b.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // BookReview relationships
            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.User)
                .WithMany(u => u.BookReviews)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // CafeOrder relationships
            modelBuilder.Entity<CafeOrder>()
                .HasOne(co => co.User)
                .WithMany(u => u.CafeOrders)
                .HasForeignKey(co => co.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // CafeOrderItem relationships
            modelBuilder.Entity<CafeOrderItem>()
                .HasOne(coi => coi.Order)
                .WithMany(co => co.OrderItems)
                .HasForeignKey(coi => coi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CafeOrderItem>()
                .HasOne(coi => coi.MenuItem)
                .WithMany(mi => mi.OrderItems)
                .HasForeignKey(coi => coi.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // Payment relationships
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithMany(co => co.Payments)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany(u => u.Payments)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // CafeReview relationships
            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.User)
                .WithMany(u => u.CafeReviews)
                .HasForeignKey(cr => cr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.MenuItem)
                .WithMany(mi => mi.Reviews)
                .HasForeignKey(cr => cr.ItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}