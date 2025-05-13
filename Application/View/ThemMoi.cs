using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.View
{
    public class ThemMoi
    {
        public class Command : IRequest<Result<TB_View>>
        {
            public TB_View Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_View>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }
            public async Task<Result<TB_View>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TenView", request.Entity.TenView);
                    dynamicParameters.Add("@MoTa", request.Entity.MoTa);
                    dynamicParameters.Add("@DuongDan", request.Entity.DuongDan);
                    dynamicParameters.Add("@Area", request.Entity.Area);
                    dynamicParameters.Add("@Controller", request.Entity.Controller);
                    dynamicParameters.Add("@Action", request.Entity.Action);
                    dynamicParameters.Add("@ViewCapChaID", request.Entity.ViewCapChaID);
                    dynamicParameters.Add("@SuDung", request.Entity.SuDung);
                    dynamicParameters.Add("@NguoiTao", request.Entity.NguoiTao);

                    string spName = "spu_TB_View_Add";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_View>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<TB_View>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_View>.Failure(ex.Message);
                }
            }
        }
    }
}
