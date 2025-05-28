let currentPage = 1
const pageSize = 4

$(document).ready(() => {
    if (!urlChuyenMuc) {
        $("#section-list-content").html("<p>Chưa xác định chuyên mục bài viết.</p>")
        return
    }

    loadArticles(currentPage, urlChuyenMuc)

    // Load sidebar tùy theo chuyên mục
    switch (urlChuyenMuc) {
        case "tin-chuyen-nganh":
            loadSidebar("#section-sidebar-1", "hoat-dong-doan-the", "Hoạt động đoàn thể")
            loadSidebar("#section-sidebar-2", "tin-hoat-dong-1", "Tin hoạt động")
            break
        case "tin-hoat-dong-1":
            loadSidebar("#section-sidebar-1", "hoat-dong-doan-the", "Hoạt động đoàn thể")
            loadSidebar("#section-sidebar-2", "tin-chuyen-nganh", "Tin chuyên ngành")
            break
        case "hoat-dong-doan-the":
            loadSidebar("#section-sidebar-1", "tin-hoat-dong-1", "Tin hoạt động")
            loadSidebar("#section-sidebar-2", "tin-chuyen-nganh", "Tin chuyên ngành")
            break
        default:
            loadSidebar("#section-sidebar-1", "hoat-dong-doan-the", "Hoạt động đoàn thể")
            loadSidebar("#section-sidebar-2", "tin-chuyen-nganh", "Tin chuyên ngành")
    }
})

function loadArticles(page, urlChuyenMuc) {
    $("#section-list-content").html(
        '<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>',
    )

    $.ajax({
        url: `/api/tin-tuc/${urlChuyenMuc}/${page}`,
        method: "GET",
        success: (res) => {
            if (res && res.data?.length > 0) {
                let html = ""
                res.data.forEach((item) => {
                    const ngayThang = new Date(item.ngayCongBo)
                    const ngay = ngayThang.getDate()
                    const thang = ngayThang.getMonth() + 1
                    const nam = ngayThang.getFullYear()

                    html += `
                        <div class="news-item">
                            <div class="row">
                                <div class="col-md-5">
                                    <div class="news-image">
                                        <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">
                                            <img src="${item.anhDaiDien || item.thumbnail || "/placeholder.svg?height=200&width=300"}" 
                                                alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid">
                                        </a>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="news-date">
                                        ${ngay}/${thang}/${nam} ${formatTime(item.ngayCongBo)}
                                    </div>
                                    <h3 class="news-title">
                                        <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
                                    </h3>
                                    <div class="news-excerpt">
                                        ${item.tomTat}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                })

                $("#section-list-content").html(html)
                renderPagination(res.totalPages, res.page)
            } else {
                $("#section-list-content").html('<div class="alert alert-info">Không tìm thấy bài viết nào.</div>')
                $("#section-bottom").html("")
            }
        },
        error: () => {
            $("#section-list-content").html('<div class="alert alert-danger">Đã có lỗi khi tải dữ liệu bài viết.</div>')
            $("#section-bottom").html("")
        },
    })
}

function renderPagination(totalPages, currentPage) {
    if (totalPages <= 1) {
        $("#section-bottom").html("")
        return
    }

    let html = '<div class="pagination-container mb-2">'
    html += '<ul class="pagination">'

    if (currentPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goToPage(${currentPage - 1})"><i class="fa fa-angle-left"></i></a></li>`
    }

    // Hiển thị tối đa 5 trang
    let startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4)
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === currentPage ? "active" : ""}"><a class="page-link" href="javascript:void(0)" onclick="goToPage(${i})">${i}</a></li>`
    }

    if (currentPage < totalPages) {
        html += `<li class="page-item"><a class="page-link" href="javascript:void(0)" onclick="goToPage(${currentPage + 1})"><i class="fa fa-angle-right"></i></a></li>`
    }

    html += "</ul>"
    html += "</div>"

    $("#section-bottom").html(html)
}

function goToPage(page) {
    currentPage = page
    loadArticles(page, urlChuyenMuc)
    // Cuộn lên đầu danh sách tin tức
    $("html, body").animate(
        {
            scrollTop: $("#section-list-content").offset().top - 100,
        },
        500,
    )
}

function loadSidebar(targetId, apiEndpoint, title) {
    $(targetId).html(`
        <div class="sidebar-widget">
            <div class="sidebar-widget-header">
                <i class="fa fa-newspaper-o"></i> ${title}
            </div>
            <div class="sidebar-widget-content">
                <div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>
            </div>
        </div>
    `)

    $.ajax({
        url: `/api/tin-tuc/${apiEndpoint}/1`,
        method: "GET",
        success: (res) => {
            if (res && res.data?.length > 0) {
                let html = `
                    <div class="sidebar-widget">
                        <div class="sidebar-widget-header">
                            <i class="fa fa-newspaper-o"></i> ${title}
                        </div>
                        <div class="sidebar-widget-content">
                `

                

                // Hiển thị các bài viết còn lại dạng danh sách
                html += '<div class="sidebar-news-list">'
                for (let i = 0; i < Math.min(res.data.length, 5); i++) {
                    const item = res.data[i]
                    const itemDate = new Date(item.ngayCongBo)
                    const itemDay = itemDate.getDate()
                    const itemMonth = itemDate.getMonth() + 1
                    const itemYear = itemDate.getFullYear()

                    html += `
                        <div class="sidebar-news-item">
                            <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
                            <div class="sidebar-news-date">${itemDay}/${itemMonth}/${itemYear}</div>
                        </div>
                    `
                }
                html += "</div>"

                // Thêm nút xem thêm
                html += `
                    <div class="text-right mt-3">
                        <a href="/${apiEndpoint}/act/1" class="btn-view-more">Xem thêm <i class="fa fa-angle-double-right"></i></a>
                    </div>
                `

                html += "</div></div>"

                $(targetId).html(html)
            } else {
                $(targetId).html(`
                    <div class="sidebar-widget">
                        <div class="sidebar-widget-header">
                            <i class="fa fa-newspaper-o"></i> ${title}
                        </div>
                        <div class="sidebar-widget-content">
                            <div class="alert alert-info">Không có dữ liệu.</div>
                        </div>
                    </div>
                `)
            }
        },
        error: () => {
            $(targetId).html(`
                <div class="sidebar-widget">
                    <div class="sidebar-widget-header">
                        <i class="fa fa-newspaper-o"></i> ${title}
                    </div>
                    <div class="sidebar-widget-content">
                        <div class="alert alert-danger">Lỗi khi tải dữ liệu.</div>
                    </div>
                </div>
            `)
        },
    })
}

function formatDate(dateStr) {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function formatTime(dateStr) {
    if (!dateStr) return ""
    const d = new Date(dateStr)
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}
