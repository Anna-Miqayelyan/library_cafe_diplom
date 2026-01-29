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

		// You can add other tables later: CafeOrders, MenuItems, Payments, etc.
	}
}
