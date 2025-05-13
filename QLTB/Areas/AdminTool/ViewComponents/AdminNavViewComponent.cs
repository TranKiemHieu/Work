using Application.AdminMenu;
using Application.Core;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Persistence;
using QLTB.Models;
using ServiceStack;
using System.Data;
using System.Security.Claims;
using Xceed.Document.NET;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QLTB.Areas.AdminTool.ViewComponents
{
    public class AdminNavViewComponent : ViewComponent
    {
      
        private readonly IMediator _mediator;
        private readonly DataContext _context;
        public AdminNavViewComponent(IMediator mediator, DataContext context)
        {
            _mediator = mediator;
            _context = context;
        }

      
        public IViewComponentResult Invoke()
        {

       
            var user = (ClaimsIdentity)User.Identity;
            string strArrRoles = user.FindFirst("RolesList").Value;
            string[] arrRoles = strArrRoles.Split(',');


            var lstMenu = _context.TB_AdminMenu.ToList();
            var subMenuPermission = _context.Permission_Menu.ToList();
           
            List<NavMenuModel> result = new List<NavMenuModel>();


            if (lstMenu != null && lstMenu.Count > 0)
            {
                foreach (var menuParent in lstMenu)
                {
                    if (menuParent.IsLeaf == false)
                    {
                        result.Add(new NavMenuModel
                        {
                            Id = menuParent.Id,
                            Title = menuParent.Title,
                            AreaName = menuParent.AreaName,
                            ControllerName = menuParent.ControllerName,
                            ActionName = menuParent.ActionName,
                            Icon = menuParent.Icon,
                            IsLeaf = menuParent.IsLeaf,
                            IsShow = menuParent.IsShow,
                            ListRoles = arrRoles.ToList(),
                            IsAuthorize = arrRoles.ToList().Exists(e => e.Equals("Host") == true),
                            DisplayOrder = menuParent.DisplayOrder,
                        });
                    }

                }
                foreach (var menuParent in result)
                {
                    foreach (var menuChild in lstMenu)
                    {
                        if (menuChild.IsLeaf == true && menuChild.ParentId == menuParent.Id)
                        {
                            bool isAuthorize = false;
                            foreach(string role in menuParent.ListRoles)
                            {
                                bool flag =  subMenuPermission.Exists(e => e.MenuId == menuChild.Id && e.Rolename.Equals(role) == true);
                                if(flag == true || role == "Host")
                                {
                                    isAuthorize = true;
                                    menuParent.IsAuthorize = true; //set authorize = true if submenu has authoriza = true
                                }
                            }
                          
                            menuParent.ListChilds.Add(new SubnavMenuModel
                            {
                                Id = menuChild.Id,
                                Title = menuChild.Title,
                                AreaName = menuChild.AreaName,
                                ControllerName = menuChild.ControllerName,
                                ActionName = menuChild.ActionName,
                                Icon = menuChild.Icon,
                                IsLeaf = true,
                                IsShow = menuChild.IsShow,
                                IsAuthorize = isAuthorize,
                                DisplayOrder = menuChild.DisplayOrder,
                                
                            });
                        }
                    }
                }
            }
            result.Sort((a,b) => a.DisplayOrder - b.DisplayOrder);
            foreach(var item in result) {
                item.ListChilds.Sort((a, b) => a.DisplayOrder - b.DisplayOrder);
            }
            return View(result);
        }
    }
}
