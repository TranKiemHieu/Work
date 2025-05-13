using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.JSInterop.Implementation;
using Persistence;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ChuyenMuc
{
    /// <summary>
    ///  Lấy danh sách chuyên mục được thể hiện từng cấp (0, 1, 2,..) dựa vào chuyenMucID cấp 0
    ///  flag = 0 lấy hết toàn bộ                                                          
    /// </summary>
    public class DanhSachChuyenMucCapCon
    {
        public class Query : IRequest<Result<List<TreeChuyenMuc>>>
        {
            public string chuyenMucID { get; set; }
            public int flag { get; set; } = 1;
        }

        public class Handler : IRequestHandler<Query, Result<List<TreeChuyenMuc>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TreeChuyenMuc>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@parentID", new Guid(request.chuyenMucID));
                    dynamicParameters.Add("@Flag", request.flag);

                    string spName = "spu_ChuyenMuc_GetChuyenMucChild";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TreeChuyenMuc>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                      
                        return Result<List<TreeChuyenMuc>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TreeChuyenMuc>>.Failure(ex.Message);
                }
            }
        }
    }
}
