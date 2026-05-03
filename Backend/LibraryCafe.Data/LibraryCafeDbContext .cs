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

        // ── Core entities ──────────────────────────────────────────
        public DbSet<User> Users => Set<User>();
        public DbSet<Book> Books => Set<Book>();
        public DbSet<MenuItem> MenuItems => Set<MenuItem>();

        // ── Library ────────────────────────────────────────────────
        public DbSet<Borrowing> Borrowings => Set<Borrowing>();
        public DbSet<BorrowRequest> BorrowRequests => Set<BorrowRequest>();
        public DbSet<BookReview> BookReviews => Set<BookReview>();

        // ── Café ───────────────────────────────────────────────────
        public DbSet<CafeOrder> CafeOrders => Set<CafeOrder>();
        public DbSet<CafeOrderItem> CafeOrderItems => Set<CafeOrderItem>();
        public DbSet<CafeReview> CafeReviews => Set<CafeReview>();

        // ── Reservations ───────────────────────────────────────────
        public DbSet<SeatReservation> SeatReservations => Set<SeatReservation>();

        // ── System ─────────────────────────────────────────────────
        public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── Borrowing ──────────────────────────────────────────
            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.User)
                .WithMany(u => u.Borrowings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.Book)
                .WithMany(bk => bk.Borrowings)
                .HasForeignKey(b => b.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // ── BorrowRequest ──────────────────────────────────────
            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.User)
                .WithMany(u => u.BorrowRequests)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.Book)
                .WithMany()
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // ── BookReview ─────────────────────────────────────────
            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.User)
                .WithMany(u => u.BookReviews)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.Book)
                .WithMany(b => b.Reviews)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookReview>()
                .HasIndex(br => new { br.UserId, br.BookId })
                .IsUnique()
                .HasDatabaseName("UQ_bookreviews_user_book");

            modelBuilder.Entity<BookReview>()
                .Property(br => br.CreatedAt)
                .HasDefaultValueSql("now()");

            // ── CafeOrder ──────────────────────────────────────────
            modelBuilder.Entity<CafeOrder>()
                .HasOne(co => co.User)
                .WithMany(u => u.CafeOrders)
                .HasForeignKey(co => co.UserId)
                .OnDelete(DeleteBehavior.Cascade);

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

            // ── CafeReview ─────────────────────────────────────────
            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.User)
                .WithMany(u => u.CafeReviews)
                .HasForeignKey(cr => cr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.MenuItem)
                .WithMany(mi => mi.Reviews)
                .HasForeignKey(cr => cr.ItemId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CafeReview>()
                .HasIndex(cr => new { cr.UserId, cr.ItemId })
                .IsUnique()
                .HasDatabaseName("UQ_cafereviews_user_item");

            modelBuilder.Entity<CafeReview>()
                .Property(cr => cr.CreatedAt)
                .HasDefaultValueSql("now()");

            // ── SeatReservation ───────────────────────────────────
            modelBuilder.Entity<SeatReservation>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ── Book defaults ──────────────────────────────────────
            modelBuilder.Entity<Book>()
                .Property(b => b.TotalCount)
                .HasDefaultValue(1);
        }
    }
}