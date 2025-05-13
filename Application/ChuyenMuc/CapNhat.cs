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

namespace Application.ChuyenMuc
{
    public class CapNhat
    {
        public class Command : IRequest<Result<TB_ChuyenMuc>>
        {
            public TB_ChuyenMuc Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_ChuyenMuc>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<TB_ChuyenMuc>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Entity.ID);
                    dynamicParameters.Add("@ChuyenMucCapChaID", request.Entity.ChuyenMucCapChaID);
                    dynamicParameters.Add("@TenChuyenMuc", request.Entity.TenChuyenMuc);
                    dynamicParameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                    dynamicParameters.Add("@BieuTuong", request.Entity.BieuTuong);
                    dynamicParameters.Add("@MaChuyenMuc", request.Entity.MaChuyenMuc);
                    dynamicParameters.Add("@MoTaAnhDaiDien", request.Entity.MoTaAnhDaiDien);
                    dynamicParameters.Add("@MoTa", request.Entity.MoTa);
                    dynamicParameters.Add("@NoiDung", request.Entity.NoiDung);
                    dynamicParameters.Add("@SuDung", request.Entity.SuDung);
                    dynamicParameters.Add("@ThuTuHienThi", request.Entity.ThuTuHienThi);
                    dynamicParameters.Add("@URLChuyenMuc", request.Entity.URLChuyenMuc);
                    dynamicParameters.Add("@MoLienKetOCuaSoMoi", request.Entity.MoLienKetOCuaSoMoi);
                    dynamicParameters.Add("@LoaiLienKet", request.Entity.LoaiLienKet);
                    dynamicParameters.Add("@DiaChiLienKet", request.Entity.DiaChiLienKet);
                    dynamicParameters.Add("@NgonNgu", request.Entity.NgonNgu);
                    dynamicParameters.Add("@LastModifiedByUserID", request.Entity.LastModifiedByUserID);
                    dynamicParameters.Add("@IsActive", request.Entity.IsActive);
                    dynamicParameters.Add("@IsMenu", request.Entity.IsMenu);

                    string spName = "spu_TB_ChuyenMuc_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_ChuyenMuc>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_ChuyenMuc>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_ChuyenMuc>.Failure(ex.Message);
                }
            }
        }
    }
}
