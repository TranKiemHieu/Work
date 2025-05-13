
const baseUrl = getRootLink();

$(document).ready(function () {

    initSelect2();
    
    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "ChuyenMuc",
            "search": {
                "tuKhoa": tuKhoa.trim(),
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
    
    const user = getDataWithApi("POST", "/api/AccountApi/GetAllUsers?keyword=").then(data => {
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].lockoutEnabled == false) {
                    $('#select_User1Edit').append(`<option value="${data[i].id}">${data[i].displayName}-${data[i].userName}</option>`)
                    $('#select_User2Edit').append(`<option value="${data[i].id}">${data[i].displayName}-${data[i].userName}</option>`)
                    $('#select_User3Edit').append(`<option value="${data[i].id}">${data[i].displayName}-${data[i].userName}</option>`)
                    //dataUser.push(data[i])
                }
            }
        }
    })
    initDataGrid();
    
    async function initDataGrid() {
        let dt = [];
        await getDataWithApi('POST', '/api/ChuyenMucApi/Gets', buildData()).then(data => {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].Stt = i + 1;
                }
                dt = data;
            };
        })
        
        $('#treeView').dxTreeList({
            dataSource: dt,
            keyExpr: 'id',
            parentIdExpr: 'chuyenMucCapChaID',
            showRowLines: true,
            showBorders: true,
            autoExpandAll: true,
            columnAutoWidth: true,
            noDataText:"Không tìm thấy dữ liệu",
            paging: {
                enabled: true,
                pageSize: 20,
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
                dataField: 'tenChuyenMuc',
                caption: 'Chuyên mục',
                validationRules: [{ type: 'required' }],
                width: 500,
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        }).addClass("detail-command-btn")
                        .appendTo(header);
                },
                cellTemplate(container, options) {
                    $('<div>')
                        .append($('<span>', { id: options.data.id }).addClass("detail-command-btn cursor-pointer").append(options.data.tenChuyenMuc))
                        .appendTo(container);
                },
            }, {
                dataField: 'tenChuyenMucCapCha', 
                caption: 'Chuyên mục cấp cha',
                
                validationRules: [{ type: 'required' }],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            /* 'color': 'blue'*/
                        })
                        .appendTo(header);
                },
                }, {

                    caption: 'Chức năng',
                    width: 150,
                    type: 'buttons',
                    buttons: [{
                        template: function (rowData) {
                            return $("<i type='button' data-toggle='tooltip' title='Phân quyền'>").addClass("icon-fluent icon_fluent_accessibility_checkmark_filled access-command-btn text-green").css({ "display": "inline-block", 'text-align': "center-align" });
                        },
                        onClick(e) {
                            $("#select_User1Edit").val(null).trigger('change');
                            $("#select_User2Edit").val(null).trigger('change');
                            $("#select_User3Edit").val(null).trigger('change');
                            if (e.row.data.id != "") {

                                $('#idEdit').val(e.row.data.id)
                                getDataWithApi("GET", `/api/ChuyenMucApi/GetPhanQuyenByChuyenMucID?id=${e.row.data.id}`).then(data => {
                                    if (data && data.value) {
                                        $('#tenEdit').text(e.row.data.tenChuyenMuc)

                                        if (data.value.user1 != null) {
                                            $('#select_User1Edit').val(data.value.user1.split(',')).trigger('change');
                                        }
                                        if (data.value.user2 != null) {
                                            $('#select_User2Edit').val(data.value.user2.split(',')).trigger('change');
                                        }
                                        if (data.value.user3 != null) {
                                            $('#select_User3Edit').val(data.value.user3.split(',')).trigger('change');
                                        }
                                        if (data.value.apDungChoCapCon == true) {
                                            $('#apDungEdit').prop('checked', true);
                                        } else {
                                            $('#apDungEdit').prop('checked', false);
                                        }
                                    }
                                })
                            }
                            $('#modalEdit').modal('show')
                        },
                    },
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
            //expandedRowKeys: [1, 2],

        });
        $('#btn-edit').on('click', async function () {
            var chuyenMucID = $('#idEdit').val();
            var lstUser1 = $("#select_User1Edit").val();
            var lstUser2 = $("#select_User2Edit").val();
            var lstUser3 = $("#select_User3Edit").val();
            var apDungAll = $('input[name="apDungEdit"]:checked').val();
            var dt = {
                "User1": lstUser1.join(','),
                "User2": lstUser2.join(','),
                "User3": lstUser3.join(','),
                "ChuyenMucID": chuyenMucID,
                "ApDungChoCapCon": apDungAll != undefined ? true : false
            }
            try {
                await getDataWithApi("POST", "/api/ChuyenMucApi/UpdateUserPermission", JSON.stringify(dt))
            } catch (e) {
                console.log(e)
            }
            $('#modalEdit').modal('hide')
        })
    };

    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });

    function dataDelete() {
        const id = $('#idDelete').val();

        if (id) {
            getDataWithApi('DELETE', `/api/ChuyenMucApi/Delete?id=${id}`)
                .then((data) => {
                    location.reload();
                });
        }
    }

});