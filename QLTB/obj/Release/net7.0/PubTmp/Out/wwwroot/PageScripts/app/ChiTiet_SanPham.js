﻿
$(document).ready(function () {
    let totalRow = undefined, pageSize = undefined
    const runConvertDateStringToHTML = () => {
        // get .news-date elements
        const newsDateElements = document.querySelectorAll('.news-date');
        
        // return text by convertDateStringToHTML
        newsDateElements.forEach((element) => {
            const dateString = element.textContent;
            element.innerHTML = convertDateStringToHTML(dateString);
        });
    }

    // hàm chạy sau khi dữ liệu đã được load
    const afterDataLoaded = () => {
        setTimeout(() => {
            runConvertDateStringToHTML();
        }, 300);
    }

    // gọi các hàm load dữ liệu bằng Promise.all
    Promise.all([loadChiTietBaiViet(),loadBaiVietKhac()])
        .then( afterDataLoaded )
        .catch(error => console.error('Error loading data:', error));

    function loadChiTietBaiViet() {
        $('#section-main-detail-content').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "id": baiVietID == undefined ? null : baiVietID,
                "maViewCapCha": 93,
                "viewName": "_section_main_detail_content"
            },
            success: function (response) {
                $('#section-main-detail-content').html(response)
            }
        });

    }
    function loadBaiVietKhac(pageIndex = 1) {
        $('#section-bottom').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_View",
            data: {
                "pageIndex": pageIndex,
                "viewName": '_section_bottom',
                "maViewCapCha": 93,
                "sessionName": ''
            },
            success: function (response) {
                $('#section-bottom').html(response);

                totalRow = $('#totalRow').val();
                pageSize = $('#pageSize').val();
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
                    loadBaiVietKhac(parseInt($(this).text()));
                }
            })

            $(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
                var id = $('.pagination li.active span').text();
                $('#page_id').val(parseInt(id) - 1);
                loadBaiVietKhac(parseInt(id) - 1);
            })

            $(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
                var id = $('.pagination li.active span').text();
                loadBaiVietKhac(parseInt(id) + 1);
            })
        }
    }

    const convertDateStringToHTML = (dateString) => {
        // Split the date string into day, month, and year parts
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parts[1];
        const year = parts[2];

        // Create the HTML structure
        const html = `
                        <div class="news-date-rerender">
                            <div class="news-date-rerender-day">${day}</div>
                            <div  class="news-date-rerender-monthYear"><span>${month}</span>.<span>${year}</span></div>
                        </div>
                    `;

        return html;
    }
})
$(document).ready(function () {
    // get .news-date elements
    const newsDateElements = document.querySelectorAll('.news-date');
    // return text by convertDateStringToHTML
    newsDateElements.forEach((element) => {
        const dateString = element.textContent;
        element.innerHTML = convertDateStringToHTML(dateString);
    });
});