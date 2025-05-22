$(document).ready(function () {
    if (!urlChuyenMuc) {
        $('#section-list-content').html('<p>Chưa xác định chuyên mục bài viết.</p>');
        return;
    }

    // Load danh sách bài viết chính
    $.ajax({
        url: `/api/tin-tuc/${urlChuyenMuc}`,
        method: 'GET',
        success: function (res) {
            if (res && res.isSuccess && res.value?.length > 0) {
                let html = '';
                res.value.forEach(item => {
                    html += `
                        <div class="news-item mb-4">
                            <h3><a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a></h3>
                            <img src="${item.anhDaiDien || item.thumbnail}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid mb-2" />
                            <p>${item.tomTat}</p>
                            <small>Ngày công bố: ${formatDate(item.ngayCongBo)}</small>
                        </div>
                    `;
                });
                $('#section-list-content').html(html);
            } else {
                $('#section-list-content').html('<p>Không tìm thấy bài viết nào.</p>');
            }
        },
        error: function () {
            $('#section-list-content').html('<p>Đã có lỗi khi tải dữ liệu bài viết.</p>');
        }
    });

    // Load sidebar tùy theo chuyên mục
    switch (urlChuyenMuc) {
        case "tin-chuyen-nganh":
            loadSidebar("#section-sidebar-1", "hoat-dong-doan-the");
            loadSidebar("#section-sidebar-2", "tin-hoat-dong-1");
            break;
        case "tin-hoat-dong-1":
            loadSidebar("#section-sidebar-1", "hoat-dong-doan-the");
            loadSidebar("#section-sidebar-2", "tin-chuyen-nganh");
            break;
        case "hoat-dong-doan-the":
            loadSidebar("#section-sidebar-1", "tin-hoat-dong-1");
            loadSidebar("#section-sidebar-2", "tin-chuyen-nganh");
            break;
    }
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

// Format ngày
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
}
