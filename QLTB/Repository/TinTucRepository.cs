using Application.Core;
using Dapper;
using Domain;
using QLTB.Interface;

namespace QLTB.Repository
{
    public class TinTucRepository : ITinTucRepository
    {
        private readonly IConnectDB _connectDB;

        public TinTucRepository(IConnectDB connectDB)
        {
            _connectDB = connectDB;
        }
        public async Task<Result<List<TB_BaiViet>>> GetAllBaiViet()
        {
            List<TB_BaiViet> lstBaiViet = new List<TB_BaiViet>();
            try
            {
                using (var conn = _connectDB.IConnectData())
                {
                    conn.Open();
                    var sp = "dbo.spu_TB_BaiViet_GetAll"; // tên stored proceduce
                    var result = await conn.QueryAsync<TB_BaiViet>(new CommandDefinition(sp, commandType: System.Data.CommandType.StoredProcedure));
                    //xử lý kết quả trả trước khi trả về (nếu có)
                    return Result<List<TB_BaiViet>>.Success(result.ToList());
                }
            }
            catch (Exception ex)
            {
                return Result<List<TB_BaiViet>>.Failure(ex.Message);
            }
        }

        public async Task<Result<TB_BaiViet>> GetBaiViet(string urlBaiViet)
        {
            try
            {
                using (var conn = _connectDB.IConnectData())
                {
                    conn.Open();
                    var sp = "dbo.spu_TB_BaiViet_GetByUrl"; // tên stored proceduce
                    var parameters = new { URLBaiViet = urlBaiViet };

                    var result = await conn.QueryFirstOrDefaultAsync<TB_BaiViet>(new CommandDefinition(sp, parameters, commandType: System.Data.CommandType.StoredProcedure));
                    //xử lý kết quả trả trước khi trả về (nếu có)
                    if (result == null)
                        return Result<TB_BaiViet>.Failure("Không tìm thấy bài viết.");
                    return Result<TB_BaiViet>.Success(result);
                }
            }
            catch (Exception ex)
            {
                return Result<TB_BaiViet>.Failure(ex.Message);
            }
        }
    }
}
