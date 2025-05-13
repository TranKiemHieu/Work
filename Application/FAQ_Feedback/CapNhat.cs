using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.FAQ_Feedback
{
    public class CapNhat
    {
        public class Command : IRequest<Result<FAQ_YKien>>
        {
            public FAQ_YKien Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<FAQ_YKien>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _dataContext = dataContext;
                _configuration = configuration;
            }

            public async Task<Result<FAQ_YKien>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.Entity.ID);
                    dynamicParameters.Add("@NoiDungTraLoi", request.Entity.NoiDungTraLoi);
                    dynamicParameters.Add("@TrangThai", request.Entity.TrangThai);
                    dynamicParameters.Add("@NguoiChinhSuaId", request.Entity.NguoiChinhSuaId);
                    dynamicParameters.Add("@DanhDau", request.Entity.DanhDau);
                    dynamicParameters.Add("@NgayTraLoi", request.Entity.NgayTraLoi);
                    dynamicParameters.Add("@CoQuanTraLoi", request.Entity.CoQuanTraLoi);
                    dynamicParameters.Add("@Loai", request.Entity.Loai);

                    string spName = "spu_FAQ_YKien_Edit";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<FAQ_YKien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        return Result<FAQ_YKien>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<FAQ_YKien>.Failure(ex.Message);
                }
            }
        }
    }
}
