
const baseUrl = getRootLink();

$(document).ready(function () {
    let treeViewDropdownBox;
    let dataDropdown = []

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

    const dropdownBox = $("#dropdownBox")
        .dxDropDownBox({
            items: [],
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
                    noDataText: "Không tìm thấy dữ liệu",
                    selectionMode: "single",
                    showCheckBoxesMode: "none",
                    selectNodesRecursive: false,
                    selectByClick: true,
                    searchEnabled: true,
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

    editorGioiThieuEdit = CKEDITOR.replace('gioiThieuEdit', {
        language: 'vi-vn',
        extraPlugins: 'confighelper',
        placeholder: 'Nhập nội dung',
        //toolbar: "Full",
        filebrowserImageUploadUrl: '/File/UploadAdapter?subDirectory=ChuyenMuc',
        clipboard_handleImages: false,
    });

    initSelect2();
    initDateTimePicker();
    function initEdit(id) {
        getDataWithApi('GET', `/api/ChuyenMucApi/Get?id=${id}`)
            .then((data) => {

                if (data && data.value) {
                    const dt = data.value;

                    $('#idEdit').val(dt.id);
                    $('#tenChuyenMucEdit').val(dt.tenChuyenMuc);
                    $('#maChuyenMucEdit').val(dt.maChuyenMuc);
                    $('#moTaEdit').val(dt.moTa);
                    $('#capChaEdit').val(dt.chuyenMucCapChaID != null ? dt.chuyenMucCapChaID.toUpperCase() : "-1").trigger('change');
                    $('#moTaDaiDienEdit').val(dt.moTaAnhDaiDien);
                    $('#thuTuEdit').val(dt.thuTuHienThi ? dt.thuTuHienThi : 0);
                    $('#diaChiLienKetEdit').val(dt.diaChiLienKet);
                    editorGioiThieuEdit.setData(dt.noiDung);
                    if (dt.suDung == true) {
                        $('#trangThaiEdit1').prop("checked", true);
                        $('#trangThaiEdit0').prop("checked", false);
                    }
                    else {
                        $('#trangThaiEdit1').prop("checked", false);
                        $('#trangThaiEdit0').prop("checked", true);
                    }
                   
                    $(`input[name=loaiLienKet][value="${dt.loaiLienKet}"]`).prop("checked", true);
                    if (dt.loaiLienKet == 2) {
                        $('#diaChiLienKetEdit').removeClass('d-none');
                        $('#diaChiLienKetEdit').val(dt.diaChiLienKet);
                    } else if (dt.loaiLienKet == 3) {
                        $('#trangLienKetEdit').select2().next().show();
                        $('#trangLienKetEdit').val([dt.diaChiLienKet]).trigger('change');
                    }
                    $('#ngayCongBoEdit').val(formatDate(dt.ngayCongBo));

                    $('#anhBieuTuongPreEdit').val(dt.bieuTuong);
                    if (dt.bieuTuong != null && dt.bieuTuong != "") {
                        $('#anhBieuTuongImgDelete').removeClass('d-none');
                        $('#anhBieuTuongImgEdit img').removeClass('cursor-pointer');
                        $('#anhBieuTuongImgEdit img').attr("src", `${dt.bieuTuong}`);
                    }

                    $('#anhDaiDienPreEdit').val(dt.anhDaiDien);
                    if (dt.anhDaiDien != null && dt.anhDaiDien != "") {
                        $('#anhDaiDienImgDelete').removeClass('d-none');
                        $('#anhDaiDienImgEdit img').removeClass('cursor-pointer');
                        $('#anhDaiDienImgEdit img').attr("src", `${dt.anhDaiDien}`);
                    }

                    if (dt.moLienKetOCuaSoMoi == true) {
                        $('#moLienKetOCuaSoMoi').prop('checked', true);
                    }
                    if (dt.isMenu == true) {
                        $('#isMenuEdit').prop('checked', true);
                    } else {
                        $('#isMenuEdit').prop('checked', false);
                    }
                    $("#dropdownBox").dxDropDownBox('option', 'value', [dt.chuyenMucCapChaID])
                    //dropdownBox.option("4").selectedKeys

                
                  
                }
            })
    }

    async function initData() {
        $('#capChaEdit').empty();

        $('#capChaEdit').append(`<option value="-1">Chọn</option>`);

        await fetch(`${baseUrl}/api/ChuyenMucApi/Select?flag=0`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.value && data.value.length > 0) {
                    dataDropdown = data.value.filter(e => e.id != editId);

                    dropdownBox.option("items", dataDropdown);
                };
            })
            .catch((err) => {
                console.log(err);
            });
        $('#trangLienKetEdit').empty();
        await fetch(`${baseUrl}/api/ViewApi/Select?flag=1`)
            .then((res) => res.json())
            .then((data) => {
                if (data && data.value && data.value.length > 0) {
                    for (var i = 0; i < data.value.length; i++) {
                        $('#trangLienKetEdit').append(`<option value="${data.value[i].id}" >${data.value[i].moTa}</option>`)
                    }
                        
                };
            })
            .catch((err) => {
                console.log(err);
            });

        if (typeof editId !== 'undefined') {
            if (editId != null && editId != "") {
                initEdit(editId);
            }
        }
    };

    initData();

    $('#anhBieuTuongImgDelete').on('click', function () {
        $('#idDeleteImg').val(editId);
        $('#idDeleteType').val(1);

        $('#modalDeleteImg').modal('show');
    });

    $('#anhBieuTuongImgEdit > img').on('click', function () {
        $('#anhBieuTuongEdit').click();
    });

    $('#anhBieuTuongEdit').on('change', function () {
        previewImgUpload(this, 'anhBieuTuongImgEditPreview', 'anhBieuTuongImgEdit');
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


    $('#trangLienKetEdit').select2().next().hide();
    $("input[name='loaiLienKet']").change(function () {
        if ($(this).val() == "2") {
            $('#diaChiLienKetEdit').removeClass('d-none');
            $('#trangLienKetEdit').select2().next().hide();
        } else if ($(this).val() == "3") {
            $('#diaChiLienKetEdit').addClass('d-none');
            $('#trangLienKetEdit').select2().next().show();
        } else {
            $('#diaChiLienKetEdit').addClass('d-none');
            $('#trangLienKetEdit').select2().next().hide();
        }
    });
    function dataDeleteImg() {
        const id = $('#idDeleteImg').val();
        const type = $('#idDeleteType').val();

        if (id) {
            const dt = {
                "ID": id,
                "Type": Number(type)
            };

            getDataWithApi('POST', `/api/ChuyenMucApi/DeleteImg`, JSON.stringify(dt))
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
                        $('#anhBieuTuongImgEdit img').attr("src", "/assets/images/icons/imageUpload.png");
                        $('#anhBieuTuongImgEdit img').addClass("cursor-pointer");
                        if (!($('#anhBieuTuongImgDelete').hasClass('d-none'))) {
                            $('#anhBieuTuongImgDelete').addClass('d-none')
                        };

                        $('#anhBieuTuongDeleteEdit').val('1');
                    }

                    $('#modalDeleteImg').modal('hide');
                });
        }
    }

    $("#formEdit").submit(function (e) {
        e.preventDefault();
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
        const tenChuyenMuc = $('#tenChuyenMucEdit').val();
        let moTa = $('#moTaEdit').val();
        const capCha = dropdownBox.option('value');
        let moTaDaiDien = $('#moTaDaiDienEdit').val();
        const thuTu = $('#thuTuEdit').val();
        let gioiThieu = editorGioiThieuEdit.getData();
        const trangThai = $('input[name="trangThaiEdit"]:checked').val();
        const loaiLienKet = $('input[name="loaiLienKet"]:checked').val();
        const maChuyenMuc = $('#maChuyenMucEdit').val()
        const moLienKetOCuaSoMoi = $('input[name="moLienKetOCuaSoMoi"]:checked').val();
        const fileBieuTuong = $('#anhBieuTuongEdit').get(0).files;
        const fileDaiDien = $('#anhDaiDienEdit').get(0).files;
      
        const [capChaID] = capCha != null ? capCha : [];
        let diaChiLienKet = $('#diaChiLienKetEdit').val();
        const isMenu = $('input[name="isMenuEdit"]:checked').val();
        let trangLienKet = $('#trangLienKetEdit').val();

        let lienKet = ""
        if (loaiLienKet == "2") {
            lienKet = diaChiLienKet
        } else if (loaiLienKet == "3") {
            lienKet = trangLienKet
        }
        if (checkEmptyBlank(moTa)) {
            moTa = null;
        }

        if (checkEmptyBlank(moTaDaiDien)) {
            moTaDaiDien = null;
        }

        if (checkEmptyBlank(gioiThieu)) {
            gioiThieu = null;
        }
        
        if (!checkEmptyBlank(tenChuyenMuc)) {
            const dt = {
                "ChuyenMucCapChaID": capChaID,
                "TenChuyenMuc": tenChuyenMuc,
                "BieuTuong": null,
                "AnhDaiDien": null,
                "MoTaAnhDaiDien": moTaDaiDien,
                "MaChuyenMuc": maChuyenMuc,
                "MoTa": moTa,
                "NoiDung": gioiThieu,
                "SuDung": Number(trangThai) == 1 ? true : false,
                "ThuTuHienThi": Number(thuTu),
                "URLChuyenMuc": ConvertTitleToUrl(tenChuyenMuc),
                "MoLienKetOCuaSoMoi": moLienKetOCuaSoMoi == undefined ? 0 : 1,
                "LoaiLienKet": Number(loaiLienKet),
                "DiaChiLienKet": lienKet,
                "NgonNgu": "Tiếng việt (Việt Nam)",
                "IsMenu": isMenu == undefined ? 0 : 1,
            };
            
            let data = new FormData();
            data.append("Data", JSON.stringify(dt))

            if (fileBieuTuong.length > 0) {
                data.append("AnhBieuTuong", fileBieuTuong[0])
            }

            if (fileDaiDien.length > 0) {
                data.append("AnhDaiDien", fileDaiDien[0])
            }

            getDataWithApiFormData('POST', `/api/ChuyenMucApi/Add`, data)
                .then((data) => {
                    var rs = JSON.parse(data);
                    if (rs.isSuccess == true) {
                        if (rs.value.id != null) {
                            showNotification(1, 'Thêm mới chuyên mục thành công')
                        }
                        location.href = indexUrl;
                    } else {
                        showNotification(0, `Lỗi: ${rs.error}`);
                    }
                })
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }

    function dataEdit() {
        const id = $('#idEdit').val();
        const tenChuyenMuc = $('#tenChuyenMucEdit').val();
        const maChuyenMuc = $('#maChuyenMucEdit').val();
        let moTa = $('#moTaEdit').val();
        const capCha = dropdownBox.option('value');
        let moTaDaiDien = $('#moTaDaiDienEdit').val();
        const thuTu = $('#thuTuEdit').val();
        let gioiThieu = editorGioiThieuEdit.getData();
        const trangThai = $('input[name="trangThaiEdit"]:checked').val();
        const loaiLienKet = $('input[name="loaiLienKet"]:checked').val();
        const moLienKetOCuaSoMoi = $('input[name="moLienKetOCuaSoMoi"]:checked').val();
        const isMenu = $('input[name="isMenuEdit"]:checked').val();
      
        const fileBieuTuong = $('#anhBieuTuongEdit').get(0).files;
        const fileDaiDien = $('#anhDaiDienEdit').get(0).files;
        let diaChiLienKet = $('#diaChiLienKetEdit').val();
        const [capChaID] = capCha != null ? capCha : [];

        const preBieuTuong = $('#anhBieuTuongPreEdit').val();
        let delBieuTuong = $('#anhBieuTuongDeleteEdit').val();

        let trangLienKet = $('#trangLienKetEdit').val();

        let lienKet = ""
        if (loaiLienKet == "2") {
            lienKet = diaChiLienKet
        } else if (loaiLienKet == "3") {
            lienKet = trangLienKet
        }

        if (fileBieuTuong.length > 0) {
            delBieuTuong = '0';
        }

        const preDaiDien = $('#anhDaiDienPreEdit').val();
        let delDaiDien = $('#anhDaiDienDeleteEdit').val();

        if (fileDaiDien.length > 0) {
            delDaiDien = '0';
        }

        if (checkEmptyBlank(moTa)) {
            moTa = null;
        }

        if (checkEmptyBlank(moTaDaiDien)) {
            moTaDaiDien = null;
        }

        if (checkEmptyBlank(gioiThieu)) {
            gioiThieu = null;
        }

        if (id && !checkEmptyBlank(tenChuyenMuc)) {
            const dt = {
                "ID": id,
                "ChuyenMucCapChaID": capChaID, // != "-1" ? capCha : null,
                "TenChuyenMuc": tenChuyenMuc,
                "MoTaAnhDaiDien": moTaDaiDien,
                "MaChuyenMuc": maChuyenMuc,
                "MoTa": moTa,
                "ThuTuHienThi": Number(thuTu),
                "NoiDung": gioiThieu,
                "SuDung": Number(trangThai) == 1 ? true : false,
                "BieuTuong": preBieuTuong,
                "XoaAnhBieuTuong": Number(delBieuTuong) == 1 ? true : false,
                "AnhDaiDien": preDaiDien,
                "XoaAnhDaiDien": Number(delDaiDien) == 1 ? true : false,
                "NgonNgu": "Tiếng việt (Việt Nam)",
                "URLChuyenMuc": ConvertTitleToUrl(tenChuyenMuc),
                "MoLienKetOCuaSoMoi": moLienKetOCuaSoMoi == undefined ? 0 : 1,
                "LoaiLienKet": Number(loaiLienKet),
                "DiaChiLienKet": lienKet,
                "IsMenu": isMenu == undefined ? 0 : 1,
            };

            let data = new FormData();
            data.append("Data", JSON.stringify(dt))

            if (fileBieuTuong.length > 0) {
                data.append("AnhBieuTuong", fileBieuTuong[0])
            }

            if (fileDaiDien.length > 0) {
                data.append("AnhDaiDien", fileDaiDien[0])
            }

            getDataWithApiFormData('PUT', `/api/ChuyenMucApi/Edit`, data)
                .then((data) => {
                    var rs = JSON.parse(data);
                    if (rs.isSuccess == true) {
                        showNotification(1, 'Chỉnh sửa chuyên mục thành công')
                        if (typeof indexUrl !== 'undefined') {
                            if (indexUrl != null && indexUrl != "") {
                                location.href = indexUrl;
                            }
                        }
                        else {
                            location.back();
                        }
                    } else {
                        showNotification(0, `Lỗi: ${rs.error}`);
                    }
                    
                });
        }
        else {
            showNotification(0, 'Thông tin bắt buộc không được để trống!');
        }
    }
 
});