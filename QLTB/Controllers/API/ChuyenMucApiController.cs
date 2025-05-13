using Application.ChuyenMuc;
using Application.Core;
using Application.OD_AppUser;
using AutoMapper.Internal.Mappers;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Persistence;
using ServiceStack;
using System;
using System.Security.Claims;
using static Dapper.SqlMapper;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QLTB.Controllers
{
    public class ChuyenMucApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private const string UploadPath = "Upload\\ChuyenMuc";

        public ChuyenMucApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userManager) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userManager;
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<ActionResult<Result<List<ChuyenMucTrinhDien>>>> Gets(ChuyenMucFilterRequest request)
        {
            var claimUser = (ClaimsIdentity)User.Identity;

            if (claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                if (!isAdmin)
                {
                    var userCurrent = _userManager.GetUserId(HttpContext.User);
                    var userId = -1;
                    if (userCurrent != null)
                    {
                        userId = Int32.Parse(userCurrent);
                    }

                    var permission = await Mediator.Send(new GetCategoryPermission.Query { UserId = userId });
                    var result = await Mediator.Send(new DanhSach.Query { Request = request });

                    List<ChuyenMucTrinhDien> data = new List<ChuyenMucTrinhDien>();
                    if (permission.IsSuccess == true && permission.Value.Count > 0)
                    {
                        foreach (var rs in result.Value)
                        {
                            bool check = permission.Value.ToList().Exists(e => e.ChuyenMucID == rs.ID && e.UserID == userId);
                            if (check)
                            {
                                data.Add(rs);
                            }
                        }
                    }

                    foreach (var item in data)
                    {
                        // gán null cho ChuyenMucCapChaID nếu ID cấp cha không tìm thấy
                        var isHasParent = data.ToList().Exists(e => e.ID == item.ChuyenMucCapChaID);
                        if (!isHasParent)
                        {
                            item.ChuyenMucCapChaID = null;
                        }
                    }
                    return Ok(data);
                }
                else
                {
                    var data = await Mediator.Send(new DanhSach.Query { Request = request });
                    return Ok(data.Value.ToList());
                }
            }
            return Ok(); 
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<Result<TB_ChuyenMuc>>> Get(string id)
        {
          
            return await Mediator.Send(new Application.ChuyenMuc.ChiTiet.Query { ID = id });
        }

        [HttpGet]
        [Route("Select")]
        public async Task<ActionResult<Result<List<ChuyenMucSelect>>>> Select(int flag = 0, long userID = -1)
        {
            var claimUser = (ClaimsIdentity)User.Identity;

            if (claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                if (!isAdmin)
                {
                    var userCurrent = _userManager.GetUserId(HttpContext.User);
                    if (userCurrent != null)
                    {
                        userID = long.Parse(userCurrent);
                    }

                    var permission = await Mediator.Send(new GetCategoryPermission.Query { UserId = userID });

                    if (permission.IsSuccess == true && permission.Value.Count > 0)
                    {
                        var result = await Mediator.Send(new Select.Query { Flag = flag, UserID = userID });

                        foreach (var item in result.Value)
                        {
                            bool checkUser1 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ID && e.UserID == userID && e.Loai == 1);
                            bool checkUser2 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ID && e.UserID == userID && e.Loai == 2);
                            item.isSelected = (checkUser1 || checkUser2);
                        }
                        return Ok(result);
                    }
                    return Ok();
                }
                else
                {
                    var data = await Mediator.Send(new Select.Query { Flag = flag, UserID = -1 });
                    data.Value.ForEach(e => {
                        e.isSelected = true;
                    });
                    return Ok(data);
                }
            }
            return Ok();
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult<Result<TB_ChuyenMuc>>> Add([FromForm] RequestUploadFile activity)
        {
            

            TB_ChuyenMuc _entity = JsonConvert.DeserializeObject<TB_ChuyenMuc>(activity.Data);
            
            var userCurrent = _userManager.GetUserId(HttpContext.User);
            if (userCurrent != null)
            {
                _entity.CreatedByUserID = Int32.Parse(userCurrent);
            }

            string anhDaiDien = string.Empty;
            string anhBieuTuong = string.Empty;

            if (activity.AnhDaiDien.Count > 0)
            {
                var file = activity.AnhDaiDien.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_ChuyenMuc>.Failure(ufile.Message);
                }

                anhDaiDien = ufile.Url;
            }

            if (activity.AnhBieuTuong.Count > 0)
            {
                var file = activity.AnhBieuTuong.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_ChuyenMuc>.Failure(ufile.Message);
                }

                anhBieuTuong = ufile.Url;
            }

            if (!string.IsNullOrWhiteSpace(anhDaiDien))
            {
                _entity.AnhDaiDien = anhDaiDien;
            }

            if (!string.IsNullOrWhiteSpace(anhBieuTuong))
            {
                _entity.BieuTuong = anhBieuTuong;
            }

            var result = await Mediator.Send(new ThemMoi.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<ActionResult<Result<TB_ChuyenMuc>>> Add([FromBody] TB_ChuyenMuc activity)
        {
            var result = await Mediator.Send(new ThemMoi.Command { Entity = activity });

            return Ok(result);
        }

        [HttpPut]
        [Route("Edit")]
        public async Task<ActionResult<Result<TB_ChuyenMuc>>> Edit([FromForm] RequestUploadFile activity)
        {
            TB_ChuyenMucRequest _entity = JsonConvert.DeserializeObject<TB_ChuyenMucRequest>(activity.Data);

            var userCurrent = _userManager.GetUserId(HttpContext.User);
            if (userCurrent != null)
            {
                _entity.CreatedByUserID = Int32.Parse(userCurrent);
            }

            string preAnhDaiDien = _entity.AnhDaiDien;
            string preAnhBieuTuong = _entity.BieuTuong;

            //Xóa ảnh, không upload
            if (_entity.XoaAnhBieuTuong == true)
            {
                DeleteFileUpload(_entity.BieuTuong);
                _entity.BieuTuong = string.Empty;
            }

            if (_entity.XoaAnhDaiDien == true)
            {
                DeleteFileUpload(_entity.AnhDaiDien);
                _entity.AnhDaiDien = string.Empty;
            }

            //Upload ảnh mới
            string anhDaiDien = string.Empty;
            string anhBieuTuong = string.Empty;

            if (activity.AnhDaiDien.Count > 0)
            {
                var file = activity.AnhDaiDien.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_ChuyenMuc>.Failure(ufile.Message);
                }

                anhDaiDien = ufile.Url;

                if (!string.IsNullOrEmpty(preAnhDaiDien))
                {
                    DeleteFileUpload(preAnhDaiDien);
                }
            }

            if (activity.AnhBieuTuong.Count > 0)
            {
                var file = activity.AnhBieuTuong.First();

                ResultUploadFile ufile = await SaveFileUpload(file, UploadPath);
                if (ufile.Success == false)
                {
                    return Result<TB_ChuyenMuc>.Failure(ufile.Message);
                }

                anhBieuTuong = ufile.Url;

                if (!string.IsNullOrEmpty(preAnhBieuTuong))
                {
                    DeleteFileUpload(preAnhBieuTuong);
                }
            }

            if (!string.IsNullOrWhiteSpace(anhDaiDien))
            {
                _entity.AnhDaiDien = anhDaiDien;
            }

            if (!string.IsNullOrWhiteSpace(anhBieuTuong))
            {
                _entity.BieuTuong = anhBieuTuong;
            }

            var result = await Mediator.Send(new CapNhat.Command { Entity = _entity });

            return Ok(result);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<ActionResult<Result<int>>> Delete(string id)
        {
            var res = await Mediator.Send(new Application.ChuyenMuc.ChiTiet.Query { ID = id });
            
            var result = await Mediator.Send(new Xoa.Command { ID = id });

            if(result != null && result.IsSuccess == true) {
                if (res != null && res.IsSuccess == true)
                {
                    if (!string.IsNullOrEmpty(res.Value.AnhDaiDien))
                    {
                        DeleteFileUpload(res.Value.AnhDaiDien);
                    }

                    if (!string.IsNullOrEmpty(res.Value.BieuTuong))
                    {
                        DeleteFileUpload(res.Value.BieuTuong);
                    }
                }
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("DeleteImg")]
        public async Task<ActionResult<Result<int>>> DeleteImg([FromBody] ChuyenMucDeleteImageRequest data)
        {
            var res = await Mediator.Send(new Application.ChuyenMuc.ChiTiet.Query { ID = data.ID });

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
                        if (!string.IsNullOrEmpty(res.Value.BieuTuong))
                        {
                            DeleteFileUpload(res.Value.BieuTuong);
                        }
                    }
                }
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("AddUserPermission")]
        public async Task<ActionResult<Result<TB_CategoryPermission>>> AddUserPermission(CategoryPermissionRequest activity)
        {
            var Tree = await Mediator.Send(new Application.ChuyenMuc.DanhSachChuyenMucCapCon.Query { chuyenMucID = activity.ChuyenMucID.ToString() });
            List<Guid> chuyenMucID = new List<Guid>();
            if (Tree.IsSuccess == true && Tree.Value.Count > 0)
            {
                if (activity.ApDungChoCapCon == true)
                {
                    Tree.Value.ForEach(e =>
                    {
                        chuyenMucID.Add((Guid)e.ID);
                    });
                }
                else
                {
                    chuyenMucID.Add((Guid)Tree.Value.ElementAt(0).ID);
                }
            }
            else
            {
                return BadRequest("Cập nhật thất bại");
            };
            var isSuccess = true;
            for (var item = 0; item < chuyenMucID.Count; item++)
            {
               
                if (activity != null && activity.User1.Length > 0)
                {
                    string[] user1 = activity.User1.Split(",");
                    for (int i = 0; i < user1.Length; i++)
                    {
                        var result = await Mediator.Send(new ThemMoiPhanQuyen.Command
                        {
                            Entity = new CategoryPermissionRequest
                            {
                                UserID = long.Parse(user1.ElementAt(i)),
                                ChuyenMucID = chuyenMucID.ElementAt(item),
                                Loai = 1,
                                ApDungChoCapCon = (activity.ApDungChoCapCon == true && item == 0) ? true: null
                            }
                        });
                        if (result == null)
                        {
                            isSuccess = false;
                        }
                    }
                }
                //  var result = await Mediator.Send(new ThemMoiPhanQuyen.Command { Entity = activity });
                if (activity != null && activity.User2.Length > 0)
                {
                    string[] user2 = activity.User2.Split(",");
                    for (int i = 0; i < user2.Length; i++)
                    {
                        var result = await Mediator.Send(new ThemMoiPhanQuyen.Command
                        {
                            Entity = new CategoryPermissionRequest
                            {
                                UserID = long.Parse(user2.ElementAt(i)),
                                ChuyenMucID = chuyenMucID.ElementAt(item),
                                Loai = 2,
                                ApDungChoCapCon = (activity.ApDungChoCapCon == true && item == 0) ? true : null
                            }
                        });
                        if (result == null)
                        {
                            isSuccess = false;
                        }
                    }
                }

                if (activity != null && activity.User3.Length > 0)
                {
                    string[] user3 = activity.User3.Split(",");
                    for (int i = 0; i < user3.Length; i++)
                    {
                        var result = await Mediator.Send(new ThemMoiPhanQuyen.Command
                        {
                            Entity = new CategoryPermissionRequest
                            {
                                UserID = long.Parse(user3.ElementAt(i)),
                                ChuyenMucID = chuyenMucID.ElementAt(item),
                                Loai = 3,
                                ApDungChoCapCon = (activity.ApDungChoCapCon == true && item == 0) ? true : null
                            }   
                        });
                        if (result == null)
                        {
                            isSuccess = false;
                        }
                    }
                }
            }
            return Ok(isSuccess);
        }

        [HttpGet]
        [Route("GetPhanQuyenByChuyenMucID")]
        public async Task<ActionResult<Result<CategoryPermissionRequest>>> GetPhanQuyenByChuyenMucID(string id)
        {
            return await Mediator.Send(new DanhSachPhanQuyenTheoChuyenMuc.Query { chuyenMucID = id });
        }

        [HttpPost]
        [Route("UpdateUserPermission")]
        public async Task<ActionResult<Result<CategoryPermissionRequest>>> UpdateUserPermission(CategoryPermissionRequest request)
        {
            if (request.ApDungChoCapCon == true)
            {
                var Tree = await Mediator.Send(new Application.ChuyenMuc.DanhSachChuyenMucCapCon.Query { chuyenMucID = request.ChuyenMucID.ToString() });
                foreach (var item in Tree.Value)
                {
                    await Mediator.Send(new XoaPhanQuyen.Command { chuyenMucID = item.ID.ToString() });
                }
                var result =  await AddUserPermission(request);
                return Ok(result);
            }
            else
            {
                var result = await Mediator.Send(new XoaPhanQuyen.Command { chuyenMucID = request.ChuyenMucID.ToString() });

                if (result.IsSuccess == true)
                {
                    await AddUserPermission(request);
                }
                return Ok(result);
            }
        }

        [HttpPost]
        [Route("TopChuyenMuc")]
        public async Task<ActionResult<Result<List<ChuyenMucTrinhDien>>>> TopChuyenMuc(string UniqueCode = "", int SoLuong = 0)
        {
            return await Mediator.Send(new TopChuyenMuc.Query { UniqueCode = UniqueCode, SoLuong = 0 });
        }
    }
}
