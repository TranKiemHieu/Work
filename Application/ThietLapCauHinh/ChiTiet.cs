using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.ThietLapCauHinh
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<TB_ThietLapCauHinh>>
        {
            public byte? ID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TB_ThietLapCauHinh>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<TB_ThietLapCauHinh>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.ID);

                    string spName = "spu_TB_ThietLapCauHinh_GetById";

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
