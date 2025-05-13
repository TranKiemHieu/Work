using Application.Core;
using Dapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Persistence;
using ServiceStack;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xceed.Document.NET;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.ChuyenMuc
{
    public class ThemMoiPhanQuyen
    {
        public class Command : IRequest<Result<CategoryPermissionRequest>>
        {
            public CategoryPermissionRequest Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<CategoryPermissionRequest>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<CategoryPermissionRequest>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@UserID", request.Entity.UserID);
                    dynamicParameters.Add("@ChuyenMucID", request.Entity.ChuyenMucID);
                    dynamicParameters.Add("@Loai", request.Entity.Loai);
                    dynamicParameters.Add("@@ApDungChoCapCon", request.Entity.ApDungChoCapCon);

                    string spName = "spu_Permission_Category_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<CategoryPermissionRequest>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                        return Result<CategoryPermissionRequest>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<CategoryPermissionRequest>.Failure(ex.Message);
                }
            }
        }
    }
}
