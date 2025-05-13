const baseUrl = getRootLink();
$(document).ready(function () {
    if (totalRow == undefined) {
        totalRow = 0
    }
    loadDanhSachBaiViet();
   // DanhSachDocNhieuNhat();
    
    function loadDanhSachBaiViet(pageIndex = 1) {
        $('#dsTinHoatDong').empty();

        $.ajax({
            type: "POST",
            url: "/BaiViet/_DanhSachBaiViet",
            data: {
                "chuyenMuc": urlChuyenMuc,
                "pageIndex": pageIndex
            },
            success: function (response) {
                $('#dsTinHoatDong').html(response);

                if (totalRow <= pageSize) {
                    $('#dsTinHoatDong').addClass('pagination-disabled');
                    $('#pagingNews').addClass('d-none');
                } else {
                    $('#dsTinHoatDong').removeClass('pagination-disabled');
                    $('#pagingNews').removeClass('d-none');
                }

                var curPage = parseInt($('.pagination li.active span').text());
                var total = Math.ceil(totalRow / pageSize);
                var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                    $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                }
                if ((lastPage == -1 || curPage >= (total - 2)) && $('.pagination .PagedList-ellipses').length == 1) {
                    $('.pagination').children().eq(firstPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                }

                if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                    $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                    $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                    if (curPage == (total - 2)) {
                        $('.pagination').children().eq(lastEllipses + 1).remove();
                    } else if ((curPage - 2) <= 1) {
                        $('.pagination li.PagedList-ellipses:lt(1)').remove();
                    }
                }
                $('.pagination li .page-link').each(function () {
                    $(this).prop('href', `javascript:void(0)`);
                })
            }
        });
        return false;
    }

    $(document).on('click', '.pagination .page-link', function () {
        if (!$(this).attr('rel')) {
            loadDanhSachBaiViet(parseInt($(this).text()));
        }
    })

    $(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        var id = $('.pagination li.active span').text();
        $('#page_id').val(parseInt(id) - 1);
        loadDanhSachBaiViet(parseInt(id) - 1);
    })

    $(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        var id = $('.pagination li.active span').text();
        loadDanhSachBaiViet(parseInt(id) + 1);
    })

   
    
})
