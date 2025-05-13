using Application.Core;
using Dapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.BaiViet
{
    public class DanhSach
    {
        public class Query : IRequest<Result<List<TB_BaiVietTrinhDien>>>
        {
            public BaiVietFilterRequest Request { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_BaiVietTrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _configuration = configuration;
                _mediator = mediator;
            }
            public async Task<Result<List<TB_BaiVietTrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@TuKhoa", request.Request.TuKhoa);
                    dynamicParameters.Add("@ChuyenMuc", request.Request.ChuyenMuc);
                    dynamicParameters.Add("@BatDau", request.Request.BatDau);
                    dynamicParameters.Add("@KetThuc", request.Request.KetThuc);
                    dynamicParameters.Add("@UserID", request.Request.UserID);

                    string spName = "spu_TB_BaiViet_Gets";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                        if (result != null && result.Count() > 0)
                        {
                            foreach (var item in result)
                            {
                                item.TotalRows = result.Count();
                                var listMedia = await _mediator.Send(new Application.Media.DanhSachTheoBaiViet.Query { BaiVietID = item.ID.ToString() });
                                if (listMedia != null && listMedia.Value.Count() > 0)
                                {
                                    item.ListMedia.AddRange(listMedia.Value);
                                }
                            }
                        }
                        return Result<List<TB_BaiVietTrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_BaiVietTrinhDien>>.Failure(ex.Message);
                }
            }
        }
    }
}
