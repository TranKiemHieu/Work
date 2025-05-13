
const baseUrl = getRootLink();

$(document).ready(function () {
    initSelect2();

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "ThietLapCH",
            "search": {
                "tuKhoa": tuKhoa,
            }
        };

        sessionStorage.setItem("filterData", JSON.stringify(save));
    };

    function buildData() {
        let tuKhoa = $('#tu-khoa-search').val();

        const request = {
            "tuKhoa": tuKhoa,
            "soLuong": 0
        };

        return JSON.stringify(request);
    };

    $('#tim-kiem').on('click', function () {
        saveFilter();
        initDataGrid();
    });

    $('#tu-khoa-search').on("keydown", function search(e) {
        if (e.keyCode == 13) {
            saveFilter();
            initDataGrid()
        }
    });
    

    initDataGrid();
    
    async function initDataGrid() {
        let dt = [];
        await getDataWithApi('POST', '/api/ThietLapCHApi/Gets', buildData()).then(data => {
            if (data && data.value.length > 0) {
                for (var i = 0; i < data.value.length; i++) {
                    data.value[i].Stt = i + 1;
                }
                dt = data.value;
            };
        })
        
        $('#treeView').dxTreeList({
            dataSource: dt,
            keyExpr: 'id',
            showRowLines: true,
            showBorders: true,
            columnAutoWidth: true,
            noDataText:"Không tìm thấy dữ liệu",
            paging: {
                enabled: true,
                pageSize: 10,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 15, 20, 25, 50, 100],
                showNavigationButtons: true,
                //displayMode: 'dropdown',
            },
            scrolling: {
                mode: 'standard',
            },
            columns: [{
                dataField: 'tenTieuChi',
                caption: 'Tên tiêu chí',
                validationRules: [{ type: 'required' }],
                width:500,
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                }
            }, {
                dataField: 'moTa',
                caption: 'Mô tả',
                validationRules: [{ type: 'required' }],
                width:500,
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                }
            }, {
                dataField: 'tenLoai',
                caption: 'Loại',
                validationRules: [{ type: 'required' }],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                }
            }, {
                dataField: 'suDung',
                caption: 'Sử dụng',
                width: 200,
                validationRules: [{ type: 'required' }],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                }
            },
            {

                caption: 'Chức năng',
                width: 150,
                type: 'buttons',
                buttons: [{
                    template: function (rowData) {
                        return $("<i type='button' data-toggle='tooltip' title='Chỉnh sửa'>").addClass("icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow").css({ "display": "inline-block", 'text-align': "center-align" });
                    },
                    onClick(e) {
                        $('#tcNameEdit').text(e.row.data.tenTieuChi);
                        $('#idEdit').val(e.row.data.id);
                        $('#modalEdit').modal('show');
                        $('#tenTCEdit').val(e.row.data.tenTieuChi);
                        $('#moTaEdit').val(e.row.data.moTa);
                        $('#loaiEdit').val(e.row.data.loai).trigger('change');
                        $('#useEdit').prop('checked', (e.row.data.suDung == 0 ? false : true));
                    },
                },
                {
                    template: function (data) {
                        return $("<i type='button' data-toggle='tooltip' title='Xóa'>").addClass("icon-fluent icon_fluent_delete_filled delete-command-btn text-red").css({ "display": "inline-block", 'text-align': "center-align" });
                    },
                    onClick(e) {
                        $('#idDelete').val(e.row.data.id);
                        $('#nameDelete').text(`${e.row.data.tenTieuChi}`);

                        $('#modalDelete').modal('show');
                    },
                }
                ],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                }
            },
            ],
            expandedRowKeys: [1, 2, 3, 4, 5],

        });

    };

    // set timeout
    setTimeout(() => {
        let htmlselect = '';
        $('.dx-page-sizes .dx-page-size').each(function () {
            let text = $(this).text();
            console.log(text);
            htmlselect += `<option value="${text}">${text}</option>`;
        });

        // append to .dx-widget by select option
        $('.dx-pager').prepend('<select class="form-control selectPageSizeDx" id="selectPageSize">' + htmlselect + '</select>');
    }, 100);

    // get event change select option #selectPageSize
    $(document).on('change', '#selectPageSize', function () {
        let value = $(this).val();
        $('.dx-page-sizes .dx-page-size').each(function () {
            if (value == $(this).text()) {
                $(this).click();
            }
        });
    });

    $(document).on('click', '#modalAdd [data-dismiss="modal"]', function () {
        $('#checkNameAdd').removeClass('show');
    })

    $(document).on('click', 'button[data-target="#modalAdd"]', function () {
        $('#checkNameAdd').removeClass('show');
    });

    $("#formAdd").submit(function (e) {
        e.preventDefault();
        dataAdd();
    });

    async function dataAdd() {
        const tenTCAdd = $('#tenTCAdd').val();
        const loaiAdd = $('#loaiAdd option:selected').val();
        const tenLoaiAdd = $('#loaiAdd option:selected').text();
        const moTaAdd = $('#moTaAdd').val();
        const useAdd = $('#useAdd').is(':checked');

        if (checkEmptyBlank(tenTCAdd)) {
            checkValidate('checkNameAdd', 'Vui lòng nhập tên tiêu chí!');
        }

        const data = await getDataWithApi('POST', '/api/ThietLapCHApi/Gets', JSON.stringify({ "TuKhoa": '' }));
        var dtAjax = data != null && data.value.length > 0 ? data.value : [];
        var isTrungName = dtAjax.filter(e => e.tenTieuChi.toLowerCase() === tenTCAdd.trim().toLowerCase());

        if (isTrungName.length > 0) {
            checkValidate('checkNameAdd', 'Tên view đã tồn tại');
        }

        if (isTrungName.length <= 0) {
            if (!checkEmptyBlank(tenTCAdd)) {
                const dt = {
                    "TenTieuChi": tenTCAdd.trim(),
                    "MoTa": moTaAdd.trim(),
                    "Loai": loaiAdd,
                    "TenLoai": tenLoaiAdd,
                    "SuDung": useAdd
                };

                $.ajax({
                    type: 'POST',
                    async: false,
                    url: `${baseUrl}/api/ThietLapCHApi/Add`,
                    data: JSON.stringify(dt),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        if (data.value != null && data.value != 0) {
                            showNotification(1, "Thêm mới view thành công")
                            $('#modalAdd').modal('hide');

                            $('#tenTCAdd').val("");
                            $('#moTaAdd').val("");
                            $('#loaiAdd').val('').trigger('change');
                            $('#useAdd').prop('checked', false);

                            location.reload();
                        } else {
                            showNotification(0, 'Lỗi! Thêm mới thất bại')
                        }
                    },
                    error: function (err) {
                        showNotification(0, 'Lỗi!')
                    }
                });
            }
        }
    }

    $("#formEdit").submit(function (e) {
        e.preventDefault();
        dataEdit();
    });

    async function dataEdit() {
        var id = $('#idEdit').val().trim();
        const tenTCEdit = $('#tenTCEdit').val();
        const loaiEdit = $('#loaiEdit option:selected').val();
        const tenLoaiEdit = $('#loaiEdit option:selected').text();
        const moTaEdit = $('#moTaEdit').val();
        const useEdit = $('#useEdit').is(':checked');

        if (checkEmptyBlank(tenTCEdit)) {
            checkValidate('checkNameEdit', 'Vui lòng nhập tên view!');
        }

        const data = await getDataWithApi('POST', '/api/ThietLapCHApi/Gets', JSON.stringify({ "TuKhoa": '' }));
        var dtAjax = data != null && data.value.length > 0 ? data.value : [];
        var isTrungName = dtAjax.filter(e => e.tenTieuChi.toLowerCase() === tenTCEdit.trim().toLowerCase() && e.id != Number(id));
        if (isTrungName.length > 0) {
            checkValidate('checkNameEdit', 'Tên view đã tồn tại');
        }

        if (isTrungName.length <= 0 && !checkEmptyBlank(tenTCEdit)) {
            const dt = {
                "ID": Number(id),
                "TenTieuChi": tenTCEdit.trim(),
                "MoTa": moTaEdit.trim(),
                "Loai": loaiEdit,
                "TenLoai": tenLoaiEdit,
                "SuDung": useEdit
            };

            $.ajax({
                type: 'PUT',
                async: false,
                url: `${baseUrl}/api/ThietLapCHApi/Edit`,
                data: JSON.stringify(dt),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    showNotification(1, "Cập nhật view thành công")
                    $('#modalEdit').modal('hide');

                    $('#tenTCEdit').val("");
                    $('#moTaEdit').val("");
                    $('#loaiEdit').val('').trigger('change');
                    $('#useEdit').prop('checked', false);

                    location.reload();
                },
                error: function (err) {
                    showNotification(0, 'Lỗi!')
                }
            });
        }
    }


    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        const id = $('#idDelete').val();

        if (id) {
            getDataWithApi('DELETE', `/api/ThietLapCHApi/Delete?id=${id}`)
                .then((data) => {
                    location.reload();
                });
        }
    }
});