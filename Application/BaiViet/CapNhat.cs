using Application.Core;
using AutoMapper;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.BaiViet
{
    public class CapNhat
    {
        public class Command : IRequest<Result<TB_BaiViet>>
        {
            public TB_BaiViet Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_BaiViet>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<TB_BaiViet>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Entity.ID);
                    dynamicParameters.Add("@ChuyenMucID", request.Entity.ChuyenMucID);
                    dynamicParameters.Add("@ChuyenMucKhacID", request.Entity.ChuyenMucKhacID);
                    dynamicParameters.Add("@TieuDe", request.Entity.TieuDe);
                    dynamicParameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                    dynamicParameters.Add("@Thumbnail", request.Entity.Thumbnail);
                    dynamicParameters.Add("@MoTaAnhDaiDien", request.Entity.MoTaAnhDaiDien);
                    dynamicParameters.Add("@TomTat", request.Entity.TomTat);
                    dynamicParameters.Add("@NoiDung", request.Entity.NoiDung);
                    dynamicParameters.Add("@TieuDiem", request.Entity.TieuDiem);
                    dynamicParameters.Add("@URLBaiViet", request.Entity.URLBaiViet);
                    dynamicParameters.Add("@NgayCongBo", request.Entity.NgayCongBo);
                    dynamicParameters.Add("@HetHanCongBo", request.Entity.HetHanCongBo);
                    dynamicParameters.Add("@NguonTin", request.Entity.NguonTin);
                    dynamicParameters.Add("@TacGia", request.Entity.TacGia);
                    dynamicParameters.Add("@TacQuyen", request.Entity.TacQuyen);
                    dynamicParameters.Add("@TuKhoa", request.Entity.TuKhoa);
                    dynamicParameters.Add("@NgonNgu", request.Entity.NgonNgu);
                    dynamicParameters.Add("@TrangThai", request.Entity.TrangThai);
                    dynamicParameters.Add("@LastModifiedByUserID", request.Entity.LastModifiedByUserID);
                    dynamicParameters.Add("@DienThoai", request.Entity.DienThoai);
                    dynamicParameters.Add("@Email", request.Entity.Email);
                    dynamicParameters.Add("@GioMoCua", request.Entity.GioMoCua);
                    dynamicParameters.Add("@GioDongCua", request.Entity.GioDongCua);
                    dynamicParameters.Add("@DiaChi", request.Entity.DiaChi);
                    dynamicParameters.Add("@Website", request.Entity.Website);
                    dynamicParameters.Add("@ToaDoX", request.Entity.ToaDoX);
                    dynamicParameters.Add("@ToaDoY", request.Entity.ToaDoY);

                    string spName = "spu_TB_BaiViet_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_BaiViet>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

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
}
