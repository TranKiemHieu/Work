using Application.Core;
using Domain;

namespace QLTB.Interface
{
    public interface ITinTucRepository
    {
        Task<Result<List<TB_BaiViet>>> GetAllBaiViet();
        Task<Result<TB_BaiViet>> GetBaiViet(string urlBaiViet);
    }
}
