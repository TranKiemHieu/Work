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

namespace Application.Account
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<ChiTietTaiKhoan>>
        {
            public Int64 UserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ChiTietTaiKhoan>>
        {
            private readonly IConfiguration _configuration;
            private readonly DataContext _context;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
                _context = dataContext;
            }
            public async Task<Result<ChiTietTaiKhoan>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@UserId", request.UserId);
                        var queryResult = await connection.QueryFirstOrDefaultAsync<ChiTietTaiKhoan>("spu_TB_Users_GetById", parameters, commandType: System.Data.CommandType.StoredProcedure);

                        if (queryResult == null)
                        {
                            throw new Exception("Không tìm thấy tài khoản");
                        }

                        return Result<ChiTietTaiKhoan>.Success(queryResult);
                    }
                    catch (Exception ex)
                    {
                        return Result<ChiTietTaiKhoan>.Failure(ex.Message);
                    }
                }
            }
        }
    }
}
