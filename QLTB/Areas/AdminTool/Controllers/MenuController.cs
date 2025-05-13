using Application.AdminMenu;
using Application.BaiViet;
using Aspose.Cells;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using QLTB.ViewModels;

namespace QLTB.Areas.AdminTool.Controllers
{
    public class MenuController : AdminControllerBase
    {
        private readonly IMediator _mediator;

        public MenuController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [Authorize]
        public async Task<IActionResult> Index()
        {
            ViewPermissionViewModel permission = await getPermission();
            if (permission.PermittedView == 0)
                return View("Error");
            ViewBag.PageTitle = "Quản lý menu";
            return View(permission);
        }
        
    }
}
