using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLTB.Interface;

namespace QLTB.Services
{
    [Route("api/[controller]")]
    public class TinTucApiController : Controller
    {
        public readonly ITinTucRepository _tinTucRepository;
        public TinTucApiController(ITinTucRepository tinTucRepository)
        {
            _tinTucRepository = tinTucRepository;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetAllBaiViet")]
        public async Task<IActionResult> GetAllBaiViet(int moduleId, int tabId)
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
        [Route("GetBaiViet")]
        public async Task<IActionResult> GetBaiViet([FromQuery] string urlBaiViet)
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
    }
}
