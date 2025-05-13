using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Data.SqlClient;

namespace Application.FAQ_Feedback
{
    public class Paging
    {
        public class Query : IRequest<Result<List<FAQ_YKien_TrinhDien>>>
        {
            public FAQ_YKien_Filter_Request Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<FAQ_YKien_TrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _configuration = configuration;
                _mediator = mediator;
            }
            public async Task<Result<List<FAQ_YKien_TrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@Loai", request.Request.Loai);
                    dynamicParameters.Add("@TrangThai", request.Request.TrangThai.ToString().IsNullOrEmpty() ? -1 : request.Request.TrangThai);
                    dynamicParameters.Add("@BatDau", request.Request.BatDau.IsNullOrEmpty() ? null : request.Request.BatDau);
                    dynamicParameters.Add("@KetThuc", request.Request.KetThuc.IsNullOrEmpty() ? null : request.Request.KetThuc);
                    dynamicParameters.Add("@PageIndex", request.Request.PageIndex.ToString().IsNullOrEmpty() ? 1 : request.Request.PageIndex);
                    dynamicParameters.Add("@PageSize", request.Request.PageSize.ToString().IsNullOrEmpty() ? 10 : request.Request.PageSize);

                    string spName = "spu_FAQ_YKien_Gets_Paging";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<FAQ_YKien_TrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                        return Result<List<FAQ_YKien_TrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<FAQ_YKien_TrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
