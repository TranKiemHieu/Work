using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;
using static Dapper.SqlMapper;

namespace Application.View
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<TB_View_ThongSo>>
        {
            public short ID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TB_View_ThongSo>>
        {
            private readonly DataContext _dataContext;
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _dataContext = dataContext;
                _configuration = configuration;
                _mediator = mediator;
            }
            public async Task<Result<TB_View_ThongSo>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ID", request.ID);

                    string spName = "spu_TB_View_GetById";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryFirstOrDefaultAsync<TB_View_ThongSo>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        if (result != null)
                        {
                            result.ListCauHinh = new List<TB_ThongSoCauHinh_TrinhDien>();

                            var duLieu = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = result.ID });
                            
                            if (duLieu != null && duLieu.Value.Count > 0)
                            {
                                result.ListCauHinh = duLieu.Value.ToList();
                            }
                        }
                        return Result<TB_View_ThongSo>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_View_ThongSo>.Failure(ex.Message);
                }
            }
        }
    }
}
