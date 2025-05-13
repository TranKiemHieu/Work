using Application.Core;
using Dapper;
using Domain;
using Domain.Enums;
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
    public class DanhSachTheoChuyenMuc
    {
        public class Query : IRequest<Result<object>>
        {
            public string ChuyenMucID { get; set; }
            public int SoLuong { get; set; }
            public int Loai { get; set; } = 0;


            public class Handler : IRequestHandler<Query, Result<object>>
            {
                private readonly IConfiguration _configuration;
                public Handler(DataContext dataContext, IConfiguration configuration)
                {
                    _configuration = configuration;
                }
                public async Task<Result<object>> Handle(Query request, CancellationToken cancellationToken)
                {
                    try
                    {
                        DynamicParameters dynamicParameters = new DynamicParameters();
                        dynamicParameters.Add("@ChuyenMucID", request.ChuyenMucID.IsNullOrEmpty() ? null : request.ChuyenMucID);
                        dynamicParameters.Add("@SoLuong", request.SoLuong.ToString().IsNullOrEmpty() ? 0 : request.SoLuong);
                        dynamicParameters.Add("@Loai", request.Loai);

                        string spName = "spu_TB_Media_GetByChuyenMuc";

                        using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                        {
                            connection.Open();

                            var result = await connection.QueryAsync<TB_Media>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                            var data = new object();
                            if (result.Any())
                            {
                                data =  result.GroupBy(e => e.BaiVietID).ToList();
                                return Result<object>.Success(data);
                            }
                            return Result<object>.Success(result.ToList());
                        }
                    }
                    catch (Exception ex)
                    {
                        return Result<object>.Failure(ex.Message);
                    }
                }
            }
        }
    }
}
