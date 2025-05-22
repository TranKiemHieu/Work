using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using QLTB.Interface;

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
        [Route("hoat-dong-doan-the")]
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
        [Route("tin-hoat-dong-1")]
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
        [Route("tin-chuyen-nganh")]
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

    }
}
