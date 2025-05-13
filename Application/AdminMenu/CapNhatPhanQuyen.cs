using Application.Core;
using Application.OD_AppUser;
using Domain;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xceed.Document.NET;

namespace Application.AdminMenu
{
    public class CapNhatPhanQuyen
    {
        public class Command : IRequest<Result<int>>
        {
            public List<MenuItemCompact> _entity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<int>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<int>> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                   
                    if (request._entity != null && request._entity.Count > 0)
                    {
                        foreach (var item in request._entity)
                        {
                           
                            var isPermission = await _context.Permission_Menu.FindAsync((byte)item.PermissionId);
                            if (isPermission == null)
                            {
                                throw new Exception("Không tìm thấy dữ liệu");
                            }

                            isPermission.PermittedEdit = (bool)item.PermitedEdit;
                            isPermission.PermittedApprove = (bool)item.PermitedApprove;
                            isPermission.PermittedDelete = (bool)item.PermitedDelete;
                            isPermission.PermittedCreate = (bool)item.PermitedCreate;

                            await _context.SaveChangesAsync();
                        }
                    }
                    return Result<int>.Success(1);
                }
                catch (Exception ex)
                {
                    return Result<int>.Failure(ex.Message);
                }
            }
        }
    }
}
