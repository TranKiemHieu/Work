using Application.Core;
using Dapper;
using Domain;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Reflection;

namespace Application.ThongSoCauHinh
{
    public class Select
    {
        public class Query : IRequest<Result<TB_ThongSoCauHinh_DLLK>>
        {
            public byte? LinkedID { get; set; }
            public string ListID { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TB_ThongSoCauHinh_DLLK>>
        {
            private readonly IConfiguration _configuration;
            private readonly DataContext _context;
            public Handler(DataContext dataContext, IConfiguration configuration, DataContext context)
            {
                _configuration = configuration;
                _context = context;
            }
            public async Task<Result<TB_ThongSoCauHinh_DLLK>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@DuLieuLienKet", request.LinkedID);
                    dynamicParameters.Add("@ListID", request.ListID.IsNullOrEmpty()? null : request.ListID);

                    string spName = "spu_TB_ThongSoCauHinh_GetsSelect";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        TB_ThongSoCauHinh_DLLK result = new TB_ThongSoCauHinh_DLLK();
                        if(request.LinkedID == 1) //chuyên mục
                        {
                            var data = await connection.QueryAsync<ChuyenMucTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                            if (data != null && data.Count() > 0)
                            {
                                result.ListChuyenMuc.AddRange(data);
                            }
                        }
                        else if (request.LinkedID == 2) //bài viết
                        {
                            var data = await connection.QueryAsync<TB_BaiVietTrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                            if (data != null && data.Count() > 0)
                            {
                                result.ListBaiViet.AddRange(data);
                            }
                        }
                        else if (request.LinkedID == 3) //media
                        {
                            var data = await connection.QueryAsync<TB_Media>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));
                            if (data != null && data.Count() > 0)
                            {
                                result.ListMedia.AddRange(data);
                            }
                        }
                        else if (request.LinkedID == 4) //view type
                        {
                            List<TB_View_Type> listType = new List<TB_View_Type>();
                            var listViewType = typeof(typeView).GetFields(BindingFlags.Public | BindingFlags.Static);
                            if (listViewType != null && listViewType.Count() > 0)
                            {
                                foreach (var field in listViewType)
                                {
                                    var attribute = (DescriptionAttribute)Attribute.GetCustomAttribute(field, typeof(DescriptionAttribute));
                                    TB_View_Type type = new TB_View_Type
                                    {
                                        ID = (int)field.GetValue(null),
                                        Description = attribute != null ? attribute.Description : ""
                                    };

                                    if (listType.Count == 0 || !listType.Exists(x => x.ID == type.ID))
                                    {
                                        listType.Add(type);
                                    }
                                }
                            }
                            if (listType != null && listType.Count > 0)
                            {
                                result.ListViewType.AddRange(listType);
                            }
                        }
                        return Result<TB_ThongSoCauHinh_DLLK>.Success(result);
                    }
                }
                catch (Exception ex)
                {
                    return Result<TB_ThongSoCauHinh_DLLK>.Failure(ex.Message);
                }
            }
        }
    }
}
