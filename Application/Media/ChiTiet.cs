using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack.Text;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics.Metrics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Media
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<TB_Media>>
        {
            public string ID { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<TB_Media>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<TB_Media>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters parameters = new DynamicParameters();
                    parameters.Add("@ID", request.ID);

                    string spName = "spu_TB_Media_GetById";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_Media>(new CommandDefinition(spName, parameters: parameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_Media>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_Media>.Failure(ex.Message);
                }
            }
        }
    }
}
