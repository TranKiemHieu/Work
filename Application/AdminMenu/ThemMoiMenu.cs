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

namespace Application.AdminMenu
{
    public class ThemMoiMenu
    {
        public class Command : IRequest<Result<TB_AdminMenu>>
        {
            public TB_AdminMenu Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_AdminMenu>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task<Result<TB_AdminMenu>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ParentId", request.Entity.ParentId);
                    dynamicParameters.Add("@AreaName", request.Entity.AreaName);
                    dynamicParameters.Add("@ControllerName", request.Entity.ControllerName);
                    dynamicParameters.Add("@ActionName", request.Entity.ActionName);
                    dynamicParameters.Add("@Title", request.Entity.Title);
                    dynamicParameters.Add("@IsLeaf", request.Entity.IsLeaf);
                    dynamicParameters.Add("@Icon", request.Entity.Icon);
                    dynamicParameters.Add("@DisplayOrder", request.Entity.DisplayOrder);
                    dynamicParameters.Add("@IsShow", request.Entity.IsShow);


                    string spName = "spu_TB_AdminMenu_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_AdminMenu>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_AdminMenu>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_AdminMenu>.Failure(ex.Message);
                }
            }
        }
    }
}
