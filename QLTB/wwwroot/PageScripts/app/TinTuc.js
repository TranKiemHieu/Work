$(document).ready(() => {
    loadTinTieuDiem()
    loadTinHoatDong()
    loadTinChuyenNganh()
    loadTinTucSuKien()
})

function loadTinTieuDiem() {
    $("#tin-tieu-diem").html(
        '<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>',
    )

    $.get("/api/tin-tuc/danh-sach/tin-tuc", (res) => {
        if (res && res.isSuccess && res.value) {
            const item = res.value[0]
            const ngayThang = new Date(item.ngayCongBo)
            const ngay = ngayThang.getDate()
            const thang = ngayThang.getMonth() + 1
            const nam = ngayThang.getFullYear()

            const html = `
        <div class="tin-tuc-item tin-tuc-featured">
          <div class="row">
            <div class="col-md-7">
              <img src="${item.anhDaiDien || item.thumbnail || "/placeholder.svg?height=400&width=600"}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid tin-tuc-image">
            </div>
            <div class="col-md-5">
              <div class="tin-tuc-date">
                <span class="tin-tuc-day">${ngay}</span>
                <span class="tin-tuc-month">${thang}.${nam}</span>
              </div>
              <h2 class="tin-tuc-title">
                <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
              </h2>
              <div class="tin-tuc-excerpt">
                ${item.tomTat}
              </div>
              <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}" class="tin-tuc-readmore">xem tiếp <i class="fa fa-angle-right"></i></a>
            </div>
          </div>
        </div>
      `
            $("#tin-tieu-diem").html(html)
        } else {
            $("#tin-tieu-diem").html('<div class="alert alert-info">Không có tin tiêu điểm nào.</div>')
        }
    }).fail(() => {
        $("#tin-tieu-diem").html('<div class="alert alert-danger">Không thể tải dữ liệu tin tiêu điểm.</div>')
    })
}

