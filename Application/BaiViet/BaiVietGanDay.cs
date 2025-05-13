using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.BaiViet
{
    public class BaiVietGanDay
    {
        public class Query : IRequest<Result<List<TB_BaiVietTrinhDien>>>
        {
            public int SoLuong { get; set; }
            public string UniqueCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_BaiVietTrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TB_BaiVietTrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@SoLuong", request.SoLuong > 0? request.SoLuong : 0);
                    dynamicParameters.Add("@UniqueCode", !request.UniqueCode.IsNullOrEmpty()? request.UniqueCode : null);

                    string spName = "spu_TB_BaiViet_GanDay";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TB_BaiVietTrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_BaiVietTrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
