using Application.Core;
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
    public class TotalCountByChuyenMuc
    {
        public class Query : IRequest<Result<int>>
        {
            public string Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<int>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<int>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TenVietTatChuyenMuc", request.Request);

                    string spName = "spu_TB_BaiViet_TotalCountByChuyenMuc";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.ExecuteScalarAsync<int>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<int>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<int>.Failure(ex.Message);
                }
            }
        }
    }
}
