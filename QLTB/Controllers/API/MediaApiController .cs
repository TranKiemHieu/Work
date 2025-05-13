using Application.Media;
using Application.Core;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Persistence;
using static Dapper.SqlMapper;
using System.Security.Principal;
using X.PagedList;
using ServiceStack;

namespace QLTB.Controllers
{
    public class MediaApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private const string UploadPath = "Upload\\Media";

        public MediaApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userMangager) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userMangager;
        }

        //[HttpGet]
        //[Route("Get")]
        //public async Task<ActionResult<Result<TB_BaiViet>>> Get(string id)
        //{
        //    return await Mediator.Send(new ChiTiet.Query { ID = id });
        //}

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_Media>>> Add([FromForm] RequestUploadFile activity)
        {
            TB_Media _entity = JsonConvert.DeserializeObject<TB_Media>(activity.Data);

           
            string duongDan = string.Empty;
            if (activity.FileMedia.Count > 0)
            {
                var file = activity.FileMedia.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_Media>.Failure(ufile.Message);
                }

                duongDan = ufile.Url;
            }

            if (!string.IsNullOrWhiteSpace(duongDan))
            {
                _entity.DuongDan = duongDan;
            }

            var result = await Mediator.Send(new ThemMoi.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_Media>>> Edit([FromForm] RequestUploadFile activity)
        {
            MediaRequest _entity = JsonConvert.DeserializeObject<MediaRequest>(activity.Data);

            string preFile = _entity.DuongDan;

            //Xóa ảnh, không upload
            if (_entity.XoaFile == true)
            {
                DeleteFileUpload(_entity.DuongDan);
                _entity.DuongDan = string.Empty;
            }

            //Upload ảnh mới
            string duongDan = string.Empty;

            if (activity.FileMedia.Count > 0)
            {
                var file = activity.FileMedia.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_Media>.Failure(ufile.Message);
                }

                duongDan = ufile.Url;

                if (!string.IsNullOrEmpty(preFile))
                {
                    DeleteFileUpload(preFile);
                }
            }

            if (!string.IsNullOrWhiteSpace(duongDan))
            {
                _entity.DuongDan = duongDan;
            }

            var result = await Mediator.Send(new CapNhat.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(string id)
        {

            var arrID = id.Split(",");
            foreach (var item in arrID)
            {
                var chiTietMedia = await Mediator.Send(new ChiTiet.Query { ID = item });
                if (chiTietMedia != null && chiTietMedia.IsSuccess == true)
                    if (!string.IsNullOrEmpty(chiTietMedia.Value.DuongDan))
                    {
                        DeleteFileUpload(chiTietMedia.Value.DuongDan);
                    }

            }

            var result = await Mediator.Send(new Xoa.Command { ID = id });        
            return Ok(result);
        }

        /// <summary>
        /// Danh sach media theo bai viet
        /// </summary>
        /// <param name="baiVietID"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetByBaiViet/{baiVietID}")]
        public async Task<ActionResult<Result<List<TB_Media>>>> GetByBaiViet(string baiVietID)
        {
            return await _mediator.Send(new DanhSachTheoBaiViet.Query { BaiVietID = baiVietID });
        }   
    }
}
