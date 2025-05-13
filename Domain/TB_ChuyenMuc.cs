using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class TB_ChuyenMuc
    {
        public Guid? ID { get; set; }
        public string TenChuyenMuc { get; set; }
        public Guid? ChuyenMucCapChaID { get; set; }
        public string BieuTuong { get; set; }
        public string AnhDaiDien { get; set; }
        public string MaChuyenMuc { get; set; }
        public string MoTaAnhDaiDien { get; set; }
        public string MoTa { get; set; }
        public string NoiDung { get; set; }
        public bool SuDung { get; set; }
        public int ThuTuHienThi { get; set; }
        public string URLChuyenMuc { get; set; }
        public bool MoLienKetOCuaSoMoi { get; set; }
        public byte LoaiLienKet { get; set; }
        public string DiaChiLienKet { get; set; } // địa chỉ của một trang bên ngoài khác hoặc một trang của website
        public string NgonNgu { get; set; }
        public long? CreatedByUserID { get; set; }
        public long? LastModifiedByUserID { get; set; }
        public DateTime? CreatedOnDate { get; set; }
        public DateTime? LastModifiedOnDate { get; set; }
        public bool IsMenu {get; set;}
        public bool IsActive { get; set;}
    }

    public class TB_ChuyenMucRequest : TB_ChuyenMuc
    {
        public bool XoaAnhBieuTuong { get; set; }
        public bool XoaAnhDaiDien { get; set; }
    }

    public class ChuyenMucSelect
    {
        public Guid ID { get; set; }
        public Guid? ChuyenMucCapChaID { get; set; }
        public string TenChuyenMuc { get; set; }
        public Boolean isLeaf { get; set; }
        public bool SuDung { get; set; }
        public bool isSelected {get; set; } // được phép chọn khi thêm mới không ( = false nếu chỉ có quyền duyệt bài viết = User3)
    }

    public class ChuyenMucFilterRequest
    {
        public string TuKhoa { get; set; }
    }

    public class ChuyenMucDeleteImageRequest
    {
        public string ID { get; set; }
        public int Type { get; set; }   //0 - AnhDaiDien, 1 - AnhBieuTuong
    }
    public class ChuyenMucTrinhDien : TB_ChuyenMuc
    {
        public string TenChuyenMucCapCha { get; set; }
  		public int TongSoBaiViet { get; set; }
        public string TrangLienKet{ get; set; }
    }

    public class TreeChuyenMuc :TB_ChuyenMuc
    { 
        public int Cap { get; set; }
        public bool isMenu {get; set; }
    }

}
