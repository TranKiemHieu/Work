using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, Int64>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }

            //trigger
            builder.Entity<TB_AdminMenu>()
                .ToTable(tb => tb.HasTrigger("trg_Insert_Menu"));

            builder.Entity<TB_AdminMenu>()
                .ToTable(tb => tb.HasTrigger("trg_Delete_Menu"));
        }

        public DbSet<Activity> Activity { get; set; }
        public DbSet<CongViec> CongViec { get; set; }
        public DbSet<TB_ChuyenMuc> TB_ChuyenMuc { get; set; }
        public DbSet<TB_BaiViet> TB_BaiViet { get; set; }
        public DbSet<AppUser> AppUser { get; set; }
        public DbSet<TB_AdminMenu> TB_AdminMenu { get; set; }
        public DbSet<TB_MenuPermission> Permission_Menu { get; set; }
        //   public DbSet<Permission_Menu> Permission_Menu { get; set; }
        public DbSet<TB_View> TB_View { get; set; }
        public DbSet<TB_ThietLapCauHinh> TB_ThietLapCauHinh { get; set; }
        public DbSet<TB_ThongSoCauHinh> TB_ThongSoCauHinh { get; set; }
        public DbSet<TB_ChuyenMucHoiDap> TB_ChuyenMucHoiDap { get; set; }
        public DbSet<FAQ_YKien> FAQ_YKien { get; set; }
        public DbSet<TB_Media> TB_Media { get; set; }
    }
}
