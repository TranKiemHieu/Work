using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Data.SqlClient;

namespace Application.ThongKe
{
    public class ThongKeBaiViet
    {
        public class Query : IRequest<Result<List<TB_BaiVietTrinhDien>>>
        {
            public TB_ThongKe_Filter_Request Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_BaiVietTrinhDien>>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _dataContext = dataContext;
                _configuration = configuration;
                _mediator = mediator;
            }

            public async Task<Result<List<TB_BaiVietTrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    string TuKhoa = request.Request.TuKhoa.IsNullOrEmpty() ? null : request.Request.TuKhoa;
                    string ChuyenMucID = request.Request.ChuyenMucID.IsNullOrEmpty() ? null : request.Request.ChuyenMucID;
                    string NgonNgu = request.Request.NgonNgu.IsNullOrEmpty() ? null : request.Request.NgonNgu;
                    bool ChuyenMucKhac = request.Request.ChuyenMucKhac.ToString().IsNullOrEmpty() ? false : request.Request.ChuyenMucKhac;
                    string TuNgay = request.Request.TuNgay.IsNullOrEmpty() ? null : request.Request.TuNgay;
                    string DenNgay = request.Request.DenNgay.IsNullOrEmpty() ? null : request.Request.DenNgay;
                    long? NguoiCapNhat = request.Request.NguoiCapNhat.ToString().IsNullOrEmpty() ? -1 : request.Request.NguoiCapNhat;
                    int TrangThai = request.Request.TrangThai.ToString().IsNullOrEmpty() ? -1 : request.Request.TrangThai;
                    string UniqueCode = request.Request.UniqueCode.IsNullOrEmpty() ? null : request.Request.UniqueCode;

                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TuKhoa", TuKhoa);
                    dynamicParameters.Add("@ChuyenMucID", ChuyenMucID);
                    dynamicParameters.Add("@NgonNgu", NgonNgu);
                    dynamicParameters.Add("@ChuyenMucKhac", ChuyenMucKhac);
                    dynamicParameters.Add("@TuNgay", TuNgay);
                    dynamicParameters.Add("@DenNgay", DenNgay);
                    dynamicParameters.Add("@NguoiCapNhat", NguoiCapNhat);
                    dynamicParameters.Add("@TrangThai", TrangThai);
                    dynamicParameters.Add("@UniqueCode", UniqueCode);

                    string spName = "spu_TB_ThongKe_BaiViet";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        if (result != null && result.Count() > 0)
                        {
                            foreach (var item in result)
                            {
                                item.TotalRows = result.Count();
                                var listMedia = await _mediator.Send(new Application.Media.DanhSachTheoBaiViet.Query { BaiVietID = item.ID.ToString() });
                                if (listMedia != null && listMedia.Value.Count() > 0)
                                {
                                    item.ListMedia.AddRange(listMedia.Value);
                                }
                            }
                        }

                        return Result<List<TB_BaiVietTrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_BaiVietTrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
