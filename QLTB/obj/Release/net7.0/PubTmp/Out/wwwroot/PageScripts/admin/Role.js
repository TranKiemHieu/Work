const baseUrl = getRootLink();

$(document).ready(function () {
    let treeViewDropdownBox;

    initSelect2();
    loadTable();
  //      loadDanhSachMenuNodeLa();

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
            displayExpr: "title",
            placeholder: "Hãy chọn menu",
            showClearButton: true,
            //inputAttr: { "aria-label": "Owner" },
            elementAttr: {
                class: "form-control",
            },
            contentTemplate(e) {
                const $treeView = $("<div>").dxTreeView({
                    dataSource: e.component.getDataSource(),
                    dataStructure: "plain",
                    parentIdExpr: "parentId",
                    keyExpr: "id",
                    displayExpr: "title",
                    selectionMode: "single",
                    searchEnabled: true,
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

                e.component.on("valueChanged", (args) => {
                    syncTreeViewSelection(treeViewDropdownBox, args.value);
                    e.component.close();
                });

                return $treeView;
            },
        })
        .dxDropDownBox("instance");


    fetch(`${baseUrl}/api/AdminMenuApi/DanhSachMenu`)
        .then((res) => res.json())
        .then((data) => {
            dropdownBox.option("items", data);

            $('#select_Menu_Add').empty();
            for (let i = 0; i < data.length; i++) {
                if (data[i].isLeaf == true) {
                    $('#select_Menu_Add').append(`<option value="${data[i].id}">${data[i].title}</option>`)
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });

    const itemRenderedHandler = (evt) => {
        const { itemData, itemElement } = evt;
        const [htmlElement] = itemElement;
        if (!itemData.isPermission) {
            const checkBoxItem = htmlElement.parentNode.querySelector(".dx-checkbox");
            const treeViewItem =
                htmlElement.parentNode.querySelector(".dx-treeview-item");
            if (checkBoxItem) checkBoxItem.style.display = "none";
            if (treeViewItem) {
                treeViewItem.style.paddingLeft = "10px";
            }
        }
    };

    const treeViewPermission = $("#treeViewPermission")
        .dxTreeView({
            items: [],
            width: "100%",
            height: "100%",
            noDataText: "Không có dữ liệu",
            dataStructure: "plain",
            parentIdExpr: "parentId",
            keyExpr: "id",
            displayExpr: "title",
            selectedExpr: "hasPermission",
            showCheckBoxesMode: "normal",
            selectNodesRecursive: false,
            //collapseIcon: "minus",
            //expandIcon: "plus", 
            //expandIcon: "https://path/to/the/expand_icon.svg", 
            itemTemplate(item) {
              //  console.log(item);
                if (item.isPermission) {
                    return `<span>${item.title}</span>`
                }
                const roleName = $('#tenRole').text();
                return `<div class='custom-treeview-item'><span>${item.title}</span><i class="icon-fluent icon_fluent_subtract_circle_regular del-node text-red" data-menuid='${item.id}' data-rolename='${roleName}'></i></div>`;
            },
            onItemRendered: itemRenderedHandler,
        })
        .dxTreeView("instance");


    function loadTable() {
        const tableData = {
            url: `${baseUrl}/api/AccountApi/GetAllRoles`,
            type: "Get",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            dataSrc: function (data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].stt = i + 1
                    }
                    return data;
                }
                return [];
            },
        };

        const tableDefs = [
            //{
            //    targets: 1,
            //    render: function (data, type, row, meta) {
            //        return `<span class="detail-command-btn cursor-pointer" id=n-"${meta.row}">${data}</span>`;
            //    }
            //},
            {
                targets: 3,
                render: function (data, type, row, meta) {
                    let html = `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>
                                <i data-toggle="tooltip" title="Xóa" class="icon-fluent icon_fluent_delete_filled delete-command-btn text-red" id=n-"${meta.row}"></i>
                                <i data-toggle='tooltip' title='Phân quyền' class="icon-fluent icon_fluent_accessibility_checkmark_filled access-command-btn text-green" id=n-"${meta.row}"></i>`;
                    return html;
                }
            },
        ];

        const tableCols = [
            { "data": "stt", "width": "5%", "class": "center-align" },
            { "data": "name", "width": "25%", "class": "left-align" },
            { "data": "roleDescription", "width": "60%", "class": "left-align" },
            { "data": "id", "width": "10%", "class": "center-align group-icon-action" },
        ];

        initDataTableDashboardConfig('dataGrid', tableData, tableDefs, tableCols)

        $('#dataGrid tbody').on('click', '.access-command-btn', function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            $('#tenRole').text(data.name);
            hienThiMenuPhanQuyen(data.name)
        })
        $('#dataGrid tbody').on('click', '.edit-command-btn', async function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            $("#tenModelRole").text(`Cập nhật vai trò ${data.name}`);
            $("#tenVaiTro").val(data.name);
            $('#moTa').val(data.roleDescription);
            $('#roleID').val(data.id);
          
            $('#modalAddRole').modal('show');
        });
        $('#dataGrid tbody').on('click', '.delete-command-btn', function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            $('#idDelete').val(data.id);
            $('#nameDelete').text(`${data.name}`);

            $('#modalDelete').modal('show');
        })
        $('#btn-open-role').on('click', function () {
            $("#tenModelRole").text(`Thêm mới vai trò`);
            $('#roleID').val("");
            $('#moTa').val("");
            $('#modalAddRole').modal('show');
        })

        $('#modalAddRole').on('hide.bs.modal', function () {
            $("#tenModelRole").text("");
            $("#tenVaiTro").val(null);
            $('#mota').val(null);
            $('#roleID').val(null);

        })
    }

    $("#formAdd").on('submit', evt => {
        evt.preventDefault();
        dataAdd()
    })

    $("#formEdit").on('submit', e => {
        e.preventDefault();

        const arrNodes = treeViewPermission.getNodes();
        const arrNodeUpdate = [];
        arrNodes.forEach((node) => {
            const { items: nodeItems, itemData } = node;
            if (itemData.isLeaf) {
                const permission = {
                    permissionId: itemData.permissionId,
                };
                nodeItems.forEach((el) => {
                    const { itemData: elData, selected } = el;
                    switch (elData.permissionType) {
                        case 1:
                            permission.permitedEdit = selected;
                            break;
                        case 2:
                            permission.permitedDelete = selected;
                            break;
                        case 3:
                            permission.permitedApprove = selected;
                            break;
                        case 4:
                            permission.permitedCreate = selected;
                            break;
                    }
                });
                arrNodeUpdate.push({ ...permission });
            } else {
                nodeItems.forEach((nodeItem) => {
                    const { items: permissionItems, itemData: nodeItemData } = nodeItem;
                    const permission = {
                        permissionId: nodeItemData.permissionId,
                    };
                    permissionItems.forEach((el) => {
                        const { itemData: elData, selected } = el;
                        switch (elData.permissionType) {
                            case 1:
                                permission.permitedEdit = selected;
                                break;
                            case 2:
                                permission.permitedDelete = selected;
                                break;
                            case 3:
                                permission.permitedApprove = selected;
                                break;
                            case 4:
                                permission.permitedCreate = selected;
                                break;
                        }
                    });
                    arrNodeUpdate.push({ ...permission });
                });
            }
        });

        //console.log(arrNodeUpdate);
        //return;
        let fData = new FormData()
        fData.append("permission", JSON.stringify(arrNodeUpdate))

        getDataWithApiFormData('POST', `/api/AdminMenuApi/UpdateMenuPermission`, fData)
            .then((data) => {
                data = JSON.parse(data);
                if (data && data.isSuccess == true && Number(data.value) == 1) {
                    showNotification(1, 'Cập nhật phân quyền menu thành công')
                 //   hienThiMenuPhanQuyen(rolename)
                }
                else {
                    showNotification(0, 'Có lỗi xảy ra, cập nhật phân quyền menu thất bại')
                }
            })

    
            
    });
    $("#modalAdd").on('hide.bs.modal', function () {
        $('#select_choPhepTao_Add').val("false").trigger('change')
        $('#select_choPhepSua_Add').val("false").trigger('change')
        $('#select_choPhepXoa_Add').val("false").trigger('change')
        $('#select_choPhepDuyet_Add').val("false").trigger('change')
        dropdownBox.option('value', null);
    })

    
    $('#btn-xoa').on('click', async function () {
        let id = $('#permissionIdEdit').val();
        let rolename = $('#tenRole').text();

        try {
            const res = await fetch('/api/AdminMenuApi/DeleteMenuPermission/' + id, {
                method: 'DELETE'
            });

            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Xóa phân quyền menu thành công')
            hienThiMenuPhanQuyen(rolename)
            $('#data-details').addClass('hidden');
        }
        catch (err) {
            showNotification(0, err.message)
        }
    })

    $("#btn-add-role").on('click', function () {
        let id = $('#roleID').val();
        let name = $('#tenVaiTro').val();
        let mota = $('#moTa').val();
     
        if (checkEmptyBlank(id)) {
            getDataWithApi("POST", "/api/AccountApi/AddRole", JSON.stringify({
                name: name.trim(),
                roleDescription: mota.trim()
            })).then(data => {
                showNotification(1, 'Thêm mới vai trò thành công')
                $('#dataGrid').DataTable().ajax.reload().draw();
                $('#modalAddRole').modal('hide');
            }).catch(err => {
                showNotification(0, err.responseText)
            })
        } else {
            getDataWithApi("POST", "/api/AccountApi/UpdateRole", JSON.stringify({
                id: id,
                name: name.trim(),
                roleDescription: mota.trim()
            })).then(data => {
                showNotification(1, 'Cập nhật vai trò thành công')
                $('#dataGrid').DataTable().ajax.reload().draw();
                $('#modalAddRole').modal('hide');
            }).catch(err => {
                showNotification(0, err.responseText)
            })
        }  

        $('#modalAddRole').modal('show');
    })  

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });
    function dataDelete() {
        let id = $('#idDelete').val();
        getDataWithApi("DELETE", `/api/AccountApi/DeleteRole?id=${id}`).then(data => {
            showNotification(1, 'Xóa vai trò thành công')
            $('#dataGrid').DataTable().ajax.reload().draw();
            $('#modalDelete').modal('hide');
        }).catch(err => {
            showNotification(0, err.responseText)
        })
    }

    document.getElementById('treeViewPermission').addEventListener('click', evt => {
        const { target } = evt;
        if (!target.classList.contains('del-node')) {
            return;
        }
        const menuid = target.dataset.menuid;
        const rolename = target.dataset.rolename;

        //console.log(`${menuid}: ${rolename}`);
        fetch(`/api/AdminMenuApi/DeleteMenuPermission/${menuid}/${rolename}`, {
            method: 'DELETE'
        })
            .then(res => res.text())
            .then(data => {
                showNotification(1, 'Cập nhật thành công')
                hienThiMenuPhanQuyen(rolename);
            })
            .catch(err => {
                showNotification(0, err.message)
            });
    })

    async function dataAdd() {
        let rolename = $('#tenRole').text();
        let permitedCreate = $("#select_choPhepTao_Add").val()
        let permitedEdit = $("#select_choPhepSua_Add").val()
        let permitedDelete = $('#select_choPhepXoa_Add').val();
        let permitedApprove = $('#select_choPhepDuyet_Add').val();
        //let menuid = $('#select_Menu_Add').val();

        const arrMenuSelected = dropdownBox.option('value');
        if (!arrMenuSelected) {
            showNotification(0, "Hãy chọn menu để phân quyền");
            return;
        }
        const [menuid] = arrMenuSelected;

        let dt = {
            RoleName: rolename,
            MenuId: menuid,
            PermittedCreate: permitedCreate === "true" ? true : false,
            PermittedEdit: permitedEdit === "true" ? true : false,
            PermittedDelete: permitedDelete === "true" ? true : false,
            PermittedApprove: permitedApprove === "true" ? true : false
        }

        try {
            await getDataWithApi('POST', '/api/AdminMenuApi/AddMenuPermission', JSON.stringify(dt)).then(data => {
               // const response = JSON.parse(data);
                if (data && data.isSuccess == true) {
                    showNotification(1, 'Thêm mới phân quyền menu thành công')
                    $('#modalAdd').modal('hide');
                    hienThiMenuPhanQuyen(rolename)
                } else {
                    throw new Error(data.error);
                }
            })
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
    function hienThiMenuPhanQuyen(rolename) {
        fetch(
            `/api/adminmenuapi/danhsachmenutheorole/${rolename}`
        )
            .then((res) => {
                // console.log(res);
                return res.json();
            })
            .then((data) => {
                //console.log(data);
                treeViewPermission.option("items", data);
                treeViewPermission.expandAll();
                // treeView.expandAll();
                $('#modalEdit').modal('show');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function loadDanhSachMenuTheoRole(rolename) {
        try {
            const res = await fetch(`/api/AdminMenuApi/DanhSachMenuTheoRole/${rolename}`, {
                method: 'Get'
            })
            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            var data = await res.json()

            $("#show_ThemMoi").empty();
            $("#show_ThemMoi").append(`<button style="float: right; margin-right: 10px" type="button" class="btn btn-success" data-toggle="modal" data-target="#modalAdd">Thêm mới</button>`)

            return data
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }

    async function loadDanhSachMenuNodeLa(rolename) {
        try {
            const res = await fetch(`/api/AdminMenuApi/DanhSachNodeLa`, {
                method: 'Get'
            })
            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            var data = await res.json()

            $('#select_Menu_Add').empty();
            for (let i = 0; i < data.length; i++) {
                $('#select_Menu_Add').append(`<option value="${data[i].id}">${data[i].title}</option>`)
            }

            return data
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
})
