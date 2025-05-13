const baseUrl = getRootLink();

$(document).ready(function () {
    loadBanner()
    loadDanhSachTinTuc()
    loadDanhSachDichVu()
    loadDanhSachDaoTao()
    loadDanhSachSanPham()


   // const test = getDataWithApi("GET", "/api/ThongSoCHApi/GetListByView?id=63")

    function loadDanhSachDaoTao(pageIndex = 1) {
        $('#wrapper-page-home3').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_row_3',
                "maViewCapCha": 1,
                "sessionName": 'home_daotao'
            },
            success: function (response) {
                $('#wrapper-page-home3').html(response);
                //const totalRow = $('#totalRow').val();
                //const pageSize = $('#pageSize').val();
                //if (totalRow != undefined && pageSize != undefined) {
                   
                    //var curPage = parseInt($('.pagination li.active span').text());
                    //var total = Math.ceil(totalRow / pageSize);
                    //var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                    //var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                    //var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                    //var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                    //if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                    //    $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                    //}
                    //if ((lastPage == -1 || curPage >= (total - 2)) && $('.pagination .PagedList-ellipses').length == 1) {
                    //    $('.pagination').children().eq(firstPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                    //}

                    //if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                    //    $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                    //    $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                    //    if (curPage == (total - 2)) {
                    //        $('.pagination').children().eq(lastEllipses + 1).remove();
                    //    } else if ((curPage - 2) <= 1) {
                    //        $('.pagination li.PagedList-ellipses:lt(1)').remove();
                    //    }
                    //}
                    //$('.pagination li .page-link').each(function () {
                    //    $(this).prop('href', `javascript:void(0)`);
                    //})
                //}
            }
        });
       
        //$(document).on('click', '.pagination .page-link', function () {
        //    if (!$(this).attr('rel')) {
        //        loadDanhSachDaoTao(parseInt($(this).text()));
        //    }
        //})

        //$(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    $('#page_id').val(parseInt(id) - 1);
        //    loadDanhSachDaoTao(parseInt(id) - 1);
        //})

        //$(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    loadDanhSachDaoTao(parseInt(id) + 1);
        //})
    }

    
    function loadDanhSachTinTuc(pageIndex = 1) {
        const totalRow = $('#totalRow').val();
        const pageSize = $('#pageSize').val();
        $('#wrapper-page-home').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_row_1',
                "maViewCapCha": 1,
                "sessionName": 'home_tintuc'
            },
            success: function (response) {
                $('#wrapper-page-home').html(response);
                //if (totalRow != undefined && pageSize != undefined) {

                //    var curPage = parseInt($('.pagination li.active span').text());
                //    var total = Math.ceil(totalRow / pageSize);
                //    var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                //    var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                //    var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                //    var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                //    if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                //        $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                //    }
                //    if ((lastPage == -1 || curPage >= (total - 2)) && $('.pagination .PagedList-ellipses').length == 1) {
                //        $('.pagination').children().eq(firstPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //    }

                //    if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                //        $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //        $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                //        if (curPage == (total - 2)) {
                //            $('.pagination').children().eq(lastEllipses + 1).remove();
                //        } else if ((curPage - 2) <= 1) {
                //            $('.pagination li.PagedList-ellipses:lt(1)').remove();
                //        }
                //    }
                //    $('.pagination li .page-link').each(function () {
                //        $(this).prop('href', `javascript:void(0)`);
                //    })
                //}
            }
        });
        //if (totalRow != undefined && pageSize != undefined) {
        //    $(document).on('click', '.pagination .page-link', function () {
        //        if (!$(this).attr('rel')) {
        //            loadDanhSachDaoTao(parseInt($(this).text()));
        //        }
        //    })

        //    $(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        //        var id = $('.pagination li.active span').text();
        //        $('#page_id').val(parseInt(id) - 1);
        //        loadDanhSachDaoTao(parseInt(id) - 1);
        //    })

        //    $(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        //        var id = $('.pagination li.active span').text();
        //        loadDanhSachDaoTao(parseInt(id) + 1);
        //    })
        //}
    }

    function loadDanhSachDichVu(pageIndex = 1) {
        $('#wrapper-page-home2').empty();
        const totalRow = $('#totalRow').val();
        const pageSize = $('#pageSize').val();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_row_2',
                "maViewCapCha": 1,
                "sessionName": 'home_dichvu'
            },
            success: function (response) {
                $('#wrapper-page-home2').html(response);
               
                if (totalRow != undefined && pageSize != undefined) {

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
           }
        });
        if (totalRow != undefined && pageSize != undefined) {
            $(document).on('click', '.pagination .page-link', function () {
                if (!$(this).attr('rel')) {
                    loadDanhSachDaoTao(parseInt($(this).text()));
                }
            })

            $(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
                var id = $('.pagination li.active span').text();
                $('#page_id').val(parseInt(id) - 1);
                loadDanhSachDaoTao(parseInt(id) - 1);
            })

            $(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
                var id = $('.pagination li.active span').text();
                loadDanhSachDaoTao(parseInt(id) + 1);
            })
        }
        
    }

    function loadDanhSachSanPham(pageIndex = 1) {
        $('#wrapper-page-home4').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_row_4',
                "maViewCapCha": 1,
                "sessionName": 'home_sanpham'
            },
            success: function (response) {
                $('#wrapper-page-home4').html(response);
                const totalRow = $('#totalRow').val();
                const pageSize = $('#pageSize').val();
                //if (totalRow != undefined && pageSize != undefined) {

                //    var curPage = parseInt($('.pagination li.active span').text());
                //    var total = Math.ceil(totalRow / pageSize);
                //    var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                //    var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                //    var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                //    var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                //    if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                //        $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                //    }
                //    if ((lastPage == -1 || curPage >= (total - 2)) && $('.pagination .PagedList-ellipses').length == 1) {
                //        $('.pagination').children().eq(firstPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //    }

                //    if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                //        $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //        $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                //        if (curPage == (total - 2)) {
                //            $('.pagination').children().eq(lastEllipses + 1).remove();
                //        } else if ((curPage - 2) <= 1) {
                //            $('.pagination li.PagedList-ellipses:lt(1)').remove();
                //        }
                //    }
                //    $('.pagination li .page-link').each(function () {
                //        $(this).prop('href', `javascript:void(0)`);
                //    })
                //}
            }
        });
        //$(document).on('click', '.pagination .page-link', function () {
        //    if (!$(this).attr('rel')) {
        //        loadDanhSachDaoTao(parseInt($(this).text()));
        //    }
        //})

        //$(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    $('#page_id').val(parseInt(id) - 1);
        //    loadDanhSachDaoTao(parseInt(id) - 1);
        //})

        //$(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    loadDanhSachDaoTao(parseInt(id) + 1);
        //})
    }
   
    function loadBanner(pageIndex = 1) {
        $('#section-banner').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_banner',
                "maViewCapCha": 1,
                "sessionName": ''
            },
            success: function (response) {
                $('#section-banner').html(response);
                //const totalRow = $('#totalRow').val();
                //const pageSize = $('#pageSize').val();
                //if (totalRow != undefined && pageSize != undefined) {

                //var curPage = parseInt($('.pagination li.active span').text());
                //var total = Math.ceil(totalRow / pageSize);
                //var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                //var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                //var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                //var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                //if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                //    $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                //}
                //if ((lastPage == -1 || curPage >= (total - 2)) && $('.pagination .PagedList-ellipses').length == 1) {
                //    $('.pagination').children().eq(firstPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //}

                //if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                //    $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                //    $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                //    if (curPage == (total - 2)) {
                //        $('.pagination').children().eq(lastEllipses + 1).remove();
                //    } else if ((curPage - 2) <= 1) {
                //        $('.pagination li.PagedList-ellipses:lt(1)').remove();
                //    }
                //}
                //$('.pagination li .page-link').each(function () {
                //    $(this).prop('href', `javascript:void(0)`);
                //})
                //}
            }
        });

        //$(document).on('click', '.pagination .page-link', function () {
        //    if (!$(this).attr('rel')) {
        //        loadDanhSachDaoTao(parseInt($(this).text()));
        //    }
        //})

        //$(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    $('#page_id').val(parseInt(id) - 1);
        //    loadDanhSachDaoTao(parseInt(id) - 1);
        //})

        //$(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        //    var id = $('.pagination li.active span').text();
        //    loadDanhSachDaoTao(parseInt(id) + 1);
        //})
    }
})