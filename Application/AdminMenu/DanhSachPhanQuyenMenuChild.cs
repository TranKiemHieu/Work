using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xceed.Document.NET;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Application.AdminMenu
{
    public class DanhSachPhanQuyenMenuChild
    {
        public class Query : IRequest<Result<List<Permission_Menu>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<Permission_Menu>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<Permission_Menu>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    try
                    {
                        var queryResult = await connection.QueryAsync<Permission_Menu>("spu_TB_AdminMenu_GetPermissionMenuChild", commandType: System.Data.CommandType.StoredProcedure);

                        
                        return Result<List<Permission_Menu>>.Success(queryResult.ToList());
                    }
                    catch (Exception ex)
                    {
                        return Result<List<Permission_Menu>>.Failure(ex.Message);
                    }
                }
            }
        }
    }
}
