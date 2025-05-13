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

namespace Application.ChuyenMuc
{
    /// <summary>
    ///  Lấy danh sách phân quyền một chuyên mục dựa vào chuyenMucID
    /// </summary>
    public class DanhSachPhanQuyenTheoChuyenMuc
    {
        public class Query : IRequest<Result<CategoryPermissionRequest>>
        {
            public string chuyenMucID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<CategoryPermissionRequest>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<CategoryPermissionRequest>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ChuyenMucID", new Guid(request.chuyenMucID));

                    string spName = "spu_Permission_Category_GetByChuyenMucID";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<CategoryPermissionRequest>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<CategoryPermissionRequest>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<CategoryPermissionRequest>.Failure(ex.Message);
                }
            }
        }
    }
}
