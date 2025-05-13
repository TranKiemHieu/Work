const baseUrl = getRootLink();

$(document).ready(function () {
    //function getViewSelect() {
    //    $('#viewAdd').empty();
    //    $('#viewEdit').empty();
    //    getDataWithApi('POST', '/api/ViewApi/Gets', JSON.stringify({ "TuKhoa": '' }))
    //        .then((data) => {
    //            if (data && data.value.length > 0) {
    //                data.value.forEach((el) => {
    //                    $('#viewAdd').append(`<option value="${el.id}">${el.tenView}</option>`);
    //                    $('#viewEdit').append(`<option value="${el.id}">${el.tenView}</option>`);
    //                });
    //            }
    //        })
    //};
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

    

    const dropdownBoxSettings = $(".dropdownBoxItem")
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
        const data = await getDataWithApi('POST', '/api/ViewApi/Gets', JSON.stringify({ "TuKhoa": '' }))
        if (data && data.value && data.value.length > 0) {
            let response = data.value.filter(e => e.suDung == true);
            $("#viewAdd").dxDropDownBox("instance").option("dataSource", response);
            $("#viewEdit").dxDropDownBox("instance").option("dataSource", response);
        };
    };

    dtTieuChi = []
    async function getTieuChiSelect() {
        $('#tcAdd').empty();
        $('#tcEdit').empty();
        getDataWithApi('POST', '/api/ThietLapCHApi/Gets', JSON.stringify({ "TuKhoa": '' }))
            .then((data) => {
                if (data && data.value.length > 0) {
                    data.value.forEach((el) => {
                        $('#tcAdd').append(`<option value="${el.id}">${el.tenTieuChi}</option>`);
                        $('#tcEdit').append(`<option value="${el.id}">${el.tenTieuChi}</option>`);
                    });
                }
            })
        
        const tieuChi = await getDataWithApi('POST', '/api/ThietLapCHApi/Gets', JSON.stringify({ "TuKhoa": '' }));
        if (tieuChi != null && tieuChi.value.length > 0) {
            dtTieuChi = tieuChi.value;
            $('#tenTSAdd').val(dtTieuChi[0].moTa);
        }
    };

    getTieuChiSelect();
    initSelect2();

    dtAjax = []

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "ThongSoCH",
            "search": {
                "tuKhoa": tuKhoa,
                "soLuong": 0
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
        $('#dataGridSettings').DataTable().ajax.reload().draw();
    });

    $('#tu-khoa-search').on("keydown", function search(e) {
        if (e.keyCode == 13) {
            saveFilter();
            $('#dataGridSettings').DataTable().ajax.reload().draw();
        }
    });

    const tableData = {
        url: `${baseUrl}/api/ThongSoCHApi/Gets`,
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
            targets: 3,
            render: function (data, type, row, meta) {
                if (data == '0' || data == '1') {
                    return `<span class="text-left">${data == '1' ? 'true' : 'false'}</span>`;
                }
                return `<span class="multiline-ellipsis ellipsis-2-line">${data}</span>`;
            }
        },
        {
            targets: 5,
            render: function (data, type, row, meta) {
                let html = ""
                if (data == true) {
                    html = `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_checkmark_filled text-green" id=n-"${meta.row}"></i>`
                }
                return html
            }
        },
        {
            targets: 6,
            render: function (data, type, row, meta) {
                let html = ""
                if (canEdit == 1) {
                    html += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>`
                }
                if (canDelete == 1) {
                    html += `<i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id=n-"${meta.row}"></i>`;
                }
                return html
            }
        },
        {
            targets: 7,
            visible: false
        }
    ];

    const tableCols = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "tenThongSo", "width": "15%", "class": "left-align" },
        { "data": "tenLoai", "width": "7%", "class": "left-align" },
        { "data": "giaTriThietLap", "width": "20%", "class": "left-align" },
        { "data": "thuTuHienThi", "width": "7%", "class": "center-align" },
        { "data": "suDung", "width": "6%", "class": "center-align" },
        { "data": "id", "width": "10%", "class": "center-align group-icon-action" },
        { "data": "tenView", "width": "7%", "class": "left-align" },
    ];

    initDataTableRowGroupConfig('dataGridSettings', tableData, tableDefs, tableCols, 'tenView', 'tenViewCapCha', '')
    
    $(document).on('click', '#modalAdd [data-dismiss="modal"]', function () {
        $('#checkNameAdd').removeClass('show');
    })

    $(document).on('click', 'button[data-target="#modalAdd"]', function () {
        $('#checkNameAdd').removeClass('show');
    });

    $('#modalEdit').on('hidden.bs.modal', function (e) {
        $('#linkedDataEdit').val($('#dllkEdit').val()).trigger('change');
    })
    
    $('#tcAdd').change(function () {
        const dataTC = dtTieuChi.filter(x => x.id == Number(this.value));
        if (dataTC != null && dataTC.length > 0) {
            $('#tenTSAdd').val(dataTC[0].moTa);
            var linkID = dataTC[0].id == 26 ? 4 : (dataTC[0].id == 28 ? 5 : null);
            GetInputAddToForm('valueTSAdd', dataTC[0].loai, null, linkID);
            getLinkedSelect(Number(this.value))
            if (dataTC[0].loai == 10) {
                $('#linkedDataAdd').prop('disabled', false);
                if (dataTC[0].id == 26) {
                    $('#linkedDataAdd').val(4).trigger('change');
                }
                else if (dataTC[0].id == 28) {
                    $('#linkedDataAdd').val(5).trigger('change');
                }
                else {
                    $('#linkedDataAdd').val('').trigger('change');
                }
            }
            else {
                $('#linkedDataAdd').prop('disabled', true);
            }
        }
    });

    $('#tcEdit').change(function () {
        const dataTC = dtTieuChi.filter(x => x.id == Number(this.value));
        if (dataTC != null && dataTC.length > 0) {
            $('#tenTSEdit').val(dataTC[0].moTa);
            const dataTS = dtAjax.filter(x => x.id == $('#idEdit').val());
            var value = checkEmptyBlank($('#loaiEdit').val()) || $('#loaiEdit').val() != dataTC[0].loai ? null : dataTS[0].giaTriThietLap;
            if (dataTS != null && dataTS.length > 0) {
                var dlLK = null;
                if (dataTS[0].duLieuLienKet == 1) {
                    dlLK = dataTS[0].listChuyenMuc;
                }
                else if (dataTS[0].duLieuLienKet == 2) {
                    dlLK = dataTS[0].listBaiViet;
                }
                else if (dataTS[0].duLieuLienKet == 3) {
                    dlLK = dataTS[0].listMedia;
                }
                else if (dataTS[0].duLieuLienKet == 4) {
                    dlLK = dataTS[0].listViewType;
                }
                GetInputAddToForm('valueTSEdit', dataTC[0].loai, value, dataTS[0].duLieuLienKet, dlLK);
            }
            getLinkedSelect(Number(this.value))
            if (dataTC[0].loai == 10) {
                $('#linkedDataEdit').prop('disabled', false);
                $('#linkedDataEdit').val(dtTieuChi[0].id).trigger('change');
            }
            else {
                $('#linkedDataEdit').prop('disabled', true);
            }
        }
    });

    $('#linkedDataAdd').change(function () {
        getDataWithApi('GET', `/api/ThongSoCHApi/Select?linkedID=${Number(this.value) }`)
            .then((data) => {
                if (data != null && data.value != null) {
                    var dlLK = [];
                    if (Number(this.value) == 1) {
                        dlLK = data.value.listChuyenMuc;
                    }
                    else if (Number(this.value) == 2) {
                        dlLK = data.value.listBaiViet;
                    }
                    else if (Number(this.value) == 3) {
                        dlLK = data.value.listMedia;
                    }
                    else if (Number(this.value) == 4) {
                        dlLK = data.value.listViewType;
                    }
                    InputValueEvent('valueTSAdd', 10, Number(this.value), null, dlLK);
                }
            })
    });

    $('#linkedDataEdit').change(function () {
        if (checkEmptyBlank($('#dllkEdit').val()) || $('#dllkEdit').val() != Number(this.value)) {
            getDataWithApi('GET', `/api/ThongSoCHApi/Select?linkedID=${Number(this.value)}`)
                .then((data) => {
                    if (data != null && data.value.length > 0) {
                        var dlLK = [];
                        if (Number(this.value) == 1) {
                            dlLK = data.value.listChuyenMuc;
                        }
                        else if (Number(this.value) == 2) {
                            dlLK = data.value.listBaiViet;
                        }
                        else if (Number(this.value) == 2) {
                            dlLK = data.value.listMedia;
                        }
                        else if (Number(this.value) == 4) {
                            dlLK = data.value.listViewType;
                        }
                        InputValueEvent('valueTSEdit', 10, Number(this.value), null, dlLK);
                    }
                })
        }
    });

    $("#formAdd").submit(function (e) {
        e.preventDefault();
        dataAdd();
    });

    function dataAdd() {
        const tenTSAdd = $('#tenTSAdd').val();
        const viewAdd = $(`#viewAdd`).dxDropDownBox("instance").option('value');
        const tcAdd = $('#tcAdd option:selected').val();
        var giaTriAdd = null;
        const sttAdd = $('#sttAdd').val();
        const linkedDataAdd = $('#linkedDataAdd option:selected').val();
        const dataTC = !checkEmptyBlank(tcAdd)? dtTieuChi.filter(x => x.id == Number(tcAdd)) : null;
        if (dataTC != null && dataTC.length > 0 && dataTC[0].loai != 8 && dataTC[0].loai != 9) {
            giaTriAdd = GetValueInput('valueTSAdd', dataTC[0].loai, linkedDataAdd);
        }

        if (checkEmptyBlank(tenTSAdd)) {
            checkValidate('checkNameAdd', 'Vui lòng nhập tên thông số!');
        }

        if (checkEmptyBlank(sttAdd)) {
            checkValidate('checkSTTAdd', 'Vui lòng nhập số thứ tự!');
        }

        var isTrungName = dtAjax.filter(e => e.tenThongSo === tenTSAdd && e.maTieuChi == tcAdd && e.maView == viewAdd);

        if (isTrungName.length > 0) {
            checkValidate('checkNameAdd', 'Tên thông số đã tồn tại');
        }

        const fileDaiDien = GetValueInput('valueTSAdd', 8);
        const fileTepDinhKem = GetValueInput('valueTSAdd', 9);

        if (isTrungName.length <= 0) {
            if (!checkEmptyBlank(tenTSAdd) & !checkEmptyBlank(sttAdd)) {
                const dt = {
                    "TenThongSo": tenTSAdd.trim(),
                    "MaView": viewAdd[0],
                    "MaTieuChi": tcAdd,
                    "GiaTriThietLap": giaTriAdd,
                    "ThuTuHienThi": sttAdd,
                    "DuLieuLienKet": linkedDataAdd == '' ? null : linkedDataAdd
                };

                let data = new FormData();
                data.append("Data", JSON.stringify(dt))

                if (fileDaiDien.length > 0) {
                    data.append("AnhDaiDien", fileDaiDien[0])
                }
                if (fileTepDinhKem.length > 0) {
                    data.append("FileMedia", fileTepDinhKem[0])
                }

                getDataWithApiFormData('POST', `/api/ThongSoCHApi/Add`, data)
                    .then((data) => {
                        if (data) {
                            $('#tenTSAdd').val('');
                            $(`#viewAdd`).dxDropDownBox("instance").option('value', null);
                            $('#tcAdd').val('1').trigger('change');
                            $('#sttAdd').val('');
                            $('#linkedDataAdd').val('').trigger('change');
                            $('#txt-Add').val('');

                            $('#modalAdd').modal('hide');

                            $('#dataGridSettings').DataTable().ajax.reload().draw();
                        }
                    })
            }
        }
    }

    $('#dataGridSettings tbody').on('click', '.edit-command-btn', function () {
        var id = $(this).attr("ID").match(/\d+/)[0];
        var data = $('#dataGridSettings').DataTable().row(id).data();
        $('#idEdit').val(data.id);
        $('#loaiEdit').val(data.loai);
        $('#dllkEdit').val(data.duLieuLienKet);

        $('#tsNameEdit').text(data.tenThongSo);
        $('#modalEdit').modal('show');
        $('#tenTSEdit').val(data.tenThongSo);
        $(`#viewEdit`).dxDropDownBox("instance").option('value', data.maView);
        $('#tcEdit').val(data.maTieuChi).trigger('change');
        $('#linkedDataEdit').prop('disabled', data.loai == 10 ? false : true);
        $('#linkedDataEdit').val(data.duLieuLienKet).trigger('change');
        $('#sttEdit').val(data.thuTuHienThi);
        
    });

    $("#formEdit").submit(function (e) {
        e.preventDefault();
        dataEdit();
    });

    function dataEdit() {
        var id = $('#idEdit').val().trim();
        const tenTSEdit = $('#tenTSEdit').val();
        const viewEdit = $(`#viewEdit`).dxDropDownBox("instance").option('value');
        const tcEdit = $('#tcEdit option:selected').val();
        const linkedDataEdit = $('#linkedDataEdit option:selected').val();
        var giaTriEdit = '';
        const sttEdit = $('#sttEdit').val();
        if (!checkEmptyBlank($('#loaiEdit').val()) && $('#loaiEdit').val() != 8 && $('#loaiEdit').val() != 9) {
            giaTriEdit = GetValueInput('valueTSEdit', $('#loaiEdit').val(), linkedDataEdit);
        }
        if (checkEmptyBlank(tenTSEdit)) {
            checkValidate('checkNameEdit', 'Vui lòng nhập tên thông số!');
        }

        if (checkEmptyBlank(sttEdit)) {
            checkValidate('checkSTTEdit', 'Vui lòng nhập số thứ tự!');
        }

        var isTrungName = dtAjax.filter(e => e.tenThongSo === tenTSEdit && e.id != id && e.maTieuChi == tcEdit && e.maView == viewEdit);

        if (isTrungName.length > 0) {
            checkValidate('checkNameEdit', 'Tên thông số đã tồn tại');
        }

        const fileDaiDien = GetValueInput('valueTSEdit', 8);
        const fileTepDinhKem = GetValueInput('valueTSEdit', 9);

        if (isTrungName.length <= 0) {
            if (!checkEmptyBlank(tenTSEdit) & !checkEmptyBlank(sttEdit)) {
                const dt = {
                    "ID": id,
                    "TenThongSo": tenTSEdit.trim(),
                    "MaView": viewEdit.toString(),
                    "MaTieuChi": tcEdit,
                    "GiaTriThietLap": giaTriEdit,
                    "ThuTuHienThi": sttEdit,
                    "DuLieuLienKet": linkedDataEdit == '' ? null : linkedDataEdit
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
                            $('#modalEdit').modal('hide');

                            $('#tenTSEdit').val('');
                            $(`#viewEdit`).dxDropDownBox("instance").option('value', null);
                            $('#tcEdit').val('1').trigger('change');
                            $('#sttEdit').val('');
                            $('#linkedDataEdit').val('').trigger('change');
                            $('#txt-Edit').val('');

                            $('#dataGridSettings').DataTable().ajax.reload().draw();
                        }
                    })
            }
        }
    }

    $('#dataGridSettings tbody').on('click', '.delete-command-btn', function () {
        var id = $(this).attr("ID").match(/\d+/)[0];
        var data = $('#dataGridSettings').DataTable().row(id).data();

        $('#idDelete').val(data.id);
        $('#nameDelete').text(`${data.tenThongSo}`);

        $('#modalDelete').modal('show');
    });

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        const id = $('#idDelete').val();

        if (id) {
            getDataWithApi('DELETE', `/api/ThongSoCHApi/Delete?id=${id}`)
                .then((data) => {

                    $('#modalDelete').modal('hide');

                    $('#dataGridSettings').DataTable().ajax.reload().draw();
                });
        }
    }

    function getLinkedSelect(idTieuChi = null) {
        $('#linkedDataAdd').empty();
        $('#linkedDataEdit').empty();
        if (idTieuChi == 26) {
            $('#linkedDataAdd').append(`<option value="4">Kiểu View</option>`);
            $('#linkedDataEdit').append(`<option value="4">Kiểu View</option>`);
        } else if (idTieuChi == 28) {
            $('#linkedDataAdd').append(`<option value="5">Kiểu Layer</option>`);
            $('#linkedDataEdit').append(`<option value="5">Kiểu Layer</option>`);
        } else {
            $('#linkedDataAdd').append(`<option value="">Chọn</option>`);
            $('#linkedDataAdd').append(`<option value="1">Chuyên mục</option>`);
            $('#linkedDataAdd').append(`<option value="2">Bài viết</option>`);
            $('#linkedDataAdd').append(`<option value="3">Media</option>`);

            $('#linkedDataEdit').append(`<option value="">Chọn</option>`);
            $('#linkedDataEdit').append(`<option value="1">Chuyên mục</option>`);
            $('#linkedDataEdit').append(`<option value="2">Bài viết</option>`);
            $('#linkedDataEdit').append(`<option value="3">Media</option>`);
        }
    };
});