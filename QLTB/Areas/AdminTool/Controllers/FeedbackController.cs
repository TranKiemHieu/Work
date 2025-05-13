using Application.AdminMenu;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class FeedbackController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> YKienPhanHoi()
        {
            var vm = await getPermission();
            ViewBag.PageTitle = "Danh sách góp ý, ý kiến";
            if (vm.PermittedView == 0)
                return View("Error");
            return View(vm);
        }

        [Authorize]
        public async Task<IActionResult> HoiDap()
        {
            var vm = await getPermission();
            ViewBag.PageTitle = "Danh sách hỏi đáp";
            if (vm.PermittedView == 0)
                return View("Error");
            return View(vm);
        }
    }
}
