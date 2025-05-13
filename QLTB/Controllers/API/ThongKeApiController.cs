
using Application.Core;
using Application.OD_AppUser;
using Application.ThongKe;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using Aspose.Cells;
using System.Drawing;
using Domain.Enums;
using System.Web;
using Microsoft.IdentityModel.Tokens;
using Xceed.Document.NET;
using System.Text;
using Azure.Core;
using System.Globalization;
using OfficeOpenXml;
using ServiceStack;
using OfficeOpenXml.Style;
using Persistence;
using System.Text.RegularExpressions;
using Microsoft.Extensions.FileSystemGlobbing.Internal;

namespace QLTB.Controllers
{
    public class ThongKeApiController : AdminController
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;

        public ThongKeApiController(IMediator mediator, IWebHostEnvironment hostingEnvironment, IConfiguration config, UserManager<AppUser> userMangager) : base(hostingEnvironment, config)
        {
            _mediator = mediator;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
            _userManager = userMangager;
        }

        [HttpPost]
        [Route("ThongKeBaiViet")]
        public async Task<ActionResult<Result<List<TB_BaiVietTrinhDien>>>> ThongKeBaiViet(TB_ThongKe_Filter_Request request)
        { 
            var claimUser = (ClaimsIdentity)User.Identity;

            if (claimUser != null && claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                var user = claimUser.Name != null ? await _userManager.FindByNameAsync(claimUser.Name) : null;

                if (!isAdmin && user != null)
                {
                    request.UniqueCode = user.OrgUniqueCode;

                    var result = await Mediator.Send(new ThongKeBaiViet.Query { Request = request });

                    var permission = await Mediator.Send(new GetCategoryPermission.Query { UserId = user.Id });
                 
                    if (permission.IsSuccess == true && permission.Value.Count > 0)
                    {
                        var data = result.Value;
                        foreach (var item in data)
                        {
                            item.isAuthorizeUser1 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == user.Id && e.Loai == 1 && e.UserID == item.CreatedByUserID);
                            item.isAuthorizeUser2 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == user.Id && e.Loai == 2);
                            item.isAuthorizeUser3 = permission.Value.ToList().Exists(e => e.ChuyenMucID == item.ChuyenMucID && e.UserID == user.Id && e.Loai == 3);                                                    
                        }
                        result.Value = data.Where(e => e.isAuthorizeUser1 != false || e.isAuthorizeUser2 != false || e.isAuthorizeUser3 != false).ToList();
                    }

                    return Ok(result);
                }
                else
                {
                    request.UniqueCode = null;
                    var result = await Mediator.Send(new ThongKeBaiViet.Query { Request = request });
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
        [Route("XuatFileExcel")]
        public async Task<IActionResult> XuatFileExcel(string TuKhoa = "", string ChuyenMucID = "", string NgonNgu = "", bool ChuyenMucKhac = false, string TuNgay = "", string DenNgay = "", long NguoiCapNhat = -1, int TrangThai = -1)
        {
            TB_ThongKe_Filter_Request request = new TB_ThongKe_Filter_Request { 
                TuKhoa = TuKhoa,
                ChuyenMucID = ChuyenMucID,
                NgonNgu = NgonNgu,
                ChuyenMucKhac = ChuyenMucKhac,
                TuNgay = TuNgay,
                DenNgay = DenNgay,
                NguoiCapNhat = NguoiCapNhat,
                TrangThai = TrangThai
            };
            var claimUser = (ClaimsIdentity)User.Identity;

            if (claimUser != null && claimUser.IsAuthenticated == true)
            {
                string rolename = claimUser.FindFirst("RolesList").Value;
                bool isAdmin = rolename.Split(',').ToList().Exists(e => e.ToUpper().Equals("HOST") == true);
                var user = claimUser.Name != null ? await _userManager.FindByNameAsync(claimUser.Name) : null;

                if (!isAdmin && user != null)
                {
                    request.UniqueCode = user.OrgUniqueCode;
                }
                else
                {
                    request.UniqueCode = null;
                }
            }
            var result = await Mediator.Send(new ThongKeBaiViet.Query { Request = request });

            var filePath = Path.Combine(_hostingEnvironment.ContentRootPath + "\\wwwroot\\Temple\\MauThongKeTinBai.xlsx");
            var fileName = $"ThongKeTinBai_{DateTime.Now:dd.MM.yyyy}.xlsx";

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Không tìm thấy tệp");
            }
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            ExcelPackage package = new ExcelPackage(filePath);
            ExcelWorkbook workbook = package.Workbook;
            ExcelWorksheet worksheet = package.Workbook.Worksheets[0];

            if (result != null && result.Value.Count > 0)
            {
                worksheet.Cells["A1:B1"].Value = "Thời gian in phiếu: " + string.Format("{0:dd/MM/yyyy}", DateTime.Now);
                var tuNgay = request.TuNgay.IsNullOrEmpty() ? "..." : string.Format("{0:dd/MM/yyyy}", DateTime.ParseExact(request.TuNgay, "yyyy-MM-dd", null));
                var denNgay = request.DenNgay.IsNullOrEmpty() ? "..." : string.Format("{0:dd/MM/yyyy}", DateTime.ParseExact(request.DenNgay, "yyyy-MM-dd", null));
                worksheet.Cells["A4:M4"].Value = "Từ ngày " + tuNgay + " - Đến ngày " + denNgay;

                for (int i = 0; i < result.Value.Count; i++)
                {
                    List<string> listAnh = result.Value[i].ListMedia.Where(x => x.LoaiFileMedia == (int)LoaiFileMedia.Anh).Select(x => x.TenFileMedia).ToList();
                    List<string> listMedia = result.Value[i].ListMedia.Where(x => x.LoaiFileMedia != (int)LoaiFileMedia.Anh).Select(x => x.TenFileMedia).ToList();
                    var content = Regex.Replace(HttpUtility.HtmlDecode(result.Value[i].NoiDung), "<.*?>", "");
                    int imgCount = Regex.Matches(HttpUtility.HtmlDecode(result.Value[i].NoiDung), @"<img\s[^>]*>").Count;
                    string patternMedia = @"<(audio|video|source|iframe|embed|object|track|map|area|param|canvas)[^>]+>";
                    int mediaCount = Regex.Matches(HttpUtility.HtmlDecode(result.Value[i].NoiDung), patternMedia).Count;
                    string pattern = @"<a[^>]*\bhref\s*=\s*(?:""(?<url>[^""]*)""|'(?<url>[^']*)')";
                    MatchCollection matches = Regex.Matches(HttpUtility.HtmlDecode(result.Value[i].NoiDung), pattern, RegexOptions.IgnoreCase);
                    var imageExtensions = new Regex(@"\.(jpg|jpeg|png|gif|bmp|svg)$", RegexOptions.IgnoreCase);
                    var mediaExtensions = new Regex(@"\.(tiff|mp3|wav|wma|ogg|mp4|avi|mkv|mov|flv|doc|docx|pdf|ppt|pptx|xls|xlsx|txt)$", RegexOptions.IgnoreCase);
                    foreach (Match match in matches)
                    {
                        string url = match.Groups["url"].Value;
                        if (imageExtensions.IsMatch(url))
                        {
                            listAnh.Add(Path.GetFileName(url));
                        }
                        else if (mediaExtensions.IsMatch(url))
                        {
                            listMedia.Add(Path.GetFileName(url));
                        }
                    }
                    int find1 = content.IndexOf("<img ");
                    int find2 = result.Value[i].NoiDung.IndexOf("<img ");
                    var index = i + 7;
                    worksheet.Cells["A" + index].Value = i + 1;
                    worksheet.Cells["B" + index].Value = result.Value[i].TieuDe;
                    worksheet.Cells["C" + index].Value = string.Format("{0:dd/MM/yyyy}", result.Value[i].NgayCongBo);
                    worksheet.Cells["D" + index].Value = string.Join(";" + Environment.NewLine, listAnh);
                    worksheet.Cells["E" + index].Value = string.Join(";" + Environment.NewLine, listMedia);
                    worksheet.Cells["F" + index].Value = "";
                    worksheet.Cells["G" + index].Value = result.Value[i].TenChuyenMuc.Replace("; ", ";" + Environment.NewLine);
                    worksheet.Cells["H" + index].Value = listAnh.Count() + imgCount;
                    worksheet.Cells["I" + index].Value = listMedia.Count() + mediaCount;
                    worksheet.Cells["J" + index].Value = content.Length;
                    worksheet.Cells["K" + index].Value = result.Value[i].TenNguoiCapNhat;
                    worksheet.Cells["L" + index].Value = result.Value[i].NguonTin;
                    worksheet.Cells["M" + index].Value = result.Value[i].TacQuyen;
                }

                //Format
                int totalRow = result.Value.Count() + 6;
                ExcelStyle style1 = worksheet.Cells["A7:M" + totalRow].Style;
                style1.Font.Size = 13;
                style1.VerticalAlignment = ExcelVerticalAlignment.Center;
                style1.WrapText = true;
                style1.Border.Top.Style = ExcelBorderStyle.Thin;
                style1.Border.Bottom.Style = ExcelBorderStyle.Thin;
                style1.Border.Left.Style = ExcelBorderStyle.Thin;
                style1.Border.Right.Style = ExcelBorderStyle.Thin;
                worksheet.Cells["A7:A" + totalRow].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Columns[3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Columns[6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Columns[8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Columns[9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                worksheet.Columns[10].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            }

            byte[] fileBytes = package.GetAsByteArray();
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
    }
}
