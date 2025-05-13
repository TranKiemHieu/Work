using Application.ThongSoCauHinh;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using Persistence;
using Microsoft.IdentityModel.Tokens;

namespace QLTB.Controllers
{
    public class ThongSoCHApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _context;
        private const string UploadPath = "Upload\\Theme";

        public ThongSoCHApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userManager, DataContext dataContext) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userManager;
            _context = dataContext;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<TB_ThongSoCauHinh_TrinhDien>>>> Gets([FromBody] TB_ThongSoCauHinh_Filter_Request request)
        {
            return await Mediator.Send(new DanhSach.Query { Request = request });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_ThongSoCauHinh>>> Add([FromForm] RequestUploadFile activity)
        {
            TB_ThongSoCauHinh _entity = JsonConvert.DeserializeObject<TB_ThongSoCauHinh>(activity.Data);
            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                _entity.NguoiTao = user.Id;
            }
            var ct = _context.TB_ThietLapCauHinh.Where(x => x.ID == _entity.MaTieuChi).FirstOrDefault();
            if(ct != null && _entity != null)
            {
                if(ct.Loai == 8)
                {
                    string anhDaiDien = string.Empty;

                    if (activity.AnhDaiDien.Count > 0)
                    {
                        var file = activity.AnhDaiDien.First();

                        ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                        if (ufile.Success == false)
                        {
                            return Result<TB_ThongSoCauHinh>.Failure(ufile.Message);
                        }

                        anhDaiDien = ufile.Url;
                    }

                    if (!string.IsNullOrWhiteSpace(anhDaiDien))
                    {
                        _entity.GiaTriThietLap = anhDaiDien;
                    }
                }
                else if (ct.Loai == 9)
                {
                    if (activity.FileMedia.Count > 0)
                    {
                        foreach (IFormFile f in activity.FileMedia)
                        {
                            ResultUploadFile ufile = await SaveFileUploadMetadata(f, UploadPath, "", true);
                            if (ufile.Success == false)
                            {
                                return Result<TB_ThongSoCauHinh>.Failure(ufile.Message);
                            }

                            string link = ufile.Url;

                            if (!string.IsNullOrWhiteSpace(link))
                            {
                                _entity.GiaTriThietLap = link;
                            }
                        }
                    }
                }
            }
            var result = await Mediator.Send(new ThemMoi.Command { Entity = _entity });
            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_ThongSoCauHinh_Request>>> Edit([FromForm] RequestUploadFile activity)
        {
            TB_ThongSoCauHinh_Request _entity = JsonConvert.DeserializeObject<TB_ThongSoCauHinh_Request>(activity.Data);

            var userCurrent = (ClaimsIdentity)User.Identity;
            if (userCurrent != null && userCurrent.Name != null)
            {
                var user = await _userManager.FindByNameAsync(userCurrent.Name);
                _entity.NguoiCapNhat = user.Id;
            }

            var ct = _context.TB_ThietLapCauHinh.Where(x => x.ID == _entity.MaTieuChi).FirstOrDefault();
            if (ct != null && _entity != null)
            {
                if (ct.Loai == 8)
                {
                    string anhDaiDien = string.Empty;

                    if (activity.AnhDaiDien.Count > 0)
                    {
                        var file = activity.AnhDaiDien.First();

                        ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                        if (ufile.Success == false)
                        {
                            return Result<TB_ThongSoCauHinh_Request>.Failure(ufile.Message);
                        }

                        anhDaiDien = ufile.Url;

                        if (!string.IsNullOrEmpty(_entity.PreAnhDaiDien))
                        {
                            DeleteFileUpload(_entity.PreAnhDaiDien);
                        }
                    }
                    else
                    {
                        if (_entity.XoaDaiDien == true && !string.IsNullOrEmpty(_entity.PreAnhDaiDien))
                        {
                            DeleteFileUpload(_entity.PreAnhDaiDien);
                        }
                        else
                        {
                            _entity.GiaTriThietLap = _entity.PreAnhDaiDien;
                        }
                    }

                    if (!string.IsNullOrWhiteSpace(anhDaiDien))
                    {
                        _entity.GiaTriThietLap = anhDaiDien;
                    }
                }
                else if (ct.Loai == 9)
                {
                    string link = string.Empty;
                    if (activity.FileMedia.Count > 0)
                    {
                        foreach (IFormFile f in activity.FileMedia)
                        {
                            ResultUploadFile ufile = await SaveFileUploadMetadata(f, UploadPath, "", true);
                            if (ufile.Success == false)
                            {
                                return Result<TB_ThongSoCauHinh_Request>.Failure(ufile.Message);
                            }

                            link = ufile.Url;

                            if (!string.IsNullOrEmpty(_entity.PreFile))
                            {
                                DeleteFileUpload(_entity.PreFile);
                            }
                        }
                    }
                    else
                    {
                        if (_entity.XoaFile == true && !string.IsNullOrEmpty(_entity.PreFile))
                        {
                            DeleteFileUpload(_entity.PreFile);
                        }
                        else
                        {
                            _entity.GiaTriThietLap = _entity.PreFile;
                        }
                    }

                    if (!string.IsNullOrWhiteSpace(link))
                    {
                        _entity.GiaTriThietLap = link;
                    }
                }
            }
            var result = await Mediator.Send(new CapNhat.Command { Entity = _entity });
            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(string id)
        {
            var result = await Mediator.Send(new Xoa.Command { ID = id });
            return Ok(result);
        }

        [HttpGet]
        [Route("GetListByView")]
        public async Task<ActionResult<Result<List<TB_ThongSoCauHinh_TrinhDien>>>> GetListByView(short? id)
        {
            var result = await Mediator.Send(new GetListByView.Query { MaView = id });
            return Ok(result);
        }

        [HttpGet]
        [Route("Select")]
        public async Task<ActionResult<Result<TB_ThongSoCauHinh_DLLK>>> Select(byte? LinkedID, string ListID = null)
        {
            return await Mediator.Send(new Select.Query { LinkedID = LinkedID, ListID = ListID });
        }
    }
}
