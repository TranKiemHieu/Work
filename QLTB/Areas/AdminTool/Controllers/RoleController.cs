using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLTB.ViewModels;

namespace QLTB.Areas.AdminTool.Controllers
{
    public class RoleController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> IndexAsync()
        {
            ViewPermissionViewModel permission = await getPermission();
            if (permission.PermittedView == 0)
                return View("Error");
            ViewBag.PageTitle = "Quản lý vai trò";
            return View(permission);
        }
    }
}
