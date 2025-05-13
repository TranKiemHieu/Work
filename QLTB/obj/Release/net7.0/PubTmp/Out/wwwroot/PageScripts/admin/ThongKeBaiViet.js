const baseUrl = getRootLink();

$(document).ready(function () {
    initData();
    initDateTimePicker();
    initSelect2();

    let treeViewDropdownBox;

    const syncTreeViewSelection = function (treeViewInstance1, value) {
        if (!value) {
            treeViewInstance1.unselectAll();
            return;
        }

        value.forEach((key) => {
            treeViewInstance1.selectItem(key);
        });
    };

    const dropdownBox = $('#category-search').dxDropDownBox({
        dataSource: [],
        valueExpr: 'id',
        displayExpr: 'tenChuyenMuc',
        placeholder: 'Chọn chuyên mục',
        showClearButton: true,
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
                    syncTreeViewSelection(args.component, v);
                },
                selectNodesRecursive: false,
                showCheckBoxesMode: 'normal',
                onItemSelectionChanged(args) {
                    const selectedKeys = args.component.getSelectedNodeKeys();
                    e.component.option('value', selectedKeys);
                },
            });

            treeViewDropdownBox = $treeView.dxTreeView('instance');

            $treeView.find('.dx-treeview-search')[0].classList.add('border');
            $treeView.find('.dx-treeview-search')[0].classList.add('rounded');
            $treeView.find('.dx-searchbox.dx-editor-filled .dx-icon-search').css({
                "right": "0"
            });

            e.component.on('valueChanged', (args) => {
                const { value } = args;
                syncTreeViewSelection(treeViewDropdownBox, value);
            });

            return $treeView;
        },
    }).dxDropDownBox("instance");
    

    function initData() {
        getDataWithApi('GET', '/api/ChuyenMucApi/Select?flag=0').then((data) => {
            if (data && data.value && data.value.length > 0) {
                let response = data.value.filter(e => e.suDung == true && e.isSelected == true);
                $("#category-search").dxDropDownBox("instance").option("dataSource", response);
            };
        })
    };

    function saveFilter() {
        let tuKhoa = $('#tu-khoa-search').val();

        const save = {
            "type": "ThongKeBaiViet",
            "search": {
                "tuKhoa": tuKhoa,
                "soLuong": 0
            }
        };

        sessionStorage.setItem("filterData", JSON.stringify(save));
    };

    function buildData() {
        let tuKhoa = $('#tu-khoa-search').val();
        let ngonNgu = $('#language-search option:selected').val() == '' ? null : $('#language-search option:selected').text();
        let chuyenMucID = null;
        
        if ($(`#category-search`).dxDropDownBox("instance").option('value') != null) {
            chuyenMucID = $(`#category-search`).dxDropDownBox("instance").option('value').toString()
        }

        const request = {
            "tuKhoa": tuKhoa,
            "chuyenMucID": chuyenMucID,
            "ngonNgu": ngonNgu,
            "chuyenMucKhac": $('#other-category-search').is(':checked'),
            "tuNgay": formatDateToSearch($('#tu-ngay-search').val()),
            "denNgay": formatDateToSearch($('#den-ngay-search').val()),
            "nguoiCapNhat": Number($('#user-search option:selected').val()),
            "trangThai": Number($('#status-search option:selected').val())
        };
        return JSON.stringify(request);
    };

    $('#btn-filter').on('click', function () {
        saveFilter();
        $('#dataGrid').DataTable().ajax.reload().draw();
        $('#tongSoBaiViet').text($('#dataGrid').DataTable().data.length);
    });

    $('#tat-ca').on('click', function () {
        $('#tu-khoa-search').val("")
        dropdownBox.option('value', null);
        $('#language-search').val('').trigger('change');
        $('#other-category-search').prop('checked', false);
        $('#tu-ngay-search').val("");
        $('#den-ngay-search').val("");
        $('#user-search').val('-1').trigger('change');
        $('#status-search').val('-1').trigger('change');
        $('#dataGrid').DataTable().ajax.reload().draw();

        saveFilter();
    });

    $('#tu-khoa-search').on("keydown", function search(e) {
        if (e.keyCode == 13) {
            saveFilter();
            $('#dataGrid').DataTable().ajax.reload().draw();
            $('#tongSoBaiViet').text($('#dataGrid').DataTable().data.length);
        }
    });

    dtAjax = []

    const tableData = {
        url: `${baseUrl}/api/ThongKeApi/ThongKeBaiViet`,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: buildData,
        dataSrc: function (data) {
            if (data && data.value && data.value.length > 0) {
                for (let i = 0; i < data.value.length; i++) {
                    data.value[i].stt = i + 1;
                }
                $('#tongSoBaiViet').text(data.value.length);
                dtAjax = data.value
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
                if (row.listMedia.length > 0) {
                    return `<div class="center-align hover-container"><span class="text-blue-light hover-span" data-id="${data}">Xem</span></div>
                        <div class="fade-container bg-blue-light position-absolute border rounded p-1 left-align" style="z-index: 1; display: none;"></div>`;
                }
                return '';
            }
        },
        {
            targets: 4,
            render: function (data, type, row, meta) {
                if (!checkEmptyBlank(data)) {
                    return `<span>${moment(data).format('DD/MM/YYYY')}</span>`;
                }
                return '';
            }
        },
        {
            targets: 5,
            render: function (data, type, row, meta) {
                if (!checkEmptyBlank(data)) {
                    return `<span>${moment(data).format('DD/MM/YYYY')}</span>`;
                }
                return '';
            }
        },
        {
            targets: 6,
            render: function (data, type, row, meta) {
                if (!checkEmptyBlank(data)) {
                    return `<span>${moment(data).format('DD/MM/YYYY')}</span>`;
                }
                return '';
            }
        },
        {
            targets: 8,
            render: function (data, type, row, meta) {
                if (data == true) {
                    return`<i data-toggle="tooltip" class="icon-fluent icon_fluent_checkmark_filled text-green" id=n-"${meta.row}"></i>`
                }
                return ''
            }
        }
    ];

    const tableCols = [
        { "data": "stt", "width": "5%", "class": "stt-text center-align" },
        { "data": "tieuDe", "class": "left-align" },
        { "data": "tenChuyenMuc", "width": "18%", "class": "left-align" },
        { "data": "id", "width": "7%" },
        { "data": "createdOnDate", "width": "7%", "class": "center-align" },
        { "data": "ngayCongBo", "width": "7%", "class": "center-align" },
        { "data": "ngayCapNhat", "width": "6%", "class": "center-align" },
        { "data": "tenNguoiCapNhat", "width": "12%", "class": "left-align" },
        { "data": "trangThai", "width": "6%", "class": "center-align" }
    ];

    initDataTableConfig('dataGrid', tableData, tableDefs, tableCols)

    $('#dataGrid tbody').on('mouseenter', '.hover-container', function () {
        var id = $(this).find('.hover-span').data('id');
        if ($(this).parent().find('.fade-container').hide()) {
            getDataWithApi('GET', `/api/MediaApi/GetByBaiViet/${id}`)
                .then((response) => {
                    if (response != null && response.value.length > 0) {
                        $(this).toggleClass('cursor-pointer', response.value.length > 0);
                        var media = '';
                        response.value.forEach(m => {
                            var index = response.value.indexOf(m) + 1;
                            media += `<p class="m-0">${index}. ${m.tenFileMedia}</p>`;
                        })
                        $(this).parent().find('.fade-container').html(media);
                        $(this).siblings('.fade-container').stop().fadeIn();
                    }
                });
        }
    }).on('mouseleave', '.hover-container', function () {
        $(this).siblings('.fade-container').stop().fadeOut();
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

    $('#xuatExcel').on('click', function () {
        ExportExcel();
    });

    function ExportExcel() {
        let tuKhoa = $('#tu-khoa-search').val();
        let ngonNgu = $('#language-search option:selected').val() == '' ? null : $('#language-search option:selected').text();
        let chuyenMucID = null;
        if ($(`#category-search`).dxDropDownBox("instance").option('value') != null) {
            chuyenMucID = $(`#category-search`).dxDropDownBox("instance").option('value').toString()
        }
        let chuyenMucKhac = $('#other-category-search').is(':checked');
        let tuNgay = formatDateToSearch($('#tu-ngay-search').val());
        let denNgay = formatDateToSearch($('#den-ngay-search').val());
        let nguoiCapNhat = $('#user-search option:selected').val();
        let trangThai = $('#status-search option:selected').val();
        var request = `${baseUrl}/api/ThongKeApi/XuatFileExcel?chuyenMucKhac=${chuyenMucKhac}`;
        if (!checkEmptyBlank(tuKhoa)) request += `&tuKhoa=${tuKhoa}`;
        if (!checkEmptyBlank(ngonNgu)) request += `&ngonNgu=${ngonNgu}`;
        if (!checkEmptyBlank(chuyenMucID)) request += `&chuyenMucID=${chuyenMucID}`;
        if (!checkEmptyBlank(tuNgay)) request += `&tuNgay=${tuNgay}`;
        if (!checkEmptyBlank(denNgay)) request += `&denNgay=${denNgay}`;
        if (!checkEmptyBlank(nguoiCapNhat)) request += `&nguoiCapNhat=${nguoiCapNhat}`;
        if (!checkEmptyBlank(trangThai)) request += `&trangThai=${trangThai}`;
        window.location.href = request;
        

        //$.get(`${baseUrl}/api/ThongKeApi/XuatFileExcel`, JSON.stringify(buildData), function (response) {
        //    alert(1)
        //    // Download the Excel file
        //    //var blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        //    //var link = document.createElement('a');
        //    //link.href = window.URL.createObjectURL(blob);
        //    //link.download = "output_excel_file.xlsx";
        //    //link.click();
        //}).fail(function (xhr, status, error) {
        //    console.error("Error:", error);
        //    // Handle error
        //});

        //var request = `${baseUrl}/api/ThongKeApi/XuatFileExcel?chuyenMucKhac=${chuyenMucKhac}`;
        ////if (!checkEmptyBlank(tuKhoa)) request += `&tuKhoa=${tuKhoa}`;
        ////if (!checkEmptyBlank(ngonNgu)) request += `&ngonNgu=${ngonNgu}`;
        ////if (!checkEmptyBlank(chuyenMucID)) request += `&chuyenMucID=${chuyenMucID}`;
        ////if (!checkEmptyBlank(tuNgay)) request += `&tuNgay=${tuNgay}`;
        ////if (!checkEmptyBlank(denNgay)) request += `&denNgay=${denNgay}`;
        ////if (!checkEmptyBlank(nguoiCapNhat)) request += `&nguoiCapNhat=${nguoiCapNhat}`;
        ////if (!checkEmptyBlank(trangThai)) request += `&trangThai=${trangThai}`;

        //window.location.href = request;
    }
});