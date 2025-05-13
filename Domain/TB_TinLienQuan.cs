using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_TinLienQuan
    {
        public int ID { get; set; }
        public Guid? BaiVietID { get; set; }
        public Guid? BaiVietLienQuanID{ get; set; }
    }
    public class TinLienQuanTrinhDien : TB_TinLienQuan
    {
        public string TieuDe { get; set; }
        public string TenChuyenMuc {get; set; }
        public string TacGia {get; set; }
        public int TrangThai { get; set; }
    }
}
