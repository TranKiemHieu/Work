using Application.Core;
using Azure.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Persistence;
using System.Data.SqlClient;

namespace Application.View
{
    public class Dupplicate
    {
        public class Command : IRequest<Result<TB_View>>
        {
            public TB_View Entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TB_View>>
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

                        if (result != null)
                        {
                            var resultTS = await AddThongSoCauHinh(result, request.Entity.ID);
                            var listChild = _dataContext.TB_View.Where(x => x.ViewCapChaID == request.Entity.ID);
                            if(listChild != null && listChild.Count() > 0)
                            {
                                TB_View_Filter_Request request1 = new TB_View_Filter_Request { ParentID = request.Entity.ID };
                                var listView = await _mediator.Send(new DanhSach.Query { Request = request1 });
                                if (listView != null && listView.Value.Count > 0)
                                {
                                    foreach (var v in listView.Value)
                                    {
                                        v.NguoiTao = result.NguoiTao;
                                        v.ViewCapChaID = result.ID;
                                        var result1 = await _mediator.Send(new ThemMoi.Command { Entity = v });
                                        var resultTS1 = await AddThongSoCauHinh(result1.Value, v.ID);
                                    }
                                }
                            }
                        }
                        return Result<TB_View>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_View>.Failure(ex.Message);
                }
            }

            public async Task<Result<bool>> AddThongSoCauHinh(TB_View view, short MaView)
            {
                if (view != null)
                {
                    var listThongSo = await _mediator.Send(new Application.ThongSoCauHinh.GetListByView.Query { MaView = MaView });
                    if (listThongSo != null && listThongSo.Value.Count > 0)
                    {
                        foreach (var ts in listThongSo.Value)
                        {
                            ts.NguoiTao = view.NguoiTao;
                            ts.MaView = view.ID;
                            var resultTS = await _mediator.Send(new Application.ThongSoCauHinh.ThemMoi.Command { Entity = ts });
                        }
                    }
                    return Result<bool>.Success(true);
                }
                return Result<bool>.Success(false);
            }
        }
    }
}
