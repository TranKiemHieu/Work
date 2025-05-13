using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLTB.ViewModels;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    public class BaiVietController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");

            ViewBag.PageTitle = "Quản lý bài viết";
            return View(vm);
        }

        [Authorize]
        [Route("/BaiViet/Edit/{id?}")]
        public async Task<IActionResult> Edit(string id = "")
        {
            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");

            if (string.IsNullOrWhiteSpace(id))
            {
                ViewBag.PageTitle = "Thêm mới bài viết";

                if (vm.PermittedCreate == 0)
                    return View("Error");
            }
            else
            {
                ViewBag.PageTitle = "Cập nhật bài viết";

                if (vm.PermittedEdit == 0)
                    return View("Error");
            }

            ViewBag.Id = id;
            return View(vm);
        }
    }
}
