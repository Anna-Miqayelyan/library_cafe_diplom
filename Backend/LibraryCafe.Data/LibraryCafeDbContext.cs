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

        public DbSet<Book> Books => Set<Book>();
        public DbSet<User> Users => Set<User>();
        public DbSet<MenuItem> MenuItems => Set<MenuItem>();
        public DbSet<Borrowing> Borrowings => Set<Borrowing>();
        public DbSet<BorrowRequest> BorrowRequests => Set<BorrowRequest>();
        public DbSet<BookReview> BookReviews => Set<BookReview>();
        public DbSet<CafeOrder> CafeOrders => Set<CafeOrder>();
        public DbSet<CafeOrderItem> CafeOrderItems => Set<CafeOrderItem>();
        public DbSet<CafeReview> CafeReviews => Set<CafeReview>();
        public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.User).WithMany(u => u.Borrowings)
                .HasForeignKey(b => b.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Borrowing>()
                .HasOne(b => b.Book).WithMany(bk => bk.Borrowings)
                .HasForeignKey(b => b.BookId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(r => r.User).WithMany()
                .HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(r => r.Book).WithMany()
                .HasForeignKey(r => r.BookId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.User).WithMany(u => u.BookReviews)
                .HasForeignKey(br => br.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookReview>()
                .HasOne(br => br.Book).WithMany(b => b.Reviews)
                .HasForeignKey(br => br.BookId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookReview>()
                .HasIndex(br => new { br.UserId, br.BookId }).IsUnique()
                .HasDatabaseName("UQ_bookreviews_user_book");

            modelBuilder.Entity<BookReview>()
                .Property(br => br.CreatedAt).HasDefaultValueSql("now()");

            modelBuilder.Entity<CafeOrder>()
                .HasOne(co => co.User).WithMany(u => u.CafeOrders)
                .HasForeignKey(co => co.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CafeOrderItem>()
                .HasOne(coi => coi.Order).WithMany(co => co.OrderItems)
                .HasForeignKey(coi => coi.OrderId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CafeOrderItem>()
                .HasOne(coi => coi.MenuItem).WithMany(mi => mi.OrderItems)
                .HasForeignKey(coi => coi.ItemId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.User).WithMany(u => u.CafeReviews)
                .HasForeignKey(cr => cr.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CafeReview>()
                .HasOne(cr => cr.MenuItem).WithMany(mi => mi.Reviews)
                .HasForeignKey(cr => cr.ItemId).OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CafeReview>()
                .HasIndex(cr => new { cr.UserId, cr.ItemId }).IsUnique()
                .HasDatabaseName("UQ_cafereviews_user_item");

            modelBuilder.Entity<CafeReview>()
                .Property(cr => cr.CreatedAt).HasDefaultValueSql("now()");

            modelBuilder.Entity<Book>()
                .Property(b => b.TotalCount).HasDefaultValue(1);
        }
    }
}