using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_BaiViet
    {
        public Guid? ID { get; set; }
        public string TieuDe { get; set; }
        public string AnhDaiDien { get; set; }
        public string Thumbnail { get; set; }
        public string MoTaAnhDaiDien { get; set; }
        public string TomTat { get; set; }
        public string NoiDung { get; set; }
        public bool TieuDiem { get; set; }
        public int? ThuTuHienThi { get; set; }
        public string URLBaiViet { get; set; }
        public DateTime? NgayCongBo { get; set; }
        public DateTime? HetHanCongBo { get; set; }
        public string NguonTin { get; set; }
        public string TacGia { get; set; }
        public string TacQuyen { get; set; }
        public string NgonNgu { get; set; }
        public int? LuotXem { get; set; }
        public string TuKhoa { get; set; }
        public int TrangThai { get; set; }
        public Guid? ChuyenMucID { get; set; }
        public string ChuyenMucKhacID { get; set; }
        public DateTime? CreatedOnDate { get; set; } 
        public DateTime? LastModifiedOnDate { get; set; }
        public long? CreatedByUserID { get; set; }
        public long? LastModifiedByUserID { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public TimeSpan? GioMoCua { get; set; }
        public TimeSpan? GioDongCua { get; set; }
        public string DiaChi { get; set; }
        public string Website { get; set; }
        public double? ToaDoX {  get; set; }
        public double? ToaDoY { get; set; }
    }

    public class TB_BaiVietTrinhDien : TB_BaiViet
    {
        public string TenChuyenMuc { get; set; }
        public int LoaiChuyenMuc {get; set; }
        public string URLChuyenMuc {get; set; }
        public string TenVietTat { get; set; }
        public int TotalRows { get; set; }
        public int PageSize { get; set; }
        public bool isAuthorizeUser1 { get; set; } = true;
        public bool isAuthorizeUser2 { get; set; } = true;
        public bool isAuthorizeUser3 { get; set; } = true;
        public int TongSoMedia { get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public string TenNguoiCapNhat { get; set; }
        public List<TB_Media> ListMedia { get; set; } = new List<TB_Media>();
    }

    public class TB_BaiVietRequest : TB_BaiViet
    {
        public bool XoaDaiDien { get; set; }
        public bool XoaThumbnail { get; set; }
        public string PreAnhDaiDien { get; set; }
        public string PreThumbnail { get; set; }
    }

    public class BaiVietFilterRequest
    {
        public string TuKhoa { get; set; }
        public string ChuyenMuc { get; set; }
        public string ChuyenMucID { get; set; }
        public string BatDau { get; set; }
        public string KetThuc { get; set; }
        public long UserID {get; set; }
        public int SoLuong { get; set; } = 0;
        public bool IsTieuDiem { get; set; } = false;
    }

    public class TB_BaiVietHomeRequest
    {
        public string URLChuyenMuc { get; set; }
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
    }
    public class BaiVietDeleteImageRequest
    {
        public string ID { get; set; }
        public int Type { get; set; }   //0 - AnhDaiDien, 1 - Thumbnail
    }

    public class TB_BaiViet_ThongKe
    {
        public DateTime? NgayCongBo { get; set; }
        public int TongSoChuyenMuc { get; set; }
        public int TongSoChuyenMucSuDung { get; set; }
        public int TongSoBaiViet { get; set; }
        public int TongSoBaiVietCongBo { get; set; }
        public int TongSoLuotXem { get; set; }
        public int TongSoLuotTai { get; set; }
    }
}
