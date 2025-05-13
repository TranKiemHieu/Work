const baseUrl = getRootLink();
var today = new Date().toLocaleString();
var dataMedia = []; dataBaiViet = []; dataTLQ = [];
var dataMediaDelete = []; dataTinLQDelete = []
editorNoiDungEdit = CKEDITOR.replace('noiDungEdit', {
    language: 'vi-vn',
    extraPlugins: 'confighelper',
    placeholder: 'Nhập nội dung',
    //toolbar: "Full",
    filebrowserUploadUrl: '/File/UploadAdapter?subDirectory=BaiViet',
    filebrowserImageUploadUrl: '/File/UploadAdapter?subDirectory=BaiViet&type=img',
    clipboard_handleImages: false,
});

$(document).ready(function () {
    initSelect2();
    initDateTimePicker();

    let treeViewDropdownBox, treeViewDropdownBox_cmk;
    let dataDropdown = [], dataDropdown_cmk = []

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

    const syncTreeViewSelection_cmk = function (treeViewInstance1, value) {
        if (!value) {
            treeViewInstance1.unselectAll();
            return;
        }

        value.forEach((key) => {
            treeViewInstance1.selectItem(key);
        });
    };

    const dropdownBox = $("#dropdownBox")
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


    const dropdownBox_cmk = $('#dropdownBox_cmk').dxDropDownBox({
        dataSource: [],
        valueExpr: 'id',
        displayExpr: 'tenChuyenMuc',
        placeholder: 'Chọn chuyên mục khác',
        showClearButton: true,
      //  inputAttr: { 'aria-label': 'Owner' },
        contentTemplate(e) {
           
            const $treeView = $('<div>').dxTreeView({
                dataSource: e.component.getDataSource(),
                dataStructure: 'plain',
                keyExpr: 'id',
                parentIdExpr: 'chuyenMucCapChaID',
                noDataText: "Không tìm thấy dữ liệu",
                selectionMode: 'multiple',
                displayExpr: 'tenChuyenMuc',
                searchEnabled: true,
                selectByClick: true,
                onContentReady(args) {
                    const v = e.component.option('value');
                    syncTreeViewSelection_cmk(args.component, v);
                },
                selectNodesRecursive: false,
                showCheckBoxesMode: 'normal',
                onItemSelectionChanged(args) {
                    const selectedKeys = args.component.getSelectedNodeKeys();
                    e.component.option('value', selectedKeys);
                },
            });

            treeViewDropdownBox_cmk = $treeView.dxTreeView('instance');

            $treeView.find('.dx-treeview-search')[0].classList.add('border');
            $treeView.find('.dx-treeview-search')[0].classList.add('rounded');
            $treeView.find('.dx-searchbox.dx-editor-filled .dx-icon-search').css({
                "right": "0"
            });

            e.component.on('valueChanged', (args) => {
                const { value } = args;
                syncTreeViewSelection_cmk(treeViewDropdownBox_cmk, value);
            });

            return $treeView;
        },
    });
    function initEdit(id) {
        getDataWithApi('GET', `/api/BaiVietApi/Get?id=${id}`)
            .then((data) => {
                if (data && data.value) {
                    const dt = data.value;

                    $('#idEdit').val(dt.id);
                    $('#tieuDeEdit').val(dt.tieuDe);
                    $('#moTaEdit').val(dt.moTa);
                    $('#moTaAnhDaiDienEdit').val(dt.moTaAnhDaiDien);
                    $('#tomTatEdit').val(dt.tomTat);
                    $('#nguonTinEdit').val(dt.nguonTin);
                    $('#tacGiaEdit').val(dt.tacGia);
                    $('#tacQuyenEdit').val(dt.tacQuyen);
                    $('#tuKhoaEdit').val(dt.tuKhoa);
                    if (dt.tieuDiem == true) {
                        $('#tieuDiemEdit').prop("checked", true)
                    } else {
                        $("#tieuDiemEdit").prop("checked", false)
                    }
                    if (dt.trangThai == true) {
                        $('#trangThaiEdit1').prop("checked", true);
                        $('#trangThaiEdit0').prop("checked", false);
                    }
                    else {
                        $('#trangThaiEdit1').prop("checked", false);
                        $('#trangThaiEdit0').prop("checked", true);
                    }

                    $('#ngayCongBoEdit').val(formatDate(dt.ngayCongBo));
                    $('#hetHanCongBoEdit').val(formatDate(dt.hetHanCongBo));

                    $('#anhDaiDienPreEdit').val(dt.anhDaiDien);
                    if (dt.anhDaiDien != null && dt.anhDaiDien != "") {
                        $('#anhDaiDienImgDelete').removeClass('d-none');
                        $('#anhDaiDienImgEdit img').removeClass("cursor-pointer");
                        $('#anhDaiDienImgEdit img').attr("src", `${dt.anhDaiDien}`);
                    }

                    $('#thumbnailPreEdit').val(dt.thumbnail);
                    if (dt.thumbnail != null && dt.thumbnail != "") {
                        $('#thumbnailDelete').removeClass('d-none');
                        $('#thumbnailImgEdit img').removeClass("cursor-pointer");
                        $('#thumbnailImgEdit img').attr("src", `${dt.thumbnail}`);
                    }


                    if (dt.chuyenMucKhacID != null) {
                        $("#dropdownBox_cmk").dxDropDownBox("instance").option('value', dt.chuyenMucKhacID.toLowerCase().split(","));
                    }
                    $("#dropdownBox").dxDropDownBox('option', 'value', [dt.chuyenMucID])
                    editorNoiDungEdit.setData(dt.noiDung);

                    $('#dienThoaiEdit').val(dt.dienThoai);
                    $('#emailEdit').val(dt.email);
                    $('#gioMoCuaEdit').val(dt.gioMoCua);
                    $('#gioDongCuaEdit').val(dt.gioDongCua);
                    $('#diaChiEdit').val(dt.diaChi);
                    $('#websiteEdit').val(dt.website);
                    $('#toaDoX').val(dt.toaDoX);
                    $('#toaDoY').val(dt.toaDoY);
                }
            })
    };

    async function initData() {
        $('#chuyenMucEdit').empty();

        $('#chuyenMucEdit').append(`<option value="-1">Chọn chuyên mục</option>`);

        const data = await getDataWithApi('GET', '/api/ChuyenMucApi/Select?flag=0')
        if (data && data.value && data.value.length > 0) {
            dataDropdown = data.value.filter(e => e.suDung == true && e.isSelected == true);
            dataDropdown_cmk = data.value.filter(e => e.suDung == true && e.isSelected == true);

            let response = data.value.filter(e => e.suDung == true && e.isSelected == true);
            //add data into dropdowns
           // dropdownBox.option("items", dataDropdown);
            $("#dropdownBox").dxDropDownBox("instance").option("dataSource", response);
            $("#dropdownBox_cmk").dxDropDownBox("instance").option("dataSource", response);

        };
        
        if (typeof editId !== 'undefined') {
            if (editId != null && editId != "") {
                initEdit(editId);
                //media
                getDataWithApi("GET", `/api/MediaApi/GetByBaiViet/${editId}`).then((result) => {
                    if (result && result.value && result.value.length > 0) {
                        for (var i = 0; i < result.value.length; i++) {
                            result.value[i].stt = i + 1;
                            result.value[i].ID = result.value[i].id;
                            result.value[i].BaiVietID = result.value[i].baiVietID;
                            result.value[i].TenFileMedia = result.value[i].tenFileMedia;
                            result.value[i].TieuDe = result.value[i].tieuDe;
                            result.value[i].MoTa = result.value[i].moTa;
                            result.value[i].LoaiFileMedia = result.value[i].loaiFileMedia;
                            result.value[i].ThuTu = result.value[i].thuTuHienThi;

                            var formData = new FormData()
                            formData.append("Data", JSON.stringify(result.value[i]))
                            dataMedia.push(formData);

                            $("#dataGrid").DataTable().rows.add([result.value[i]]);
                            $("#dataGrid").DataTable().draw(); // Redraw the DataTable
                        }
                    }
                })
                //tinlq
                getDataWithApi("GET", `/api/TinLienQuanApi/GetByBaiViet/${editId}`).then((result) => {
                    if (result && result.value && result.value.length > 0) {
                        for (var i = 0; i < result.value.length; i++) {
                            result.value[i].stt = i + 1;
                            result.value[i].BaiVietID = result.value[i].baiVietID;
                            result.value[i].ID = result.value[i].id;
                            result.value[i].BaiVietLienQuanID = result.value[i].baiVietLienQuanID;
                            result.value[i].TieuDe = result.value[i].tieuDe;
                            result.value[i].ChuyenMuc = result.value[i].tenChuyenMuc;
                            result.value[i].TacGia = result.value[i].tacGia;
                            result.value[i].TrangThai = result.value[i].trangThai;


                            dataTLQ.push(result.value[i])

                            $("#dataGridTinLQ").DataTable().rows.add([result.value[i]]);
                            $("#dataGridTinLQ").DataTable().draw(); // Redraw the DataTable
                        }
                    }
                })
            }
        };
    };

    CKEDITOR.on('instanceReady', function () {
        initData();
    });

    // xóa ảnh đại diên và thumbnail
    $('#thumbnailDelete').on('click', function () {
        $('#idDeleteImg').val(editId);
        $('#idDeleteType').val(1);

        $('#modalDeleteImg').modal('show');
    });


    $('#anhDaiDienImgDelete').on('click', function () {
        $('#idDeleteImg').val(editId);
        $('#idDeleteType').val(0);

        $('#modalDeleteImg').modal('show');
    });

    $('#anhDaiDienImgEdit > img').on('click', function () {
        $('#anhDaiDienEdit').click();
    });

    $('#anhDaiDienEdit').on('change', function () {
        previewImgUpload(this, 'anhDaiDienImgEditPreview', 'anhDaiDienImgEdit');
    });

    $("#formDeleteImg").submit(function (e) {
        e.preventDefault();
        dataDeleteImg();
    });
    function dataDeleteImg() {
        const id = $('#idDeleteImg').val();
        const type = $('#idDeleteType').val();

        if (id) {
            const dt = {
                "ID": id,
                "Type": Number(type)
            };

            getDataWithApi('POST', `/api/BaiVietApi/DeleteImg`, JSON.stringify(dt))
                .then((data) => {
                    if (type == 0) {
                        $('#anhDaiDienImgEdit img').attr("src", "/assets/images/icons/imageUpload.png");
                        $('#anhDaiDienImgEdit img').addClass("cursor-pointer");
                        if (!($('#anhDaiDienImgDelete').hasClass('d-none'))) {
                            $('#anhDaiDienImgDelete').addClass('d-none')
                        };

                        $('#anhDaiDienDeleteEdit').val('1');
                    }
                    else {
                        $('#thumbnailImgEdit img').attr("src", "/assets/images/icons/imageUpload.png");
                        $('#thumbnailImgEdit img').addClass("cursor-pointer");
                        if (!($('#thumbnailDelete').hasClass('d-none'))) {
                            $('#thumbnailDelete').addClass('d-none')
                        };

                        $('#thumbnailDeleteEdit').val('1');
                    }

                    $('#modalDeleteImg').modal('hide');
                });
        }
    }

    $('#thumbnailImgEdit > img').on('click', function () {
        $('#thumbnailEdit').click();
    });

    $('#thumbnailEdit').on('change', function () {
        previewImgUpload(this, 'thumbnailEditPreview', 'thumbnailImgEdit');
    });
    //end thumbnail
    $("#luu").on('click' ,function () {
        if (typeof editId !== 'undefined') {
            if (editId != null && editId != "") {
                dataEdit();
            }
            else {
                dataAdd();
            }
        }
        else {
            dataAdd();
        }
    });
 
    function dataAdd() {
        const tieuDe = $('#tieuDeEdit').val();
        const chuyenMucID = dropdownBox.option('value');
        const chuyenMucKhacID = $("#dropdownBox_cmk").dxDropDownBox("instance").option('value')
        let moTaAnhDaiDien = $('#moTaAnhDaiDienEdit').val();
        const tieuDiem = $('input[name="tieuDiemEdit"]:checked').val();
        let tomTat = $('#tomTatEdit').val();
        const noiDung = editorNoiDungEdit.getData();
        const nguonTin = $('#nguonTinEdit').val();
        const tacGia = $('#tacGiaEdit').val();
        const tacQuyen = $('#tacQuyenEdit').val();
        const tuKhoa = $('#tuKhoaEdit').val();
        const ngonNgu = $('#ngonNguEdit').val();
        const ngayCongBo = $('#ngayCongBoEdit').val();
        const hetHanCongBo = $('#hetHanCongBoEdit').val();
        let trangThai = $('input[name="trangThaiEdit"]:checked').val();
        let dienThoai = $('#dienThoaiEdit').val();
        let email = $('#emailEdit').val();
        let gioMoCua = $('#gioMoCuaEdit').val();
        let gioDongCua = $('#gioDongCuaEdit').val();
        let diaChi = $('#diaChiEdit').val();
        let website = $('#websiteEdit').val();
        let toaDoX = $('#toaDoX').val();
        let toaDoY = $('#toaDoY').val();
      
        if (ngayCongBo != null && ngayCongBo != "") {
            ngayCongBoFormat = formatDateToSend(ngayCongBo);
        }

        const fileDaiDien = $('#anhDaiDienEdit').get(0).files;
        const fileThumbnail = $('#thumbnailEdit').get(0).files;

        const cmID = chuyenMucID != null ? chuyenMucID : [];
        const cmkID = chuyenMucKhacID != null ? chuyenMucKhacID : [];

        if (!checkEmptyBlank(tieuDe) && chuyenMucID != undefined && !checkEmptyBlank(noiDung)) {
            if (email.trim() != "" && !checkEmail(email)) {
                showNotification(0, "Địa chỉ email không hợp lệ")
                return;
            }
            if (website.trim() != "" && !checkURL(website)) {
                showNotification(0, "Địa chỉ website không hợp lệ")
                return;
            }
            const dt = {
                "TieuDe": tieuDe,
                "ChuyenMucID": cmID.toString(),
                "ChuyenMucKhacID": cmkID.toString(),
                "MoTaAnhDaiDien": moTaAnhDaiDien,
                "TieuDiem": tieuDiem == undefined ? 0 : 1,
                "TomTat": tomTat,
                "NoiDung": noiDung,
                "NguonTin": nguonTin,
                "TacGia": tacGia,
                "TacQuyen": tacQuyen,
                "TuKhoa": tuKhoa,
                "NgonNgu": ngonNgu,
                "NgayCongBo": (ngayCongBo != null && ngayCongBo) != "" ? formatDateToSend(ngayCongBo) : null,
                "HetHanCongBo": (hetHanCongBo != null && hetHanCongBo) != "" ? formatDateToSend(hetHanCongBo) : null,
                "TrangThai": Number(trangThai),
                "URLBaiViet": `${ConvertTitleToUrl(tieuDe)}-${formatDateCurrent()}`,
                "DienThoai": dienThoai.trim(),
                "Email": email.trim(),
                "GioMoCua": gioMoCua,
                "GioDongCua": gioDongCua,
                "DiaChi": diaChi.trim(),
                "Website": website.trim(),
                "ToaDoX": Number(toaDoX),
                "ToaDoY": Number(toaDoY)
            };

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))

            if (fileDaiDien.length > 0) {
                data.append("AnhDaiDien", fileDaiDien[0])
            }
            if (fileThumbnail.length > 0) {
                data.append("Thumbnail", fileThumbnail[0])
            }

            getDataWithApiFormData('POST', `/api/BaiVietApi/Add`, data)
                .then((data) => {
                    if (data) {
                        const conv = JSON.parse(data);

                        if (conv && conv.isSuccess == false) {
                            showNotification(0, conv.error);
                        }
                        else {
                            backPage(conv.value.id)
                        }
                    }
                })
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }
 
    function dataEdit() {
        const id = $('#idEdit').val();
        const tieuDe = $('#tieuDeEdit').val();
        const chuyenMucID = dropdownBox.option('value');
        const chuyenMucKhacID = $("#dropdownBox_cmk").dxDropDownBox("instance").option('value')
        let moTaAnhDaiDien = $('#moTaAnhDaiDienEdit').val();
        const tieuDiem = $('input[name="tieuDiemEdit"]:checked').val();
        let tomTat = $('#tomTatEdit').val();
        const noiDung = editorNoiDungEdit.getData();
        const nguonTin = $('#nguonTinEdit').val();
        const tacGia = $('#tacGiaEdit').val();
        const tacQuyen = $('#tacQuyenEdit').val();
        const tuKhoa = $('#tuKhoaEdit').val();
        const ngonNgu = $('#ngonNguEdit').val();
        const ngayCongBo = $('#ngayCongBoEdit').val();
        const hetHanCongBo = $('#hetHanCongBoEdit').val();
        const trangThai = $('input[name="trangThaiEdit"]:checked').val();
        let dienThoai = $('#dienThoaiEdit').val();
        let email = $('#emailEdit').val();
        let gioMoCua = $('#gioMoCuaEdit').val();
        let gioDongCua = $('#gioDongCuaEdit').val();
        let diaChi = $('#diaChiEdit').val();
        let website = $('#websiteEdit').val();
        let toaDoX = $('#toaDoX').val();
        let toaDoY = $('#toaDoY').val();

        if (ngayCongBo != null && ngayCongBo != "") {
            ngayCongBoFormat = formatDateToSend(ngayCongBo);
        }

        const fileDaiDien = $('#anhDaiDienEdit').get(0).files;
        const fileThumbnail = $('#thumbnailEdit').get(0).files;

        const cmID = chuyenMucID != null ? chuyenMucID : [];
        const cmkID = chuyenMucKhacID != null ? chuyenMucKhacID : [];

        const preDaiDien = $('#anhDaiDienPreEdit').val();
        const preThumbnail = $('#thumbnailPreEdit').val();

        //chưa hiểu làm gì
        let delDaiDien = $('#anhDaiDienDeleteEdit').val() == "1" ? true : false;
        let delThumbnail = $('#thumbnailDeleteEdit').val() == "1" ? true: false;
    
        if (fileDaiDien.length > 0) {
            delDaiDien = true;
        }

        if (fileThumbnail.length > 0) {
            delThumbnail = true;
        }

        if (!checkEmptyBlank(tieuDe) && !checkEmptyBlank(chuyenMucID) && !checkEmptyBlank(noiDung)) {
            if (email.trim() != "" && !checkEmail(email)) {
                showNotification(0, "Địa chỉ email không hợp lệ")
                return;
            }
            if (website.trim() != "" && !checkURL(website)) {
                showNotification(0, "Địa chỉ website không hợp lệ")
                return;
            }

            const dt = {
                "ID": id,
                "TieuDe": tieuDe,
                "ChuyenMucID": cmID.toString(),
                "ChuyenMucKhacID": cmkID.toString(),
                "MoTaAnhDaiDien": moTaAnhDaiDien,
                "TieuDiem": tieuDiem == undefined ? 0 : 1,
                "TomTat": tomTat,
                "NoiDung": noiDung,
                "NguonTin": nguonTin,
                "TacGia": tacGia,
                "TacQuyen": tacQuyen,
                "TuKhoa": tuKhoa,
                "NgonNgu": ngonNgu,
                "NgayCongBo": (ngayCongBo != null && ngayCongBo) != "" ? formatDateToSend(ngayCongBo) : null,
                "HetHanCongBo": (hetHanCongBo != null && hetHanCongBo) != "" ? formatDateToSend(hetHanCongBo) : null,
                "TrangThai": Number(trangThai),
                "URLBaiViet": `${ConvertTitleToUrl(tieuDe)}-${formatDateCurrent()}`,

                "PreAnhDaiDien": preDaiDien,
                "PreThumbnail": preThumbnail,
                "XoaDaiDien": Boolean(delDaiDien),
                "XoaThumbnail": Boolean(delThumbnail),

                "DienThoai": dienThoai.trim(),
                "Email": email.trim(),
                "GioMoCua": gioMoCua,
                "GioDongCua": gioDongCua,
                "DiaChi": diaChi.trim(),
                "Website": website.trim(),
                "ToaDoX": Number(toaDoX),
                "ToaDoY": Number(toaDoY)
            };

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))

            if (fileDaiDien.length > 0) {
                data.append("AnhDaiDien", fileDaiDien[0])
            }
            if (fileThumbnail.length > 0) {
                data.append("Thumbnail", fileThumbnail[0])
            }

            getDataWithApiFormData('PUT', `/api/BaiVietApi/Edit`, data)
                .then((data) => {
                    const conv = JSON.parse(data);

                    if (conv && conv.isSuccess == false) {
                        showNotification(0, conv.error);
                    }
                    else {
                        backPage(conv.value.id)
                    }
                });
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }
    async function backPage(baiVietID) {
        await dataMediaAdd(baiVietID);
        await dataTinLQAdd(baiVietID);

        if (typeof indexUrl !== 'undefined') {
            if (indexUrl != null && indexUrl != "") {
                location.href = indexUrl;
            }
        }
        else {
            location.back();
        }
    }
  
    //Start tab 2 Media

    const tableDefs = [
        {
            targets: 4,
            render: function (data, type, row, meta) {
                let html = ""
                if (data == 1) {
                    html = "Văn bản";
                } else if (data == 2) {
                    html = "Audio";
                } else if (data == 3) {
                    html = "Video"
                } else if (data == 4) {
                    html = "Hình ảnh"
                }
                return html;
            }
        },
        {
            targets: 6,

            render: function (data, type, row, meta) {
                var canEdit = 1, canDelete = 1;
                let html = '';
                if (canEdit) {
                    html += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>`
                }

                if (canDelete) {
                    html += `<i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id=n-"${meta.row}"></i>`
                }

                return html;
            }
        }
    ];

    const tableCols = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "TenFileMedia", "width": "20%", "class": "left-align text-medium" },
        { "data": "TieuDe", "width": "20%", "class": "left-align" },
        { "data": "MoTa", "width": "25%", "class": "left-align" },
        { "data": "LoaiFileMedia", "width": "10%", "class": "center-align" },
        { "data": "ThuTu", "width": "10%", "class": "center-align" },
        { "data": "", "width": "10%", "class": "center-align group-icon-action" },
    ];
   
    initDataTableDataSourceConfig('dataGrid', [], tableDefs, tableCols);

    $('#dataGrid tbody').on('click', '.edit-command-btn', function () {
        let id = $(this).attr("ID").match(/\d+/)[0];
        let data = $('#dataGrid').DataTable().row(id).data();

        $('#idFileEdit').val(data.stt);
        $('#tenFileEdit').text(data.TieuDe)
        $('#tieuDeFileEdit').val(data.TieuDe)
        $('#moTaFileEdit').val(data.MoTa)
        $('#thuTuFileEdit').val(data.ThuTu)
      

        $('#modalEdit').modal('show');
    });

    $('#dataGrid tbody').on('click', '.delete-command-btn', function () {
        let id = $(this).attr("ID").match(/\d+/)[0];
        let data = $('#dataGrid').DataTable().row(id).data();

        $('#idDelete').val(data.stt);
        $('#nameDelete').text(data.TenFileMedia)
        $('#typeDelete').val("media")
        $('#modalDelete').modal('show');
    });

    $('#luuMedia').on('click', function () {
        var tieuDe = $('#tieuDeAdd').val();
        var moTa = $('#moTaAdd').val();
        var thuTu = $('#thuTuAdd').val();
        var fileMedia = $('#fileMediaAdd').get(0).files

        if (!checkEmptyBlank(tieuDe) && fileMedia.length > 0) {
            var loaiFile = fileMedia[0].type.split('/')[0]
            if (loaiFile == "application") {
                loaiFile = 1;
            } else if (loaiFile == "audio") {
                loaiFile = 2;
            } else if (loaiFile == "video") {
                loaiFile = 3
            } else if (loaiFile == "image") {
                loaiFile = 4
            }
            var dt = {
                "stt": dataMedia.length + 1,
                "TieuDe": tieuDe.trim(),
                "MoTa": moTa.length > 0 ? moTa.trim() : moTa,
                "ThuTu": Number(thuTu),
                "TenFileMedia": fileMedia[0].name,
                "LoaiFileMedia": loaiFile,
                "BaiVietID": null
            }

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))
            data.append("FileMedia", fileMedia[0])
            dataMedia.push(data);

            $("#dataGrid").DataTable().rows.add([dt]);
            $("#dataGrid").DataTable().draw(); // Redraw the DataTable

            $('#modalAdd').modal('hide');
        } else {
            showNotification(0, "Thông tin bắt buộc không được trống")
        }

    })
    $('#editMedia').on('click', function () {
        var index = $('#idFileEdit').val();
        var tieuDe = $('#tieuDeFileEdit').val();
        var moTa = $('#moTaFileEdit').val();
        var thuTu = $('#thuTuFileEdit').val();
        var fileMedia = $('#fileMediaEdit').get(0).files

        if (!checkEmptyBlank(tieuDe)) {
            var formData = JSON.parse(dataMedia[index - 1].get("Data"));
           
            formData.TieuDe = tieuDe.trim();
            formData.MoTa = moTa.length > 0 ? moTa.trim() : moTa
            formData.ThuTu = Number(thuTu)
            formData.stt = Number(index)

            if (fileMedia.length > 0) {
                var loaiFile = fileMedia[0].type.split('/')[0]
                if (loaiFile == "application") {
                    loaiFile = 1;
                } else if (loaiFile == "audio") {
                    loaiFile = 2;
                } else if (loaiFile == "video") {
                    loaiFile = 3
                } else if (loaiFile == "image") {
                    loaiFile = 4
                }

                dataMedia[index - 1].set("FileMedia", fileMedia[0]);
                formData.TenFileMedia = fileMedia[0].name
                formData.LoaiFileMedia = loaiFile
            }
            dataMedia[index - 1].set("Data", JSON.stringify(formData));

            $("#dataGrid").DataTable().clear();
            for (var i = 0; i < dataMedia.length; i++) {
                var dt = JSON.parse(dataMedia[i].get("Data"));
                if (dt != null) {
                    $("#dataGrid").DataTable().rows.add([dt]);
                }
            }
           
            $("#dataGrid").DataTable().draw(); // Redraw the DataTable

            $('#modalEdit').modal('hide');
        } else {
            showNotification(0, "Thông tin bắt buộc không được trống")
        }

    })
    $("#modalAdd").on("hide.bs.modal", function () {
        $('#tieuDeAdd').val("");
        $('#moTaAdd').val("");
        $('#thuTuAdd').val(0);

        $('#fileMediaAdd').val(null);
       
    })
    $("#modalEdit").on("hide.bs.modal", function () {
        $('#fileMediaEdit').val(null);

    })
    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        var index = $('#idDelete').val();
        var type = $('#typeDelete').val();
        if (type == "media") {
            
            dataMediaDelete.push(JSON.parse(dataMedia[index - 1].get("Data")).ID) // lưu tạm id cần xóa

            dataMedia.splice(index - 1, 1)

            $("#dataGrid").DataTable().clear();
            for (var i = 0; i < dataMedia.length; i++) {
                var dt = JSON.parse(dataMedia[i].get("Data"));
                if (dt.stt > index) {
                    dt.stt -= 1;
                    dataMedia[i].set("Data", JSON.stringify(dt));
                }
                $("#dataGrid").DataTable().rows.add([dt]);
            }
            $("#dataGrid").DataTable().draw();
            $('#modalDelete').modal('hide');
        } else {

            dataTinLQDelete.push(dataTLQ[index - 1].ID)
            dataTLQ.splice(index - 1, 1)
            
            $("#dataGridTinLQ").DataTable().clear();
            for (var i = 0; i < dataTLQ.length; i++) {
                if (dataTLQ[i].stt > index) {
                    dataTLQ[i].stt -= 1;
                }
                $("#dataGridTinLQ").DataTable().rows.add([dataTLQ[i]]);
            }
            $("#dataGridTinLQ").DataTable().draw();
            $('#modalDelete').modal('hide');
        }
        
    };
    async function dataMediaAdd(baiVietID) {
        if (dataMediaDelete.length > 0) {
            var listID = dataMediaDelete.join(",")
            await getDataWithApi('DELETE', `/api/MediaApi/Delete?id=${listID}`,)
        }
       
        for (var i = 0; i < dataMedia.length; i++) {
            var dt = JSON.parse(dataMedia[i].get("Data"));
            dt.BaiVietID = baiVietID;

            dataMedia[i].set("Data", JSON.stringify(dt));
            if (dt.ID == undefined) {
                await getDataWithApiFormData('POST', `/api/MediaApi/Add`, dataMedia[i])
            } else {
                await getDataWithApiFormData('PUT', `/api/MediaApi/Edit`, dataMedia[i])
            }
        }
    }
    //End tab 2 media

    //Start tab 3 tinlienquan
    const tableDefsTLQ = [
        {
            targets: 4,
            render: function (data, type, row, meta) {
                if (data == 1) {
                    return "Công bố";
                } 
                return "Không công bố"
            }
        },
        {
            targets: 5,

            render: function (data, type, row, meta) {
                var canEdit = 1, canDelete = 1;
                let html = '';
                if (canEdit) {
                    html += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>`
                }

                if (canDelete) {
                    html += `<i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id=n-"${meta.row}"></i>`
                }

                return html;
            }
        }
    ];

    const tableColsTLQ = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "TieuDe", "width": "35%", "class": "left-align text-medium" },
        { "data": "ChuyenMuc", "width": "20%", "class": "left-align" },
        { "data": "TacGia", "width": "20%", "class": "left-align" },
        { "data": "TrangThai", "width": "10%", "class": "center-align" },
        { "data": "ID", "width": "10%", "class": "center-align group-icon-action" },
    ];

    initDataTableDataSourceConfig('dataGridTinLQ', [], tableDefsTLQ, tableColsTLQ);

    $('#dataGridTinLQ tbody').on('click', '.edit-command-btn', function () {
        let id = $(this).attr("ID").match(/\d+/)[0];
        let data = $('#dataGridTinLQ').DataTable().row(id).data();
        $('#idTLQEdit').val(data.stt);
        $('#selectBaiVietEdit').val(data.BaiVietLienQuanID.toUpperCase()).trigger('change');
        $('#tacGiaTLQEdit').val(data.TacGia)
        $('#chuyenMucTLQEdit').val(data.ChuyenMuc)
        $('#trangThaiTLQEdit').val(data.TrangThai == 1 ? "Công bố" : "Không công bố")
        
        $('#modalTinLQEdit').modal('show');
    });

    $('#dataGridTinLQ tbody').on('click', '.delete-command-btn', function () {
        let id = $(this).attr("ID").match(/\d+/)[0];
        let data = $('#dataGridTinLQ').DataTable().row(id).data();

        $('#idDelete').val(data.stt);
        $('#nameDelete').text(data.TieuDe)
        $('#typeDelete').val("tinlq")

        $('#modalDelete').modal('show');
    });

    var loadTinLienQuan = new function () {
        const request = {
            "tuKhoa": null,
            "chuyenMuc": null,
            "batDau": null,
            "ketThuc": null
        };
        var result;
        $('#selectBaiVietAdd').empty();

        $('#selectBaiVietAdd').append(`<option value="-1">Chọn tin liên quan</option>`);

        $('#selectBaiVietEdit').empty();

        $('#selectBaiVietEdit').append(`<option value="-1">Chọn tin liên quan</option>`);

        getDataWithApi('POST', `/api/BaiVietApi/Gets`, JSON.stringify(request) )
            .then((data) => {
                if (data && data.value && data.value.length > 0) {
                    for(i = 0; i < data.value.length; i++) {
                        if (data.value[i].id != editId) {
                            $('#selectBaiVietAdd').append(`<option value="${data.value[i].id.toUpperCase()}">${data.value[i].tieuDe}</option>`);
                            $('#selectBaiVietEdit').append(`<option value="${data.value[i].id.toUpperCase()}">${data.value[i].tieuDe}</option>`);
                        }
                    }
                    dataBaiViet = data.value;
                }
                
            })
    }
   
    // loadTinLienQuan();

    $("#selectBaiVietAdd").on("change", function () {
        var baiViet = dataBaiViet.filter(e => e.id.toUpperCase() == this.value.toUpperCase() && this.value != "-1" )
        if (baiViet.length > 0) {
            $('#chuyenMucTLQAdd').val(baiViet[0].tenChuyenMuc);
            $('#tacGiaTLQAdd').val(baiViet[0].tacGia);
            $('#trangThaiTLQAdd').val(baiViet[0].trangThai == 1 ? "Công bố" : "Không công bố");
        }
    })
    $("#selectBaiVietEdit").on("change", function () {
        var baiViet = dataBaiViet.filter(e => e.id.toUpperCase() == this.value.toUpperCase() && this.value != "-1")
        if (baiViet.length > 0) {
            $('#chuyenMucTLQEdit').val(baiViet[0].tenChuyenMuc);
            $('#tacGiaTLQEdit').val(baiViet[0].tacGia);
            $('#trangThaiTLQEdit').val("");
        }
    })
    $('#luuTLQ').on('click', function () {
        var id = $('#selectBaiVietAdd').val();
        
        if (id != "-1" && id != "") {
            var trung = dataTLQ.filter(e => e.BaiVietLienQuanID.toUpperCase() == id.toUpperCase())
            if (trung.length > 0) {
                showNotification(0, "Tin liên quan bị trùng")
                return;
            }
            var bv = dataBaiViet.filter(e => e.id.toUpperCase() == id.toUpperCase())
            if (bv.length > 0 ) {
                var dt = {
                    "stt": dataTLQ.length + 1,
                    "TieuDe": bv[0].tieuDe,
                    "ChuyenMuc": bv[0].tenChuyenMuc,
                    "BaiVietLienQuanID": bv[0].id,
                    "TacGia": bv[0].tacGia,
                    "TrangThai": bv[0].trangThai
                }
                dataTLQ.push(dt);
            }
            $("#dataGridTinLQ").DataTable().rows.add([dt]);
            $("#dataGridTinLQ").DataTable().draw(); // Redraw the DataTable

            $('#modalTinLQAdd').modal('hide');
        } else {
            showNotification(0, "Thông tin bắt buộc không được trống")
        }

    })

    $('#editTLQ').on('click', function () {
        var index = $('#idTLQEdit').val();
        var id = $('#selectBaiVietEdit').val();

        if (id != "-1" && id != "") {

            var trung = dataTLQ.filter(e => e.baiVietLienQuanID.toUpperCase() == id.toUpperCase())
            if (trung.length > 0) {
                showNotification(0, "Tin liên quan bị trùng")
                return;
            }
            var bv = dataBaiViet.filter(e => e.id.toUpperCase() == id.toUpperCase())
            if (bv.length > 0) {
                var dt = {
                    "stt": index,
                    "TieuDe": bv[0].tieuDe,
                    "ChuyenMuc": bv[0].tenChuyenMuc,
                    "BaiVietLienQuanID": bv[0].id,
                    "TacGia": bv[0].tacGia,
                    "TrangThai": bv[0].trangThai
                }
                dataTLQ[index - 1] = dt;
            }
            $("#dataGridTinLQ").DataTable().clear();
            for (var i = 0; i < dataTLQ.length; i++) {;
                $("#dataGridTinLQ").DataTable().rows.add([dataTLQ[i]]);
            }

            $("#dataGridTinLQ").DataTable().draw(); // Redraw the DataTable

            $('#modalTinLQEdit').modal('hide');
        } else {
            showNotification(0, "Thông tin bắt buộc không được trống")
        }
    })
    $("#modalTinLQAdd").on("show.bs.modal", function () {
       
        $('#chuyenMucTLQAdd').val("");
        $('#tacGiaTLQAdd').val("");
        $('#trangThaiTLQAdd').val("");
        $('#selectBaiVietAdd').val("-1").trigger('change');
        
    })
    $("#modalEdit").on("hide.bs.modal", function () {
        $('#chuyenMucTLQEdit').val("");
        $('#tacGiaTLQEdit').val("");
        $('#trangThaiTLQEdit').val("");
    })
    async function dataTinLQAdd(baiVietID) {
        if (dataTinLQDelete.length > 0) {
            var listID = dataTinLQDelete.join(",")
            await getDataWithApi('DELETE', `/api/TinLienQuanApi/Delete?id=${listID}`,)
        }

        for (var i = 0; i < dataTLQ.length; i++) {
            if (dataTLQ[i].ID == undefined) {
                var request = {
                    "BaiVietID": baiVietID,
                    "BaiVietLienQuanID": dataTLQ[i].BaiVietLienQuanID
                }
                await getDataWithApi('POST', `/api/TinLienQuanApi/Add`, JSON.stringify(request))
            } else {
                var request = {
                    "ID": dataTLQ[i].ID,
                    "BaiVietID": baiVietID,
                    "BaiVietLienQuanID": dataTLQ[i].BaiVietLienQuanID
                }
                await getDataWithApi('POST', `/api/TinLienQuanApi/Edit`, JSON.stringify(request))
            }
          
        }
    }
    //End tab 3 tinlienquan

   
});