using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Media
{
    public class DanhSachTheoBaiViet
    {
        public class Query : IRequest<Result<List<TB_Media>>>
        {
            public string BaiVietID { get; set; }
            public int SoLuong { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_Media>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TB_Media>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@BaiVietID", request.BaiVietID.IsNullOrEmpty()? null : request.BaiVietID);
                    dynamicParameters.Add("@SoLuong", request.SoLuong.ToString().IsNullOrEmpty()? 0 : request.SoLuong);

                    string spName = "spu_TB_Media_GetByBaiViet";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_Media>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TB_Media>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_Media>>.Failure(ex.Message);
                }
            }
        }
    }
}
