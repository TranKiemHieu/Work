using Application.Core;
using Dapper;
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
using static Dapper.SqlMapper;

namespace Application.AdminMenu
{
    public class Xoa
    {
        public class Command : IRequest<Result<int>>
        {
            public int Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<int>>
        {
            private readonly DataContext _context;
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }

            public async Task<Result<int>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters parameters = new DynamicParameters();
                    parameters.Add("@Id", request.Id);

                    string spName = "spu_TB_AdminMenu_Delete";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.ExecuteScalarAsync<int>(new CommandDefinition(spName, parameters: parameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<int>.Success(result);

                    }
                }
                catch (Exception ex)
                {
                    return Result<int>.Failure(ex.Message);
                }
            }
        }
    }
}
