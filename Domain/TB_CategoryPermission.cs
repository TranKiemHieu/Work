using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class TB_CategoryPermission
    {
        public long UserID { get; set; }
        public Guid ChuyenMucID {  get; set; }
        public int Loai { get; set; } // = 1(User1), = 2(User2), = 3(User3) 
    }
    public class CategoryPermissionRequest : TB_CategoryPermission
    {
        public string User1 {get; set; } // Quyền cập nhật thông tin và hiệu chỉnh thông tin do mình cập nhật
        public string User2 {get; set; } // Quyền hiệu chỉnh thông tin
        public string User3 {get; set; } // Quyền duyệt thông tin
        public bool? ApDungChoCapCon { get; set; } // Áp dụng phân quyền cho cả chuyên mục con của chuyên mục hiên tại
    }
}
