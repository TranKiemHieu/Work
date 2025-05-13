using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack;
using ServiceStack.Text;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Xceed.Document.NET;

namespace Application.BaiViet
{
    public class DanhSachTheoChuyenMucPaging
    {
        public class Query : IRequest<Result<List<TB_BaiVietTrinhDien>>>
        {
            public ModelPaging Request { get; set; }
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
                    dynamicParameters.Add("@ChuyenMucID", request.Request.ChuyenMucID);
                    dynamicParameters.Add("@PageIndex", request.Request.PageIndex);
                    dynamicParameters.Add("@PageSize", request.Request.PageSize);
                    dynamicParameters.Add("@TieuDiem", request.Request.TieuDiem);

                    string spName = "spu_TB_BaiViet_GetByChuyenMuc_Paging";

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