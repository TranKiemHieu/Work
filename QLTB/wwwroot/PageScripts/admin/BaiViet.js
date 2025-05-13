const baseUrl = getRootLink();

$(document).ready(function () {
    
    const itemDropdownBoxRenderedHandler = (evt) => {
        const { itemData, itemElement } = evt;
        const [htmlElement] = itemElement;
        if (!itemData.isLeaf) {
            const checkBoxItem = htmlElement.parentNode.querySelector(".dx-checkbox");
            if (checkBoxItem) checkBoxItem.classList.add("dx-state-disabled");
            const treeViewItem =
                htmlElement.parentNode.querySelector(".dx-treeview-item");
            if (treeViewItem) treeViewItem.classList.add("dx-state-disabled");
        }
    };

    const syncTreeViewSelection = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };
    const dropdownBox = $("#chuyen-muc-search")
        .dxDropDownBox({
            dataSource: [],
            valueExpr: "id",
            displayExpr: "tenChuyenMuc",
            placeholder: "Chọn chuyên mục",
            showClearButton: true,
            //inputAttr: { "aria-label": "Owner" },
            elementAttr: {
                class: "form-control",
            },
            contentTemplate(e) {
                const $treeView = $("<div>").dxTreeView({
                    dataSource: e.component.getDataSource(),
                    dataStructure: "plain",
                    parentIdExpr: "chuyenMucCapChaID",
                    keyExpr: "id",
                    displayExpr: "tenChuyenMuc",
                    searchEnabled: true,
                    noDataText: "Không tìm thấy dữ liệu",
                    selectionMode: "single",
                    showCheckBoxesMode: "none",
                    selectNodesRecursive: false,
                    selectByClick: true,
                    onContentReady(args) {
                        const value = e.component.option("value");
                        syncTreeViewSelection(args.component, value);
                    },
                    onItemSelectionChanged(args) {
                        const selectedKeys = args.component.getSelectedNodeKeys();
                        e.component.option("value", selectedKeys);
                    },
                    onItemRendered: itemDropdownBoxRenderedHandler,
                });

                treeViewDropdownBox = $treeView.dxTreeView("instance");

                $treeView.find('.dx-treeview-search')[0].classList.add('border');
                $treeView.find('.dx-treeview-search')[0].classList.add('rounded');
                $treeView.find('.dx-searchbox.dx-editor-filled .dx-icon-search').css({
                    "right": "0"
                });

                e.component.on("valueChanged", (args) => {
                    syncTreeViewSelection(treeViewDropdownBox, args.value);
                    e.component.close();
                });

                return $treeView;
            },
        })
        .dxDropDownBox("instance");
    //getChuyenMucSelect();
    //initSelect2();
    //initDateTimePicker();

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();
        let chuyenMuc = dropdownBox.option('value');
        let tuNgay = $('#tu-ngay-search').val();
        let denNgay = $('#den-ngay-search').val();

        const save = {
            "type": "BaiViet",
            "search": {
                "tuKhoa": tuKhoa.trim(),
                "chuyenMuc": chuyenMuc != null ? chuyenMuc.toString() : null,
                "batDau": tuNgay,
                "ketThuc": denNgay
            }
        };

        sessionStorage.setItem("filterData", JSON.stringify(save));
    };

    $('#addBtn').on('click', function () {
        if (typeof addUrl !== 'undefined') {
            if (addUrl != null && addUrl != "") {
                location.href = addUrl;
            }
        };
    });

    function buildData() {
        let tuKhoa = $('#tu-khoa-search').val();
        let chuyenMuc = dropdownBox.option('value');
        let tuNgay = $('#tu-ngay-search').val();
        let denNgay = $('#den-ngay-search').val();

        const request = {
            "tuKhoa": tuKhoa,
            "chuyenMuc": chuyenMuc != null ? chuyenMuc.toString() : null,
            "batDau": formatDateToSearch(tuNgay),
            "ketThuc": formatDateToSearch(denNgay)
        };

        return JSON.stringify(request);
    };

    $('#tim-kiem').on('click', function () {
        saveFilter();
        $('#dataGrid').DataTable().ajax.reload().draw();
    });

    $('#tat-ca').on('click', function () {
        $('#tu-khoa-search').val("")
        dropdownBox.option('value', null);
        $('#tu-ngay-search').val("");
        $('#den-ngay-search').val("");
        $('#dataGrid').DataTable().ajax.reload().draw();

        saveFilter();
    });

    $('#tu-khoa-search').on("keydown", function search(e) {
        if (e.keyCode == 13) {
            saveFilter();
            $('#dataGrid').DataTable().ajax.reload().draw();
        }
    });

    const tableApi = {
        url: `${baseUrl}/api/BaiVietApi/Gets`,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: buildData,
        dataSrc: function (data) {
            if (data && data.value && data.value.length > 0) {
                for (let i = 0; i < data.value.length; i++) {
                    data.value[i].stt = i + 1;
                }

                return data.value;
            }

            return [];
        },
    };

    const tableDefs = [
        {
            targets: 1,
            render: function (data, type, row, meta) {
                return `<span class="detail-command-btn cursor-pointer" id=n-"${meta.row}">${data}</span>`;
            }
        },
        {
            targets: 3,
            render: function (data, type, row, meta) {
                if (data != null && data != "") {
                    return `<span>${formatShortDate(data)}</span>`;
                }

                return '<span></span>';
            }
        },
        {
            targets: 4,
            render: function (data, type, row, meta) {
                if (data != null && data != "") {
                    return `<span>${formatShortDate(data)}</span>`;
                }

                return '<span></span>';
            }
        },
        {
            targets: 5,
            render: function (data, type, row, meta) {
                if (data == 1) {
                    return `Công bố`;
                }
                return 'Không công bố';
            }
        },
        //{
        //    targets: 4,
        //    render: function (data, type, row, meta) {
        //        if (data == true) {
        //            return '<i class="icon-fluent icon_fluent_checkmark_filled text-green"></i>';
        //        }

        //        return '<span class="text-medium">-</span>';
        //    }
        //},
        {
            targets: 6,
            render: function (data, type, row, meta) {
                let html = '';
                if (canEdit && (row.isAuthorizeUser1 || row.isAuthorizeUser2)) {
                    html += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>`
                }

                if (canDelete && (row.isAuthorizeUser1 || row.isAuthorizeUser2)) {
                    html += `<i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id=n-"${meta.row}"></i>`
                }

                if (canApprove && row.isAuthorizeUser3) {
                    html += `<i data-toggle="tooltip" title="chưa làm" class="icon-fluent icon_fluent_checkbox_checked_filled checked-command-btn text-green" id=n-"${meta.row}"></i>`
                }

                return html;
            }
        }
    ];

    const tableCols = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "tieuDe", "width": "40%", "class": "left-align text-medium" },
        { "data": "tenChuyenMuc", "width": "18%", "class": "left-align" },
        { "data": "ngayCongBo", "width": "12%", "class": "center-align" },
        { "data": "hetHanCongBo", "width": "8%", "class": "center-align" },
        { "data": "trangThai", "width": "7%", "class": "center-align" },
        { "data": "id", "width": "10%", "class": "center-align group-icon-action" },
    ];

    if (!canEdit && !canDelete) {
        tableCols.pop();
        tableDefs.pop();
    }

    async function initTable() {
      
        getDataWithApi('GET', '/api/ChuyenMucApi/Select?flag=0')
            .then((data) => {
                if (data && data.value && data.value.length > 0) {
                    $("#chuyen-muc-search").dxDropDownBox("instance").option("dataSource", data.value);
                }
            })
            .then(() => {
                initSelect2();
                initDateTimePicker();
            })
            .then(() => {
                const preFilter = sessionStorage.getItem("filterData");

                if (preFilter != null && preFilter != "") {
                    const conv = JSON.parse(preFilter);

                    if (conv && conv.type && conv.type == "BaiViet") {
                        $('#tu-khoa-search').val(conv.search.tuKhoa);
                        $('#chuyen-muc-search').val(conv.search.chuyenMuc).trigger('change');
                        $('#tu-ngay-search').val(conv.search.batDau);
                        $('#den-ngay-search').val(conv.search.ketThuc);
                    }
                    else {
                        sessionStorage.setItem("filterData", null);
                    }
                };
            })
            .then(() => {
                initDataTableConfig('dataGrid', tableApi, tableDefs, tableCols);

                $('#dataGrid tbody').on('click', '.delete-command-btn', function () {
                    var id = $(this).attr("ID").match(/\d+/)[0];
                    var data = $('#dataGrid').DataTable().row(id).data();

                    $('#idDelete').val(data.id);
                    $('#nameDelete').text(`${data.tieuDe}`);

                    $('#modalDelete').modal('show');
                });

                $('#dataGrid tbody').on('click', '.edit-command-btn', function () {
                    var id = $(this).attr("ID").match(/\d+/)[0];
                    var data = $('#dataGrid').DataTable().row(id).data();

                    if (typeof editUrl !== 'undefined') {
                        if (editUrl != null && editUrl != "") {
                            location.href = editUrl + `?id=${data.id}`;
                        }
                    };
                });

                $('#dataGrid tbody').on('click', '.detail-command-btn', function () {
                    var id = $(this).attr("ID").match(/\d+/)[0];
                    var data = $('#dataGrid').DataTable().row(id).data();
                    $('#tinBaiDetail').empty();

                    let html = `<h4 class="news_title">${data.tieuDe}</h4>`;

                    if (!checkEmptyBlank(data.ngayCongBo)) {
                        html += `<p class="news_date">${formatDate(data.ngayCongBo)}</p>`;
                    }
                    if (!checkEmptyBlank(data.moTa)) {
                        html += `<p class="news_summary">${data.moTa}</p>`;
                    }

                    if (data.anhDaiDien != null && data.anhDaiDien != "") {
                        html += `<div class="news_img text-center">
                        <img class="news_thumb" src="${data.anhDaiDien}">
                    </div>`
                    }

                    if (!checkEmptyBlank(data.moTaAnhDaiDien)) {
                        html += `<p class="news_noteimg">${data.moTaAnhDaiDien}</p>`;
                    }

                    html += `<div class="news_content">${data.noiDung}</div>`;

                    if (!checkEmptyBlank(data.nguonTin)) {
                        html += `<p style="text-align: right" class="right-align">${data.nguonTin}</p>`;
                    }
                    $('#tinBaiDetail').append(html);

                    $('#modalDetail').modal('show');
                });
            });
    };

    initTable();

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        const id = $('#idDelete').val();

        if (id) {
            getDataWithApi('DELETE', `/api/BaiVietApi/Delete?id=${id}`)
                .then((data) => {
                  location.reload();
                });
        }
    }
});