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

namespace Application.TinLienQuan
{
    public class CapNhat
    {
        public class Command : IRequest<Result<TB_TinLienQuan>>
        {
            public TB_TinLienQuan Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_TinLienQuan>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<TB_TinLienQuan>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Entity.ID);
                    dynamicParameters.Add("@BaiVietID", request.Entity.BaiVietID);
                    dynamicParameters.Add("@BaiVietLienQuanID", request.Entity.BaiVietLienQuanID);
                    

                    string spName = "spu_TB_TinLienQuan_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_TinLienQuan>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_TinLienQuan>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_TinLienQuan>.Failure(ex.Message);
                }
            }
        }
    }
}
