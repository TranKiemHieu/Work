using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.AdminMenu
{
    public class DanhSachMenuChild
    {
        public class Query : IRequest<Result<List<TB_AdminMenu>>>
        {
            public int ParentId { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<TB_AdminMenu>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<TB_AdminMenu>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters parameters = new DynamicParameters();
                    parameters.Add("@ParentId", request.ParentId);

                    string spName = "spu_TB_AdminMenu_GetMenuChild";
                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_AdminMenu>(new CommandDefinition(spName, parameters: parameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<List<TB_AdminMenu>>.Success(result.ToList());
                    }
                   
                }
                catch (Exception ex)
                {
                    return Result<List<TB_AdminMenu>>.Failure(ex.Message);
                }
            }
        }
    }
}
