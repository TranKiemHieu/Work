using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain
{
    public class TB_MenuPermission
    {
        public byte Id { get; set; }
        public string Rolename {  get; set; }
        public byte MenuId { get; set; }
        public bool PermittedEdit { get; set; }
        public bool PermittedDelete { get; set; }
        public bool PermittedApprove { get; set; }
        public bool PermittedCreate { get; set; }
    }

    public class MenuPermissionRequest : TB_MenuPermission
    {
        public string permission { get; set; }
    }
    public class MenuItemCompact
    {
        public int Id { get; set; }
        public int? PermissionType { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; }
        public bool IsLeaf { get; set; }
        public bool? IsPermission { get; set; } = false;
        public bool? PermitedEdit { get; set; }
        public bool? PermitedCreate { get; set; }
        public bool? PermitedDelete { get; set; }
        public bool? PermitedApprove { get; set; }
        public int? PermissionId { get; set; }
        public bool HasPermission { get; set; } = false;
    }
 
    public class PermissionDto
    {
        public bool? PermittedEdit { get; set; }
        public bool? PermittedView { get; set; }
        public bool? PermittedDelete { get; set; }
        public bool? PermittedApprove { get; set; }
        public bool? PermittedCreate { get; set; }
    }

    public class Permission_Menu
    {
        public string RoleName { get; set; }
        public string ListMenuID {get; set;}
    }
}
