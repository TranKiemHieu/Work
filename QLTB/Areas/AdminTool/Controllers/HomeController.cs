using Application.AdminMenu;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class HomeController : Controller
    {
        [Authorize]
        [Route("/AdminTool")]
        public IActionResult Index()
        {
            ViewBag.PageTitle = "Trang chủ";
            var claimUser = (ClaimsIdentity)User.Identity;
           // string orgCode = claimUser != null? claimUser.FindFirst("OrgUniqueCode").Value : null;
            ViewBag.orgUniqueCode = ""; // orgCode;
            return View();
        }
        public IActionResult TableDemo()
        {
            return View();
        }

        [Route("StatusCodeError/{statusCode}")]
        public IActionResult Error(int statusCode)
        {
            if (statusCode == 404)
            {
                ViewBag.Error = "Không tìm thấy trang hoặc bạn không có quyền truy cập trang này!";
            }
           
            return View();
        }
    }
}
