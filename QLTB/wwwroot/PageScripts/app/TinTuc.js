$(document).ready(function () {
    loadTinTieuDiem();
    loadTinHoatDong();
    loadTinChuyenNganh();
    loadTinTucSuKien();
});

function loadTinTieuDiem() {
    $.get("/api/tin-tuc/tin-tieu-diem", function (res) {
        if (res && res.isSuccess && res.value) {
            let item = res.value;
            let html = `
                <div class="news-item mb-3">
                    <h5><a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a></h5>
                    <img src="${item.anhDaiDien || item.thumbnail}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid mb-2" />
                    <p>${item.tomTat}</p>
                    <p><small>${formatDate(item.ngayCongBo)}</small></p>
                </div>
            `;
            $('#tin-tieu-diem').html(html);
        } else {
            $('#tin-tieu-diem').html('<p>Không có tin tiêu điểm nào.</p>');
        }
    });
}

function loadTinHoatDong() {
    $.get("/api/tin-tuc/tin-hoat-dong-1", function (res) {
        if (res && res.isSuccess && res.value.length > 0) {
            let html = '';
            res.value.forEach(item => {
                html += `
                <div class="news-item mb-3">
                    <h5><a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a></h5>
                    <p>${item.tomTat}</p>
                    <p><small>${formatDate(item.ngayCongBo)}</small></p>
                </div>
            `;
            });
            $('#tin-hoat-dong').html(html);
        } else {
            $('#tin-hoat-dong').html('<p>Không có tin hoạt động nào.</p>');
        }
    });
}

function loadTinChuyenNganh() {
    $.get("/api/tin-tuc/tin-chuyen-nganh", function (res) {
        if (res && res.isSuccess && res.value.length > 0) {
            let html = '';
            res.value.forEach(item => {
                html += `
                <div class="news-item mb-3">
                    <h5><a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a></h5>
                    <p>${item.tomTat}</p>
                    <p><small>${formatDate(item.ngayCongBo)}</small></p>
                </div>
            `;
            });
            $('#tin-chuyen-nganh').html(html);
        } else {
            $('#tin-chuyen-nganh').html('<p>Không có tin chuyên ngành nào.</p>');
        }
    });
}

function loadTinTucSuKien() {
    $.get("/api/tin-tuc/tin-tuc-su-kien", function (res) {
        if (res && res.isSuccess && res.value.length > 0) {
            let html = '';
            res.value.forEach(item => {
                html += `
                <div class="news-item mb-3">
                    <h5><a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a></h5>
                </div>
            `;
            });
            $('#tin-tuc-su-kien').html(html);
        } else {
            $('#tin-tuc-su-kien').html('<p>Không có tin tức sự kiện nào.</p>');
        }
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
}
