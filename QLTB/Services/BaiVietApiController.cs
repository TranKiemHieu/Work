//using Domain;
//using Microsoft.AspNetCore.Mvc;
//using QLTB.Interface;
//using Microsoft.Data.SqlClient;

//namespace QLTB.Services
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class BaiVietApiController : ControllerBase
//    {
//        private readonly IConnectDB _connectDB;

//        public BaiVietApiController(IConnectDB connectDB)
//        {
//            _connectDB = connectDB;
//        }

//        // GET: api/BaiViet
//        [HttpGet]
//        public IActionResult GetDanhSachBaiViet()
//        {
//            List<TB_BaiViet> danhSach = new();

//            using (var conn = _connectDB.IConnectData())
//            {
//                conn.Open();
//                var command = new SqlCommand("SELECT * FROM TB_BaiViet", conn);
//                var reader = command.ExecuteReader();

//                while (reader.Read())
//                {
//                    danhSach.Add(new TB_BaiViet
//                    {
//                        ID = reader["ID"] as Guid?,
//                        TieuDe = reader["TieuDe"]?.ToString(),
//                        TomTat = reader["TomTat"]?.ToString(),
//                        NoiDung = reader["NoiDung"]?.ToString(),
//                        AnhDaiDien = reader["AnhDaiDien"]?.ToString(),
//                        NgayCongBo = reader["NgayCongBo"] as DateTime?,
//                        LuotXem = reader["LuotXem"] as int?,
//                        TrangThai = Convert.ToInt32(reader["TrangThai"])
//                    });
//                }
//            }

//            return Ok(danhSach);
//        }

//        // GET: api/BaiViet/{id}
//        [HttpGet("chi-tiet")]
//        public IActionResult GetChiTietBaiViet([FromQuery] string urlBaiViet)
//        {
//            TB_BaiViet baiViet = null;

//            using (var conn = _connectDB.IConnectData())
//            {
//                conn.Open();
//                var command = new SqlCommand("SELECT * FROM TB_BaiViet WHERE URLBaiViet = @url", conn);
//                command.Parameters.AddWithValue("@url", urlBaiViet);
//                var reader = command.ExecuteReader();

//                if (reader.Read())
//                {
//                    baiViet = new TB_BaiViet
//                    {
//                        ID = reader["ID"] as Guid?,
//                        TieuDe = reader["TieuDe"]?.ToString(),
//                        TomTat = reader["TomTat"]?.ToString(),
//                        NoiDung = reader["NoiDung"]?.ToString(),
//                        AnhDaiDien = reader["AnhDaiDien"]?.ToString(),
//                        Thumbnail = reader["Thumbnail"]?.ToString(),
//                        MoTaAnhDaiDien = reader["MoTaAnhDaiDien"]?.ToString(),
//                        NgayCongBo = reader["NgayCongBo"] as DateTime?,
//                        LuotXem = reader["LuotXem"] as int?,
//                        TrangThai = Convert.ToInt32(reader["TrangThai"]),
//                        URLBaiViet = reader["URLBaiViet"]?.ToString(),
//                        NguonTin = reader["NguonTin"]?.ToString(),
//                        TacGia = reader["TacGia"]?.ToString()
//                    };
//                }
//            }

//            if (baiViet == null)
//                return NotFound("Không tìm thấy bài viết.");

//            return Ok(baiViet);
//        }
//    }
//}
