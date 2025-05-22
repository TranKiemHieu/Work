$(document).ready(function () {
    if (!urlBaiViet) {
        $('#section-main-detail-content').html('<p>Không xác định được bài viết.</p>');
        return;
    }

    $.ajax({
        url: `/api/tin-tuc/chi-tiet/tid/${urlBaiViet}`,
        method: 'GET',
        success: function (res) {
            console.log('Chi tiet', res)
            if (res && res.isSuccess && res.value) {
                const item = res.value;

                let html = `
                    <div class="news-detail">
                        <h1 class="mb-3">${item.tieuDe}</h1>
                        <p><small>Ngày đăng: ${formatDate(item.ngayCongBo)} | Lượt xem: ${item.luotXem || 0}</small></p>
                        ${item.anhDaiDien ? `<img src="${item.anhDaiDien}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid my-3" />` : ''}
                        <p class="lead">${item.tomTat}</p>
                        <div class="content">${item.noiDung}</div>
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

    // Load sidebar tùy theo chuyên mục
    loadSidebar("#section-sidebar-1", "hoat-dong-doan-the");
    loadSidebar("#section-sidebar-2", "tin-chuyen-nganh");    
});

// Hàm gọi API để nạp dữ liệu vào sidebar
function loadSidebar(targetId, apiEndpoint) {
    $.ajax({
        url: `/api/tin-tuc/${apiEndpoint}`,
        method: 'GET',
        success: function (res) {
            if (res && res.isSuccess && res.value?.length > 0) {
                let html = '<ul class="list-group">';
                res.value.forEach(item => {
                    html += `
                        <li class="list-group-item">
                            <a href="/tin-tuc/chi-tiet/${item.id}">${item.tieuDe}</a>
                        </li>
                    `;
                });
                html += '</ul>';
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
