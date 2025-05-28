using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using QLTB.Interface;
using System.Text;

namespace QLTB.Services
{
    [Route("api/tin-tuc")]
    public class TinTucApiController : Controller
    {
        public readonly ITinTucRepository _tinTucRepository;
        private readonly DataContext _context;

        public TinTucApiController(ITinTucRepository tinTucRepository, DataContext context)
        {
            _tinTucRepository = tinTucRepository;
            _context = context;
        }

        private string NormalizeUrl(string input)
        {
            return input
                .Replace("“", "\"") // hoặc ""
                .Replace("”", "\"") // hoặc ""
                .Replace("‘", "'")
                .Replace("’", "'")
                .Replace("–", "-")
                .Replace("—", "-")
                .Replace("…", "...")
                .Normalize(NormalizationForm.FormC); // Chuẩn hóa Unicode
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllBaiViet()
        {
            try
            {
                var result = await _tinTucRepository.GetAllBaiViet();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("tin-tieu-diem")]
        public async Task<IActionResult> GetBaiVietTieuDiem()
        {
            try
            {
                var result = await _tinTucRepository.GetBaiVietTieuDiem();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("chi-tiet/tid/{urlBaiViet}")]
        public async Task<IActionResult> GetBaiViet(string urlBaiViet)
        {
            try
            {
                if (string.IsNullOrEmpty(urlBaiViet))
                    return BadRequest("Thiếu tham số urlBaiViet");

                var result = await _tinTucRepository.GetBaiViet(urlBaiViet);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("chi-tiet/{idBaiViet}")]
        public async Task<IActionResult> GetBaiVietById(Guid? idBaiViet)
        {
            try
            {
                var result = await _tinTucRepository.GetBaiVietById(idBaiViet);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("danh-sach/hoat-dong-doan-the")]
        public async Task<IActionResult> GetHoatDongDoanThe()
        {
            try
            {
                var result = await _tinTucRepository.GetHoatDongDoanThe();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("danh-sach/tin-hoat-dong-1")]
        public async Task<IActionResult> GetTinHoatDong()
        {
            try
            {
                var result = await _tinTucRepository.GetTinHoatDong();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("danh-sach/tin-chuyen-nganh")]
        public async Task<IActionResult> GetTinChuyenNganh()
        {
            try
            {
                var result = await _tinTucRepository.GetTinChuyenNganh();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("tin-tuc-su-kien")]
        public async Task<IActionResult> GetTinTuc()
        {
            try
            {
                var result = await _tinTucRepository.GetTinTuc();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("{url}/{page:int}")]
        public async Task<IActionResult> GetBaiVietByChuyenMuc(string url, int page, int pageSize = 5)
        {
            try
            {
                if (string.IsNullOrEmpty(url))
                    return BadRequest("Thiếu tham số chuyên mục");

                List<TB_BaiViet> allArticles = new List<TB_BaiViet>();

                if (url == "tin-chuyen-nganh")
                {
                    allArticles = (await _tinTucRepository.GetTinChuyenNganh()).Value;
                }
                else if (url == "tin-hoat-dong-1")
                {
                    allArticles = (await _tinTucRepository.GetTinHoatDong()).Value;
                }
                else if (url == "hoat-dong-doan-the")
                {
                    allArticles = (await _tinTucRepository.GetHoatDongDoanThe()).Value;
                }
                else
                {
                    return NotFound("Không tìm thấy chuyên mục phù hợp.");
                }

                var total = allArticles.Count;

                var paginated = allArticles
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var result = new
                {
                    total,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)total / pageSize),
                    data = paginated
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
