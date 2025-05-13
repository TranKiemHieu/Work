using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_ThietLapCauHinh
    {
        public byte ID { get; set; }
        public string TenTieuChi { get; set; }
        public byte? Loai { get; set; }
        public string TenLoai { get; set; }
        public bool SuDung { get; set; }
        public string MoTa { get; set; }
    }

    public class TB_ThietLapCauHinh_Filter_Request : TB_ThietLapCauHinh
    {
        public string TuKhoa { get; set; }
        public int SoLuong { get; set; }
    }
}
