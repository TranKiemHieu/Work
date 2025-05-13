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

namespace Application.Media
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
            public Handler(DataContext dataContext, IConfiguration configuration)
            {
                _configuration = configuration;
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

                    string spName = "spu_TB_BaiViet_Gets";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                        //if(result != null)
                        //{
                        //    DynamicParameters parameters = new DynamicParameters();
                        //    parameters.Add("@Flag", 0); 
                        //    var chuyenMuc = await connection.QueryAsync<ChuyenMucSelect>(new CommandDefinition("spu_TB_ChuyenMuc_GetsSelect", parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        //    for(var i  = 0; i < result.Count(); i++)
                        //    {
                        //        if(result.ElementAt(i) != null)
                        //        {
                        //            var chuyenMucKhacID = result.ElementAt(i).ChuyenMucKhacID.Split(",");
                        //            for (var k = 0; k < chuyenMucKhacID.Count(); k++)
                        //            {
                        //                for (var j = 0; j < chuyenMuc.Count(); j++)
                        //                {
                        //                      Xử lý id => tên chuyên mục 
                        //                }
                        //            }
                        //        }
                        //    }
                        //}
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
