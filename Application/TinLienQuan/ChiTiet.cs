using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.TinLienQuan
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<TB_BaiViet>>
        {
            public string ID { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<TB_BaiViet>>
        {
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }
            public async Task<Result<TB_BaiViet>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.TB_BaiViet.FindAsync(request.ID);

                if (activity == null)
                {
                    return Result<TB_BaiViet>.Failure("Not found");
                }

                return Result<TB_BaiViet>.Success(activity);
            }
        }
    }
}
