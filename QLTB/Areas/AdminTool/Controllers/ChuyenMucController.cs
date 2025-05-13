using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class ChuyenMucController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");

            ViewBag.PageTitle = "Quản lý chuyên mục";
            return View(vm);
        }

        [Authorize]
        public async Task<IActionResult> Edit(string id = "")
        {
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");

            if (string.IsNullOrWhiteSpace(id))
            {
                ViewBag.PageTitle = "Thêm mới chuyên mục";
            }
            else 
            {
                ViewBag.PageTitle = "Cập nhật chuyên mục";
            }
            
            ViewBag.Id = id;
            return View(vm);
        }

        [Authorize]
        public async Task<IActionResult> PhanQuyen()
        {
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");
            ViewBag.PageTitle = "Phân quyền chuyên mục";
            return View(vm);
        }
    }
}
