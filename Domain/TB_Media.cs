using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_Media
    {
        public int ID { get; set; }
        public string TieuDe { get; set; }
        public string MoTa { get; set; }
        public int? LuotTai { get; set; }
        public string TenFileMedia { get; set; }
        public string DuongDan { get; set; }
        public int LoaiFileMedia { get; set; }
        public Guid? BaiVietID { get; set; }
        public DateTime? CreatedOnDate { get; set; }
        public DateTime? LastModifiedOnDate { get; set; }
        public int ThuTuHienThi { get; set; }
    }

    public class MediaRequest : TB_Media
    {
        public bool XoaFile { get; set; }
    }
    public class MediaDeleteRequest
    {
        public string ID { get; set; }
        public string duongDan { get; set; }
    }
}
