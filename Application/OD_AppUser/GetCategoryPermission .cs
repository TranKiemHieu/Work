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
    public class GetPermission
    {        

        public class Query : IRequest<Result<PermissionDto>>
        {
            public string AreaName { get; set; }
            public string ControllerName { get; set; }
            public string ActionName { get; set; }
            public string RolesName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PermissionDto>>
        {
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task<Result<PermissionDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connettion = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connettion.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@pAreaName", request.AreaName);
                        parameters.Add("@pControllerName", request.ControllerName);
                        parameters.Add("@pActionName", request.ActionName);
                        parameters.Add("@pRoles", request.RolesName);
                        var queryResult = await connettion.QueryAsync<PermissionDto>("spu_GetPermission_Menu", parameters, commandType: System.Data.CommandType.StoredProcedure);

                        PermissionDto result = new PermissionDto
                        {
                            PermittedEdit = false,
                            PermittedView = false,
                            PermittedApprove = false,
                            PermittedDelete = false,
                            PermittedCreate = false
                        };

                        foreach (var item in queryResult)
                        {
                            if (item.PermittedEdit.HasValue || item.PermittedDelete.HasValue || item.PermittedApprove.HasValue)
                                result.PermittedView = true;

                            if (item.PermittedEdit.HasValue && item.PermittedEdit.Value)
                                result.PermittedEdit = true;

                            if (item.PermittedDelete.HasValue && item.PermittedDelete.Value)
                                result.PermittedDelete = true;

                            if (item.PermittedApprove.HasValue && item.PermittedApprove.Value)
                                result.PermittedApprove = true;
                            if (item.PermittedCreate.HasValue && item.PermittedCreate.Value)
                                result.PermittedCreate = true;
                        }

                        if (result.PermittedDelete.Value || result.PermittedApprove.Value || result.PermittedEdit.Value || result.PermittedCreate.Value)
                            result.PermittedView = true;

                        return Result<PermissionDto>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<PermissionDto>.Failure(ex.Message);
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
