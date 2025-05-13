using Application.Core;
using Aspose.Cells.ExternalConnections;
using Dapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dapper.SqlMapper;

namespace Application.BaiViet
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<TB_BaiViet>>
        {
            public string ID { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<TB_BaiViet>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<TB_BaiViet>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters parameters = new DynamicParameters();
                    parameters.Add("@ID", new Guid(request.ID));

                    string spName = "spu_TB_BaiViet_GetById";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_BaiViet>(new CommandDefinition(spName, parameters: parameters, commandType: System.Data.CommandType.StoredProcedure));

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
