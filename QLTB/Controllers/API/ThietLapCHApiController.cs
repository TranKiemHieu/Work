using Application.ThietLapCauHinh;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ServiceStack;
using System.Security.Claims;
using Persistence;

namespace QLTB.Controllers
{
    public class ThietLapCHApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _context;

        public ThietLapCHApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userManager, DataContext dataContext) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userManager;
            _context = dataContext;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<TB_ThietLapCauHinh_Filter_Request>>>> Gets([FromBody] TB_ThietLapCauHinh_Filter_Request request)
        {
            return await Mediator.Send(new DanhSach.Query { Request = request });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_ThietLapCauHinh>>> Add([FromBody] TB_ThietLapCauHinh activity)
        {
            var result = await Mediator.Send(new ThemMoi.Command { Entity = activity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_ThietLapCauHinh>>> Edit([FromBody] TB_ThietLapCauHinh activity)
        {
            var result = await Mediator.Send(new CapNhat.Command { Entity = activity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(int id)
        {
            var result = await Mediator.Send(new Xoa.Command { ID = id });
            return Ok(result);
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<Result<TB_ThietLapCauHinh>>> Get(byte? ID)
        {
            return await Mediator.Send(new ChiTiet.Query { ID = ID });
        }
    }
}
