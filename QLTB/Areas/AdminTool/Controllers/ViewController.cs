using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class ViewController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            ViewBag.PageTitle = "Quản lý view";
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");
            return View(vm);
        }
    }
}
