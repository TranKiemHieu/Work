using Application.Core;
using AutoMapper;
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

namespace Application.BaiViet
{
    public class XoaAnh
    {
        public class Command : IRequest<Result<TB_BaiViet>>
        {
            public BaiVietDeleteImageRequest Data { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_BaiViet>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<TB_BaiViet>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Data.ID);
                    dynamicParameters.Add("@Type", request.Data.Type);

                    string spName = "spu_TB_BaiViet_Delete_Img";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_BaiViet>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_BaiViet>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_BaiViet>.Failure(ex.Message);
                }
            }
        }
    }
}
