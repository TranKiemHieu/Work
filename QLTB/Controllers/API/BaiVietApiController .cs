using Application.BaiViet;
using Application.Core;
using Application.OD_AppUser;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace QLTB.Controllers
{
    public class BaiVietApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private const string UploadPath = "Upload\\BaiViet";

        public BaiVietApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userMangager) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userMangager;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<TB_BaiVietTrinhDien>>>> Gets(BaiVietFilterRequest request)
        { 
            var claimUser = (ClaimsIdentity)User.Identity;

            if (claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                if (!isAdmin)
                {
                    var userCurrent = _userManager.GetUserId(HttpContext.User);
                    request.UserID = userCurrent != null ? long.Parse(userCurrent) : 0;

                    var result = await Mediator.Send(new DanhSach.Query { Request = request });

                    var permission = await Mediator.Send(new GetCategoryPermission.Query { UserId = request.UserID });
                 
                    if (permission.IsSuccess == true && permission.Value.Count > 0)
                    {
                        var data = result.Value;
                        foreach (var item in data)
                        {
                            item.isAuthorizeUser1 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == request.UserID && e.Loai == 1 && e.UserID == item.CreatedByUserID);
                            item.isAuthorizeUser2 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == request.UserID && e.Loai == 2);
                            item.isAuthorizeUser3 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == request.UserID && e.Loai == 3);                                                    
                        }
                        result.Value = data.Where(e => e.isAuthorizeUser1 != false || e.isAuthorizeUser2 != false || e.isAuthorizeUser3 != false).ToList();
                    }

                    return Ok(result);
                }
                else
                {
                    request.UserID = -1;
                    var result = await Mediator.Send(new DanhSach.Query { Request = request });
                    foreach (var item in result.Value)
                    {
                        item.isAuthorizeUser1 = true;
                        item.isAuthorizeUser2 = true;
                        item.isAuthorizeUser3 = true;
                    }
                    return Ok(result);
                }
            }
            return Ok();
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<Result<TB_BaiViet>>> Get(string id)
        {
            return await Mediator.Send(new Application.BaiViet.ChiTiet.Query { ID = id });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_BaiViet>>> Add([FromForm] RequestUploadFile activity)
        {
            TB_BaiViet _entity = JsonConvert.DeserializeObject<TB_BaiViet>(activity.Data);

            var userCurrent = _userManager.GetUserId(HttpContext.User);
            if(userCurrent != null)
            {
                _entity.CreatedByUserID = Int32.Parse(userCurrent);
            }
            string anhDaiDien = string.Empty;
            string thumbnail = string.Empty;
            if (activity.AnhDaiDien.Count > 0)
            {
                var file = activity.AnhDaiDien.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_BaiViet>.Failure(ufile.Message);
                }

                anhDaiDien = ufile.Url;
            }

            if (!string.IsNullOrWhiteSpace(anhDaiDien))
            {
                _entity.AnhDaiDien = anhDaiDien;
            }

            if (activity.Thumbnail.Count > 0)
            {
                var file = activity.Thumbnail.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_BaiViet>.Failure(ufile.Message);
                }

                thumbnail = ufile.Url;
            }

            if (!string.IsNullOrWhiteSpace(thumbnail))
            {
                _entity.Thumbnail = thumbnail;
            }

            // xử lý tạm thời trùng (chuyên muc, cm khác) 
            if (_entity.ChuyenMucKhacID != null)
            {
                var arr = _entity.ChuyenMucKhacID.Split(',');
                List<string> strChuyenMuc = new List<string>();
                foreach (var item in arr)
                {
                    if (item.Equals(_entity.ChuyenMucID.ToString()) == false)
                    {
                        strChuyenMuc.Add(item.ToUpper());
                    }
                }
                _entity.ChuyenMucKhacID = string.Join(",", strChuyenMuc.ToArray());
            }
            var result = await Mediator.Send(new ThemMoi.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_BaiViet>>> Edit([FromForm] RequestUploadFile activity)
        {
            TB_BaiVietRequest _entity = JsonConvert.DeserializeObject<TB_BaiVietRequest>(activity.Data);
           
            var userCurrent = _userManager.GetUserId(HttpContext.User);
            if (userCurrent != null)
            {
                _entity.LastModifiedByUserID = Int32.Parse(userCurrent);
            }
           
            //Upload ảnh mới
            string anhDaiDien = string.Empty;
            string thumbnail = string.Empty;
                //Ảnh đại diện
            if (activity.AnhDaiDien.Count > 0)
            {
                var file = activity.AnhDaiDien.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_BaiViet>.Failure(ufile.Message);
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
                    _entity.AnhDaiDien = _entity.PreAnhDaiDien;
                }
            }

            if (!string.IsNullOrWhiteSpace(anhDaiDien))
            {
                _entity.AnhDaiDien = anhDaiDien;
            }
                //Thumbnail
            if (activity.Thumbnail.Count > 0)
            {
                var file = activity.Thumbnail.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_BaiViet>.Failure(ufile.Message);
                }

                thumbnail = ufile.Url;

                if (!string.IsNullOrEmpty(_entity.PreThumbnail))
                {
                    DeleteFileUpload(_entity.PreThumbnail);
                }
            }
            else
            {
                if (_entity.XoaThumbnail == true && !string.IsNullOrEmpty(_entity.PreThumbnail))
                {
                    DeleteFileUpload(_entity.PreThumbnail);
                }
                else
                {
                    _entity.Thumbnail = _entity.PreThumbnail;
                }
            }

            if (!string.IsNullOrWhiteSpace(thumbnail))
            {
                _entity.Thumbnail = thumbnail;
            }

            // xử lý tạm thời trùng (chuyên muc, cm khác) 
            if (_entity.ChuyenMucKhacID != null)
            {
                var arr = _entity.ChuyenMucKhacID.Split(',');
                List<string> strChuyenMuc = new List<string>();
                foreach (var item in arr)
                {
                    if (item.Equals(_entity.ChuyenMucID.ToString()) == false)
                    {
                        strChuyenMuc.Add(item.ToUpper());
                    }
                }
                _entity.ChuyenMucKhacID = string.Join(",", strChuyenMuc.ToArray());
            }
            var result = await Mediator.Send(new CapNhat.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(string id)
        {
            //Xóa file media
            var xoaMedia = await Mediator.Send(new Application.Media.DanhSachTheoBaiViet.Query { BaiVietID = id });
            if (xoaMedia != null && xoaMedia.IsSuccess == true && xoaMedia.Value.Count > 0)
            {
                foreach (var i in xoaMedia.Value)
                {
                    if (!string.IsNullOrEmpty(i.DuongDan))
                    {
                        DeleteFileUpload(i.DuongDan);
                    }
                }
            }

            var res = await Mediator.Send(new Application.BaiViet.ChiTiet.Query { ID = id });

            var result = await Mediator.Send(new Xoa.Command { ID = id });

            if (result != null && result.IsSuccess == true)
            {
                if (res != null && res.IsSuccess == true)
                {
                    if (!string.IsNullOrEmpty(res.Value.AnhDaiDien))
                    {
                        DeleteFileUpload(res.Value.AnhDaiDien);
                    }
                    if (!string.IsNullOrEmpty(res.Value.Thumbnail))
                    {
                        DeleteFileUpload(res.Value.Thumbnail);
                    }
                }
            }

            return Ok(result);
        }

        //[HttpPost]
        //[Route("GetByChuyenMuc")]
        //public async Task<ActionResult<Result<List<TB_BaiVietTrinhDien>>>> GetByChuyenMuc(string id, int sl)
        //{
        //    return await _mediator.Send(new DanhSachTheoBaiViet.Query { ChuyenMucID = id, SoLuong = sl});
        //}

       
        [HttpPost]
        [Route("DeleteImg")]
        public async Task<ActionResult<Result<int>>> DeleteImg([FromBody] BaiVietDeleteImageRequest data)
        {
            var res = await Mediator.Send(new Application.BaiViet.ChiTiet.Query { ID = data.ID });

            var result = await Mediator.Send(new XoaAnh.Command { Data = data });

            if (result != null && result.IsSuccess == true)
            {
                if (res != null && res.IsSuccess == true)
                {
                    if (data.Type == 0)
                    {
                        if (!string.IsNullOrEmpty(res.Value.AnhDaiDien))
                        {
                            DeleteFileUpload(res.Value.AnhDaiDien);
                        }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(res.Value.Thumbnail))
                        {
                            DeleteFileUpload(res.Value.Thumbnail);
                        }
                    }
                }
            }

            return Ok(result);
        }


        [HttpPost]
        [Route("GetsPaging")]
        public async Task<ActionResult<Result<List<TB_BaiVietTrinhDien>>>> GetsPaging(ModelPaging request)
        {
            return await Mediator.Send(new DanhSachTheoChuyenMucPaging.Query { Request = request });
        }

        [HttpPost]
        [Route("ThongKe")]
        public async Task<ActionResult<Result<TB_BaiViet_ThongKe>>> ThongKe(string UniqueCode = "", string TuNgay = "", string DenNgay = "")
        {
            return await Mediator.Send(new ThongKe.Query { UniqueCode = UniqueCode, TuNgay = TuNgay, DenNgay = DenNgay });
        }

        [HttpPost]
        [Route("ThongKeTheoNgay")]
        public async Task<ActionResult<Result<List<TB_BaiViet_ThongKe>>>> ThongKeTheoNgay(string UniqueCode = "", string TuNgay = "", string DenNgay = "")
        {
            return await Mediator.Send(new ThongKeTheoNgay.Query { UniqueCode = UniqueCode, TuNgay = TuNgay, DenNgay = DenNgay });
        }

        [HttpPost]
        [Route("BaiVietGanDay")]
        public async Task<ActionResult<Result<List<TB_BaiVietTrinhDien>>>> BaiVietGanDay(string UniqueCode = "", int SoLuong = 0)
        {
            return await Mediator.Send(new BaiVietGanDay.Query { UniqueCode = UniqueCode, SoLuong = 0 });
        }
    }
}
