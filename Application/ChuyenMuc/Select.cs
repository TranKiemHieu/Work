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
using System.Threading;
using System.Threading.Tasks;

namespace Application.ChuyenMuc
{
    /// <summary>
    /// Lấy danh sách chuyên mục dựa vào Flag = 0(lấy hết) hoặc Flag = 1 (chỉ lấy cấp cha )
    ///                                  UserID của tài khoản đang đăng nhập(= -1 lấy hết)
    /// </summary>
    public class Select
    {
        public class Query : IRequest<Result<List<ChuyenMucSelect>>>
        {
            public int Flag { get; set; }
            public long UserID {get;set ; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ChuyenMucSelect>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<ChuyenMucSelect>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Flag", request.Flag);
                    dynamicParameters.Add("@UserID", request.UserID);

                    string spName = "spu_TB_ChuyenMuc_GetsSelect";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<ChuyenMucSelect>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        foreach (var i in result)
                        {
                            i.isLeaf = true;
                        }

                        return Result<List<ChuyenMucSelect>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<ChuyenMucSelect>>.Failure(ex.Message);
                }
            }
        }
    }
}
