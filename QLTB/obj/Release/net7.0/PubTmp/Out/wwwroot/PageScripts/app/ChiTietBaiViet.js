const baseUrl = getRootLink();


$(document).ready(function () {

    dtBaiViet = [];
    let itemOthers = 6;

    if (cate == 'ttsk') {
        itemOthers = 6;
    } else {
        itemOthers = 5;
    }

    let numReadMore = 1;
    let menuWrapper = `<div class="menu-wrapper">
                            <div class="menu-parent">
                                <h4 class="menu-text">Tin tức</h4>
                            </div>
                            <ul class="menu-child">
                                <li class="menu-item">
                                    <a class="menu-link" href="${urlTinHoatDong}">Tin hoạt động</a>
                                </li>
                                <li class="menu-item">
                                    <a class="menu-link" href="${urlVanBan}">Văn bản</a>
                                </li>
                            </ul>
                        </div>`

    if (typeof id !== 'undefined') {
        if (id != null && id != "") {
            LoadChiTietBaiViet(id);
        }
    };

    if (typeof cate !== 'undefined') {
        if (cate != null && cate != "") {
            //DanhSachVanBan();
            DanhSachBaiViet();
            breadcrumbActive(cate);
        }
    };

    function breadcrumbActive (cate) {
        let breadcrumbText = '';
        let breadcrumbParentText = '';
        if (cate === "ttsk") {
            breadcrumbText = "Tin hoạt động";
            breadcrumbParentText = "Tin tức";
        } else if (cate === "vb") {
            breadcrumbText = "Văn bản";
            breadcrumbParentText = "Tin tức";
        } else if (cate === "hdsd") {
            breadcrumbText = "Hướng dẫn sử dụng";
            breadcrumbParentText = "Tiện ích";
        }

        $('#breadcrumb-parent').text(breadcrumbParentText)
        $('#breadcrumb-active').text(breadcrumbText);

        $('.menu-wrapper ul li').each(function () {
            if ($(this).children('a').text() == breadcrumbText) {
                $(this).addClass('active')
            } else {
                $(this).removeClass('active')
            }
        })
    }

    function LoadChiTietBaiViet() {
        $('#newsDetail').empty();
        $.ajax({
            type: 'GET',
            async: false,
            url: `${baseUrl}/api/BaiVietApi/Get?id=` + id,
            dataType: 'JSON',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.value != null && data.value != "") {
                    data = data.value
                    document.title = data.tenBaiViet
                    let html = `<h4 class="news_title">${data.tenBaiViet != null ? data.tenBaiViet : ""}</h4>`;

                    if (!checkEmptyBlank(data.ngayCongBo)) {
                        html += `<p class="news_date text-blue-gray"><i class="icon-fluent icon_fluent_calendar_regular"></i>${formatShortDate(data.ngayCongBo)}</p>`;
                    }

                    html += `<div class="detail__content">`

                    if (!checkEmptyBlank(data.moTa)) {
                        html += `<p class="news_summary text-medium">${data.moTa}</p>`;
                    }

                    if (data.anhDaiDienURL != null && data.anhDaiDienURL != "") {
                        html += `<div class="news_img text-center">
                                    <img class="news_thumb" src="${data.anhDaiDienURL}">
                                </div>`
                    }

                    if (!checkEmptyBlank(data.moTaAnhDaiDien)) {
                        html += `<p class="news_noteimg text-blue-gray">${data.moTaAnhDaiDien}</p>`;
                    }

                    if (!checkEmptyBlank(data.noiDung)) {
                        html += `<div class="news_content">${data.noiDung}</div>`;
                    }

                    //html += `<div class="news_sources text-right">Nguồn: <span class="text-medium">Nguon</span></div>`

                    html += `</div>`

                    $('#btnPrint').attr('data-href', `${baseUrl}/print/pid/${id}`)
                    $('#myLinkNews').val(`${baseUrl}/news/pid/${id}/cid/${cate}`)

                    $('#newsDetail').append(html)
                }
            },
            error: function (err) {
                showNotification(0, 'Lỗi!')
            }
        });
    }

    function DanhSachBaiViet() {
        if (cate === "ttsk") {
            let sidebarHtml = ''
            let othersHtml = ''
            let dsVanBan = DanhSachBaiVietSidebar("vb", 5, false)
         //   let dsDocNhieuNhat = DanhSachBaiVietSidebar(cate, 5, false)
            let dsTinBaiKhac = DanhSachBaiVietKhac(cate, 6, true)

            $('#newsOthers').empty()
            $("#sidebar-content").empty();

            sidebarHtml += menuWrapper;
            
            if (dsVanBan != null && dsVanBan != "") {
                sidebarHtml += `<div class="box-category box-news-thumb">
                                    <h4 class="title-box-category">
                                        <a href="${urlVanBan}" class="inner-title" title="Văn bản">Văn bản</a>
                                    </h4>
                                    <div class="content-box-category">
                                        ${dsVanBan}
                                    </div>
                                </div>`;
            }

            //if (dsDocNhieuNhat != null && dsDocNhieuNhat != "") {
            //    sidebarHtml += `<div class="box-category box-news-thumb">
            //                        <h4 class="title-box-category">
            //                            <span class="inner-title" title="Đọc nhiều nhất">Đọc nhiều nhất</span>
            //                        </h4>
            //                        <div class="content-box-category">
            //                            ${dsDocNhieuNhat}
            //                        </div>
            //                    </div>`;
            //}

            if (dsTinBaiKhac != null && dsTinBaiKhac != "") {
                othersHtml += `<div class="box-category-others box-news-thumb box-news-thumb-others">
                                    <h4 class="title-box-category">
                                        <span class="inner-title">Các bài viết khác</span>
                                    </h4>
                                    <div class="content-box-category content-box-category-others" id="listOthers">
                                        ${dsTinBaiKhac}
                                    </div>`

                if ((totalCount(cate) - itemOthers) <= 0) {
                    othersHtml += ` <div class="text-center">
                                        <a class="btn btn-outline-secondary btn-more-mobile d-none" data-cate="${cate}" id="readmore-btn">Xem thêm</a>
                                    </div>
                                </div>`
                } else {
                    othersHtml += ` <div class="text-center">
                                        <a class="btn btn-outline-secondary btn-more-mobile" data-cate="${cate}" id="readmore-btn">Xem thêm</a>
                                    </div>
                                </div>`
                }

                $('#newsOthers').append(othersHtml)
            }

            if (sidebarHtml != null && sidebarHtml != "") {
                $("#sidebar-content").append(sidebarHtml);
            }
        } else if(cate === 'vb') {
            let sidebarHtml = ''
            let othersHtml = ''
            let dsTinHoatDong = DanhSachBaiVietSidebar("ttsk", 3, false)
           // let dsDocNhieuNhat = DanhSachBaiVietSidebar("ttsk", 5, false)
            let dsVanBanKhac = DanhSachBaiVietKhac(cate, 5, false)

            $('#newsOthers').empty()
            $("#sidebar-content").empty();

            sidebarHtml += menuWrapper;
            
            if (dsTinHoatDong != null && dsTinHoatDong != "") {
                sidebarHtml += `<div class="box-category box-news-thumb">
                                    <h4 class="title-box-category">
                                        <a href="${urlTinHoatDong}" class="inner-title" title="Tin hoạt động">Tin hoạt động</a>
                                    </h4>
                                    <div class="content-box-category">
                                        ${dsTinHoatDong}
                                    </div>
                                </div>`;
            }

            //if (dsDocNhieuNhat != null && dsDocNhieuNhat != "") {
            //    sidebarHtml += `<div class="box-category box-news-thumb">
            //                        <h4 class="title-box-category">
            //                            <span class="inner-title" title="Đọc nhiều nhất">Đọc nhiều nhất</span>
            //                        </h4>
            //                        <div class="content-box-category">
            //                            ${dsDocNhieuNhat}
            //                        </div>
            //                    </div>`;
            //}

            if (dsVanBanKhac != null && dsVanBanKhac != "") {
                othersHtml += ` <div class="box-category-others box-news-others">
                                    <h4 class="title-box-category">
                                        <span class="inner-title">Các văn bản khác</span>
                                    </h4>
                                    <div class="content-box-category content-box-category-others" id="listOthers">
                                        ${dsVanBanKhac}
                                    </div>`

                if ((totalCount(cate) - itemOthers) <= 0) {
                    othersHtml += ` <div class="text-right">
                                        <a class="news-readmore-btn text-azure d-none" data-cate="${cate}" id="readmore-btn">Xem thêm<i class="icon-fluent icon_fluent_chevron_down_filled"></i></a>
                                    </div>
                                </div>`
                } else {
                    othersHtml += ` <div class="text-right">
                                        <a class="news-readmore-btn text-azure" data-cate="${cate}" id="readmore-btn">Xem thêm<i class="icon-fluent icon_fluent_chevron_down_filled"></i></a>
                                    </div>
                                </div>`
                }

                $('#newsOthers').append(othersHtml)
            }

            if (sidebarHtml != null && sidebarHtml != "") {
                $("#sidebar-content").append(sidebarHtml);
            }
        }
        else if (cate === 'hdsd') {
            $('#ds_baivietkhac').empty()
            $("#sidebar-content").empty();
            let dataRender = DanhSachBaiVietSidebar(cate, 5, false);
            if (dataRender != null && dataRender != "") {
                let ds = `<div class="box-category box-news-thumb">
                                    <h4 class="title-box-category">
                                        <span class="inner-title" title="Các bài hướng dẫn khác">Các bài hướng dẫn khác</span>
                                    </h4>
                                    <div class="content-box-category">
                                        ${dataRender}
                                    </div>
                                </div>`;
                $("#sidebar-content").append(ds);
            }
        }

        $(document).on('click', '#readmore-btn', function () {
            numReadMore += 1
            //let cateOthers = $(this).data('cate');

            let dsNewOthers = DanhSachBaiVietKhac(cate, itemOthers, false, numReadMore)

            if (dsNewOthers != null && dsNewOthers != "") {
                $('#listOthers').append(dsNewOthers)
            }

            if ((totalCount(cate) - numReadMore*itemOthers) == 0) {
                $(this).addClass('d-none');
            } else {
                $(this).removeClass('d-none');
            }
        })
    }

    function DanhSachBaiVietSidebar(cate, itemRender, isDescription) {
        let dataHtml = '';
        $.ajax({
            type: 'POST',
            async: false,
            url: `${baseUrl}/api/BaiVietApi/GetByChuyenMuc?request=${cate}&sl=${itemRender}`,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.value.length > 0) {
                    dataHtml = '';
                    data.value.forEach(function (item, index) {
                        dataHtml += templateSidebarRender(item, cate, isDescription);
                    })
                }
            },
            error: function (err) {
                showNotification(0, 'Lỗi!')
            }
        });

        return dataHtml;
    }

    function DanhSachBaiVietKhac(cate, itemRender, isDescription, pageIndex = 1) {
        let dataHtml = '';
        let request = {
            "chuyenMuc": cate,
            "pageIndex": pageIndex,
            "pageSize": itemRender
        }
        $.ajax({
            type: 'POST',
            async: false,
            url: `${baseUrl}/api/BaiVietApi/GetsPaging`,
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                totalCount(cate)
                if (data.value.length > 0) {
                    dataHtml = '';
                    data.value.forEach(function (item, index) {
                        dataHtml += templateOthersRender(item, cate, isDescription);
                    })
                }
            },
            error: function (err) {
                showNotification(0, 'Lỗi!')
            }
        });

        return dataHtml;
    }

    function templateSidebarRender (item, cate, isDescription) {
        let templateRender = '';
        let news_link = '';
        if (cate === "ttsk" || cate === "hdsd") {
            news_link = `${baseUrl}/Tin-hoat-dong/${item.url}`
            templateRender = ` <div class="item-news item-news-thumb">
                                    <div class="news_image">
                                        <a class="news_thumb" href="${news_link}" title="${item.tenBaiViet != null ? item.tenBaiViet : ''}">
                                            <img class="thumb" src="${item.anhDaiDienURL == null || item.anhDaiDienURL == "" ? "/assets/images/icons/NoImage.png" : item.anhDaiDienURL}" alt="${item.tenBaiViet != null ? item.tenBaiViet : ''}">
                                        </a>
                                    </div>
                                    <div class="news_content">
                                        <h4 class="title_news">
                                            <a class="multiline-ellipsis ellipsis-2-line" href="${news_link}" title="${item.tenBaiViet != null ? item.tenBaiViet : ''}">${item.tenBaiViet}</a>
                                        </h4>
                                        <span class="news_date_public">${formatShortDate(item.ngayCongBo)}</span>
                                    `
            if (isDescription) {
                templateRender += `<p class="news_description multiline-ellipsis ellipsis-3-line">${item.moTa}</p>`
            }

            templateRender += ` </div>
                            </div>`
        }

        if (cate === "vb") {
            news_link = `${baseUrl}/Van-ban/${item.url}`
            templateRender = ` <div class="item-news">
                                    <h5 class="title-news">
                                        <a class="multiline-ellipsis ellipsis-2-line" href="${news_link}">${item.tenBaiViet}</a>
                                    </h5>
                                    <span class="date-news">${formatShortDate(item.ngayCongBo)}</span>
                                </div>`
        }

        return templateRender
    }

    function templateOthersRender (item, cate, isDescription) {
        let templateRender = '';
        let news_link = '';
        if (cate === "ttsk" || cate === "hdsd") {
            news_link = `${baseUrl}/Tin-hoat-dong/${item.url}`
            templateRender = ` <div class="item-news item-news-thumb">
                                    <div class="news_image">
                                        <a class="news_thumb" href="${news_link}" title="${item.tenBaiViet != null ? item.tenBaiViet : ''}">
                                            <img class="thumb" src="${item.anhDaiDienURL == null || item.anhDaiDienURL == "" ? "/assets/images/icons/NoImage.png" : item.anhDaiDienURL}" alt="${item.tenBaiViet != null ? item.tenBaiViet : ''}">
                                        </a>
                                    </div>
                                    <div class="news_content">
                                        <h4 class="title_news">
                                            <a class="multiline-ellipsis ellipsis-2-line" href="${news_link}" title="${item.tenBaiViet != null ? item.tenBaiViet : ''}">${item.tenBaiViet}</a>
                                        </h4>
                                        <span class="news_date_public">${formatShortDate(item.ngayCongBo)}</span>
                                    `
            if (isDescription) {
                templateRender += `<p class="news_description text-blue-gray multiline-ellipsis ellipsis-3-line">${item.moTa}</p>`
            }

            templateRender += ` </div>
                            </div>`
        }

        if (cate === "vb") {
            news_link = `${baseUrl}/Van-ban/${item.url}`
            templateRender = ` <div class="item-news">
                                    <h5 class="title-news">
                                        <a class="" href="${news_link}">${item.tenBaiViet}</a><span class="date-news d-inline-block mt-0">${formatShortDate(item.ngayCongBo)}</span>
                                    </h5>
                                </div>`
        }

        return templateRender
    }

    function totalCount(cate) {
        var total = 0;
        $.ajax({
            type: 'POST',
            async: false,
            url: `${baseUrl}/api/BaiVietApi/TotalCount?request=${cate}`,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                total = response.value
            }
        });
        return total;
    }

    function resizeimg() {
        var imgWidth = $('.box-news-thumb-others .content-box-category-others .item-news-thumb .news_image').width();
        var heightimg = $(".box-news-thumb-others .content-box-category-others .item-news-thumb .news_image");
        var heights = imgWidth/1.52941176471;
        for(var i=0;i<heightimg.length;i++){
            heightimg[i].style.height = heights + "px";
        }
    }

    window.addEventListener("resizeimg", resizeimg);
    $(window).on("resize", function () {
        resizeimg();
    });

    resizeimg();
})