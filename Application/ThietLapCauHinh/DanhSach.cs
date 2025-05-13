using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.ThietLapCauHinh
{
    public class DanhSach
    {
        public class Query : IRequest<Result<List<TB_ThietLapCauHinh_Filter_Request>>>
        {
            public TB_ThietLapCauHinh_Filter_Request Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_ThietLapCauHinh_Filter_Request>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TB_ThietLapCauHinh_Filter_Request>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TuKhoa", request.Request.TuKhoa);
                    dynamicParameters.Add("@SoLuong", request.Request.SoLuong);

                    string spName = "spu_TB_ThietLapCauHinh_Gets";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_ThietLapCauHinh_Filter_Request>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TB_ThietLapCauHinh_Filter_Request>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_ThietLapCauHinh_Filter_Request>>.Failure(ex.Message);
                }
            }
        }
    }
}
