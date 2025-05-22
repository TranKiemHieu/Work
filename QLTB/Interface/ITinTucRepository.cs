using Application.Core;
using Domain;

namespace QLTB.Interface
{
    public interface ITinTucRepository
    {
        Task<Result<List<TB_BaiViet>>> GetAllBaiViet();
        Task<Result<TB_BaiViet>> GetBaiViet(string urlBaiViet);
        Task<Result<TB_BaiViet>> GetBaiVietById(Guid? idBaiViet);
        Task<Result<TB_BaiViet>> GetBaiVietTieuDiem();
        Task<Result<List<TB_BaiViet>>> GetHoatDongDoanThe();
        Task<Result<List<TB_BaiViet>>> GetTinHoatDong();
        Task<Result<List<TB_BaiViet>>> GetTinChuyenNganh();
        Task<Result<List<TB_BaiViet>>> GetTinTuc();
    }
}
