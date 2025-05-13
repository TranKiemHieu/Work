using Application.AdminMenu;
using Application.BaiViet;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Linq;
using X.PagedList;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Controller = Microsoft.AspNetCore.Mvc.Controller;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace QLTB.Controllers
{
    public class BaiVietController : Controller
    {
        private readonly IMediator _mediator;
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly DataContext _context;

        public BaiVietController(IMediator mediator, ILogger<HomeController> logger, UserManager<AppUser> userManager, DataContext context,
            SignInManager<AppUser> signInManager)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _mediator = mediator;
            _context = context;
        }

        [Route("/{url}/act/{redirect}")]
        public IActionResult DanhSachBaiViet(string url, int redirect = 0)
        {
            try
            {

                var chuyenMuc = _context.TB_ChuyenMuc.Where(e => e.URLChuyenMuc.Equals(url)).FirstOrDefault();
               
                if (chuyenMuc != null)
                {
                    ViewData["Title"] = chuyenMuc.TenChuyenMuc;
                    ViewData["Description"] = "Chuyên mục " + chuyenMuc.TenChuyenMuc.ToLower() + " HueCIT";
                    ViewData["Keywords"] = chuyenMuc.TenChuyenMuc + ", HueCIT";
                    ViewBag.Url = url;

                    var chuyenMucCapChaID = chuyenMuc.ChuyenMucCapChaID;
                    var duongDanView = chuyenMuc.DiaChiLienKet;
                    while (chuyenMucCapChaID != null)
                    {
                        try
                        {
                            var chuyenMucCapCha = _context.TB_ChuyenMuc.Where(e => e.ID == chuyenMucCapChaID).FirstOrDefault();
                            if (chuyenMucCapCha != null)
                            {
                                if (chuyenMucCapCha.ChuyenMucCapChaID == null)
                                {
                                    duongDanView = chuyenMucCapCha.DiaChiLienKet;
                                }
                                chuyenMucCapChaID = chuyenMucCapCha.ChuyenMucCapChaID;
                            }
                            else
                            {
                                chuyenMucCapChaID = null;
                            }
                        }
                        catch
                        {
                            chuyenMucCapChaID = null;
                        }
                    }
                    if (!duongDanView.IsNullOrEmpty() && int.Parse(duongDanView) > 0)
                    {
                        ViewBag.ViewID = int.Parse(duongDanView);

                        var view = _context.TB_View.FirstOrDefault(x => x.ID.ToString() == duongDanView);

                        if (view != null && !view.DuongDan.IsNullOrEmpty())
                        {
                            if(redirect == 1)
                            {
                                var arrDuongDan = view.DuongDan.Split("/").ToArray();
                                if(arrDuongDan.Length > 0)
                                {
                                    arrDuongDan[arrDuongDan.Length - 1] = "DanhSach.cshtml";
                                }
                                return View(string.Join("/", arrDuongDan));
                            }
                            return View(view.DuongDan);
                        }
                    }
                }
                return RedirectToAction("Error", "Home");
            }
            catch
            {
                return RedirectToAction("Error", "Home");
            }
        }

        [Route("/{urlcm}/chi-tiet/{urlbv}")]
        public IActionResult ChiTietBaiViet(string urlcm = "", string urlbv = "")
        {
            try
            {
                var baiViet = _context.TB_BaiViet.Where(e => e.URLBaiViet == urlbv).FirstOrDefault();
                //SEO
                ViewData["Title"] = baiViet.TieuDe;
                ViewData["Description"] = baiViet.TieuDe.ToLower() + "|HueCIT";
                ViewData["Keywords"] = baiViet.TuKhoa + ", HueCIT";
                ViewBag.BaiVietID = baiViet.ID;

                var chuyenMuc = _context.TB_ChuyenMuc.Where(e => e.URLChuyenMuc == urlcm).FirstOrDefault();

                var capChaID = chuyenMuc.ChuyenMucCapChaID;
                var duongDanViewChiTiet = "";
                
                if(capChaID == null)
                {
                    var view = _context.TB_View.FirstOrDefault(x => x.ID.ToString() == chuyenMuc.DiaChiLienKet);
                    if(view != null && !view.DuongDan.IsNullOrEmpty())
                    {
                        duongDanViewChiTiet = view.DuongDan;
                    }
                }
                else
                {
                    while (capChaID != null)
                    {
                        try
                        {
                            var chuyenMucCapCha = _context.TB_ChuyenMuc.Where(e => e.ID == capChaID).FirstOrDefault();
                            if (chuyenMucCapCha != null)
                            {
                                if(chuyenMucCapCha.ChuyenMucCapChaID == null)
                                {
                                    var view = _context.TB_View.FirstOrDefault(x => x.ID.ToString() == chuyenMucCapCha.DiaChiLienKet);
                                    if (view != null && !view.DuongDan.IsNullOrEmpty())
                                    {
                                        duongDanViewChiTiet = view.DuongDan;
                                    }
                                }
                                capChaID = chuyenMucCapCha.ChuyenMucCapChaID;
                            }
                            else
                            {
                                capChaID = null;
                            }
                        }
                        catch
                        {
                            capChaID = null;
                        }
                    }
                }
                // Trả về view chi tiết
                if (duongDanViewChiTiet.Contains("TinTuc"))
                {
                    return View("~/Views/BaiViet/TinTuc/ChiTiet.cshtml");
                }
                if (duongDanViewChiTiet.Contains("DichVu"))
                {
                    return View("~/Views/BaiViet/DichVu/ChiTiet.cshtml");
                }
                if (duongDanViewChiTiet.Contains("SanPham"))
                {
                    return View("~/Views/BaiViet/SanPham/ChiTiet.cshtml");
                }
                if (duongDanViewChiTiet.Contains("Blog"))
                {
                    return View("~/Views/BaiViet/Blog/ChiTiet.cshtml");
                }
                if (duongDanViewChiTiet.Contains("TuyenDung"))
                {
                    return View("~/Views/BaiViet/TuyenDung/ChiTiet.cshtml");
                }
                return View("~/Views/Shared/Error.cshtml");
            }
            catch
            {
                return RedirectToAction("Error", "Home");
            }
        }

    }
}