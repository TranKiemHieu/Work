using Application.Core;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.AdminMenu
{
    public class ChiTiet
    {
        public class Query : IRequest<Result<Domain.TB_AdminMenu>>
        {
            public int Id { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<Domain.TB_AdminMenu>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Domain.TB_AdminMenu>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var entity = await _context.TB_AdminMenu.FindAsync(request.Id);

                    if (entity == null)
                    {
                        throw new Exception("Không tìm thấy dữ liệu");
                    }

                    return Result<Domain.TB_AdminMenu>.Success(entity);
                }
                catch (Exception ex)
                {
                    return Result<Domain.TB_AdminMenu>.Failure(ex.Message);
                }
            }
        }
    }
}
