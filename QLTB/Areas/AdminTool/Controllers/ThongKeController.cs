using Azure.Core;
using Domain;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Persistence;
using System.ComponentModel;
using System.Reflection;
using System.Security.Claims;
using static Dapper.SqlMapper;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class ThongKeController : AdminControllerBase
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly DataContext _context;

        public ThongKeController(ILogger<HomeController> logger, UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, DataContext dataContext)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _context = dataContext;
        }

        [Authorize]
        public async Task<IActionResult> ThongKeBaiViet()
        {
            var listNgonNgu = _context.TB_BaiViet.Select(x => x.NgonNgu).Distinct().ToList();
            ViewBag.ListNgonNgu = listNgonNgu;

            var claimUser = (ClaimsIdentity)User.Identity;
            if (claimUser != null && claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                
                if (!isAdmin)
                {
                    var user = await _userManager.FindByNameAsync(claimUser.Name);
                    var list = user != null? _context.AppUser.Where(x => x.OrgUniqueCode == user.OrgUniqueCode) : null;
                    ViewBag.ListNguoiCapNhat = list != null && list.Count() > 0? list.ToList() : null;
                }
                else
                {
                    var list = _context.AppUser.ToList();
                    ViewBag.ListNguoiCapNhat = list != null && list.Count() > 0 ? list.ToList() : null;
                }
            }

            var vm = await getPermission();
            if (vm.PermittedView == 0)
                return View("Error");
            return View(vm);
        }
    }
}
