using Application.Core;
using Dapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Media
{
    public class ThemMoi
    {
        public class Command : IRequest<Result<TB_Media>>
        {
            public TB_Media Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_Media>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }
            public async Task<Result<TB_Media>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TieuDe", request.Entity.TieuDe);
                    dynamicParameters.Add("@TenFileMedia", request.Entity.TenFileMedia);
                    dynamicParameters.Add("@MoTa", request.Entity.MoTa);
                    dynamicParameters.Add("@DuongDan", request.Entity.DuongDan);
                    dynamicParameters.Add("@LoaiFileMedia", request.Entity.LoaiFileMedia);
                    dynamicParameters.Add("@BaiVietID", request.Entity.BaiVietID);
                    dynamicParameters.Add("@ThuTuHienThi", request.Entity.ThuTuHienThi);

                    string spName = "spu_TB_Media_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_Media>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_Media>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_Media>.Failure(ex.Message);
                }
            }
        }
    }
}
