using Application.Core;
using Dapper;
using Domain;
using FluentValidation;
using MediatR;
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
    public class ThongKe
    {
        public class Query : IRequest<Result<TB_BaiViet_ThongKe>>
        {
            public string TuNgay { get; set; }
            public string DenNgay { get; set; }
            public string UniqueCode { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TB_BaiViet_ThongKe>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }
            public async Task<Result<TB_BaiViet_ThongKe>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TuNgay", request.TuNgay.IsNullOrEmpty() ? null : request.TuNgay);
                    dynamicParameters.Add("@DenNgay", request.DenNgay.IsNullOrEmpty() ? null : request.DenNgay);
                    dynamicParameters.Add("@UniqueCode", request.UniqueCode.IsNullOrEmpty() ? null : request.UniqueCode);

                    string spName = "spu_TB_BaiViet_ThongKe";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_BaiViet_ThongKe>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_BaiViet_ThongKe>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_BaiViet_ThongKe>.Failure(ex.Message);
                }
            }
        }
    }
}
