namespace QLTB.ViewModels
{
    public class ViewPermissionViewModel
    {
        //  permisstion menu
        public int PermittedView { get; set; }
        public int PermittedEdit { get; set; }
        public int PermittedDelete { get; set; }
        public int PermittedApprove { get; set; }
        public int PermittedCreate { get; set; }
        
        //  permisstion user
        public int PermittedUser1 { get; set;}
        public int PermittedUser2 { get; set;}
        public int PermittedUser3 { get; set;}
    }


    public class DataPermissionViewModel
    {
        public bool IsAdmin { get; set; }
        public string UniqueCode { get; set; }
    }
}
