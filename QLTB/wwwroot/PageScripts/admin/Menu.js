const baseUrl = getRootLink();

$(document).ready(function () {
    let dtMenu = {}

    initSelect2();
   
    $(() => {
        const treeView = $('#simple-treeview').dxTreeView({
            dataSource: new DevExpress.data.CustomStore({
                key: 'id',
                load(loadOptions) {
                    const deferred = $.Deferred();
                    $.ajax({
                        url: '/api/AdminMenuApi/DanhSachMenu',
                        dataType: 'json',
                        success(result) {
                            dtMenu = result;
                            $('#parentIdAdd').empty();
                            $('#parentIdAdd').append(`<option value="-1">Không</option>`)
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].parentId == null) {
                                    $('#parentIdAdd').append(`<option value="${result[i].id}">${result[i].title}</option>`)
                                }
                            }
                            deferred.resolve(result)
                        },
                        error() {
                            deferred.reject('Data Loading Error');
                        },
                        timeout: 5000,
                    });

                    return deferred.promise();
                },
            }),
            expandNodesRecursive: false,
            rootValue: '',
            dataStructure: 'plain',
            //height: 500,
            keyExpr: "id",
            // expand all nodes
            onContentReady: function (e) {
                e.component.expandAll();
            },
            displayExpr: "title",
            parentIdExpr: "parentId",
         //   hasItemsExpr: "hasChildren",
            onItemClick: function (evt) {
                //const itemDt = evt.itemData;
                data = evt.itemData;
                console.log(data)
                loadData();
            }
        }).dxTreeView('instance');
    });

    function loadData() {
        $('#content_cauhinh').empty()
        let html = ` <div class="form-row">
                                <div class="col-md-6 form-group">
                                    <label for="title" class="form-label">Menu cấp cha</label>
                                    <select id="select-MenuParent" class="form-control" ${data.hasChildren ? "disabled" : ""}></select>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="title" class="form-label">Tiêu đề<span class="text-red"> *</span></label>
                                    <input type="text" class="form-control field-input" id="title" autocomplete="off">
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="areaName" class="form-label">AreaName<span class="text-red"> *</span></label>
                                    <input type="text" class="form-control field-input" id="areaName"  autocomplete="off" ${data.hasChildren ? "disabled" : ""} />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="controllerName" class="form-label">ControllerName<span class="text-red"> *</span></label>
                                    <input type="text" class="form-control field-input" id="controllerName" autocomplete="off" ${data.hasChildren ? "disabled" : ""} />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="actionName" class="form-label">ActionName<span class="text-red"> *</span></label>
                                    <input type="text" class="form-control field-input" id="actionName" autocomplete="off" ${data.hasChildren ? "disabled" : ""} />
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="icon" class="form-label">Icon</label>
                                    <input type="text" class="form-control field-input" id="icon" autocomplete="off"/>
                                </div>
                                <div class="col-md-6 form-group">
                                    <label for="title" class="form-label">Thứ tự hiển thị</label>
                                    <input type="number" class="form-control field-input" id="txtDisplayOrder" autocomplete="off"/>
                                </div>
                                <div class="col-md-6 form-group">
                                    <div class="group-check group-check-inline">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" name="hienThi" id="hienThi"/>
                                            <label class="form-check-label" for="hienThi">Hiển thị</label>
                                        </div>
                                    </div>
                                 </div>
                            </div>
                            <div class="group-button-action text-right">
                                <button type="button" id="btn-huy" class="btn btn-outline-light" data-dismiss="modal">Hủy bỏ</button>
                                <button type="button" id="btn-sua" class="btn btn-secondary">Lưu chỉnh sửa</button>
                                <button type="button" id="btn-xoa" class="btn btn-danger">Xóa</button>
                            </div>`

        $('#content_cauhinh').append(html)
        $('#select-MenuParent').append('<option value="-1">Không</option>');
        initSelect2();
        for (var i = 0; i < dtMenu.length; i++) {
            if (dtMenu[i].parentId == null) {
                $('#select-MenuParent').append(`<option value="${dtMenu[i].id}">${dtMenu[i].title}</option>`)
            }
        }
        $('#select-MenuParent').val(data.parentId == null ? '-1' : data.parentId).trigger('change');
        $('#tenMenu').text(data.title)
        $('#tenMenu').parent().removeClass('d-none')
        $('#title').val(data.title)
        $('#areaName').val(data.areaName);
        $('#controllerName').val(data.controllerName)
        $('#actionName').val(data.actionName)
        $('#icon').val(data.icon)
        $('#txtDisplayOrder').val(data.displayOrder)
        if (data.isShow == true) {
            $('#hienThi').prop('checked', true);
        }
        $('#btn-huy').on('click', function () {
            loadData()
        })
        
        $('#btn-sua').on('click', async function () {
            let menuParent = $('#select-MenuParent').val()
            let title = $('#title').val()
            let areaName = $('#areaName').val()
            let controllerName = $('#controllerName').val()
            let actionName = $('#actionName').val()
            let icon = $('#icon').val()
            const displayOrder = $('#txtDisplayOrder').val();
            let hienThi = $('input[name="hienThi"]:checked').val();

            let dt = {
                id: data.id,
                parentId: menuParent == "-1" ? null : menuParent,
                title: title,
                areaName: areaName,
                controllerName: controllerName,
                actionName: actionName,
                isLeaf: menuParent == "-1" ? false : true,
                icon: icon,
                displayOrder: Number(displayOrder),
                isShow: hienThi == undefined ? false : true,
            }

            await fetch('/api/AdminMenuApi/ChinhSuaMenu', {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(dt)
            }).then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText)
                }
                location.reload()
                showNotification(1, "Chỉnh sửa menu thành công")
            }).catch(err => {
                showNotification(0, err.message)
            })
        })

        $('#btn-xoa').on('click', async function () {

            $('#idDelete').val(data.id);
            $('#nameDelete').text(data.title);

            $('#modalDelete').modal('show');
            let areaName = $('#areaName').val()
            let controllerName = $('#controllerName').val()
            let actionName = $('#actionName').val()
        })
    }

    $("#formAdd").submit(function (e) {
        e.preventDefault();
        dataAdd();
    });

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    $('#btn-them').on('click', async function () {
        let menuParent = $('#parentIdAdd').val()
        let title = $('#titleAdd').val()
        let areaName = $('#areaNameAdd').val()
        let controllerName = $('#controllerNameAdd').val()
        let actionName = $('#actionNameAdd').val()
        let icon = $('#iconAdd').val()
        let displayOrder = $('#txtDisplayOrderAdd').val();
        let hienThi = $('input[name="hienThiAdd"]:checked').val();

        let dt = {
            parentId: menuParent == -1 ? null : menuParent,
            title: title,
            areaName: areaName,
            controllerName: controllerName,
            actionName: actionName,
            isLeaf: menuParent != "-1" ? true : false,
            icon: icon,
            displayOrder: Number(displayOrder),
            isShow: hienThi == undefined ? false : true,
        }

        await fetch('/api/AdminMenuApi/ThemMoiMenu', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(dt)
        }).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            location.reload()
            showNotification(1, "Thêm mới menu thành công")
        }).catch(err => {
            showNotification(0, err.message)
        })
    })

    async function dataAdd() {
        let title = $('#titleAdd').val();
        let parentId = $('#parentIdAdd').val();
        let areaName = $('#areaNameAdd').val();
        let controllerName = $('#controllerNameAdd').val();
        let actionName = $("#actionNameAdd").val()
        const displayOrder = $("#txtDisplayOrderAdd").val();

        let dt = {
            title: title.trim(),
            parentId: parentId == "" ? null : Number(parentId),
            areaName: parentId == "" ? null : areaName,
            controllerName: parentId == "" ? null : controllerName,
            actionName: parentId == "" ? null : actionName,
            isLeaf: parentId == "" ? false : true,
            displayOrder: +displayOrder
        }

        try {
            let res = await fetch('/api/AdminMenuApi/themmoimenu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dt)
            })
            console.log(res)
            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Thêm mới menu thành công')
            $('#modalAdd').modal('hide');
            location.reload()
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
    async function dataDelete() {
        let id = $('#idDelete').val();


        try {
            const res = await fetch('/api/AdminMenuApi/XoaMenu/' + id, {
                method: 'DELETE'
            })

            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Xóa menu thành công')
            $('#modalDelete').modal('hide');
            location.reload()
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }

    async function getMenuChaSelect() {
        try {
            const res = await fetch(`/api/AdminMenuApi/DanhSachNodeCha`, {
                method: 'GET'
            })
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            let data = await res.json()
            console.log(data)
            if (data && data.length) {
                for (let i = 0; i < data.length; i++) {
                    $('#parentIdAdd').append(`<option value="${data[i].id}">${data[i].title}</option>`)
                }
            }
        } catch (err) {
            showNotification(0, err.message);
        }

    };
})