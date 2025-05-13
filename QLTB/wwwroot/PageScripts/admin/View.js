
const baseUrl = getRootLink();

$(document).ready(function () {
    let treeViewDropdownBox;
    let dataDropdown = [], dataDropdown_cmk = []

    const itemDropdownBoxRenderedHandler = (evt) => {
        const { itemData, itemElement } = evt;
        const [htmlElement] = itemElement;
        if (!itemData.isLeaf) {
            const checkBoxItem = htmlElement.parentNode.querySelector(".dx-checkbox");
            if (checkBoxItem) checkBoxItem.classList.add("dx-state-disabled");
            const treeViewItem =
                htmlElement.parentNode.querySelector(".dx-treeview-item");
            const treeViewItem1 =
                htmlElement.parentNode.querySelector(".dx-texteditor-input");
            console.log(treeViewItem1)
            // $('#viewAdd .dx-popup-content').css({ 'min-height': '120px' });
            //if (treeViewItem) treeViewItem.classList.add("dx-state-disabled");
        }
    };

    const syncTreeViewSelection = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };

    const dropdownBoxSettings = $(".dropdownBoxView")
        .dxDropDownBox({
            dataSource: [],
            valueExpr: "id",
            displayExpr: "tenView",
            placeholder: "Chọn view",
            showClearButton: true,
            elementAttr: {
                class: "form-control",
            },
            contentTemplate(e, container, contentElement) {
                const $treeView = $(`<div id="ddbContent">`).dxTreeView({
                    dataSource: e.component.getDataSource(),
                    dataStructure: "plain",
                    parentIdExpr: "viewCapChaID",
                    keyExpr: "id",
                    displayExpr: "tenView",
                    searchEnabled: true,
                    noDataText: "Không tìm thấy dữ liệu",
                    selectionMode: "single",
                    showCheckBoxesMode: "none",
                    selectNodesRecursive: false,
                    selectByClick: true,
                    onContentReady(args) {
                        const value = e.component.option("value");
                        if (value == null) {
                            var $content = $("<div>").appendTo(container[0]);
                            $content.css("min-height", "10px");
                        }
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

    initData()
    async function initData() {
        const data = await getDataWithApi('GET', '/api/ViewApi/Select?flag=0')
        if (data && data.value && data.value.length > 0) {
            let response = data.value.filter(e => e.suDung == true);
            $("#parentViewAdd").dxDropDownBox("instance").option("dataSource", response);
            $("#parentViewEdit").dxDropDownBox("instance").option("dataSource", response);
        };
    };

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "View",
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

    dtView = []
    async function initDataGrid() {
        let dt = [];
        await getDataWithApi('POST', '/api/ViewApi/Gets', buildData()).then(data => {
            if (data && data.value.length > 0) {
                for (var i = 0; i < data.value.length; i++) {
                    data.value[i].Stt = i + 1;
                }
                dt = data.value;
                dtView = data.value;
            };
        })

        $('#treeView').dxTreeList({
            dataSource: dt,
            keyExpr: 'id',
            parentIdExpr: 'viewCapChaID',
            showRowLines: true,
            showBorders: true,
            autoExpandAll: true, 
            columnAutoWidth: true,
            noDataText: "Không tìm thấy dữ liệu",
            paging: {
                enabled: true,
                pageSize: 100,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [20, 50, 100],
                showNavigationButtons: true
            },
            scrolling: {
                mode: 'standard',
            },
            columns: [{
                dataField: 'tenView',
                caption: 'Tên View',
                validationRules: [{ type: 'required' }],
                width: 500,
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
                width: 500,
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
                dataField: 'viewCapChaID',
                caption: 'View cấp cha',
                lookup: {
                    dataSource: {
                        store: dt,
                        sort: 'tenView',
                    },
                    valueExpr: 'id',
                    displayExpr: 'tenView',
                },
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
                    template: function (rowData, e) {
                        return $("<i type='button' data-toggle='tooltip' title='Sao chép'>").addClass("icon-fluent icon_fluent_copy_add_filled copy-command-btn text-blue").css({ "display": "inline-block", 'text-align': "center-align" });
                    },
                    onClick(e) {
                        $('#viewNameEdit').text('Sao chép view ' + e.row.data.tenView);
                        $('#idEdit').val(e.row.data.id);
                        $('#typeEdit').val(1);
                        $('#modalEdit').modal('show');
                        var isTrungName = dtView.filter(x => x.tenView.toLowerCase() === e.row.data.tenView.toLowerCase());
                        var name = isTrungName.length > 0 ? `${e.row.data.tenView}(${isTrungName.length})` : e.row.data.tenView;
                        var isTrungName1 = dtView.filter(x => x.tenView.indexOf('(') != -1);
                        if (isTrungName1.length > 0) {
                            $('#tenViewEdit').val(`${e.row.data.tenView}(${isTrungName1.length + 1})`);
                        } else {
                            $('#tenViewEdit').val(name);
                        }
                        $(`#parentViewEdit`).dxDropDownBox("instance").option('value', e.row.data.viewCapChaID);
                        $('#moTaEdit').val(e.row.data.moTa);
                        $('#urlEdit').val(e.row.data.duongDan);
                        $('#areaEdit').val(e.row.data.area);
                        $('#controllerEdit').val(e.row.data.controller);
                        $('#actionEdit').val(e.row.data.action);
                        $('#useEdit').prop('checked', (e.row.data.suDung == 0 ? false : true));
                    },
                }, {
                    template: function (rowData, e) {
                        if (e.data.listCauHinh.length > 0) {
                            return $("<i type='button' data-toggle='tooltip' title='Cấu hình'>").addClass("icon-fluent icon_fluent_settings_filled settings-command-btn text-grey").css({ "display": "inline-block", 'text-align': "center-align" });
                        }
                        return '';
                    },
                    onClick(e) {
                        $('#idView').val(e.row.data.id);
                        $('#nameView').text(e.row.data.tenView);
                        $('#modalSettings').modal('show');
                        LoadFormSetting(e.row.data.id);
                    },
                }, {
                    template: function (rowData) {
                        return $("<i type='button' data-toggle='tooltip' title='Chỉnh sửa'>").addClass("icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow").css({ "display": "inline-block", 'text-align': "center-align" });
                    },
                    onClick(e) {
                        $('#viewNameEdit').text('Cập nhật view ' + e.row.data.tenView);
                        $('#idEdit').val(e.row.data.id);
                        $('#typeEdit').val(0);
                        $('#modalEdit').modal('show');
                        $('#tenViewEdit').val(e.row.data.tenView);
                        $(`#parentViewEdit`).dxDropDownBox("instance").option('value', e.row.data.viewCapChaID);
                        $('#moTaEdit').val(e.row.data.moTa);
                        $('#urlEdit').val(e.row.data.duongDan);
                        $('#areaEdit').val(e.row.data.area);
                        $('#controllerEdit').val(e.row.data.controller);
                        $('#actionEdit').val(e.row.data.action);
                        $('#useEdit').prop('checked', (e.row.data.suDung == 0 ? false : true));
                    },
                },
                {
                    template: function (data, e) {
                        var listSuDung = dtView.filter(t => t.viewCapChaID == e.data.id && t.suDung == true);
                        if (listSuDung.length == 0 && e.data.suDung == false) {
                            return $("<i type='button' data-toggle='tooltip' title='Xóa'>").addClass("icon-fluent icon_fluent_delete_filled delete-command-btn text-red").css({ "display": "inline-block", 'text-align': "center-align" });
                        }
                        return '';
                    },
                    onClick(e) {
                        $('#idDelete').val(e.row.data.id);
                        $('#nameDelete').text(`${e.row.data.tenView}`);

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

    function dataAdd() {
        const tenViewAdd = $('#tenViewAdd').val();
        const parentViewAdd = $(`#parentViewAdd`).dxDropDownBox("instance").option('value');
        const moTaAdd = $('#moTaAdd').val();
        const urlAdd = $('#urlAdd').val();
        const areaAdd = $('#areaAdd').val();
        const controllerAdd = $('#controllerAdd').val();
        const actionAdd = $('#actionAdd').val();
        const useAdd = $('#useAdd').is(':checked');

        if (checkEmptyBlank(tenViewAdd)) {
            checkValidate('checkNameAdd', 'Vui lòng nhập tên view!');
        }

        var isTrungName = dtView.filter(e => e.tenView.toLowerCase() === tenViewAdd.toLowerCase());

        if (isTrungName.length > 0) {
            checkValidate('checkNameAdd', 'Tên view đã tồn tại');
        }

        if (isTrungName.length <= 0) {
            if (!checkEmptyBlank(tenViewAdd)) {
                const dt = {
                    "TenView": tenViewAdd.trim(),
                    "MoTa": moTaAdd.trim(),
                    "DuongDan": urlAdd.trim(),
                    "Area": areaAdd.trim(),
                    "Controller": controllerAdd.trim(),
                    "Action": actionAdd.trim(),
                    "ViewCapChaID": parentViewAdd != null ? parentViewAdd.toString() : null,
                    "SuDung": useAdd,
                };

                $.ajax({
                    type: 'POST',
                    async: false,
                    url: `${baseUrl}/api/ViewApi/Add`,
                    data: JSON.stringify(dt),
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        if (data.value != null && data.value != 0) {
                            showNotification(1, "Thêm mới view thành công")
                            $('#modalAdd').modal('hide');

                            $('#tenViewAdd').val("");
                            $('#moTaAdd').val("");
                            $('#urlAdd').val("");
                            $('#areaAdd').val("");
                            $('#controllerAdd').val("");
                            $('#actionAdd').val("");
                            $(`#parentViewAdd`).dxDropDownBox("instance").option('value', null);
                            $('#useAdd').prop('checked', false);

                            initDataGrid();
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
        if ($('#typeEdit').val() == '1') {
            dataDupllicate();
        }
        else {
            dataEdit();
        }
    });

    async function dataEdit() {
        var id = $('#idEdit').val().trim();
        const tenViewEdit = $('#tenViewEdit').val();
        const parentViewEdit = $(`#parentViewEdit`).dxDropDownBox("instance").option('value');
        const moTaEdit = $('#moTaEdit').val();
        const urlEdit = $('#urlEdit').val();
        const areaEdit = $('#areaEdit').val();
        const controllerEdit = $('#controllerEdit').val();
        const actionEdit = $('#actionEdit').val();
        const useEdit = $('#useEdit').is(':checked');

        if (checkEmptyBlank(tenViewEdit)) {
            checkValidate('checkNameEdit', 'Vui lòng nhập tên view!');
        }

        var isTrungName = dtView.filter(e => e.tenView.toLowerCase() === tenViewEdit.toLowerCase() && e.id != Number(id) && e.viewCapChaID.toString() == parentViewEdit);

        if (isTrungName.length > 0) {
            checkValidate('checkNameEdit', 'Tên view đã tồn tại');
        }

        if (isTrungName.length <= 0 && !checkEmptyBlank(tenViewEdit)) {
            const dt = {
                "ID": Number(id),
                "TenView": tenViewEdit.trim(),
                "MoTa": moTaEdit.trim(),
                "DuongDan": urlEdit.trim(),
                "Area": areaEdit.trim(),
                "Controller": controllerEdit.trim(),
                "Action": actionEdit.trim(),
                "ViewCapChaID": parentViewEdit != null ? parentViewEdit.toString() : null,
                "SuDung": useEdit,
            };

            $.ajax({
                type: 'PUT',
                async: false,
                url: `${baseUrl}/api/ViewApi/Edit`,
                data: JSON.stringify(dt),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    showNotification(1, "Cập nhật view thành công")
                    $('#modalEdit').modal('hide');

                    $('#tenViewEdit').val("");
                    $('#moTaEdit').val("");
                    $('#urlEdit').val("");
                    $('#areaEdit').val("");
                    $('#controllerEdit').val("");
                    $('#actionEdit').val("");
                    $(`#parentViewEdit`).dxDropDownBox("instance").option('value', null);
                    $('#useEdit').prop('checked', false);

                    initDataGrid();
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
            getDataWithApi('DELETE', `/api/ViewApi/Delete?id=${id}`)
                .then((data) => {
                    $('#modalDelete').modal('hide');
                    initDataGrid();
                });
        }
    }

    //thiết lập cấu hình
    async function LoadFormSetting(id) {
        const dlLK = await getDataWithApi('GET', `/api/ThongSoCHApi/Select?linkedID=${1}`);

        var data = dtView != null && dtView.length > 0 ? dtView.filter(x => x.id == id) : null;

        if (data != null && data.length > 0 && data[0].listCauHinh.length > 0) {
            $('#slTSView').val(data[0].listCauHinh.length);
            $('#formSettings .modal-body').empty();

            data[0].listCauHinh.forEach(el => {
                var html = `<div class="form-group settings-item" id="settings-${data[0].listCauHinh.indexOf(el)}" data-id="${el.id}" data-view=${el.maView}></div>`;
                $('#formSettings .modal-body').append(html);
            })

            data[0].listCauHinh.forEach(el => {
                var dataLK = null;
                if (el.loai == 10) {
                    if (el.duLieuLienKet == '1') {
                        if (dlLK != null && dlLK.value != null && dlLK.value.listChuyenMuc.length > 0) {
                            dataLK = dlLK.value.listChuyenMuc;
                        }
                    }
                    else if (el.duLieuLienKet == '2') dataLK = el.listBaiViet;
                    else if (el.duLieuLienKet == '3') dataLK = el.listMedia;
                    else if (el.duLieuLienKet == '4') dataLK = el.listViewType;
                }
                var id = `settings-${data[0].listCauHinh.indexOf(el)}`;
                GetInputAddToForm(id, el.loai, el.giaTriThietLap, el.duLieuLienKet, dataLK, el.tenThongSo);
            })
        }
    }

    $("#formSettings").submit(function (e) {
        e.preventDefault();
        var view = dtView.filter(x => x.id == $('#idView').val());
        var dtTS = view != null && view.length > 0 ? view[0].listCauHinh : null;

        if (dtTS != null && dtTS.length > 0) {
            dtTS.forEach(t => {
                var i = dtTS.indexOf(t);
                
                if (t.loai == 8) {
                    var preImg = $(`#edt-settings-${i}-ImgEdit img`).attr('src');
                    if (checkEmptyBlank(preImg) || t.giaTriThietLap != preImg) {
                        dataSettings(t, null, GetValueInput(`settings-${i}`, 8), [], true);
                    }
                } else if (t.loai == 9) {
                    var preFile = $(`#preFile`).val();
                    if (checkEmptyBlank(preFile) || t.giaTriThietLap != preFile) {
                        dataSettings(t, null, [], GetValueInput(`settings-${i}`, 9), false, true);
                    }
                } else {
                    dataSettings(t, GetValueInput(`settings-${i}`, t.loai, t.duLieuLienKet), [], [], true, true);
                }
            })
        }
    });

    function dataSettings(dtTS, giaTriSettings, fileDaiDien, fileTepDinhKem, isXoaAnh = false, isXoaFile = false) {
        const dt = {
            "ID": dtTS.id,
            "TenThongSo": dtTS.tenThongSo,
            "MaView": dtTS.maView,
            "MaTieuChi": dtTS.maTieuChi,
            "GiaTriThietLap": giaTriSettings,
            "ThuTuHienThi": dtTS.thuTuHienThi,
            "DuLieuLienKet": dtTS.duLieuLienKet,
            "PreAnhDaiDien": isXoaAnh ? null : dtTS.giaTriThietLap,
            "XoaDaiDien": isXoaAnh,
            "PreFile": isXoaFile ? null : dtTS.giaTriThietLap,
            "XoaFile": isXoaFile
        };

        let data = new FormData();
        data.append("Data", JSON.stringify(dt))

        if (fileDaiDien.length > 0) {
            data.append("AnhDaiDien", fileDaiDien[0])
        }
        if (fileTepDinhKem.length > 0) {
            data.append("FileMedia", fileTepDinhKem[0])
        }

        getDataWithApiFormData('PUT', `/api/ThongSoCHApi/Edit`, data)
            .then((data) => {
                if (data) {
                    $('#modalSettings').modal('hide');

                    //$('#tenTSEdit').val("");
                    //$('#viewEdit').val($('#viewEdit option').first().val()).trigger('change');
                    //$('#tcEdit').val($('#tcEdit option').first().val()).trigger('change');
                    //$('#valueEdit').val("");
                    initDataGrid();
                }
            })
    }

    async function dataDupllicate() {
        var id = $('#idEdit').val().trim();
        const tenViewEdit = $('#tenViewEdit').val();
        const parentViewEdit = $(`#parentViewEdit`).dxDropDownBox("instance").option('value');
        const moTaEdit = $('#moTaEdit').val();
        const urlEdit = $('#urlEdit').val();
        const areaEdit = $('#areaEdit').val();
        const controllerEdit = $('#controllerEdit').val();
        const actionEdit = $('#actionEdit').val();
        const useEdit = $('#useEdit').is(':checked');

        if (checkEmptyBlank(tenViewEdit)) {
            checkValidate('checkNameEdit', 'Vui lòng nhập tên view!');
        }

        var isTrungName = dtView.filter(e => e.tenView.toLowerCase() === tenViewEdit.toLowerCase() && e.id != Number(id) && e.viewCapChaID.toString() == parentViewEdit);
        if (isTrungName.length > 0) {
            checkValidate('checkNameEdit', 'Tên view đã tồn tại');
        }

        if (isTrungName.length <= 0 && !checkEmptyBlank(tenViewEdit)) {
            const dt = {
                "ID": id,
                "TenView": tenViewEdit.trim(),
                "MoTa": moTaEdit.trim(),
                "DuongDan": urlEdit.trim(),
                "Area": areaEdit.trim(),
                "Controller": controllerEdit.trim(),
                "Action": actionEdit.trim(),
                "ViewCapChaID": parentViewEdit != null ? parentViewEdit.toString() : null,
                "SuDung": useEdit,
            };

            $.ajax({
                type: 'POST',
                async: false,
                url: `${baseUrl}/api/ViewApi/Dupplicate`,
                data: JSON.stringify(dt),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.value != null && data.value != 0) {
                        showNotification(1, "Thêm mới view thành công!")
                        $('#modalEdit').modal('hide');

                        $('#tenViewEdit').val("");
                        $('#moTaEdit').val("");
                        $('#urlEdit').val("");
                        $('#areaEdit').val("");
                        $('#controllerEdit').val("");
                        $('#actionEdit').val("");
                        $(`#parentViewEdit`).dxDropDownBox("instance").option('value', null);
                        $('#useEdit').prop('checked', false);

                        initDataGrid();
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
});