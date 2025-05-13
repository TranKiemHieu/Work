using MediatR;
using Microsoft.AspNetCore.Mvc;
using QLTB.ViewModels;
using System.Security.Claims;

namespace QLTB.Areas.AdminTool.Controllers
{
    [Area("AdminTool")]
    public class AdminControllerBase : Controller
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected async Task<ViewPermissionViewModel> getPermission()
        {
            ViewPermissionViewModel vm = new ViewPermissionViewModel
            {
                PermittedView = 0,
                PermittedEdit = 0,
                PermittedDelete = 0,
                PermittedApprove = 0,
                PermittedCreate = 0
            };

            var claimsIdentity = (ClaimsIdentity)User.Identity;

            string areaName = ControllerContext.RouteData.Values["area"].ToString();
            string controllerName = ControllerContext.RouteData.Values["controller"].ToString();
            string actionName = ControllerContext.RouteData.Values["action"].ToString();

            if (claimsIdentity != null && claimsIdentity.Name != null)
            {
                string strRoles = claimsIdentity.FindFirst("RolesList").Value;
              
                var permissionResult = await Mediator.Send(new Application.OD_AppUser.GetPermission.Query { AreaName = areaName, ControllerName = controllerName, ActionName = actionName, RolesName = strRoles });
                
                ViewPermissionViewModel vma = new ViewPermissionViewModel
                {
                    PermittedView = permissionResult.Value.PermittedView.Value ? 1 : 0,
                    PermittedEdit = permissionResult.Value.PermittedEdit.Value ? 1 : 0,
                    PermittedDelete = permissionResult.Value.PermittedDelete.Value ? 1 : 0,
                    PermittedApprove = permissionResult.Value.PermittedApprove.Value ? 1 : 0,
                    PermittedCreate = permissionResult.Value.PermittedCreate.Value ? 1 : 0
                };
                //
                List<string> arrRoles = strRoles.Split(",").ToList();
                bool isHost = arrRoles.Exists(e => e.Equals("Host") == true);
                if (isHost)
                {
                    vma.PermittedView = 1;
                    vma.PermittedCreate = 1;
                    vma.PermittedApprove = 1;
                    vma.PermittedEdit = 1;
                    vma.PermittedDelete = 1;
                }
                return vma;
            }
            
            return vm;
        }
    }
}
