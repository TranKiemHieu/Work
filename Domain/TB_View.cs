using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_View
    {
        public short ID { get; set; }
        public string TenView { get; set; }
        public string MoTa { get; set; }
        public string DuongDan { get; set; }
        public string Area { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public short? ViewCapChaID { get; set; }
        public bool SuDung { get; set; }
        public long? NguoiTao { get; set; }
        public DateTime? NgayTao { get; set; }
        public long? NguoiCapNhat { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }

    public class TB_View_Filter_Request: TB_View
    {
        public string TuKhoa { get; set; }
        public short? ParentID { get; set; }
        public int SoLuong { get; set; }
    }

    public class TB_View_ThongSo : TB_View
    {
        public string TenViewCapCha { get; set; }
        public List<TB_ThongSoCauHinh_TrinhDien> ListCauHinh { get; set; }
    }

    public class TB_View_Type
    {
        public int ID { get; set; }
        public string Description { get; set; }
    }
}
