using Application.View;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServiceStack;
using System.Security.Claims;
using Persistence;
using Microsoft.CodeAnalysis.Options;
using System.ComponentModel;
using Domain.Enums;
using System.Reflection;

namespace QLTB.Controllers
{
    public class ViewApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _context;
        private const string UploadPath = "Upload\\ChuyenMuc";

        public ViewApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userManager, DataContext dataContext) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userManager;
            _context = dataContext;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<TB_View_ThongSo>>>> Gets([FromBody] TB_View_Filter_Request request)
        {
            return await Mediator.Send(new DanhSach.Query { Request = request });
        }

        [HttpGet]
        [Route("Select")]
        public async Task<ActionResult<Result<List<TB_View>>>> Select(int flag = 0)
        {
            return await Mediator.Send(new Select.Query { Flag = flag });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_View>>> Add([FromBody] TB_View activity)
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                activity.NguoiTao = user.Id;
            }

            var result = await Mediator.Send(new ThemMoi.Command { Entity = activity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_View>>> Edit([FromBody] TB_View activity)
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                activity.NguoiCapNhat = user.Id;
            }

            var result = await Mediator.Send(new CapNhat.Command { Entity = activity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(short id)
        {
            var view = _context.TB_View.FirstOrDefault(x => x.ID == id);
            if (view != null)
            {
                var listChild = view.ViewCapChaID == null ? _context.TB_View.Where(x => x.ViewCapChaID == view.ID) : null;
                if (listChild != null && listChild.Count() > 0)
                {
                    foreach (var v in listChild)
                    {
                        if (v.SuDung == false)
                        {
                            var result1 = await Mediator.Send(new Xoa.Command { ID = v.ID });
                        }
                    }
                }
            }
            var result = await Mediator.Send(new Xoa.Command { ID = id });
            return Ok(result);
        }

        [HttpPost]
        [Route("Dupplicate")]
        public async Task<ActionResult<Result<TB_View>>> Dupplicate([FromBody] TB_View activity)
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                activity.NguoiTao = user.Id;
            }

            var result = await Mediator.Send(new Dupplicate.Command { Entity = activity });

            return Ok(result);
        }
    }
}
