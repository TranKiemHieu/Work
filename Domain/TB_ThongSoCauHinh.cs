using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_ThongSoCauHinh
    {
        public Guid? ID { get; set; }
        public short MaView { get; set; }
        public byte MaTieuChi { get; set; }
        public string GiaTriThietLap { get; set; }
        public long? NguoiTao { get; set; }
        public DateTime? NgayTao { get; set; }
        public long? NguoiCapNhat { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public string TenThongSo { get; set; }
        public int ThuTuHienThi { get; set; }
        public byte? DuLieuLienKet { get; set; } //1: chuyên mục - 2: bài viết - 3: media
    }

    public class TB_ThongSoCauHinh_Filter_Request : TB_ThongSoCauHinh
    {
        public string TuKhoa { get; set; }
        public int SoLuong { get; set; }
    }

    public class TB_ThongSoCauHinh_TrinhDien : TB_ThongSoCauHinh
    {
        public string TenView { get; set; }
        public string TenTieuChi { get; set; }
        public byte? Loai { get; set; }
        public string TenLoai { get; set; }
        public string DuongDan { get; set; }
        public bool SuDung { get; set; }
        public List<ChuyenMucTrinhDien> ListChuyenMuc { get; set; } = new List<ChuyenMucTrinhDien>();
        public List<TB_BaiVietTrinhDien> ListBaiViet { get; set; } = new List<TB_BaiVietTrinhDien>();
        public List<TB_Media> ListMedia { get; set; } = new List<TB_Media>();
        public List<TB_View_Type> ListViewType { get; set; } = new List<TB_View_Type>();
        public List<FAQ_YKien_TrinhDien> ListFAQ_YKien { get; set; } = new List<FAQ_YKien_TrinhDien>();
        public string TenViewCapCha { get; set; }
        public object Media { get; set; } = new object();
    }

    public class TB_ThongSoCauHinh_Request : TB_ThongSoCauHinh
    {
        public bool XoaDaiDien { get; set; }
        public bool XoaFile { get; set; }
        public string PreAnhDaiDien { get; set; }
        public string PreFile { get; set; }
    }

    public class TB_ThongSoCauHinh_DLLK
    {
        public List<ChuyenMucTrinhDien> ListChuyenMuc { get; set; } = new List<ChuyenMucTrinhDien>();
        public List<TB_BaiVietTrinhDien> ListBaiViet { get; set; } = new List<TB_BaiVietTrinhDien>();
        public List<TB_Media> ListMedia { get; set; } = new List<TB_Media>();
        public List<TB_View_Type> ListViewType { get; set; } = new List<TB_View_Type>();
    }
   
    public class ThongSoCauHinhTrinhDien
    {
        public List<TB_ThongSoCauHinh_TrinhDien> ListThongSo {get; set;} = new List<TB_ThongSoCauHinh_TrinhDien>();
        public List<TB_BaiVietTrinhDien> ListBaiViet { get; set;} = new List<TB_BaiVietTrinhDien>();
    }
    public class ModelPaging
    {
        public string DuongDanView { get; set;}
        public string ChuyenMucID { get; set;}
        public int PageIndex { get; set;}
        public int PageSize { get; set;}
        public bool TieuDiem { get; set; } = false;
    }
}
