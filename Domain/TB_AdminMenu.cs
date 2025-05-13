using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class TB_AdminMenu
    {
        public byte Id {  get; set; }
        public int? ParentId {  get; set; }
        public string AreaName {  get; set; }
        public string ControllerName {  get; set; }
        public string ActionName {  get; set; }
        public string Title {  get; set; }
        public bool IsLeaf {  get; set; }
        public string Icon {  get; set; }
        public int DisplayOrder { get; set; }
        public bool IsShow { get; set; }
    }
    public class MenuItem : TB_AdminMenu
    {
        public bool HasChildren { get; set; }
    }
  
    public class MenuItemWithRoles : TB_AdminMenu
    {
        public string ListRole { get; set; }
    }
    public class NavMenuModel : TB_AdminMenu
    {
        public bool IsAuthorize { get; set; } = false;
        public List<string> ListRoles { get; set; } = new List<string>();
        public List<SubnavMenuModel> ListChilds { get; set; } = new List<SubnavMenuModel>();

    }

    public class SubnavMenuModel : TB_AdminMenu
    {
        public bool IsAuthorize { get; set; } = false;
        public List<string> ListRoles { get; set; } = new List<string>();

    }
}
