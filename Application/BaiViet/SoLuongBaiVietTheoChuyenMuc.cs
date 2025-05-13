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
    public class SoLuongBaiVietTheoChuyenMuc
    {
        public class Query : IRequest<Result<TB_BaiVietTrinhDien>>
        {
            public string Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TB_BaiVietTrinhDien>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<TB_BaiVietTrinhDien>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@URLChuyenMuc", request.Request);

                    string spName = "spu_TB_BaiViet_GetQuantityByChuyenMuc";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_BaiVietTrinhDien>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_BaiVietTrinhDien>.Failure(ex.Message);
                }
            }
        }
    }
}
