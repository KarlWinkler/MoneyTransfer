using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace MoneyTransferAPI.Models
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Account> Accounts { get; set; }
        public virtual DbSet<Admin> Admins { get; set; }
        public virtual DbSet<Country> Countries { get; set; }
        public virtual DbSet<Currency> Currencies { get; set; }
        public virtual DbSet<Fee> Fees { get; set; }
        public virtual DbSet<Friend> Friends { get; set; }
        public virtual DbSet<Hour> Hours { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Partner> Partners { get; set; }
        public virtual DbSet<Paymentmethod> Paymentmethods { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Userearn> Userearns { get; set; }
        public virtual DbSet<Userreward> Userrewards { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("name=DBName", x => x.ServerVersion("8.0.27-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(e => new { e.AccountId, e.Username })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("account");

                entity.HasIndex(e => e.CurrencyId)
                    .HasName("currencyId");

                entity.Property(e => e.AccountId)
                    .HasColumnName("accountId")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Username)
                    .HasColumnName("username")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Balance).HasColumnName("balance");

                entity.Property(e => e.CurrencyId).HasColumnName("currencyId");

                entity.Property(e => e.Dob)
                    .HasColumnName("DOB")
                    .HasColumnType("date");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasColumnType("varchar(30)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.FName)
                    .IsRequired()
                    .HasColumnName("fName")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.LName)
                    .IsRequired()
                    .HasColumnName("lName")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Currency)
                    .WithMany(p => p.Accounts)
                    .HasForeignKey(d => d.CurrencyId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("account_ibfk_1");
            });

            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.AccountId)
                    .HasName("PRIMARY");

                entity.ToTable("admin");

                entity.Property(e => e.AccountId)
                    .HasColumnName("accountId")
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.ToTable("country");

                entity.HasIndex(e => e.CurrencyId)
                    .HasName("currencyId");

                entity.Property(e => e.CountryId).HasColumnName("countryId");

                entity.Property(e => e.CountryName)
                    .IsRequired()
                    .HasColumnName("countryName")
                    .HasColumnType("varchar(25)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.CurrencyId).HasColumnName("currencyId");

                entity.HasOne(d => d.Currency)
                    .WithMany(p => p.Countries)
                    .HasForeignKey(d => d.CurrencyId)
                    .HasConstraintName("country_ibfk_1");
            });

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.ToTable("currency");

                entity.Property(e => e.CurrencyName)
                    .IsRequired()
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.FromUsd).HasColumnName("FromUSD");
            });

            modelBuilder.Entity<Fee>(entity =>
            {
                entity.ToTable("fee");

                entity.HasIndex(e => e.CountryId)
                    .HasName("countryId");

                entity.Property(e => e.CountryId).HasColumnName("countryId");

                entity.Property(e => e.FeeName)
                    .IsRequired()
                    .HasColumnType("varchar(30)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.TarnsactionType).HasColumnName("tarnsactionType");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Fees)
                    .HasForeignKey(d => d.CountryId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("fee_ibfk_1");
            });

            modelBuilder.Entity<Friend>(entity =>
            {
                entity.HasKey(e => new { e.AccountId, e.FriendAccountd })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("friend");

                entity.HasIndex(e => e.FriendAccountd)
                    .HasName("friendAccountd");

                entity.Property(e => e.AccountId).HasColumnName("accountId");

                entity.Property(e => e.FriendAccountd).HasColumnName("friendAccountd");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.FriendAccounts)
                    .HasForeignKey(d => d.AccountId)
                    .HasConstraintName("friend_ibfk_1");

                entity.HasOne(d => d.FriendAccountdNavigation)
                    .WithMany(p => p.FriendFriendAccountdNavigations)
                    .HasForeignKey(d => d.FriendAccountd)
                    .HasConstraintName("friend_ibfk_2");
            });

            modelBuilder.Entity<Hour>(entity =>
            {
                entity.HasKey(e => new { e.LocationId, e.DayOfWeek })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("hours");

                entity.Property(e => e.DayOfWeek).HasColumnName("dayOfWeek");

                entity.Property(e => e.CloseTime).HasColumnName("closeTime");

                entity.Property(e => e.OpenTime).HasColumnName("openTime");

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.Hours)
                    .HasForeignKey(d => d.LocationId)
                    .HasConstraintName("hours_ibfk_1");
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("location");

                entity.HasIndex(e => e.AccountId)
                    .HasName("AccountId");

                entity.HasIndex(e => e.CountryId)
                    .HasName("countryId");

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasColumnName("city")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.CountryId).HasColumnName("countryId");

                entity.Property(e => e.FName)
                    .IsRequired()
                    .HasColumnName("fName")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.LName)
                    .IsRequired()
                    .HasColumnName("lName")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.PhoneNo)
                    .IsRequired()
                    .HasColumnName("phoneNo")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.HasOne(d => d.Account)
                    .WithMany(p => p.Locations)
                    .HasForeignKey(d => d.AccountId)
                    .HasConstraintName("location_ibfk_1");

                entity.HasOne(d => d.Country)
                    .WithMany(p => p.Locations)
                    .HasForeignKey(d => d.CountryId)
                    .HasConstraintName("location_ibfk_2");
            });

            modelBuilder.Entity<Partner>(entity =>
            {
                entity.HasKey(e => e.AccountId)
                    .HasName("PRIMARY");

                entity.ToTable("partner");

                entity.Property(e => e.AccountId)
                    .HasColumnName("accountId")
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<Paymentmethod>(entity =>
            {
                entity.HasKey(e => e.PaymentMethodNumber)
                    .HasName("PRIMARY");

                entity.ToTable("paymentmethod");

                entity.HasIndex(e => e.AccountId)
                    .HasName("accountId");

                entity.Property(e => e.PaymentMethodNumber)
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.AccountId).HasColumnName("accountId");

                entity.Property(e => e.PaymentMethodName)
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.TransId)
                    .HasName("PRIMARY");

                entity.ToTable("transactions");

                entity.HasIndex(e => e.CurrencyFromSender)
                    .HasName("CurrencyFromSender");

                entity.HasIndex(e => e.CurrencyToReceiver)
                    .HasName("CurrencyToReceiver");

                entity.HasIndex(e => e.FeeId)
                    .HasName("FeeId");

                entity.HasIndex(e => e.ReceiverId)
                    .HasName("ReceiverId");

                entity.HasIndex(e => e.SenderId)
                    .HasName("SenderId");

                entity.HasOne(d => d.CurrencyFromSenderNavigation)
                    .WithMany(p => p.TransactionCurrencyFromSenderNavigations)
                    .HasForeignKey(d => d.CurrencyFromSender)
                    .HasConstraintName("transactions_ibfk_3");

                entity.HasOne(d => d.CurrencyToReceiverNavigation)
                    .WithMany(p => p.TransactionCurrencyToReceiverNavigations)
                    .HasForeignKey(d => d.CurrencyToReceiver)
                    .HasConstraintName("transactions_ibfk_4");

                entity.HasOne(d => d.Fee)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.FeeId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("transactions_ibfk_5");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.AccountId)
                    .HasName("PRIMARY");

                entity.ToTable("user");

                entity.Property(e => e.AccountId)
                    .HasColumnName("accountId")
                    .ValueGeneratedNever();

                entity.Property(e => e.PhoneNumber)
                    .HasColumnName("phoneNumber")
                    .HasColumnType("varchar(20)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");
            });

            modelBuilder.Entity<Userearn>(entity =>
            {
                entity.HasKey(e => new { e.RewardId, e.UserId })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("userearn");

                entity.HasIndex(e => e.UserId)
                    .HasName("userId");

                entity.Property(e => e.RewardId).HasColumnName("rewardId");

                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Reward)
                    .WithMany(p => p.Userearns)
                    .HasForeignKey(d => d.RewardId)
                    .HasConstraintName("userearn_ibfk_2");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Userearns)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("userearn_ibfk_1");
            });

            modelBuilder.Entity<Userreward>(entity =>
            {
                entity.HasKey(e => e.RewardId)
                    .HasName("PRIMARY");

                entity.ToTable("userreward");

                entity.Property(e => e.RewardId).HasColumnName("rewardId");

                entity.Property(e => e.RewardLevel).HasColumnName("rewardLevel");

                entity.Property(e => e.RewardName)
                    .IsRequired()
                    .HasColumnName("rewardName")
                    .HasColumnType("varchar(30)")
                    .HasCharSet("utf8mb4")
                    .HasCollation("utf8mb4_0900_ai_ci");

                entity.Property(e => e.RewardPoints).HasColumnName("rewardPoints");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
