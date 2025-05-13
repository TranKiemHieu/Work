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

namespace Application.OD_AppUser
{
    public class GetCategoryPermission
    {        

        public class Query : IRequest<Result<List<TB_CategoryPermission>>>
        {
            public long UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_CategoryPermission>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task<Result<List<TB_CategoryPermission>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connettion = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connettion.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@UserId", request.UserId);
                        var queryResult = await connettion.QueryAsync<TB_CategoryPermission>("spu_GetPermission_Category", parameters, commandType: System.Data.CommandType.StoredProcedure);
                                          
                        return Result<List<TB_CategoryPermission>>.Success(queryResult.ToList());
                    }
                    catch (Exception ex)
                    {
                        return Result<List<TB_CategoryPermission>>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connettion.CloseAsync();
                    }
                }
            }
        }
    }
}
