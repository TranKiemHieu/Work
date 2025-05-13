using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.AdminMenu
{
    public class DanhSachMenuParent
    {
        public class Query : IRequest<Result<List<Domain.TB_AdminMenu>>>
        {

        }
        public class Handler : IRequestHandler<Query, Result<List<Domain.TB_AdminMenu>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Domain.TB_AdminMenu>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var lstResult = await _context.TB_AdminMenu.Where(o => !o.ParentId.HasValue).ToListAsync();

                    return Result<List<Domain.TB_AdminMenu>>.Success(lstResult);
                }
                catch(Exception ex)
                {
                    return Result<List<Domain.TB_AdminMenu>>.Failure(ex.Message);
                }
            }
        }
    }
}
