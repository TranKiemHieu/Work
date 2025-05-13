using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.View
{
    public class Select
    {
        public class Query : IRequest<Result<List<TB_View>>>
        {
            public int Flag { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_View>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TB_View>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Flag", request.Flag);

                    string spName = "spu_TB_View_GetSelect";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_View>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TB_View>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_View>>.Failure(ex.Message);
                }
            }
        }
    }
}