function loadTinHoatDong() {
    $("#tin-hoat-dong").html(
        '<div class="section-header"><h2 class="section-title">TIN HOẠT ĐỘNG</h2></div>' +
        '<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>'
    );

    $.get("/api/tin-tuc/danh-sach/tin-hoat-dong-1", (res) => {
        if (res && res.isSuccess && res.value.length > 0) {
            let html = '<div class="section-header"><h2 class="section-title"><a href="/tin-hoat-dong-1/act/1" style="color: inherit; text-decoration: none;">TIN HOẠT ĐỘNG</a></h2></div>';

            res.value.forEach((item, index) => {
                if (index < 3) {
                    const ngayThang = new Date(item.ngayCongBo);
                    const ngay = ngayThang.getDate();
                    const thang = ngayThang.getMonth() + 1;
                    const nam = ngayThang.getFullYear();

                    html += `
                        <div class="tin-tuc-item">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="${item.anhDaiDien || item.thumbnail || "/placeholder.svg?height=200&width=300"}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid tin-tuc-image">
                                </div>
                                <div class="col-md-8">
                                    <div class="tin-tuc-date">
                                        <span class="tin-tuc-day">${ngay}</span>
                                        <span class="tin-tuc-month">${thang}.${nam}</span>
                                    </div>
                                    <h3 class="tin-tuc-title">
                                        <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
                                    </h3>
                                    <div class="tin-tuc-excerpt">
                                        ${item.tomTat || ""}
                                    </div>
                                    <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}" class="tin-tuc-readmore">xem tiếp <i class="fa fa-angle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            $("#tin-hoat-dong").html(html);
        } else {
            $("#tin-hoat-dong").html(
                '<div class="section-header"><h2 class="section-title">TIN HOẠT ĐỘNG</h2></div>' +
                '<div class="alert alert-info">Không có tin hoạt động nào.</div>'
            );
        }
    }).fail(() => {
        $("#tin-hoat-dong").html(
            '<div class="section-header"><h2 class="section-title">TIN HOẠT ĐỘNG</h2></div>' +
            '<div class="alert alert-danger">Không thể tải dữ liệu tin hoạt động.</div>'
        );
    });
}


function loadTinChuyenNganh() {
    $("#tin-chuyen-nganh").html(
        '<div class="section-header"><h2 class="section-title">TIN CHUYÊN NGÀNH</h2></div>' +
        '<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>',
    )

    $.get("/api/tin-tuc/danh-sach/tin-chuyen-nganh", (res) => {
        if (res && res.isSuccess && res.value.length > 0) {
            let html = '<div class="section-header"><h2 class="section-title"><a href="/tin-chuyen-nganh/act/1" style="color: inherit; text-decoration: none;">TIN CHUYÊN NGÀNH</a></h2></div>'

            res.value.forEach((item, index) => {
                if (index < 3) {
                    // Giới hạn hiển thị 3 tin
                    const ngayThang = new Date(item.ngayCongBo)
                    const ngay = ngayThang.getDate()
                    const thang = ngayThang.getMonth() + 1
                    const nam = ngayThang.getFullYear()

                    html += `
            <div class="tin-tuc-item">
              <div class="row">
                <div class="col-md-4">
                  <img src="${item.anhDaiDien || item.thumbnail || "/placeholder.svg?height=200&width=300"}" alt="${item.moTaAnhDaiDien || item.tieuDe}" class="img-fluid tin-tuc-image">
                </div>
                <div class="col-md-8">
                  <div class="tin-tuc-date">
                    <span class="tin-tuc-day">${ngay}</span>
                    <span class="tin-tuc-month">${thang}.${nam}</span>
                  </div>
                  <h3 class="tin-tuc-title">
                    <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
                  </h3>
                  <div class="tin-tuc-excerpt">
                    ${item.tomTat}
                  </div>
                  <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}" class="tin-tuc-readmore">xem tiếp <i class="fa fa-angle-right"></i></a>
                </div>
              </div>
            </div>
          `
                }
            })

            $("#tin-chuyen-nganh").html(html)
        } else {
            $("#tin-chuyen-nganh").html(
                '<div class="section-header"><h2 class="section-title">TIN CHUYÊN NGÀNH</h2></div>' +
                '<div class="alert alert-info">Không có tin chuyên ngành nào.</div>',
            )
        }
    }).fail(() => {
        $("#tin-chuyen-nganh").html(
            '<div class="section-header"><h2 class="section-title">TIN CHUYÊN NGÀNH</h2></div>' +
            '<div class="alert alert-danger">Không thể tải dữ liệu tin chuyên ngành.</div>',
        )
    })
}

function loadTinTucSuKien() {
    $("#tin-tuc-su-kien").html(
        '<div class="sidebar-box">' +
        '<div class="sidebar-header"><h3><i class="fa fa-newspaper-o"></i> Tin tức sự kiện</h3></div>' +
        '<div class="loading-spinner"><i class="fa fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>' +
        "</div>",
    )

    $.get("/api/tin-tuc/danh-sach/tin-tuc", (res) => {
        if (res && res.isSuccess && res.value.length > 0) {
            let html =
                '<div class="sidebar-box">' +
                '<div class="sidebar-header"><h3><i class="fa fa-newspaper-o"></i> Tin tức sự kiện</h3></div>' +
                '<div class="sidebar-content">'

            res.value.forEach((item, index) => {
                if (index >= 1 && index < 5) {
                    // Giới hạn hiển thị 5 tin
                    html += `
            <div class="sidebar-news-item">
              <a href="/tin-tuc/chi-tiet/${item.urlBaiViet}">${item.tieuDe}</a>
            </div>
          `
                }
            })

            html += "</div></div>"

            // Thêm form góp ý
            html += `
  <div class="sidebar-widget">
    <div class="sidebar-widget-header">
      <i class="fa fa-envelope"></i> GÓP Ý - LIÊN HỆ
    </div>
    <div class="sidebar-widget-content">
      <p class="feedback-title">GỬI ĐẾN CHÚNG TÔI NHỮNG GÓP Ý TỪ BẠN!</p>
      <form id="feedbackForm">
        <div class="form-group">
          <input type="text" class="form-control" name="fullName" placeholder="Họ và tên *" required>
        </div>
        <div class="form-group">
          <input type="email" class="form-control" name="email" placeholder="Email *" required>
        </div>
        <div class="form-group">
          <textarea class="form-control" name="content" rows="4" placeholder="Nội dung" required></textarea>
        </div>
        <div class="form-group">
          <img src="/assets/images/tintuc/capcha.png" alt="Captcha" class="captcha-image">
        </div>
        <div class="form-group">
          <input type="text" class="form-control" name="captcha" placeholder="Nhập vào mã bảo vệ" required>
        </div>
        <button type="submit" class="btn btn-submit">Gửi</button>
      </form>
    </div>
  </div>

  <div class="sidebar-widget">
    <div class="sidebar-widget-header">
      <i class="fa fa-users"></i> KHÁCH HÀNG - ĐỐI TÁC
    </div>
    <div class="sidebar-widget-content partners-content">
      <div class="partner-item">
        <a href="#"><img src="/assets/images/tintuc/smart-city.png" alt="Smart Media City"></a>
      </div>
      <div class="partner-item">
        <a href="#"><img src="/assets/images/tintuc/huedita.png" alt="HueDITA"></a>
      </div>
      <div class="partner-item">
        <a href="#"><img src="/assets/images/tintuc/vimo.png" alt="VIMO"></a>
      </div>
      <div class="partner-item">
        <a href="#"><img src="/assets/images/tintuc/Hoatamus.png" alt="Hoatamus"></a>
      </div>
    </div>
  </div>
`

            $("#tin-tuc-su-kien").html(html)

            // Xử lý form góp ý
            $("#feedbackForm").submit(function (e) {
                e.preventDefault()
                const formData = {
                    fullName: $(this).find('input[name="fullName"]').val(),
                    email: $(this).find('input[name="email"]').val(),
                    content: $(this).find('textarea[name="content"]').val(),
                    captcha: $(this).find('input[name="captcha"]').val(),
                }

                // Gửi dữ liệu form đi (thay thế bằng API endpoint thực tế)
                $.ajax({
                    url: "/api/feedback/submit",
                    type: "POST",
                    data: JSON.stringify(formData),
                    contentType: "application/json",
                    success: (response) => {
                        alert("Cảm ơn bạn đã gửi góp ý!")
                        $("#feedbackForm")[0].reset()
                    },
                    error: () => {
                        alert("Có lỗi xảy ra khi gửi góp ý. Vui lòng thử lại sau.")
                    },
                })
            })

            // Khởi tạo slider đối tác (nếu cần)
            initPartnersSlider()
        } else {
            $("#tin-tuc-su-kien").html(
                '<div class="sidebar-box">' +
                '<div class="sidebar-header"><h3><i class="fa fa-newspaper-o"></i> Tin tức sự kiện</h3></div>' +
                '<div class="sidebar-content">' +
                '<div class="alert alert-info">Không có tin tức sự kiện nào.</div>' +
                "</div></div>",
            )
        }
    }).fail(() => {
        $("#tin-tuc-su-kien").html(
            '<div class="sidebar-box">' +
            '<div class="sidebar-header"><h3><i class="fa fa-newspaper-o"></i> Tin tức sự kiện</h3></div>' +
            '<div class="sidebar-content">' +
            '<div class="alert alert-danger">Không thể tải dữ liệu tin tức sự kiện.</div>' +
            "</div></div>",
        )
    })
}

function initPartnersSlider() {
    // Nếu sử dụng thư viện slider như Slick hoặc Owl Carousel
    // $('.partners-slider').slick({
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   autoplay: true,
    //   autoplaySpeed: 3000,
    //   arrows: false,
    //   dots: true
    // })
}

function formatDate(dateString) {
    if (!dateString) return ""
    const d = new Date(dateString)
    return d.toLocaleDateString("vi-VN")
}