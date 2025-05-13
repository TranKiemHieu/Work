const baseUrl = getRootLink();

$(document).ready(function () {
    editorNoiDungEdit = CKEDITOR.replace('replyContent', {
        language: 'vi-vn',
        extraPlugins: 'confighelper',
        placeholder: 'Nhập nội dung',
        //toolbar: "Full",
        filebrowserImageUploadUrl: '/File/UploadAdapter?subDirectory=YKienPhanHoi/' + new Date().getFullYear(),
        filebrowserUploadUrl: '/File/UploadAdapter?subDirectory=YKienPhanHoi/' + new Date().getFullYear(),
        clipboard_handleImages: false,
    });

    initDateTimePicker();
    initSelect2();

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "Feedback",
            "search": {
                "tuKhoa": tuKhoa,
                "loai": 0,
                "batDau": formatDateToSearch($('#tu-ngay-search').val()),
                "ketThuc": formatDateToSearch($('#den-ngay-search').val()),
                "trangThai": Number($('#trang-thai-search option:selected').val())
            }
        };

        sessionStorage.setItem("filterData", JSON.stringify(save));
    };

    function buildData() {
        let tuKhoa = $('#tu-khoa-search').val();

        const request = {
            "tuKhoa": tuKhoa,
            "loai": 0,
            "batDau": formatDateToSearch($('#tu-ngay-search').val()),
            "ketThuc": formatDateToSearch($('#den-ngay-search').val()),
            "trangThai": Number($('#trang-thai-search option:selected').val())
        };
        return JSON.stringify(request);
    };

    $('#tat-ca').on('click', function () {
        $('#tu-khoa-search').val("")
        $('#trang-thai-search').val('-1').trigger('change');
        $('#tu-ngay-search').val("");
        $('#den-ngay-search').val("");
        $('#dataGrid').DataTable().ajax.reload().draw();

        saveFilter();
    });

    $('#btn-filter').on('click', function () {
        saveFilter();
        $('#dataGrid').DataTable().ajax.reload().draw();
    });

    $('#tu-khoa-search').on("keydown", function search(e) {
        if (e.keyCode == 13) {
            saveFilter();
            $('#dataGrid').DataTable().ajax.reload().draw();
        }
    });

    dtAjax = []

    const tableData = {
        url: `${baseUrl}/api/FeedbackApi/Gets`,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: buildData,
        dataSrc: function (data) {
            if (data && data.value && data.value.length > 0) {
                for (let i = 0; i < data.value.length; i++) {
                    data.value[i].stt = i + 1;
                }
                dtAjax = data.value
                return data.value;
            }

            return [];
        },
    };

    const tableDefs = [
        {
            targets: 1,
            render: function (data, type, row, meta) {
                if (data != null && data != "") {
                    return `<div id="fb-${row.id}" class="multiline-ellipsis ellipsis-2-line">
                                ${data}
                            </div>`;
                }
                return '';
            }
        },
        {
            targets: 2,
            render: function (data, type, row, meta) {
                if (data != null && data != "") {
                    return data;
                }
                return '';
            }
        },
        {
            targets: 5,
            render: function (data, type, row, meta) {
                if (data != null && data != "") {
                    return `<span class="text-truncate w-140" data-toggle="tooltip" title="${data}">
                                ${data}
                            </span>`;
                }
                return '';
            }
        },
        {
            targets: 6,
            render: function (data, type, row, meta) {
                if (!checkEmptyBlank(data)) {
                    return `<span>${moment(data).format('DD/MM/YYYY')}</span>`;
                }
                return '';
            }
        },
        {
            targets: 7,
            render: function (data, type, row, meta) {
                if (data == 0) {
                    return '<span class="badge badge-warning d-block">Đã tiếp nhận</span>';
                } else if (data == 1) { //đã phản hồi
                    return '<span class="badge badge-info d-block">Đã phản hồi</span>';
                } else if (data == 2) { //đã công bố
                    return '<span class="badge badge-success d-block">Đã công bố</span>';
                } else if (data == 3) {//hủy công bố
                    return '<span class="badge badge-secondary d-block">Hủy công bố</span>';
                }
                return '';
            }
        },
        {
            targets: 8,
            render: function (data, type, row, meta) {
                var listIcon = ``;
                if (row.trangThai == 0 && canApprove == 1) { //đã tiếp nhận
                    listIcon = `<i data-toggle="tooltip" title="Phản hồi" class="icon-fluent icon_fluent_comment_edit_filled comment-command-btn text-yellow" id="n-${row.id}"></i>`;
                } else if (row.trangThai == 1 && canApprove == 1) { //đã phản hồi
                    listIcon = `<i data-toggle="tooltip" title="Công bố" class="icon-fluent icon_fluent_comment_checkmark_filled publish-command-btn text-green" id="n-${row.id}"></i>`;
                } else if (row.trangThai == 2 && canApprove == 1) { //đã công bố
                    listIcon = `<i data-toggle="tooltip" title="Hủy công bố" class="icon-fluent icon_fluent_comment_dismiss_filled cancel-command-btn text-body" id="n-${row.id}"></i>`;
                    if (canEdit == 1) {
                        listIcon += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id="n-${row.id}"></i>`;
                    }
                } else {//hủy công bố
                    if (canApprove == 1) {
                        listIcon = `<i data-toggle="tooltip" title="Công bố" class="icon-fluent icon_fluent_comment_checkmark_filled publish-command-btn text-green" id="n-${row.id}"></i>`;
                    }
                    if (canEdit == 1) {
                        listIcon += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id="n-${row.id}"></i>`;
                    }
                }
                if (canDelete == 1) {
                    listIcon += `<i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id="n-${row.id}"></i>`;
                }

                return listIcon;
            }
        }
    ];

    const tableCols = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "noiDung", "class": "left-align cursor-pointer text-medium detail-feedback" },
        { "data": "tenBaiViet", "width": "18%", "class": "left-align" },
        { "data": "nguoiGui", "width": "10%" },
        { "data": "dienThoai", "width": "7%", "class": "center-align" },
        { "data": "email", "width": "12%", "class": "center-align" },
        { "data": "ngayTaoLap", "width": "6%", "class": "center-align" },
        { "data": "trangThai", "width": "10%", "class": "center-align" },
        { "data": "id", "width": "10%", "class": "center-align group-icon-action" }
    ];

    initDataTableConfig('dataGrid', tableData, tableDefs, tableCols)

    $('#dataGrid tbody').on('click', '.detail-feedback', function () {
        var id = $('<div/>').html($(this).children().attr("id")).text().replace('fb-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#titleDetail').text('Xem chi tiết góp ý, ý kiến');
        $('#idEdit').val(id);
        if (data != null && data.length > 0) {
            OpenDetail(data[0]);
        }
    });

    //comment/reply feedback
    $('#dataGrid tbody').on('click', '.comment-command-btn', function () {
        var id = $('<div/>').html($(this).attr("id")).text().replace('n-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#titleDetail').text('Trả lời góp ý, ý kiến');
        $('#idEdit').val(id);
        editorNoiDungEdit.setData('');
        if (data != null && data.length > 0) {
            OpenDetail(data[0]);
        }
    });

    $(document).on('click', '#replyBtn', function () {
        var id = $('#idEdit').val();
        $('.feedbackBox').addClass('d-none');
        $('.replyFeedbackBox').removeClass('d-none');
        $('#groupReplyBtnBox').html('');
        $('#groupReplyBtnBox').html(listButtonBox(1));
    });

    $('#dataGrid tbody').on('click', '.edit-command-btn', function () {
        var id = $('<div/>').html($(this).attr("id")).text().replace('n-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#titleDetail').text('Chỉnh sửa ý kiến phản hồi');
        $('.feedbackBox').addClass('d-none');
        $('.replyFeedbackBox').removeClass('d-none');
        $('#idEdit').val(id);
        if (data != null && data.length > 0) {
            OpenDetail(data[0]);

            $('#reply-date').val(moment(new Date()).format('DD/MM/YYYY'));
            $('#organization-reply').val('-1').trigger('change');

            if (data[0].coQuanTraLoi != null && data[0].coQuanTraLoi != "") {
                $('#organization-reply').val(data[0].coQuanTraLoi).trigger('change');
            }

            if (data[0].ngayTraLoi != null && data[0].ngayTraLoi != "") {
                $('#reply-date').val(moment(data[0].ngayTraLoi).format('DD/MM/YYYY'));
            }

            $('#groupReplyBtnBox').html('');
            $('#groupReplyBtnBox').html(listButtonBox(2));
        }
    });

    $(document).on('click', '#sendReplyBtn', function (e) {
        e.preventDefault();
        dataEdit($('#idEdit').val(), 1, "Gửi phản hồi ý kiến thành công");
    });

    //publish feedback
    $('#dataGrid tbody').on('click', '.publish-command-btn', function () {
        var id = $('<div/>').html($(this).attr("id")).text().replace('n-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('.feedbackBox').addClass('d-none');
        $('.replyFeedbackBox').addClass('d-none');
        $('#idPublish').val(id);
        if (data != null && data.length > 0) {
            $('#fbPublish').html(data[0].noiDung);
        }
        $('#modalPublish').modal('show');
    });

    $(document).on('click', '#publishBtn', function () {
        var id = $('#idEdit').val();
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#idPublish').val(id);
        if (data != null && data.length > 0) {
            $('#fbPublish').html(data[0].noiDung);
        }
        $('#modalPublish').modal('show');
    });

    $(document).on('click', '#sendPublishBtn', function (e) {
        e.preventDefault();
        dataEdit($('#idEdit').val(), 2, "Gửi phản hồi và công bố thành công");
    });

    $("#modalPublish").submit(function (e) {
        e.preventDefault();
        dataAction($('#idPublish').val(), 'modalPublish', 2, "Công bố thành công");
    });

    //cancel publish feedback
    $('#dataGrid tbody').on('click', '.cancel-command-btn', function () {
        var id = $('<div/>').html($(this).attr("id")).text().replace('n-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('.feedbackBox').addClass('d-none');
        $('.replyFeedbackBox').addClass('d-none');
        $('#idCancel').val(id);
        if (data != null && data.length > 0) {
            $('#fbCancel').html(data[0].noiDung);
        }
        $('#modalCancel').modal('show');
    });

    $(document).on('click', '#cancelBtn', function () {
        var id = $('#idEdit').val();
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#idCancel').val(id);
        if (data != null && data.length > 0) {
            $('#fbCancel').html(data[0].noiDung);
        }
        $('#modalCancel').modal('show');
    });

    $("#modalCancel").submit(function (e) {
        e.preventDefault();
        dataAction($('#idCancel').val(), 'modalCancel', 3, "Hủy công bố thành công");
    });

    $(document).on('click', '#saveBtn', function (e) {
        e.preventDefault();
        var data = dtAjax.filter(e => e.id.toUpperCase() == $('#idEdit').val().toUpperCase());
        const trangThai = data != null && data.length > 0 ? data[0].trangThai : null;
        dataEdit($('#idEdit').val(), trangThai, "Chỉnh sửa nội dung trả lời thành công");
    });

    function dataEdit(id, trangThai, message) {
        const noiDungtraLoi = editorNoiDungEdit.getData();
        const ngayTraLoi = $('#reply-date').val();
        const coQuanTraLoi = $('#organization-reply option:selected').val();

        if (!checkEmptyBlank(noiDungtraLoi)) {
            const dt = {
                "ID": id,
                "NoiDungTraLoi": noiDungtraLoi,
                "TrangThai": Number(trangThai),
                "NgayTraLoi": formatDateToSearch(ngayTraLoi),
                "CoQuanTraLoi": coQuanTraLoi == '-1' ? null : coQuanTraLoi,
                "Loai": 0
            };

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))
            getDataWithApiFormData('PUT', `/api/FeedbackApi/Edit`, data)
                .then((data) => {
                    showNotification(1, message)

                    $('#modalDetail').modal('hide');

                    editorNoiDungEdit.setData('');

                    $('#reply-date').val(moment(new Date()).format('DD/MM/YYYY'));
                    $('#organization-reply').val('-1').trigger('change');

                    $('#dataGrid').DataTable().ajax.reload().draw();
                });
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }

    function dataAction(id, idModal, trangThai, message) {
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        const noiDungTraLoi = data != null && data.length > 0 && data[0].noiDungTraLoi != null ? data[0].noiDungTraLoi : null;
        const ngayTraLoi = data != null && data.length > 0 ? data[0].ngayTraLoi : null;
        const coQuanTraLoi = data != null && data.length > 0 ? data[0].coQuanTraLoi : null;

        if (!checkEmptyBlank(data[0].noiDung)) {
            const dt = {
                "ID": id,
                "NoiDungTraLoi": noiDungTraLoi,
                "TrangThai": Number(trangThai),
                "NgayTraLoi": formatDateToSearch(ngayTraLoi),
                "CoQuanTraLoi": coQuanTraLoi,
                "Loai": 0
            };

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))

            getDataWithApiFormData('PUT', `/api/FeedbackApi/Edit`, data)
                .then((data) => {
                    showNotification(1, message)

                    $('#modalDetail').modal('hide');
                    $(`#${idModal}`).modal('hide');

                    editorNoiDungEdit.setData('');
                    $('#reply-date').val(moment(new Date()).format('DD/MM/YYYY'));
                    $('#organization-reply').val('-1').trigger('change');

                    $('#dataGrid').DataTable().ajax.reload().draw();
                });
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }

    //xóa
    $('#dataGrid tbody').on('click', '.delete-command-btn', function () {
        var id = $('<div/>').html($(this).attr("id")).text().replace('n-', '');
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('.feedbackBox').addClass('d-none');
        $('.replyFeedbackBox').addClass('d-none');
        $('#idDelete').val(id);
        if (data != null && data.length > 0) {
            $('#nameDelete').text(`${data[0].noiDung}`);
        }
        
        $('#modalDelete').modal('show');
    });

    $(document).on('click', '#deleteBtn', function (ev) {
        ev.preventDefault();
        var id = $('#idEdit').val();
        var data = dtAjax.filter(e => e.id.toUpperCase() == id.toUpperCase());
        $('#idDelete').val(id);
        if (data != null && data.length > 0) {
            $('#nameDelete').text(`${data[0].noiDung}`);
        }
        $('#modalDelete').modal('show');
    });

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        let id = $('#idDelete').val();

        $.ajax({
            type: 'DELETE',
            async: false,
            url: `${baseUrl}/api/FeedbackApi/Delete?id=` + id,
            dataType: 'JSON',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.value != null) {
                    showNotification(1, "Xóa ý kiến thành công")
                    $('#modalDetail').modal('hide');
                    $('#modalDelete').modal('hide');
                    $('#dataGrid').DataTable().ajax.reload().draw();
                } else {
                    $('#modalDelete').modal('hide');
                    showNotification(0, "Lỗi! Xóa ý kiến thất bại")
                }
            },
            error: function (err) {
                $('#modalDelete').modal('hide');
                showNotification(0, "Lỗi!")
            }
        });
    }


    function OpenDetail(data) {
        $('.feedbackBox').removeClass('d-none');
        $('.replyFeedbackBox').addClass('d-none');
        if (checkEmptyBlank(data.dienThoai)) $('#sdtYKien').parent().addClass('d-none');
        else $('#sdtYKien').parent().removeClass('d-none');
        $('#nguoiGuiYKien').text(data.nguoiGui);
        $('#sdtYKien').text(data.dienThoai);
        $('#emailYKien').text(data.email);
        $('#ngayGuiYKien').text(moment(data.ngayTaoLap).format('DD/MM/YYYY'));
        trangThaiDes('trangThaiYKien', data.trangThai);
        $('#duLieuLQYKien').html('');
        if (data.tenBaiViet != null && data.tenBaiViet != '') {
            $('#baiVietLQYKien').html(`<span><i data-toggle="tooltip" class="icon-fluent icon_fluent_database_regular"></i>${data.tenBaiViet}</span>`);
            $('#baiVietLQYKien').removeClass('d-none');
        } else {
            $('#baiVietLQYKien').addClass('d-none');
        }
        
        if (data.noiDung != null && data.noiDung != '') {
            $('#yKienPhanHoiContent').html(data.noiDung);
            editorNoiDungEdit.setData(data.noiDungTraLoi);
        }

        $('#feedbackContent').html('');

        if (data.trangThai >= 1 && data.noiDungTraLoi != null && data.noiDungTraLoi != '') {
            $('#feedbackBox').removeClass('d-none');
            var nguoiTraLoi = '';
            var ngayTraLoi = '';
            if (data.coQuanTraLoi != null && data.coQuanTraLoi != "") {
                nguoiTraLoi = `<span class="info-feedback-item mb-0">
                                         <i class="icon-fluent icon_fluent_building_regular"></i>
                                         <span">${data.coQuanTraLoi}</span>
                                   </span>`;
            }

            if (data.ngayTraLoi != null && data.ngayTraLoi != "") {
                ngayTraLoi = `<span class="info-feedback-item">
                                    <i class="icon-fluent icon_fluent_calendar_ltr_regular"></i>
                                    <span>${moment(data.ngayTraLoi).format('DD/MM/YYYY')}</span>
                                </span>`;
            }
            $('#traLoiBox').html(nguoiTraLoi + ngayTraLoi);

            $('#feedbackContent').html(data.noiDungTraLoi);
        } else {
            $('#feedbackBox').addClass('d-none');
        }

        $('#groupFeedbackBtnBox').html('');
        $('#groupFeedbackBtnBox').html(listButtonBox(0, data.trangThai));

        $('#groupReplyBtnBox').html('');
        $('#groupReplyBtnBox').html(listButtonBox(1));

        $('#modalDetail').modal('show');
    }

    function listButtonBox(type, trangThai) {
        var buttonList = '';
        if (type == 0) {
            if (trangThai == 0) {
                buttonList = `<button id="replyBtn" type="button" class="btn btn-secondary">Trả lời</button>
                          <button id="publishBtn" type="button" class="btn btn-success">Công bố</button>`;
            } else if (trangThai == 1 || trangThai == 3) {
                buttonList = `<button id="publishBtn" type="button" class="btn btn-success">Công bố</button>`;
            } else if (trangThai == 2) {
                buttonList = `<button id="cancelBtn" type="button" class="btn btn-dark">Hủy công bố</button>`;
            }
            buttonList += `<button id="deleteBtn" type="button" class="btn btn-outline-danger">Xóa</button>
                       <button type="button" class="btn btn-outline-light" data-dismiss="modal">Trở về</button>`;
            return buttonList;
        }
        else if(type == 1){
            buttonList = `<button type="button" class="btn btn-outline-light" data-dismiss="modal">Hủy bỏ</button>
                            <button id="sendPublishBtn" type="button" class="btn btn-outline-success">Gửi phản hồi và công bố</button>
                            <button id="sendReplyBtn" type="button" class="btn btn-secondary">Gửi phản hồi</button>`;
            return buttonList;
        }
        else {
            buttonList = `<button type="button" class="btn btn-outline-light" data-dismiss="modal">Hủy bỏ</button>
                            <button id="saveBtn" type="button" class="btn btn-secondary">Lưu</button>`;
            return buttonList;
        }
    }

    function trangThaiDes(id, trangThai) {
        $(`#${id}`).html('');
        if (trangThai == 0) {
            $(`#${id}`).html('<i data-toggle="tooltip" class="icon-fluent icon_fluent_comment_regular text-yellow"></i> <span class="text-yellow">Đã tiếp nhận</span>');
        } else if (trangThai == 1) {
            $(`#${id}`).html('<i data-toggle="tooltip" class="icon-fluent icon_fluent_comment_edit_regular text-blue"></i> <span class="text-blue">Đã phản hồi</span>');
        } else if (trangThai == 2) {
            $(`#${id}`).html('<i data-toggle="tooltip" class="icon-fluent icon_fluent_comment_checkmark_regular text-success"></i> <span class="text-green">Đã công bố</span>');
        } else if (trangThai == 3) {
            $(`#${id}`).html('<i data-toggle="tooltip" class="icon-fluent icon_fluent_comment_dismiss_regular text-gray"></i> <span class="text-gray">Hủy công bố</span>');
        }
    }
});