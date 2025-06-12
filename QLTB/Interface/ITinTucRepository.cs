using Application.Core;
using Domain;

namespace QLTB.Interface
{
    public interface ITinTucRepository
    {
        Task<Result<TB_BaiViet>> GetBaiViet(string urlBaiViet);
        Task<Result<List<TB_BaiViet>>> GetBaiVietByURLChuyenMuc(string URLChuyenMuc);
    }
}
