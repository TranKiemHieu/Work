using Application.FAQ_Feedback;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Persistence;
using Newtonsoft.Json;

namespace QLTB.Controllers
{
    public class FeedbackApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _context;
        private const string UploadPath = "Upload\\YKienPhanHoi";

        public FeedbackApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userManager, DataContext dataContext) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userManager;
            _context = dataContext;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<FAQ_YKien_TrinhDien>>>> Gets([FromBody] FAQ_YKien_Filter_Request request)
        {
            return await Mediator.Send(new DanhSach.Query { Request = request });
        }

        [HttpPost]
        [Route("Paging")]
        public async Task<ActionResult<Result<List<FAQ_YKien_TrinhDien>>>> Paging([FromBody] FAQ_YKien_Filter_Request request)
        {
            return await Mediator.Send(new Paging.Query { Request = request });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<FAQ_YKien>>> Add([FromBody] FAQ_YKien activity)
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                activity.NguoiTaoLapId = user.Id;
            }

            var result = await Mediator.Send(new ThemMoi.Command { Entity = activity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<FAQ_YKien>>> Edit([FromForm] FAQ_YKien_UploadFile activity)
        {
            var _entity = JsonConvert.DeserializeObject<FAQ_YKien>(activity.Data);
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                _entity.NguoiChinhSuaId = user.Id;
            }

            var result = await Mediator.Send(new CapNhat.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(Guid? id)
        {
            var result = await Mediator.Send(new Xoa.Command { ID = id });
            return Ok(result);
        }
    }
}
