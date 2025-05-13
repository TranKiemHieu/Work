using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.ThongSoCauHinh
{
    public class CapNhat
    {
        public class Command : IRequest<Result<TB_ThongSoCauHinh>>
        {
            public TB_ThongSoCauHinh Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_ThongSoCauHinh>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<TB_ThongSoCauHinh>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Entity.ID);
                    dynamicParameters.Add("@TenThongSo", request.Entity.TenThongSo);
                    dynamicParameters.Add("@MaView", request.Entity.MaView);
                    dynamicParameters.Add("@MaTieuChi", request.Entity.MaTieuChi);
                    dynamicParameters.Add("@GiaTriThietLap", request.Entity.GiaTriThietLap);
                    dynamicParameters.Add("@ThuTuHienThi", request.Entity.ThuTuHienThi);
                    dynamicParameters.Add("@NguoiCapNhat", request.Entity.NguoiCapNhat);
                    dynamicParameters.Add("@DuLieuLienKet", request.Entity.DuLieuLienKet);

                    string spName = "spu_TB_ThongSoCauHinh_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_ThongSoCauHinh>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_ThongSoCauHinh>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_ThongSoCauHinh>.Failure(ex.Message);
                }
            }
        }
    }
}
