using Application.Core;
using Domain;
using Domain.RequestDtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using QLTB.Models;

using System.Linq;
using System.Security.Claims;

namespace QLTB.Controllers
{
    public class AdminMenuApiController : AdminController
    {

        private readonly RoleManager<AppRole> _roleManager;

        public AdminMenuApiController(IWebHostEnvironment hostingEnvironment, RoleManager<AppRole> roleManager, IConfiguration config) : base(hostingEnvironment, config)
        {
            _roleManager =  roleManager;
    }

        [HttpGet]
        [Route("getmenu/{parentid?}")]
        public async Task<IActionResult> GetDanhSachMenu(int? parentid)
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSach.Query { ParentId = parentid });
            return HandleResult(result);
        }

        [HttpGet]
        [Route("DanhSachMenu")]
        public async Task<IActionResult> DanhSachMenu()
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSachMenu.Query());
            return HandleResult(result);
        }

        [HttpGet]
        [Route("danhsachmenutheorole/{rolename}")]
        public async Task<IActionResult> DanhSachMenuTheoRole(string rolename)
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSachMenuTheoRole.Query { RoleName = rolename });
            return HandleResult(result);
        }

        [HttpGet]
        [Route("getmenupermission/{id}")]
        public async Task<IActionResult> GetDanhSachMenu(int id)
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSachPhanQuyen.Query { MenuId = id });
            return HandleResult(result);
        }

        [HttpPost]
        [Route("AddMenuPermission")]
        public async Task<IActionResult> AddMenuPermission([FromBody] TB_MenuPermission _request)
        {
            var result = await Mediator.Send(new Application.AdminMenu.ThemMoiPhanQuyen.Command { Entity = _request });
            return Ok(result);  
        }

        [HttpPost]
        [Route("UpdateMenuPermission")]
        public async Task<IActionResult> UpdateMenuPermission([FromForm] MenuPermissionRequest data)
        {
            var menuItems = JsonConvert.DeserializeObject<List<MenuItemCompact>>(data.permission);
            var result = await Mediator.Send(new Application.AdminMenu.CapNhatPhanQuyen.Command { _entity = menuItems });
            return Ok(result);
        }

        //[HttpDelete]
        //[Route("deletemenupermission/{id}")]
        //public async Task<IActionResult> DeleteMenuPermission(int id)
        //{
        //    var result = await Mediator.Send(new Application.AdminMenu.XoaPhanQuyen.Command { Id = id });
        //    if (!result.IsSuccess)
        //        return HandleResult(result);
        //    _jsonService.RecreateData();
        //    return HandleResult(result);
        //}

        [HttpGet]
        [Route("danhsachnodecha")]
        public async Task<IActionResult> DanhSachNodeCha()
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSachMenuParent.Query());
            return HandleResult(result);
        }

        [HttpGet]
        [Route("danhsachnodela")]
        public async Task<IActionResult> DanhSachNodeLa()
        {
            var result = await Mediator.Send(new Application.AdminMenu.DanhSachMenuChild.Query());
            return HandleResult(result);
        }

        [HttpPost]
        [Route("themmoimenu")]
        public async Task<IActionResult> ThemMoiMenu([FromBody] TB_AdminMenu _request)
        {
            var result = await Mediator.Send(new Application.AdminMenu.ThemMoiMenu.Command { Entity = _request });
            return Ok(result);
        }
        [HttpPut]
        [Route("chinhsuamenu")]
        public async Task<IActionResult> ChinhSuaMenu([FromBody] TB_AdminMenu _request)
        {
            var result = await Mediator.Send(new Application.AdminMenu.CapNhat.Command { Entity = _request });
            return Ok(result);
        }

        [HttpDelete]
        [Route("XoaMenu/{id}")]
        public async Task<IActionResult> XoaMenu(int id)
        {

            var lstMenuChild = await Mediator.Send(new Application.AdminMenu.DanhSachMenuChild.Query { ParentId = id });

            if (lstMenuChild != null && lstMenuChild.IsSuccess == true && lstMenuChild.Value.Count > 0)
            {
                foreach (var item in lstMenuChild.Value)
                {
                    await Mediator.Send(new Application.AdminMenu.Xoa.Command { Id = item.Id });
                }
            }
            var result = await Mediator.Send(new Application.AdminMenu.Xoa.Command { Id = id });
            return Ok(result);

        }

        //[HttpGet]
        //[Route("chitietmenu/{id}")]
        //public async Task<IActionResult> ChiTietMenu(int id)
        //{
        //    var result = await Mediator.Send(new Application.AdminMenu.ChiTiet.Query { Id = id });
        //    return HandleResult(result);
        //}

        //[HttpPost]
        //[Route("updatepermissionbatch")]
        //public async Task<IActionResult> UpdatePermissionBatch([FromBody] MenuPermissionRequest _request)
        //{
        //    List<string> lstUpdate = new List<string>();
        //    foreach(var item in _request.Permission)
        //    {
        //        lstUpdate.Add($"{item.Id}|{(item.PermittedEdit ? 1 : 0)}|{(item.PermittedDelete ? 1 : 0)}|{(item.PermittedApprove ? 1 : 0)}|{(item.PermittedCreate ? 1 : 0)}");
        //    }
        //    string strBatchUpdate = string.Join(",", lstUpdate);

        //    var result = await Mediator.Send(new Application.AdminMenu.CapNhatCayPhanQuyen.Command { DanhSachPhanQuyen = strBatchUpdate });
        //    return HandleResult(result);
        //}

        [HttpDelete]
        [Route("DeleteMenuPermission/{menuid}/{rolename}")]
        public async Task<IActionResult> DeleteMenuPermission(int menuid, string rolename)
        {
            var result = await Mediator.Send(new Application.AdminMenu.XoaPhanQuyenTheoMenu.Command { MenuId = menuid, RoleName = rolename });
            return Ok(result);
        }
    }
}
