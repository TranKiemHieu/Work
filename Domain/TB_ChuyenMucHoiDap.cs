using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_ChuyenMucHoiDap
    {
        public Guid? ID { get; set; }
        public string TenChuyenMuc { get; set; }
        public string TenVietTat { get; set; }
        public string MoTa { get; set; }
        public bool SuDung { get; set; }
        public int ThuTuHienThi { get; set; }
        public long? NguoiTao { get; set; }
        public DateTime? NgayTao { get; set; }
        public long? NguoiCapNhat { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
}
