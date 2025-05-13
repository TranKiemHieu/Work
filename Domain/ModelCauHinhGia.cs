using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class ModelCauHinhGia
    {

        public int ID { get; set; }
        public string ChuyenMucID { get; set; }
        public bool IsTomTat { get; set; }
        public bool IsHinhAnh {  get; set; }
        public bool IsThumbnail {  get; set; }
        public bool IsNgayCongBo {  get; set; }
        public bool IsHetHanCongBo {  get; set; }
        public int PageSize {get;set; }
        public int ColumnNumber { get;set; } // số bài viết trên một hàng
        public List<TB_BaiVietTrinhDien> BaiViet {get; set;}
    }
}
