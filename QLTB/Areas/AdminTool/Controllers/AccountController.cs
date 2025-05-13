using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QLTB.Controllers;
using QLTB.ViewModels;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    public class AccountController : AdminControllerBase
    {
        [Authorize]
        public async Task<IActionResult> Index()
        {
            ViewPermissionViewModel permission = await getPermission();
            if (permission.PermittedView == 0)
                return View("Error");

            var claimUser = (ClaimsIdentity)User.Identity;
            if (claimUser != null)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;

                var arr = rolename.Split(',');
                for (var i = 0; i < arr.Length; i++)
                {
                    if (arr[i] != null && (arr[i].ToUpper() == "HOST" || arr[i].ToUpper() == "SYSTEMADMIN"))
                    {
                        ViewBag.isAdmin = 1;
                        break;
                    }
                    else
                    {
                        ViewBag.isAdmin = 0;
                    }
                }
            }
            ViewBag.PageTitle = "Quản lý người dùng";
            return View(permission);
        }
    }
}
