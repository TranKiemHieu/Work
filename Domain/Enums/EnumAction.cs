using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Reflection;

namespace Domain.Enums
{
    public enum EnumAction
    {
        /// <summary>
        /// Xem
        /// </summary>
        [Description("Xem")]
        Xem = 1,
        /// <summary>
        /// Tải về
        /// </summary>
        [Description("Tải về")]
        TaiVe = 2,
    }
    public enum LoaiLienKet
    {
        /// <summary>
        /// 
        /// </summary>
        [Description("Không có loại liên kết")]
        Không = 1,
        /// <summary>
        /// 
        /// </summary>
        [Description("Một liên kết đến một trang bên ngoài")]
        URL = 2,
        /// <summary>
        /// 
        /// </summary>
        [Description("Một trang của website")]
        Trang = 3,
    }

    public enum LoaiFileMedia
    {
        /// <summary>
        /// 
        /// </summary>
        [Description("application/")]
        VanBan = 1,
        /// <summary>
        /// 
        /// </summary>
        [Description("audio/")]
        Audio = 2,
        /// <summary>
        /// 
        /// </summary>
        [Description("video/")]
        Video = 3,
        /// <summary>
        /// 
        /// </summary>
        [Description("image/")]
        Anh = 4,
    }
    /// <summary>
    /// User thuộc loại quyền hạn (1 , 2, 3) trong bảng PermissionCategory
    /// </summary>
    public enum Type_CatePermission
    {
        /// <summary>
        /// Quyền cập nhật thông tin và hiệu chỉnh do mình cập nhật (tương đương Loai = 1)
        /// </summary>
        User1 = 1,
        /// <summary>
        /// Quyền hiệu chỉnh thông tin (tương đương Loai = 2)
        /// </summary>
        User2 = 2,
        /// <summary>
        /// Quyền duyệt thông tin (tương đương Loai = 3)
        /// </summary>
        User3 = 3,
    }
    /// <summary>
    /// Loại chuyên mục in ( văn bản, tin tức, media)
    /// </summary>
    public enum LoaiChuyenMuc
    {
        /// <summary>
        /// 
        /// </summary>
        [Description("Văn bản")]
        VanBan = 1,
        /// <summary>
        /// 
        /// </summary>
        [Description("Tin tức")]
        TinTuc = 2,
        /// <summary>
        /// 
        /// </summary>
        [Description("Media")]
        Media = 3,
    }

    public enum TrangThaiBaiViet
    {
        /// <summary>
        /// Đã được duyệt nhưng không công bố
        /// </summary>
        [Description("Không công bố")]
        KhongCongBo = 0,
        /// <summary>
        /// 
        /// </summary>
        [Description("Công bố")]
        CongBo = 1,
        /// <summary>
        /// khi duyệt sẽ chuyển đến trạng thái công bố hoặc không công bố
        /// </summary>
        [Description("Chờ duyệt")]
        ChoDuyet = 2,
    }

    public enum TrangThaiYKien_HoiDap
    {
        /// <summary>
        /// Đã tiếp nhận ý kiến
        /// </summary>
        [Description("Đã tiếp nhận")]
        DaTiepNhan = 0,
        /// <summary>
        /// Đã phản hồi ý kiến/trả lời câu hỏi
        /// </summary>
        [Description("Đã phản hồi")]
        DaPhanHoi = 1,
        /// <summary>
        /// khi tiếp nhận sẽ chuyển đến trạng thái công bố hoặc hủy công bố
        /// </summary>
        [Description("Công bố")]
        CongBo = 2,
        /// <summary>
        /// Hủy công bố ý kiến đã công bố
        /// </summary>
        [Description("Hủy công bố")]
        HuyCongBo = 3,
    }

    public enum typeView
    {
        /// <summary>
        /// Đã tiếp nhận ý kiến
        /// </summary>
        [Description("Danh sách sản phẩm")]
        DanhSachSanPham = 1,
        /// <summary>
        /// Đã phản hồi ý kiến/trả lời câu hỏi
        /// </summary>
        [Description("Tin tức")]
        TinTuc = 2,
        /// <summary>
        /// khi tiếp nhận sẽ chuyển đến trạng thái công bố hoặc hủy công bố
        /// </summary>
        [Description("Danh sách dịch vụ")]
        DanhSachDichVu = 3,
        /// <summary>
        /// Hủy công bố ý kiến đã công bố
        /// </summary>
        [Description("Tin tức sự kiện")]
        TinTucSuKien = 4,
        /// <summary>
        /// 
        /// </summary>
        [Description("Tin hoạt động - tin chuyên ngành")]
        TinHoatDong = 5,
        /// <summary>
        /// 
        /// </summary>
        [Description("Danh sách blog")]
        DanhSachBlog = 6,

        [Description("Dạng list chuyên mục")]
        ListChuyenMuc = 7,

        [Description("Đọc nhiều nhất")]
        DocNhieuNhat = 8,

        [Description("Sản phẩm")]
        SanPham = 9,

        [Description("Dịch vụ")]
        DichVu = 10,

        [Description("Đào tạo")]
        DaoTao = 11,

        [Description("Dạng slide")]
        Slide = 12,

        [Description("Dạng list bài viết")]
        ListBaiViet = 13,

        [Description("Thư mời")]
        ThuMoi = 14,

        [Description("Media (2 X 3)")]
        Media = 15,
		
		[Description("Góp ý, ý kiến")]
        GopY = 16,
		
		[Description("Hỏi đáp")]
        HoiDap = 17,

        [Description("Dạng list Hỏi đáp/Góp ý, ý kiến")]
        ListHoiDapGopY = 18,

        [Description("Banner")]
        Banner = 19
    }
}
