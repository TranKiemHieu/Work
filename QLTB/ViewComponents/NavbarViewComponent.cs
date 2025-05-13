
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using ServiceStack;
using System.Collections.Specialized;

namespace QLTB.ViewComponents
{
    public class NavbarViewComponent : ViewComponent
    {
       
        private readonly IMediator _mediator;
        private readonly DataContext _context;
        public NavbarViewComponent(IMediator mediator, DataContext context)
        {
            _mediator = mediator;
            _context = context;
        }

      
        public IViewComponentResult Invoke()
        {
            int cap = 3;
            var treeChuyenMuc =  _mediator.Send(new Application.ChuyenMuc.DanhSachChuyenMucCapCon.Query { chuyenMucID = Guid.Empty.ToString(), flag = 0 });
            var view = _context.TB_View.ToList();
            var result = treeChuyenMuc.Result.Value.Where(e => e.Cap < cap && e.isMenu == true).ToList();

            for(var i = 0; i < result.Count; i++)
            {
                for(var j = 0; j < view.Count; j++)
                {
                    if(result.ElementAt(i).DiaChiLienKet == view.ElementAt(j).ID.ToString())
                    {
                        result.ElementAt(i).DiaChiLienKet = view.ElementAt(j).DuongDan;
                    }
                }
            }
            return View(result);
        }
    }
}
