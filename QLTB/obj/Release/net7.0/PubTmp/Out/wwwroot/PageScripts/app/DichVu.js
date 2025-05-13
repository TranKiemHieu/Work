const baseUrl = getRootLink();
$(document).ready(function () {
    const totalRow = $('#totalRow').val();
    const pageSize = $('#pageSize').val();
    loadDanhSachBaiViet();
    //loadDanhSachFeedback();
    loadFormFeedback();
    
    
    function loadDanhSachBaiViet(pageIndex = 1) {
        $('#wrapper-page-home').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_main_contents',
                "maViewCapCha": 10,
                "sessionName": ''
            },
            success: function (response) {
                $('#wrapper-page-home').html(response);

                if (totalRow <= pageSize) {
                    $('#wrapper-page-home').addClass('pagination-disabled');
                    $('#pagingNews').addClass('d-none');
                } else {
                    $('#wrapper-page-home').removeClass('pagination-disabled');
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

   
    //function loadDanhSachFeedback() {
    //    $('#listFeedBackContainer').empty();
    //    $.ajax({
    //        type: "POST",
    //        url: "/BaiViet/_View",
    //        data: {
    //            "pageIndex": 1,
    //            "viewName": '_section_list_feedback',
    //            "maViewCapCha": 101,
    //            "sessionName": ''
    //        },
    //        success: function (response) {
    //            $('#listFeedBackContainer').html(response);
    //        }
    //    });
    //    return false;
    //}

    function loadFormFeedback() {
        $('#feedBackContainer').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": 1,
                "viewName": '_section_feedback',
                "maViewCapCha": 101,
                "sessionName": ''
            },
            success: function (response) {
                $('#feedBackContainer').html(response);
                initSelect2();
            }
        });
        return false;
    }

    $(document).on('submit', '#formFeedback', function (e) {
        e.preventDefault();
        dataFeedbackAdd();
    })

    //$("#formFeedback").submit(function (e) {
    //   
    //    
    //});

    function dataFeedbackAdd() {
        const nguoiGui = $('#feedbackName').val();
        const dienThoai = $('#feedbackPhone').val();
        const email = $('#feedbackEmail').val();
        const noiDungYKien = $('#feedbackContent').val();

        if (checkEmptyBlank(nguoiGui)) {
            checkValidate('checkFbName', 'Vui lòng nhập họ và tên!');
        }

        if (checkEmptyBlank(email)) {
            checkValidate('checkFbEmail', 'Vui lòng nhập email!');
        }

        if (checkEmptyBlank(noiDungYKien)) {
            checkValidate('checkFbContent', 'Vui lòng nhập nội dung!');
        }

        if (!checkEmptyBlank(nguoiGui) && !checkEmptyBlank(email) && !checkEmptyBlank(noiDungYKien)) {
            const dt = {
                "ChuyenMucID": null,
                "BaiVietID": null,
                "NguoiGui": nguoiGui,
                "DienThoai": dienThoai,
                "Email": email,
                "NoiDung": noiDungYKien,
                "Loai": 0
            };

            $.ajax({
                type: 'POST',
                async: false,
                url: `${baseUrl}/api/FeedbackApi/Add`,
                data: JSON.stringify(dt),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.value != null && data.value != 0) {
                        showNotification(1, "Gửi ý kiến thành công")

                        $('#feedbackName').val('');
                        $('#feedbackPhone').val('');
                        $('#feedbackEmail').val('');
                        $('#feedbackContent').val('');

                        $('#checkFbName').removeClass('show');
                        $('#checkFbEmail').removeClass('show');
                        $('#checkFbContent').removeClass('show');
                    } else {
                        showNotification(0, 'Lỗi! Gửi ý kiến thất bại')
                    }
                },
                error: function (err) {
                    showNotification(0, 'Lỗi!')
                }
            });
        }
    }
})
