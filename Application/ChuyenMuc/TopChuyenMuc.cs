using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ChuyenMuc
{
    public class TopChuyenMuc
    {
        public class Query : IRequest<Result<List<ChuyenMucTrinhDien>>>
        {
            public int SoLuong { get; set; }
            public string UniqueCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<ChuyenMucTrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<ChuyenMucTrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@SoLuong", request.SoLuong > 0 ? request.SoLuong : 0);
                    dynamicParameters.Add("@UniqueCode", !request.UniqueCode.IsNullOrEmpty() ? request.UniqueCode : null);

                    string spName = "spu_TB_ChuyenMuc_TopChuyenMuc";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<ChuyenMucTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        foreach(var item in result)
                        {
                            // gán null cho ChuyenMucCapChaID nếu ID cấp cha không tìm thấy
                            var isHasParent = result.ToList().Exists(e => e.ID == item.ChuyenMucCapChaID);
                            if (!isHasParent)
                            {
                                item.ChuyenMucCapChaID = null;
                            }
                        }
                        return Result<List<ChuyenMucTrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<ChuyenMucTrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
