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
    public class DanhSachMenu
    {
        public class Query : IRequest<Result<List<MenuItem>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<MenuItem>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<List<MenuItem>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using(var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    try
                    {
                        var queryResult = await connection.QueryAsync<MenuItem>("spu_TB_AdminMenu_Gets", commandType: System.Data.CommandType.StoredProcedure);

                        if(queryResult.Any())
                        {
                            foreach (var item in queryResult)
                            {
                                IEnumerable<MenuItem> hasChild = queryResult.Where(e => e.ParentId == item.Id);
                                item.HasChildren = hasChild.Any();
                            }
                        }
                        
                        return Result<List<MenuItem>>.Success(queryResult.ToList());
                    }
                    catch (Exception ex)
                    {
                        return Result<List<MenuItem>>.Failure(ex.Message);
                    }
                }
            }
        }
    }
}
