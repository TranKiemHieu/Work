using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Data.SqlClient;
using System.IO.MemoryMappedFiles;

namespace Application.View
{
    public class DanhSach
    {
        public class Query : IRequest<Result<List<TB_View_ThongSo>>>
        {
            public TB_View_Filter_Request Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_View_ThongSo>>>
        {
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _configuration = configuration;
                _mediator = mediator;
            }
            public async Task<Result<List<TB_View_ThongSo>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@ParentID", request.Request.ParentID.ToString().IsNullOrEmpty() ? null : request.Request.ParentID);
                    dynamicParameters.Add("@TuKhoa", request.Request.TuKhoa.IsNullOrEmpty()? null : request.Request.TuKhoa);
                    dynamicParameters.Add("@SoLuong", request.Request.SoLuong.ToString().IsNullOrEmpty()? 0 : request.Request.SoLuong);

                    string spName = "spu_TB_View_Gets";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_View_ThongSo>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                        
                        if(result != null && result.Count() > 0)
                        {
                            foreach(var v in result)
                            {
                                v.ListCauHinh = new List<TB_ThongSoCauHinh_TrinhDien>();
                                var data = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = v.ID });
                                if(data != null && data.Value.Count() > 0)
                                {
                                    v.ListCauHinh.AddRange(data.Value);
                                }
                            }
                        }
                        return Result<List<TB_View_ThongSo>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_View_ThongSo>>.Failure(ex.Message);
                }
            }
        }
    }
}
