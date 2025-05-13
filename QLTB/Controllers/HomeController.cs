using Application.AdminMenu;
using Application.BaiViet;
using Application.Core;
using Aspose.Cells;
using Aspose.Cells.Drawing;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Protocol;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Persistence;
using QLTB.DTOs;
using QLTB.Models;
using System.Diagnostics;
using System.Drawing.Printing;
using System.Security.Claims;
using X.PagedList;
using static Azure.Core.HttpHeader;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QLTB.Controllers
{
    public class HomeController : Controller
    {
        private readonly IMediator _mediator;
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly DataContext _context;

        public HomeController(IMediator mediator, ILogger<HomeController> logger, UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, DataContext dataContext)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _mediator = mediator;
            _context = dataContext;
        }

        public async Task<IActionResult> Index()
        {

            ViewData["Title"] = "Trung tâm Công nghệ thông tin tỉnh Thừa Thiên Huế";
            ViewData["Description"] = "Trung tâm công nghệ thông tin tỉnh Thừa Thiên Huế";
            ViewData["Keywords"] = "Trung tâm công nghệ thông tin tỉnh Thừa Thiên Huế";
            var curUser = (ClaimsIdentity)User.Identity;
            var user = curUser != null && curUser.Name != null? await _userManager.FindByNameAsync(curUser.Name) : null;
            ViewBag.UserLogin = "";
            return View();
        }

        public async Task<IActionResult> Privacy()
        {
            var shjt = User.Identity.IsAuthenticated;
            var curUser = (ClaimsIdentity)User.Identity;
            var dkm = curUser.Name;
            System.Security.Claims.ClaimsPrincipal currentUser = this.User;

            var mUser = await _userManager.GetUserAsync(currentUser);
            var abc = await _userManager.FindByNameAsync(dkm);
            var roles = await _userManager.GetRolesAsync(mUser);
            //mUser.DisplayName;
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> Login()
        {
            //await _signInManager.SignOutAsync();
            var curUser = (ClaimsIdentity)User.Identity;
            var user = curUser != null && curUser.Name != null ? await _userManager.FindByNameAsync(curUser.Name) : null;
            if (user == null)
            {
                return View();
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var a = dto.Username;
            //login functionality
            var user = await _userManager.FindByNameAsync(dto.Username);

            if (user != null)
            {
                //sign in
                var signInResult = await _signInManager.PasswordSignInAsync(user, dto.Password, false, false);

                if (signInResult.IsLockedOut)
                {
                    ViewData["ErrorMessage"] = "Tài khoản đã bị khóa, xin vui lòng liên hệ quản trị viên để mở khóa tài khoản!";
                    return View();
                }

                if (!signInResult.Succeeded)
                {
                    ViewData["ErrorMessage"] = "Tên tài khoản hoặc mật khẩu không chính xác, vui lòng thử lại!";
                    return View();
                }

                if (signInResult.Succeeded)
                {
                    //return RedirectToAction("Index", "Home", new { area = "AdminTool" });
                    return RedirectToAction("Index");
                }
            }

            return RedirectToAction("Index");
        }

        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index");
        }

        public async Task<IActionResult> _SectionView(int pageIndex = 1, string viewName = "", int maViewCapCha = 0, string sessionName = "")
        {
            ThongSoCauHinhTrinhDien data = new ThongSoCauHinhTrinhDien();
            ThongSoCauHinhTrinhDien dataSession = new ThongSoCauHinhTrinhDien();
            int PageSize = 0;
            int Total = 0;
            
            string json = HttpContext.Session.GetString(sessionName);

            if (json != null)
            {
                data = JsonConvert.DeserializeObject<ThongSoCauHinhTrinhDien>(json);
                var pageSize = data.ListThongSo.FirstOrDefault(e => e.TenTieuChi == "numOfPage");
                var isPaging = data.ListThongSo.FirstOrDefault(e => e.TenTieuChi == "isPaging");
                var soLuong = data.ListThongSo.FirstOrDefault(e => e.TenTieuChi == "numOf");
                if (isPaging != null && isPaging.GiaTriThietLap == "1")
                {
                    PageSize = pageSize != null && pageSize.GiaTriThietLap != null ? Int32.Parse(pageSize.GiaTriThietLap) : 0;
                }
                else
                {
                    PageSize = soLuong != null && soLuong.GiaTriThietLap != null ? Int32.Parse(soLuong.GiaTriThietLap) : 0;
                }
                Total = data.ListBaiViet.FirstOrDefault().TotalRows;
            }
            else
            {
                var item = _context.TB_View.FirstOrDefault(x => x.TenView.ToLower() == viewName && x.SuDung == true && x.ViewCapChaID == maViewCapCha);
                if (item != null)
                {
                    //var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByViewID.Query { MaView = item.ID });
                    var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = item.ID });

                    int total = 0, sl = 0;
                    if (cauHinh.IsSuccess && cauHinh.Value != null)
                    {
                        var chuyenMuc = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "category");
                        var isShow = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isShow");
                        var soLuong = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOf");
                        var pageSize = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOfPage");
                        var isPaging = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isPaging");
                        if (isShow != null && isShow.GiaTriThietLap == "1")
                        {
                            if (isPaging != null && isPaging.GiaTriThietLap == "1")
                            {
                                sl = pageSize != null && pageSize.GiaTriThietLap != null ? Int32.Parse(pageSize.GiaTriThietLap) : 0;
                            }
                            else
                            {
                                sl = soLuong != null && soLuong.GiaTriThietLap != null ? Int32.Parse(soLuong.GiaTriThietLap) : 0;
                            }
                            var Request = new ModelPaging()
                            {
                                PageIndex = pageIndex,
                                PageSize = sl,
                                ChuyenMucID = chuyenMuc != null && chuyenMuc.GiaTriThietLap != null ? chuyenMuc.GiaTriThietLap : "",
                            };
                            var tb = await _mediator.Send(new DanhSachTheoChuyenMucPaging.Query { Request = Request });

                            if (tb.IsSuccess && tb.Value.Count > 0)
                            {
                                tb.Value.FirstOrDefault().PageSize = Request.PageSize;
                                total = tb.Value.FirstOrDefault().TotalRows;
                            }
                            PageSize = sl;
                            Total = total;
                            dataSession.ListThongSo = cauHinh.Value;
                            dataSession.ListBaiViet = tb.Value;
                        }
                    }
                }
                HttpContext.Session.SetString(sessionName, JsonConvert.SerializeObject(dataSession));
                data = dataSession;
            }
            if(data != null)
            {
                ViewBag.ListThongSo = data.ListThongSo;
                var paging = new StaticPagedList<TB_BaiVietTrinhDien>(data.ListBaiViet, pageIndex, PageSize, Total);
                return PartialView(data.ListThongSo.ElementAt(0).DuongDan, paging);
            }
            return PartialView();
        }
        public async Task<IActionResult> _SectionView_v2(int pageIndex = 1, string viewName = "", int maViewCapCha = 0, string sessionName = "")
        {
          
            var item = _context.TB_View.FirstOrDefault(x => x.TenView.ToLower() == viewName && x.SuDung == true && x.ViewCapChaID == maViewCapCha);

            if (item != null)
            {
                var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = item.ID });

                int Total = 0, PageSize = 0;
                if (cauHinh.IsSuccess && cauHinh.Value != null)
                {
                    var chuyenMuc = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "category");
                    var isShow = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isShow");
                    var soLuong = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOf");
                    var pageSize = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOfPage");
                    var isPaging = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isPaging");
                    if (isShow != null && isShow.GiaTriThietLap == "1")
                    {
                        if (isPaging != null && isPaging.GiaTriThietLap == "1")
                        {
                            PageSize = pageSize != null && pageSize.GiaTriThietLap != null ? Int32.Parse(pageSize.GiaTriThietLap) : 0;
                        }
                        else
                        {
                            PageSize = soLuong != null && soLuong.GiaTriThietLap != null ? Int32.Parse(soLuong.GiaTriThietLap) : 0;
                        }
                        var Request = new ModelPaging()
                        {
                            PageIndex = pageIndex,
                            PageSize = PageSize,
                            ChuyenMucID = chuyenMuc != null && chuyenMuc.GiaTriThietLap != null ? chuyenMuc.GiaTriThietLap : "",
                        };
                        var tb = await _mediator.Send(new DanhSachTheoChuyenMucPaging.Query { Request = Request });

                        Total = (tb.IsSuccess && tb.Value != null && tb.Value.Any()) ? tb.Value.FirstOrDefault().TotalRows : 0;

                        ViewBag.TotalRows = Total;
                        ViewBag.PageSize = PageSize;
                        ViewBag.ListThongSo = cauHinh.Value;
                        var paging = new StaticPagedList<TB_BaiVietTrinhDien>(tb.Value, pageIndex, PageSize, Total);
                        return PartialView(item.DuongDan, paging);
                    }
                }
            }
            return PartialView();
        }

        //public async Task<IActionResult> _DaoTao(int pageIndex = 1)
        //{
        //    List<ThongSoCauHinhTrinhDien> data = new List<ThongSoCauHinhTrinhDien>();
        //    var item = _context.TB_View.FirstOrDefault(x => x.TenView.ToLower() == "_daotao" && x.SuDung == true);

        //    if (item != null)
        //    {
        //        //var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByViewID.Query { MaView = item.ID });
        //        var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = item.ID });

        //        int total = 0, sl = 0;
        //        if (cauHinh.IsSuccess && cauHinh.Value != null)
        //        {
        //            var chuyenMuc = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "category");
        //            var isShow = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isShow");
        //            var soLuong = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOf");
        //            var pageSize = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOfPage");
        //            var isPaging = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isPaging");
        //            if (isShow != null && isShow.GiaTriThietLap == "1")
        //            {
        //                if (isPaging != null && isPaging.GiaTriThietLap == "1")
        //                {
        //                    sl = pageSize != null && pageSize.GiaTriThietLap != null ? Int32.Parse(pageSize.GiaTriThietLap) : 0;
        //                }
        //                else
        //                {
        //                    sl = soLuong != null && soLuong.GiaTriThietLap != null ? Int32.Parse(soLuong.GiaTriThietLap) : 0;
        //                }
        //                var Request = new ModelPaging()
        //                {
        //                    PageIndex = pageIndex,
        //                    PageSize = sl,
        //                    ChuyenMucID = chuyenMuc != null && chuyenMuc.GiaTriThietLap != null ? chuyenMuc.GiaTriThietLap : "",
        //                };
        //                var tb = await _mediator.Send(new DanhSachTheoChuyenMucPaging.Query { Request = Request });

        //                if (tb.IsSuccess && tb.Value.Count > 0)
        //                {
        //                    tb.Value.FirstOrDefault().PageSize = Request.PageSize;
        //                    total = tb.Value.FirstOrDefault().TotalRows;
        //                }
        //                data.Add(new ThongSoCauHinhTrinhDien
        //                {
        //                    ListThongSo = cauHinh.Value,
        //                    ListBaiViet = tb.Value,
        //                });

        //                var paging = new StaticPagedList<ThongSoCauHinhTrinhDien>(data, pageIndex, Request.PageSize, total);
        //                return PartialView(@"~/Views/Shared/_PartialView/_Home/_DaoTao.cshtml", paging);
        //            }
        //        }
        //    }
        //    return PartialView(@"~/Views/Shared/_PartialView/_Home/_DaoTao.cshtml", null);
        //}

        //public async Task<IActionResult> _SanPham(int pageIndex = 1)
        //{
        //    List<ThongSoCauHinhTrinhDien> data = new List<ThongSoCauHinhTrinhDien>();
        //    var item = _context.TB_View.FirstOrDefault(x => x.TenView.ToLower() == "_sanpham" && x.SuDung == true);

        //    if (item != null)
        //    {
        //        //var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByViewID.Query { MaView = item.ID });
        //        var cauHinh = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = item.ID });

        //        int total = 0, sl = 0;
        //        if (cauHinh.IsSuccess && cauHinh.Value != null)
        //        {
        //            var chuyenMuc = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "category");
        //            var isShow = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isShow");
        //            var soLuong = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOf");
        //            var pageSize = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "numOfPage");
        //            var isPaging = cauHinh.Value.FirstOrDefault(e => e.TenTieuChi == "isPaging");
        //            if (isShow != null && isShow.GiaTriThietLap  == "1")
        //            {
        //                if(isPaging != null && isPaging.GiaTriThietLap == "1")
        //                {
        //                    sl = pageSize != null && pageSize.GiaTriThietLap != null ? Int32.Parse(pageSize.GiaTriThietLap) : 0;
        //                }
        //                else
        //                {
        //                    sl = soLuong != null && soLuong.GiaTriThietLap != null ? Int32.Parse(soLuong.GiaTriThietLap) : 0;
        //                }
        //                var Request = new ModelPaging()
        //                {
        //                    PageIndex = pageIndex, 
        //                    PageSize = sl,
        //                    ChuyenMucID = chuyenMuc != null && chuyenMuc.GiaTriThietLap != null ? chuyenMuc.GiaTriThietLap : "",
        //                };
        //                var tb = await _mediator.Send(new DanhSachTheoChuyenMucPaging.Query { Request = Request });

        //                if (tb.IsSuccess && tb.Value.Count > 0)
        //                {
        //                    tb.Value.FirstOrDefault().PageSize = Request.PageSize;
        //                    total = tb.Value.FirstOrDefault().TotalRows;
        //                }
        //                data.Add(new ThongSoCauHinhTrinhDien
        //                {
        //                    ListThongSo = cauHinh.Value,
        //                    ListBaiViet = tb.Value,
        //                });

        //                var paging = new StaticPagedList<ThongSoCauHinhTrinhDien>(data, pageIndex, Request.PageSize, total);
        //                return PartialView(@"~/Views/Shared/_PartialView/_Home/_SanPham.cshtml", paging);
        //            }
        //        }
        //    }
        //    return PartialView(@"~/Views/Shared/_PartialView/_Home/_SanPham.cshtml", null);
        //}
    }
}