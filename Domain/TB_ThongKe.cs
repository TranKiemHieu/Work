using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_ThongKe_Filter_Request
    {
        public string TuKhoa { get; set; }
        public string ChuyenMucID { get; set; }
        public string NgonNgu { get; set; }
        public bool ChuyenMucKhac { get; set; }
        public string TuNgay { get; set; }
        public string DenNgay { get; set; }
        public long? NguoiCapNhat { get; set; }
        public int TrangThai { get; set; }
        public string UniqueCode { get; set; }
    }

    public class TB_ThongKe_ReadData
    {
        public string Data { get; set; }
        public string TuNgay { get; set; }
        public string DenNgay { get; set; }
    }

    public class TB_ThongKe_ReadResult
    {
        public bool Success { get; set; }
        public string FileName { get; set; }
        public string Message { get; set; }
    }
}
