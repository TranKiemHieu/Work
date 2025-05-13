using Microsoft.AspNetCore.Mvc;

namespace QLTB.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestApiController : ControllerBase
    {
        [Obsolete]
        private readonly Microsoft.Extensions.Hosting.IApplicationLifetime _applicationLifetime;
        

        [Obsolete]
        public TestApiController(Microsoft.Extensions.Hosting.IApplicationLifetime applicationLifetime)
        {
            _applicationLifetime = applicationLifetime;
        }
        [HttpGet]
        [Route("test")]
        public IActionResult gettest()
        {
            return Ok("hihhe");
        }

        [HttpGet]
        [Route("shutdown")]
        [Obsolete]
        public IActionResult shutdown()
        {
            _applicationLifetime.StopApplication();
            return Ok("hihhe");
        }

        [HttpGet]
        [Route("GetData")]
        [Obsolete]
        public IActionResult GetData()
        {
            //_applicationLifetime.StopApplication();
            return Ok("hihhe");
        }
    }
}
