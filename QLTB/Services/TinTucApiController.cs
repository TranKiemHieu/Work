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
        [Route("danh-sach/{URLChuyenMuc}")]
        public async Task<IActionResult> GetBaiVietByURLChuyenMuc(string URLChuyenMuc)
        {
            try
            {
                var result = await _tinTucRepository.GetBaiVietByURLChuyenMuc(URLChuyenMuc);
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

                var result = await _tinTucRepository.GetBaiVietByURLChuyenMuc(url);

                if (!result.IsSuccess || result.Value == null)
                    return NotFound(result.Error ?? "Không tìm thấy bài viết.");

                var allArticles = result.Value;
                var total = allArticles.Count;

                var paginated = allArticles
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    total,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)total / pageSize),
                    data = paginated
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    }
}
