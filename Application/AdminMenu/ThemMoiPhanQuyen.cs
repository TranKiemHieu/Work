using Application.Core;
using Dapper;
using Domain;
using Domain.RequestDtos;
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
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.AdminMenu
{
    public class ThemMoiPhanQuyen
    {
        public class Command : IRequest<Result<TB_MenuPermission>>
        {
            public TB_MenuPermission Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_MenuPermission>>
        {
            private readonly DataContext _context;
            private readonly IConfiguration _configuration;
            public Handler(DataContext context, IConfiguration conguration)
            {
                _context = context;
                _configuration = conguration;
            }

            public async Task<Result<TB_MenuPermission>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var menu = await _context.Permission_Menu.Where(o => o.MenuId == request.Entity.MenuId && o.Rolename == request.Entity.Rolename).FirstOrDefaultAsync();
                    
                    if (menu != null)
                    {
                        return Result<TB_MenuPermission>.Failure("Đã tồn tại phân quyền!");
                    }
                   
                    DynamicParameters dynamicParameters = new DynamicParameters();

                    dynamicParameters.Add("@MenuId", request.Entity.MenuId);
                    dynamicParameters.Add("@Rolename", request.Entity.Rolename);
                    dynamicParameters.Add("@PermittedCreate", request.Entity.PermittedCreate);
                    dynamicParameters.Add("@PermittedEdit", request.Entity.PermittedEdit);
                    dynamicParameters.Add("@PermittedDelete", request.Entity.PermittedDelete);
                    dynamicParameters.Add("@PermittedApprove", request.Entity.PermittedApprove);
               
                    string spName = "spu_Permission_Menu_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_MenuPermission>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_MenuPermission>.Success(result);
                    }

                }
                catch(Exception ex)
                {
                    return Result<TB_MenuPermission>.Failure(ex.Message);
                }
            }
        }
    }
}
