using Application.Core;
using Aspose.Cells;
using Dapper;
using Domain;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Persistence;
using ServiceStack;
using System.Data.SqlClient;
using System.Net.WebSockets;

namespace Application.ThongSoCauHinh
{
    public class GetListByView
    {
        public class Query : IRequest<Result<List<TB_ThongSoCauHinh_TrinhDien>>>
        {
            public short? MaView { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<TB_ThongSoCauHinh_TrinhDien>>>
        {
            private readonly IConfiguration _configuration;
            private readonly IMediator _mediator;
            private readonly DataContext _context;
            public Handler(DataContext dataContext, IConfiguration configuration, IMediator mediator)
            {
                _configuration = configuration;
                _mediator = mediator;
                _context = dataContext;

            }
            public async Task<Result<List<TB_ThongSoCauHinh_TrinhDien>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    DynamicParameters dynamicParameters = new DynamicParameters();
                    dynamicParameters.Add("@MaView", request.MaView);

                    string spName = "spu_TB_ThongSoCauHinh_GetByView";

                    using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        connection.Open();

                        var result = await connection.QueryAsync<TB_ThongSoCauHinh_TrinhDien>(new CommandDefinition(spName, parameters: dynamicParameters, commandType: System.Data.CommandType.StoredProcedure));

                        if(result != null && result.Count() > 0) 
                        {
                            var isFAQ = result.FirstOrDefault(x => x.TenTieuChi == "isFAQ");

                            foreach (var r in result)
                            {
                                if(r.TenTieuChi == "category")
                                {
                                    var dtSoLuong = result.FirstOrDefault(x => x.TenTieuChi == "numOf");
                                    var typeView  = result.FirstOrDefault(x => x.TenTieuChi == "typeView");
                                    int soLuong = dtSoLuong != null ? int.Parse(dtSoLuong.GiaTriThietLap) : 0;
                                    var categoryID = !r.GiaTriThietLap.IsNullOrEmpty() ? r.GiaTriThietLap : null;

                                    if (r.DuLieuLienKet == 1) //chuyên mục
                                    {
                                        var duLieuCM = await _mediator.Send(new Select.Query { LinkedID = 1, ListID = categoryID });
                                        r.ListChuyenMuc = duLieuCM != null && duLieuCM.Value.ListChuyenMuc.Count > 0 ? duLieuCM.Value.ListChuyenMuc : null;
                                        r.ListBaiViet = await GetListBaiViet(categoryID, soLuong);
                                     //   r.ListMedia = await GetListMediaByChuyenMuc(categoryID, soLuong);
                                        
                                        if(typeView != null && typeView.GiaTriThietLap == "15") {
                                            r.Media = await GetListMedia(categoryID, soLuong);
                                        }
                                        
                                    }
                                    else if (r.DuLieuLienKet == 2) //bài viết
                                    {
                                        var duLieuBV = await _mediator.Send(new Select.Query { LinkedID = 2, ListID = categoryID });
                                        r.ListBaiViet = duLieuBV != null && duLieuBV.Value.ListBaiViet.Count > 0 ? duLieuBV.Value.ListBaiViet : null;
                                        r.ListMedia = await GetListMedia(categoryID, soLuong);
                                    }
                                    else if (r.DuLieuLienKet == 3) //media
                                    {
                                        var duLieuMedia = await _mediator.Send(new Select.Query { LinkedID = 3, ListID = categoryID });
                                        r.ListMedia = duLieuMedia != null && duLieuMedia.Value.ListMedia.Count > 0 ? duLieuMedia.Value.ListMedia : null;
                                    }
                                }

                                if (r.TenTieuChi == "typeView") //view type
                                {
                                    if(r.DuLieuLienKet == 4)
                                    {
                                        var viewTypeID = !r.GiaTriThietLap.IsNullOrEmpty() ? r.GiaTriThietLap : null;
                                        var duLieuViewType = await _mediator.Send(new Select.Query { LinkedID = 4, ListID = viewTypeID });
                                        r.ListViewType = duLieuViewType != null && duLieuViewType.Value.ListViewType.Count > 0 ? duLieuViewType.Value.ListViewType : null;
                                    }
                                    
                                    if (isFAQ != null && !isFAQ.GiaTriThietLap.IsNullOrEmpty())
                                    {
                                        if (int.Parse(r.GiaTriThietLap) == (int)typeView.ListHoiDapGopY)
                                        {
                                            FAQ_YKien_Filter_Request rq = new FAQ_YKien_Filter_Request { SoLuong = 0, Loai = byte.Parse(isFAQ.GiaTriThietLap) };
                                            var listFeedback = await _mediator.Send(new Application.FAQ_Feedback.DanhSach.Query { Request = rq });
                                            if (listFeedback != null && listFeedback.Value.Count > 0)
                                            {
                                                r.ListFAQ_YKien = listFeedback.Value;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        return Result<List<TB_ThongSoCauHinh_TrinhDien>>.Success(result.ToList());
                    }
                }
                catch (Exception ex)
                {
                    return Result<List<TB_ThongSoCauHinh_TrinhDien>>.Failure(ex.Message);
                }
            }

            public async Task<List<TB_BaiVietTrinhDien>> GetListBaiViet(string ChuyenMucID = null, int SoLuong = 0)
            {
                var filter = new BaiVietFilterRequest
                {
                    ChuyenMucID = ChuyenMucID,
                    SoLuong = SoLuong
                };
                var duLieuBV = await _mediator.Send(new Application.BaiViet.DanhSachTheoChuyenMuc.Query { Request = filter });
                if(duLieuBV != null && duLieuBV.Value.Count > 0)
                {
                    return duLieuBV.Value;
                }
                return null;
            }

            public async Task<List<TB_Media>> GetListMedia(string BaiVietID = null, int SoLuong = 0)
            {
                var duLieuMedia = await _mediator.Send(new Application.Media.DanhSachTheoBaiViet.Query { BaiVietID = BaiVietID, SoLuong = SoLuong });
                if (duLieuMedia != null && duLieuMedia.Value.Count > 0)
                {
                    return duLieuMedia.Value;
                }
                return null;
            }

            public async Task<object> GetListMediaByChuyenMuc(string ChuyenMucID = null, int SoLuong = 0, int Loai = 0)
            {
                var duLieuMedia = await _mediator.Send(new Application.Media.DanhSachTheoChuyenMuc.Query { ChuyenMucID = ChuyenMucID, SoLuong = SoLuong, Loai = 4 });
                if (duLieuMedia != null)
                {
                    return duLieuMedia.Value;
                }
                return null;
            }

        }
    }
}
