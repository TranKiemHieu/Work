using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class FAQ_YKien
    {
        public Guid? ID { get; set; }
        public string ChuyenMucID { get; set; } //chuyên mục hỏi đáp
        public string BaiVietID { get; set; }
        public string NguoiGui { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string NoiDung { get; set; }
        public string NoiDungTraLoi { get; set; }
        public TrangThaiYKien_HoiDap TrangThai { get; set; }
        public long? NguoiTaoLapId { get; set; }
        public long? NguoiChinhSuaId { get; set; }
        public DateTime? NgayTaoLap { get; set; }
        public DateTime? NgayChinhSua { get; set; }
        public string DanhDau { get; set; }
        public DateTime? NgayTraLoi { get; set; }
        public string CoQuanTraLoi { get; set; }
        //0: góp ý, ý kiến - 1: hỏi đáp
        public byte? Loai { get; set; }
        public string AnhDinhKem { get; set; }
    }

    public class FAQ_YKien_TrinhDien : FAQ_YKien
    {
        public string TenChuyenMuc { get; set; }
        public string TenBaiViet { get; set; }
    }

    public class FAQ_YKien_Filter_Request : FAQ_YKien
    {
        public string TuKhoa { get; set; }
        public int SoLuong { get; set; }
        public string BatDau { get; set; }
        public string KetThuc { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalRows { get; set; }
    }

    public class FAQ_YKien_UploadFile
    {
        public string Data { get; set; }
        public List<IFormFile> TepDinhKem { get; set; } = new List<IFormFile>();
    }
}
