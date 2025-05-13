using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class ThongSoCHController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var vm = await getPermission();
            ViewBag.PageTitle = "Thông số cấu hình";
            if (vm.PermittedView == 0)
                return View("Error");
            return View(vm);
        }
    }
}
