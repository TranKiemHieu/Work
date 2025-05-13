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

namespace Application.Role
{
    public class CapNhat
    {
        public class Command : IRequest<Result<AppRole>>
        {
            public AppRole Entity { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<AppRole>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task<Result<AppRole>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Id", request.Entity.Id);
                    dynamicParameters.Add("@Name", request.Entity.Name);
                    dynamicParameters.Add("@RoleDescription", request.Entity.RoleDescription);
                    dynamicParameters.Add("@NormalizedName", request.Entity.NormalizedName);


                    string spName = "spu_TB_Role_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<AppRole>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<AppRole>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<AppRole>.Failure(ex.Message);
                }
            }
        }
    }
}
