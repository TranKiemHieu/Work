using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.ThietLapCauHinh
{
    public class ThemMoi
    {
        public class Command : IRequest<Result<TB_ThietLapCauHinh>>
        {
            public TB_ThietLapCauHinh Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_ThietLapCauHinh>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }
            public async Task<Result<TB_ThietLapCauHinh>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TenTieuChi", request.Entity.TenTieuChi);
                    dynamicParameters.Add("@MoTa", request.Entity.MoTa);
                    dynamicParameters.Add("@Loai", request.Entity.Loai);
                    dynamicParameters.Add("@TenLoai", request.Entity.TenLoai);
                    dynamicParameters.Add("@SuDung", request.Entity.SuDung);

                    string spName = "spu_TB_ThietLapCauHinh_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_ThietLapCauHinh>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_ThietLapCauHinh>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_ThietLapCauHinh>.Failure(ex.Message);
                }
            }
        }
    }
}
