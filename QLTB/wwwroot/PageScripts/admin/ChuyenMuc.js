
const baseUrl = getRootLink();

$(document).ready(function () {


    
    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "ChuyenMuc",
            "search": {
                "tuKhoa": tuKhoa,
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
            "tuKhoa": tuKhoa.trim(),
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
        await getDataWithApi('POST', '/api/ChuyenMucApi/Gets', buildData()).then(data => {
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    data[i].Stt = i + 1;
                    if (data[i].loaiLienKet == 2) {
                        data[i].trangLienKet = data[i].diaChiLienKet
                    }
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
            noDataText: "Không tìm thấy dữ liệu",
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
                width: 400,
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
                }
            }, {
                dataField: 'trangLienKet',
                caption: 'Trang liên kết',
                width: 200,
                validationRules: [{ type: 'required' }],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            'text-align': 'center'
                        })
                        .appendTo(header);
                }
            },
                
                {
                dataField: 'thuTuHienThi',
                caption: 'Thứ tự hiển thị',
                width: 150,
                validationRules: [{ type: 'required' }],
                headerCellTemplate: function (header, info) {
                    $('<div>')
                        .html(info.column.caption)
                        .css({
                            'font-size': '16px',
                            'text-align': 'center'
                        })
                        .appendTo(header);
                }
            },{
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
            }, {
                dataField: 'isMenu',
                caption: 'Menu',
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
                        if (typeof editUrl !== 'undefined') {
                            if (editUrl != null && editUrl != "") {
                                location.href = editUrl + `?id=${e.row.data.id}`;
                            }
                        };
                    },
                },
                {
                    template: function (data) {
                        return $("<i type='button' data-toggle='tooltip' title='Xóa'>").addClass("icon-fluent icon_fluent_delete_filled delete-command-btn text-red").css({ "display": "inline-block", 'text-align': "center-align" });
                    },
                    onClick(e) {
                        $('#idDelete').val(e.row.data.id);
                        $('#nameDelete').text(`${e.row.data.tenChuyenMuc}`);

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