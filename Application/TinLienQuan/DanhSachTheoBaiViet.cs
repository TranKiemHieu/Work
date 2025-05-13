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

namespace Application.TinLienQuan
{
    public class DanhSachTheoBaiViet
    {
        public class Query : IRequest<Result<List<TinLienQuanTrinhDien>>>
        {
            public string BaiVietID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TinLienQuanTrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TinLienQuanTrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@BaiVietID", request.BaiVietID);

                    string spName = "spu_TB_TinLienQuan_GetByBaiViet";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TinLienQuanTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TinLienQuanTrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TinLienQuanTrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
