$(document).ready(function () {
    const pathParts = window.location.pathname.split('/');
    const urlBaiViet = decodeURIComponent(pathParts[pathParts.length - 1]);

    if (!urlBaiViet) {
        $('#section-main-detail-content').html('<p>Không xác định được bài viết.</p>');
        return;
    }

    loadArticleDetail(urlBaiViet);

    loadSidebar("#section-sidebar-1", "hoat-dong-doan-the");
    loadSidebar("#section-sidebar-2", "tin-chuyen-nganh");
});

function loadArticleDetail(urlBaiViet) {
    $.ajax({
        url: `/api/tin-tuc/chi-tiet/tid/${urlBaiViet}`,
        method: 'GET',
        success: function (res) {
            if (res && res.isSuccess && res.value) {
                const item = res.value;

                let html = `
                    <div class="news-detail">
                        <h1 class="news-title">${item.tieuDe}</h1>
                        <div class="news-meta">
                            <small><i class="bi bi-calendar-event me-1"></i> ${formatDate(item.ngayCongBo)} 
                            | <i class="bi bi-eye me-1"></i> ${item.luotXem || 0} lượt xem</small>
                        </div>
                        ${item.anhDaiDien ? `
                            <div class="text-center">
                                <img src="${item.anhDaiDien}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid rounded" />
                            </div>` : ''
                    }
                        <p class="lead">${item.tomTat}</p>
                        <div class="news-content">${item.noiDung}</div>
                    </div>
                `;

                $('#section-main-detail-content').html(html);
            } else {
                $('#section-main-detail-content').html('<p>Không tìm thấy bài viết.</p>');
            }
        },
        error: function () {
            $('#section-main-detail-content').html('<p>Lỗi khi tải chi tiết bài viết.</p>');
        }
    });
}


function loadSidebar(targetId, apiEndpoint) {
    $.ajax({
        url: `/api/tin-tuc/danh-sach/${apiEndpoint}`,
        method: 'GET',
        success: function (res) {
            if (res && res.isSuccess && res.value?.length > 0) {
                let title = apiEndpoint === "hoat-dong-doan-the" ? "Hoạt động đoàn thể" : "Tin chuyên ngành";

                let html = `
                    <div class="sidebar-section">
                        <h5>${title}</h5>
                        <ul class="sidebar-list">
                `;

                res.value.slice(0, 5).forEach(item => {
                    html += `
                        <li>
                            <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
                        </li>
                    `;
                });

                html += `
                        </ul>
                    </div>
                `;

                $(targetId).html(html);
            } else {
                $(targetId).html('<p>Không có dữ liệu.</p>');
            }
        },
        error: function () {
            $(targetId).html('<p>Lỗi khi tải sidebar.</p>');
        }
    });
}


function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
}
