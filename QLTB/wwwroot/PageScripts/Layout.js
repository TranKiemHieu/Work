function getRootLink() {
    const url = window.location;
    if (!checkEmptyBlank(url.port)) {
        const APIURL = url.protocol + "//" + url.hostname + ":" + url.port;
        return APIURL;
    }

    const APIURLWP = url.protocol + "//" + url.hostname;
    
    return APIURLWP;
};

const DEFAULT_LANG = "vi";

let loadingCountFlag = 0;

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = CHARACTERS.length;
    for (let i = 0; i < length; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

function toggleLoadingModal(type) {
    if (Number(type) == 0) {
        //HIDE
        loadingCountFlag--;

        if (loadingCountFlag == 0) {
            if (!($('#modalLoadingData').hasClass('d-none'))) {
                $('#modalLoadingData').addClass('d-none')
            }
        }
    }
    else if (Number(type) == 1) {
        //SHOW
        if (loadingCountFlag == 0) {
            if ($('#modalLoadingData').hasClass('d-none')) {
                $('#modalLoadingData').removeClass('d-none')
            }
        }

        loadingCountFlag++;
    }
};

function initSelect2() {
    $('.select-ns').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: -1,
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });

    $('select:not(.select-ns)').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });

    $('select.hid-dup-slt:not(.select-ns)').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body'),
        templateResult: function (option, container) {
            //VER 1.0
            if ($(option.element).attr("data-s2hid") == "true") {
                $(container).css("display", "none");
                //$(container).prop('disabled', true);
            }

            if ($(option.element).attr("data-s2fhid") == "true") {
                $(container).css("display", "none");
                //$(container).prop('disabled', true);
            }

            //VER 2.0
            //if ($(option.element).attr("data-s2fhid") == "true") {
            //    $(container).css("display", "none");
            //    $(container).prop("disabled", true);
            //}
            //else if ($(option.element).attr("data-s2fhid") == "false") {
            //    $(option.element).prop("disabled", false);
            //}

            //if ($(option.element).attr("data-s2hid") == "true") {
            //    $(container).css("display", "none");
            //    $(option.element).prop("disabled", true);
            //}
            //else if ($(option.element).attr("data-s2hid") == "false") {
            //    $(option.element).prop("disabled", false);
            //}

            return option.text;
        }
    });
};

function initDateTimePicker() {
    $('.dd-mm-yyyy').datetimepicker({
        "allowInputToggle": true,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "DD/MM/YYYY",
        "locale": 'vi',
    })

    $('.mm-yyyy').datetimepicker({
        "allowInputToggle": true,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "MM/YYYY",
        "locale": 'vi',
    })

    $('.yyyy').datetimepicker({
        "allowInputToggle": true,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "YYYY",
        "locale": 'vi',
    })

    $('.inputdatetime').datetimepicker({
        "allowInputToggle": true,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "DD/MM/YYYY HH:mm:ss",
        "locale": 'vi',
    })

    $('.hh-mm-ss').datetimepicker({
        "allowInputToggle": true,
        "showClose": false,
        "showClear": false,
        "showTodayButton": false,
        "format": "HH:mm:ss",
        "locale": 'vi',
    })
};

function initTooltip() {
    $('.form-label [data-toggle="tooltip"]').tooltip({
        "container": "div.content-wrapper"
    });
};

function initDataTableConfig(element, api, defs, cols, order) {
    $(`#${element}`).DataTable({
        "pageLength": 20,
        "autoWidth": false,
        "ordering": order == null || order == false ? false : true,
        "bInfo": false,
        "bDestroy": true,
        //"bLengthChange": false,
        "lengthMenu": [5, 10, 15, 20, 25, 50, 100],
        "dom": 'r<"dataTables_inner customize_scrollbar"t>i<"dataTables_bottom"lp>',
        //"dom": '<"dataTables_filter"f>rt<"datatable_bottom datatable_total_button"<"total"<"#total-record-tktd">>i<"dataTables_filter"lp>>',
        "filter": false,
        "order": order != null ? order : [],
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                next: '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                previous: '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
            }
        },
        "ajax": api,
        "columnDefs": defs,
        "columns": cols,
        "fnDrawCallback": function(oSettings) {
            $('.dataTables_length select').addClass('select-ns');

            if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
            } else {
                 $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
            }

            if (oSettings.fnRecordsDisplay() == 0) {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').show();
            }
        }
    });

    $(`#${element}`).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip({
            "container": $('.content-wrapper').length > 0 ? "div.content-wrapper" : "body"
        })
    });

    // $(`#${element}`).DataTable().on('order.dt search.dt', function () {
    //     let i = 1;
    //     $(`#${element}`).DataTable().cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell) {
    //         this.data(i++);
    //     });
    // }).draw();

    $('.dataTables_length select').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: Infinity,
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });
};

function initDataTableDataSourceConfig(element, data, defs, cols, order) {
    $(`#${element}`).DataTable({
        "pageLength": 20,
        "autoWidth": false,
        "ordering": true,
        "bInfo": false,
        //"bLengthChange": false,
        "lengthMenu": [5, 10, 15, 20, 25, 50, 100],
        "dom": 'r<"dataTables_inner customize_scrollbar"t>i<"dataTables_bottom"lp>',
        //"dom": '<"dataTables_filter"f>rt<"datatable_bottom datatable_total_button"<"total"<"#total-record-tktd">>i<"dataTables_filter"lp>>',
        "filter": false,
        "order": order != null ? order : [],
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                next: '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                previous: '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
            }
        },
        "dataSrc": data,
        "columnDefs": defs,
        "columns": cols,
        "fnDrawCallback": function (oSettings) {
            $('.dataTables_length select').addClass('select-ns');

            if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
            }

            if (oSettings.fnRecordsDisplay() == 0) {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').show();
            }
        }
    });

    $(`#${element}`).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip({
            "container": $('.content-wrapper').length > 0 ? "div.content-wrapper" : "body"
        })
    });

    $('.dataTables_length select').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: Infinity,
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });
};

function initDataTableRowGroupConfig(element, api, defs, cols, dataSrc, dataParent, dataScroll) {
    var collapsedGroups = {};

    $(`#${element}`).DataTable({
        //"pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bLengthChange": false,
        //"lengthMenu": [10, 15, 20, 25, 50, 100],
        //"dom": 'rti<"dataTables_bottom"lp>',
        //"dom": '<"dataTables_filter"f>rt<"datatable_bottom datatable_total_button"<"total"<"#total-record-tktd">>i<"dataTables_filter"lp>>',
        "filter": false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                // next: '<i class="ft-chevron-right paging-chevron">',
                // previous: '<i class="ft-chevron-left paging-chevron">'
                next: '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                previous: '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
            }
        },
        "scrollY": '75vh',
        "scrollX": true,
        "scrollCollapse": true,
        "ajax": api,
        "paging": false,
        "columnDefs": defs,
        "columns": cols,
        //"scroller": true,
        // "fnDrawCallback": function(oSettings) {
        //     if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
        //         $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
        //     } else {
        //          $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
        //     }
        // },
        rowGroup: {
            // Uses the 'row group' plugin
            dataSrc: dataSrc != undefined ? dataSrc : false,
            startRender: function (rows, group) {
                if (dataSrc != undefined) {
                    var collapsed = !!collapsedGroups[group]? false : true;
                    var colSpan = $(`#${element}`).DataTable().columns(':visible').count();

                    var data = !checkEmptyBlank(group)? group.substring(group.indexOf('(') + 1).replace(')', '').toLowerCase() : '';
                    var parent = !checkEmptyBlank(dataParent) ? rows.data()[0][`${dataParent}`] : null;
                    rows.nodes().each(function (r) {
                        r.style.display = collapsed ? 'none' : '';
                    });
                    var icon = collapsed ? '<i class="icon-fluent icon_fluent_chevron_down_regular"></i>' : '<i class="icon-fluent icon_fluent_chevron_up_regular"></i>';

                    // Add category name to the <tr>. NOTE: Hardcoded colspan
                    return $('<tr/>')
                        .append('<td colspan="' + (colSpan > 0 ? colSpan : 1) + '" class="bg-blue-light text-medium">' + icon + ' ' + group + (parent != null ? ` (${parent})` : '') + '</td>')
                        .attr('data-name', group)
                        .addClass('cursor-pointer')
                        .toggleClass('collapsed', collapsed)
                        .attr('data-scroll', data == dataScroll.toLowerCase() ? dataScroll : '');
                }
                return $(`#${element} tbody tr.group.group-start`).empty().remove();
            }
        },
    });

    $(`#${element}`).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip({
            "container": $('.content-wrapper').length > 0 ? "div.content-wrapper" : "body"
        })

        if (dataScroll && dataScroll != '') {
            var rowIndex = $(`#${element} tbody tr[data-scroll="${dataScroll}"]`).index();
            if (rowIndex != -1) {
                $(`#${element}`).DataTable().row(rowIndex).scrollTo();
            }
        }
    });

    $(`#${element} tbody`).on('click', 'tr.group-start', function () {
        var name = $(this).data('name');

        collapsedGroups[name] = !collapsedGroups[name];
        $(`#${element}`).DataTable().draw(false);
    });

    // $('.dataTables_length select').select2({
    //     theme: 'bootstrap4',
    //     width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
    //     language: "vi",
    //     placeholder: $(this).data('placeholder'),
    //     minimumResultsForSearch: Infinity,
    //     dropdownParent: $('.content-wrapper')
    // });
}

function initDataTableFooterConfig(element, data, defs, cols, fnFooter, btnCustom) {
    // btnCustom : tùy chỉnh export file
    $(`#${element}`).DataTable({
        "pageLength": 20,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bDestroy": true,
        //"bLengthChange": false,
        "lengthMenu": [5, 10, 15, 20, 25, 50, 100],
        "dom": 'Bfr<"dataTables_inner customize_scrollbar"t>i<"dataTables_bottom"lp>',
        //"dom": '<"dataTables_filter"f>rt<"datatable_bottom datatable_total_button"<"total"<"#total-record-tktd">>i<"dataTables_filter"lp>>',
        "filter": false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                next: '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                previous: '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
            }
        },
        "ajax": data,
        "columnDefs": defs,
        "columns": cols,
        "fnDrawCallback": function (oSettings) {
            $('.dataTables_length select').addClass('select-ns');

            if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
            }

            if (oSettings.fnRecordsDisplay() == 0) {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').show();
            }
        },
        "data" : data,
        "fnFooterCallback": fnFooter,
        "buttons": [ btnCustom ]
    });

    $(`#${element}`).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip({
            "container": $('.content-wrapper').length > 0 ? "div.content-wrapper" : "body"
        })
    });

    $('.dataTables_length select').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: Infinity,
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });
}

function initDataTableDashboardConfig(element, data, defs, cols) {
    $(`#${element}`).DataTable({
        //"pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bLengthChange": false,
        //"lengthMenu": [10, 15, 20, 25, 50, 100],
        "dom": 'r<"dataTables_inner customize_scrollbar"t>i<"dataTables_bottom"lp>',
        "filter": false,
        "language": {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                next: '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                previous: '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
            }
        },
        "ajax": data,
        "columnDefs": defs,
        "columns": cols,
        "fnDrawCallback": function (oSettings) {
            $('.dataTables_length select').addClass('select-ns');

            if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
            }

            if (oSettings.fnRecordsDisplay() == 0) {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').hide();
            } else {
                $(oSettings.nTableWrapper).find('.dataTables_bottom').show();
            }
        }
    });

    $(`#${element}`).on('draw.dt', function () {
        $('[data-toggle="tooltip"]').tooltip({
            "container": $('.content-wrapper').length > 0 ? "div.content-wrapper" : "body"
        })
    });

    $('.dataTables_length select').select2({
        theme: 'bootstrap4',
        width: $(this).data('width') ? $(this).data('width') : $(this).hasClass('w-100') ? '100%' : 'style',
        language: "vi",
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: Infinity,
        dropdownParent: $('.content-wrapper').length > 0 ? $('.content-wrapper') : $('body')
    });
};

// function resizeDatatable(element){
//     $(`#${element}`).DataTable().ajax.reload().draw();
//     console.log('resize')
// }

// window.addEventListener("resizeDatatable", resizeDatatable(element));

function getFileNameFromInput(name) {
    let filename = null;
    if (name && name != "") {
        filename = name.split('.').slice(0, -1).join('.');
    }

    return filename;
};

function checkEmptyBlank(str) {
    if (!str) {
        return true
    }

    if (str == null || str.toString().trim().length === 0) {
        return true
    }

    return false
};

function getFileNameFromUrl(url) {
    let filename = null;
    if (url && url != "") {
        let xuLyFile = null;
        xuLyFile = url.substring(url.lastIndexOf('\\') + 1);
        if (xuLyFile) {
            filename = xuLyFile.substring(xuLyFile.lastIndexOf('/') + 1);
        }
    }

    return filename;
};

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
};

function getExtensionTag(filename) {
    var parts = filename.split('.');
    var extensionFile = parts[parts.length - 1];
    var tagFileClass = "";

    if (extensionFile == 'csv' || extensionFile == 'xlsx' || extensionFile == 'xls') {
        tagFileClass = 'tagfile-success';
    } else if (extensionFile == 'doc' || extensionFile == 'docx') {
        tagFileClass = 'tagfile-info';
    } else if (extensionFile == 'json' || extensionFile == 'jpg') {
        tagFileClass = 'tagfile-warning';
    } else if (extensionFile == 'rdf') {
        tagFileClass = 'tagfile-info-dark';
    } else if (extensionFile == 'pdf') {
        tagFileClass = 'tagfile-danger';
    } else {
        tagFileClass = 'tagfile-dark';
    }

    return `<span class="tagfile ${tagFileClass}">${extensionFile}</span>`
};

function getExtensionTags(arr) {
    if (arr && arr.length > 0) {
        let extlist = [];
        arr.forEach((filename) => {
            let parts = filename.split('.');
            let extension = parts[parts.length - 1];

            extlist.push(extension);
        });

        if (extlist.length > 0) {
            let uniq = [...new Set(extlist)];

            let result = '';

            uniq.forEach((extensionFile) => {
                let tagFileClass = "";

                if (extensionFile == 'csv' || extensionFile == 'xlsx' || extensionFile == 'xls') {
                    tagFileClass = 'tagfile-success';
                } else if (extensionFile == 'doc' || extensionFile == 'docx') {
                    tagFileClass = 'tagfile-info';
                } else if (extensionFile == 'json' || extensionFile == 'jpg') {
                    tagFileClass = 'tagfile-warning';
                } else if (extensionFile == 'rdf') {
                    tagFileClass = 'tagfile-info-dark';
                } else if (extensionFile == 'pdf') {
                    tagFileClass = 'tagfile-danger';
                } else {
                    tagFileClass = 'tagfile-dark';
                }

                result += `<span class="tagfile ${tagFileClass}">${extensionFile}</span>`
            });

            return result;
        };
    }

    return '';
};

function checkFileAccept(filename) {
    if (filename != null && filename != "") {
        const accept = ["doc", "docx", "pdf", "xls", "xlsx", "rtf", "ppt", "pptx", "zip", "rar"];
        let ext = getExtension(filename);
        const chk = accept.indexOf(ext.toLowerCase());

        if (chk != -1) {
            return true;
        }
    }

    return false;
};

function formatDate(date, flag) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            second = d.getSeconds()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        if (hour < 10) hour = '0' + hour
        if (minute < 10) minute = '0' + minute
        if (second < 10) second = '0' + second

        let datepart = [day, month, year].join('/');
        let timepart = [hour, minute, second].join(':');

        return `${datepart} ${timepart}`;
    }

    if (flag == 1) {
        return null;
    }

    return "";
};

//to yyyy-MM-dd
function formatDateWithoutTime(date, flag) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        let datepart = [year, month, day].join('-');

        return `${datepart}`;
    }

    if (flag == 1) {
        return null;
    }

    return "";
};

//formart dd/MM/yyyy hh:mm:ss --> dd/MM/yyyy
function formatShortDate(date, flag) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        let shortDate = [day, month, year].join('/');

        return shortDate;
    }

    if (flag == 1) {
        return null;
    }

    return "";
};

function formatDateMonth(date, flag) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [day, month].join('/');
    }

    if (flag == 1) {
        return null;
    }

    return "";
};

function formatDateSetMax(date, flag) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-');
    }

    if (flag == 1) {
        return null;
    }

    return "";
};

function formatDateToSend(date) {
    if (date != null && date != "") {
        const dateMomentObject = moment(date, "DD/MM/YYYY");
        const dateObject = dateMomentObject.toDate();

        const utcDate = new Date(Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), dateObject.getHours(), dateObject.getMinutes()))

        return utcDate;
    }

    return null;
};

function formatDateToSendWithoutTime(date) {
    if (date != null && date != "") {
        const dateMomentObject = moment(date, "DD/MM/YYYY");
        const dateObject = dateMomentObject.toDate();

        const utcDate = new Date(Date.UTC(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate()))

        return utcDate;
    }

    return null;
};

//Function convert date format dd/MM/yyyy HH:mm:ss -> yyyy-MM-ddTHH:mm:ss
function formatDateToSaveAsString(date) {
    if (date != null && date != "") {
        const dateMomentObject = moment(date, "DD/MM/YYYY HH:mm:ss");
        const dateObject = dateMomentObject.toDate();
        const utcDate = new Date(dateObject.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0];
        
        return utcDate;
    }

    return null;
};

//dd/mm/yyyy -> yyyy-mm-dd
function formatDateToSearch(date) {
    if (date != null && date != "") {
        const newdate = date.split("/").reverse().join("-");

        return newdate;
    }

    return null;
};

//format ddMMyyyyHHmmSS
function formatDateCurrent() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (second < 10) second = '0' + second

    return `${day}${month}${year}${hour}${minute}${second}`
};

function delayAction(time) {
    return new Promise(resolve => setTimeout(resolve, time));
};

function getDataWithApiNgoai(method, uri, data) {
    if (data) {
        return $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            url: uri,
            data: data
        });
    }

    return $.ajax({
        type: method,
        contentType: 'application/json; charset=utf-8',
        url: uri,
    });
};

function getDataWithApi(method, uri, data) {
    const APIURL = getRootLink();

    toggleLoadingModal(1);

    if (data) {
        return $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            url: APIURL + uri,
            data: data,
            error: function (err) {
                console.log(err);
                showNotification(0, 'Đã xảy ra lỗi, vui lòng thử lại sau!')
            },
            complete: function (e) {
                delayAction(100)
                    .then(() => {
                        toggleLoadingModal(0);
                    });
            }
        });
    }

    return $.ajax({
        type: method,
        contentType: 'application/json; charset=utf-8',
        url: APIURL + uri,
        complete: function (e) {
            delayAction(100)
                .then(() => {
                    toggleLoadingModal(0);
                });
        }
    });
};

function getDataWithApiHeader(method, uri, data, header) {
    const APIURL = getRootLink();

    if (data) {
        return $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            headers: header,
            url: APIURL + uri,
            data: data
        });
    }

    return $.ajax({
        type: method,
        contentType: 'application/json; charset=utf-8',
        headers: header,
        url: APIURL + uri,
    });
};

function getDataWithApiNgoaiHeader(method, uri, data, header) {
    if (header) {
        if (data) {
            return $.ajax({
                type: method,
                contentType: 'application/json; charset=utf-8',
                headers: header,
                url: uri,
                data: data
            });
        }

        return $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            headers: header,
            url: uri,
        });
    }
    else {
        if (data) {
            return $.ajax({
                type: method,
                contentType: 'application/json; charset=utf-8',
                url: uri,
                data: data
            });
        }

        return $.ajax({
            type: method,
            url: uri,
        });
    }
};

function getDataWithApiFormData(method, uri, data) {
    const APIURL = getRootLink();

    toggleLoadingModal(1);

    return $.ajax({
        type: method,
        url: APIURL + uri,
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: data,
        complete: function (e) {
            delayAction(100)
                .then(() => {
                    toggleLoadingModal(0);
                });
        }
    });
};

function getDupValue(arr1, arr2) {
    if (arr1 && arr1.length > 0 && arr2 && arr2.length > 0) {
        const intersections = arr1.filter(e => arr2.indexOf(e) !== -1);
        return intersections;
    }

    return null;
};

//Bỏ giá trị dup tại các select khác đã chọn trước đó
$(document).on('change', '.remove-dup-slt', function (e) {
    const current = $(this).attr('id');
    const carr = $(this).val();
    $('.remove-dup-slt').each(function (index, ele) {
        if (current != ele.id) {
            let aarr = $(ele).val();
            const res = getDupValue(carr, aarr);
            if (res && res.length > 0) {
                res.forEach((el) => {
                    const i = aarr.indexOf(el);
                    if (i > -1) {
                        aarr.splice(i, 1);
                    }
                });

                $(ele).val(aarr).trigger('change');
            }
        }
    });
});

//Ẩn giá trị này mà các select khác có thể chọn
$(document).on('change', '.hid-dup-slt', function (e) {
    const current = $(this).attr('id');
    const carr = $(this).val();
    $('.hid-dup-slt').each(function (index, ele) {
        if (current != ele.id) {
            $(ele).children(`option`).attr('data-s2hid', 'false');
            const check = Array.isArray(carr);
            if (carr && carr.length > 0 && check == true) {
                carr.forEach((el) => {
                    const checkLow = $(ele).children(`option[value="${el.toLowerCase()}"]`).length;
                    if (checkLow) {
                        $(ele).children(`option[value="${el.toLowerCase()}"]`).attr('data-s2hid', 'true');
                    }
                    else {
                        $(ele).children(`option[value="${el.toUpperCase()}"]`).attr('data-s2hid', 'true');
                    }
                });
            }
            else if (carr && check == false) {
                const checkLow = $(ele).children(`option[value="${carr.toLowerCase()}"]`).length;
                if (checkLow) {
                    $(ele).children(`option[value="${carr.toLowerCase()}"]`).attr('data-s2hid', 'true');
                }
                else {
                    $(ele).children(`option[value="${carr.toUpperCase()}"]`).attr('data-s2hid', 'true');
                }
            }
        }
    });
});

//VER 2.0
//$(document).on('change', '.hid-dup-slt', function (e) {
//    const current = $(this).attr('id');
//    const carr = $(this).val();
//    $('.hid-dup-slt').each(function (index, ele) {
//        if (current != ele.id) {
//            $(ele).children(`option`).attr('data-s2hid', 'false');
//            if (carr && carr.length > 0) {
//                carr.forEach((el) => {
//                    //Ẩn ở các select khác
//                    const checkLow = $(ele).children(`option[value="${el.toLowerCase()}"]`).length;
//                    if (checkLow) {
//                        $(ele).children(`option[value="${el.toLowerCase()}"]`).attr('data-s2hid', 'true');
//                    }
//                    else {
//                        $(ele).children(`option[value="${el.toUpperCase()}"]`).attr('data-s2hid', 'true');
//                    }
//                });
//            };
//        }
//    });
//});

//$(document).on('select2:unselect', '.hid-dup-slt', function (e) {
//    const current = $(this).attr('id');
//    const carr = $(this).val();
//    const data = e.params.data;

//    let fhid = false;
//    let hid = false;
//    const efhid = $(data.element);
//    if (efhid) {
//        fhid = $(data.element).data('s2fhid');
//        hid = $(data.element).data('s2hid');
//    }

//    if (fhid == true || fhid == 'true') {
//        $(`.hid-dup-slt option[value="${data.id.toLowerCase()}"]`).attr('data-s2fhid', 'false');
//    }

//    if (hid == true || hid == 'true') {
//        $(`.hid-dup-slt option[value="${data.id.toLowerCase()}"]`).attr('data-s2hid', 'false');
//    }
//});

function showNotification(type, message) {
    //0 - danger, 1 - success, 2 - info, 3 - warning
    $('div[data-notify="container"]').remove();
    let icon;
    switch(type) {
        case 0:
            icon = 'icon-fluent icon_fluent_warning_filled';
            type = 'danger';
            break;
        case 1:
            icon = 'icon-fluent icon_fluent_checkmark_circle_filled';
            type = 'success';
            break;
        case 2:
            icon = 'icon-fluent icon_fluent_info_filled';
            type = 'info';
            break;
        case 3:
            icon = 'icon-fluent icon_fluent_warning_filled';
            type = 'warning';
            break;
        default:
            icon = 'icon-fluent icon_fluent_info_filled';
            type = 'info';
    }

    $.notify(
        {
            icon: icon,
            message: message
        },
        {
            type: type,
            delay: 3000,
            placement: {
                from: "bottom",
                align: "center"
            },
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
        }
    );
};

function CheckTagHTML(str) {
    var regex = /<\/?[\w\s]*>|<.+[\W]>/
    return str.match(regex) == null ? false : true;
};

function previewImgUpload(input, des, pre) {
    //input đầu vào
    //id div append ảnh preview
    //id div ảnh có sẵn (trường hợp edit)
    if (input && input.files && input.files[0]) {
        if (pre != null && pre != "") {
            if (!($(`#${pre}`).hasClass('d-none'))) {
                $(`#${pre}`).addClass('d-none')
            };
        };

        var reader = new FileReader();
        reader.onload = function (e) {
            let html = `
                        <div class="imgPreview">
                            <img src="${e.target.result}" />
                            <i class="icon-fluent icon_fluent_dismiss_circle_filled delete-command-btn imgPreviewRemoveBtn" data-parent="${input.id}" data-pre="${pre != null && pre != "" && pre || ""}"></i>
                        </div>
                    `;

            $(`#${des}`).append(html);
        };

        reader.readAsDataURL(input.files[0]);
    }
};

$(document).on('click', '.imgPreviewRemoveBtn', function () {
    const input = $(this).data('parent');
    const parent = $(this).parent('.imgPreview');
    const pre = $(this).data('pre');

    if (parent) {
        parent.remove();
    };

    if (input != null && input != "") {
        $(`#${input}`).val('');
    };

    if (pre != null && pre != "") {
        if ($(`#${pre}`).hasClass('d-none')) {
            $(`#${pre}`).removeClass('d-none')
        };
    };
});

//Find with ElementID/ElementName
function findValueInData(type, data, element, sub, first, findext, distributionext) {
    //type = 0, find with id; = 1, find with name (OD_Element - ID/Name)
    //data - array
    //element - value need to find
    //sub - value need to find in details prop
    //first - get first value only flag
    //findext - get distributionExt flag (if not have elementid 168 - distribution file)
    //distributionext - distribution ext data
    let result = "";

    let repeatable = false;

    if (type == null) {
        type = 0;
    };

    if (data && data.length > 0) {
        let found = [];
        if (type == 0) {
            found = data.filter(x => x.elementID == element);
        }
        else {
            found = data.filter(x => x.elementName == element);
        };

        if (found && found.length > 0) {
            if (sub != null && sub != "") {
                const fs = found.filter(x => x.language == DEFAULT_LANG);
                repeatable = fs[0] && fs[0].repeatable || false;

                if (fs && fs.length > 0) {
                    let fsvalue = [];
                    fs.forEach((el) => {
                        if (type == 0) {
                            const foundfsv = el.detail.filter(x => x.elementID == sub);

                            if (foundfsv && foundfsv.length > 0) {
                                foundfsv.forEach((ele) => {
                                    fsvalue.push(ele);
                                });
                            }
                        }
                        else {
                            const foundfsv = el.detail.filter(x => x.elementName == sub);

                            if (foundfsv && foundfsv.length > 0) {
                                foundfsv.forEach((ele) => {
                                    fsvalue.push(ele);
                                });
                            }
                        };
                    })
                    
                    if (fsvalue && fsvalue.length > 0) {
                        const fdvalue = fsvalue.filter(x => x.language == DEFAULT_LANG);

                        if (fdvalue && fdvalue.length > 0) {
                            if (repeatable == true) {
                                result = [];

                                fdvalue.forEach((el) => {
                                    result.push(el.value);
                                });
                            }
                            else {
                                result = fdvalue[0].value;
                                if (fdvalue[0].typeID == 8 || fdvalue[0].typeID == 9 || fdvalue[0].typeID == 10) {
                                    result = formatDate(fdvalue[0].value);
                                }
                            }
                        }
                        else {
                            result = fsvalue[0].value;
                            if (fsvalue[0].typeID == 8 || fsvalue[0].typeID == 9 || fsvalue[0].typeID == 10) {
                                result = formatDate(fsvalue[0].value);
                            }
                        }
                    }
                }
                else {
                    let fsvalue = [];
                    found.forEach((el) => {
                        if (type == 0) {
                            const foundfsv = el.detail.filter(x => x.elementID == sub);

                            if (foundfsv && foundfsv.length > 0) {
                                foundfsv.forEach((ele) => {
                                    fsvalue.push(ele);
                                });
                            }
                        }
                        else {
                            const foundfsv = el.detail.filter(x => x.elementName == sub);

                            if (foundfsv && foundfsv.length > 0) {
                                foundfsv.forEach((ele) => {
                                    fsvalue.push(ele);
                                });
                            }
                        };
                    })

                    if (fsvalue && fsvalue.length > 0) {
                        const fdvalue = fsvalue.filter(x => x.language == DEFAULT_LANG);

                        if (fdvalue && fdvalue.length > 0) {
                            if (repeatable == true) {
                                result = [];

                                fdvalue.forEach((el) => {
                                    result.push(el.value);
                                });
                            }
                            else {
                                result = fdvalue[0].value;
                                if (fdvalue[0].typeID == 8 || fdvalue[0].typeID == 9 || fdvalue[0].typeID == 10) {
                                    result = formatDate(fdvalue[0].value);
                                }
                            }
                        }
                        else {
                            result = fsvalue[0].value;
                            if (fsvalue[0].typeID == 8 || fsvalue[0].typeID == 9 || fsvalue[0].typeID == 10) {
                                result = formatDate(fsvalue[0].value);
                            }
                        }
                    }
                }
            }
            else {
                const fvalue = found.filter(x => x.language == DEFAULT_LANG);

                if (fvalue && fvalue.length > 0) {
                    repeatable = fvalue[0] && fvalue[0].repeatable || false;
                    if (repeatable == true) {
                        result = [];

                        fvalue.forEach((el) => {
                            result.push(el.value);
                        });
                    }
                    else {
                        result = fvalue[0].value;
                        if (fvalue[0].typeID == 8 || fvalue[0].typeID == 9 || fvalue[0].typeID == 10) {
                            result = formatDate(fvalue[0].value);
                        }
                    }
                }
                else {
                    result = found[0].value;
                    if (found[0].typeID == 8 || found[0].typeID == 9 || found[0].typeID == 10) {
                        result = formatDate(found[0].value);
                    }
                }
            }
        }
    }

    if (first == true && repeatable == true) {
        repeatable = false;
        const last = result[0];
        result = last;
    };

    if (findext == true) {
        if (repeatable == true && result.length == 0) {
            if (distributionext && distributionext.jsonData) {
                result.push(distributionext.jsonData)
            }
        }
        else if (repeatable == false && checkEmptyBlank(result)) {
            if (distributionext && distributionext.jsonData) {
                result = distributionext.jsonData;
            }
        }
    }

    const last = {
        "isArray": repeatable,
        "data": result
    };

    return last;
};

function countFieldInData(type, data, element) {
    //type = 0, find with id; = 1, find with name (OD_Element - ID/Name)
    //data - array
    //element - value need to find to count
    let result = 0;

    if (type == null) {
        type = 0;
    };

    if (data && data.length > 0) {
        let found = [];
        if (type == 0) {
            found = data.filter(x => x.elementID == element);
        }
        else {
            found = data.filter(x => x.elementName == element);
        };

        if (found && found.length > 0) {
            result = found.length;
        };
    }

    return result;
};

//------INPUT RENDER FORM

function returnButtonAddInForm(id, datatype, required, repeat, elementid) {
    //id: id wrapper
    //datatype
    //required - required OD_ClassSchema
    //repeat - repeatable OD_ClassSchema
    //elementid
    if (repeat == true) {
        const btn = `<div class="text-right">
                        <span class="add-field" data-location="${id}" data-foidt="${datatype}" data-foireq="${required}" data-foirep="${repeat}" data-foieid="${elementid}"><i class="icon-fluent icon_fluent_add_filled"></i>Thêm mới</span>
                    </div>`;

        return btn;
    }

    return '';
}

function returnInputInForm(datatype, id, label, required, repeat, value, elementid, type, hid, isedit, metadataid, linkedid, description) {
    //datatype
    //id - id html
    //label for input
    //required - required OD_ClassSchema
    //repeat - repeatable OD_ClassSchema
    //value - set for edit
    //elementid
    //type = 0 - input cho form gốc (có nút thêm mới input cùng element id, div nếu repeat = true). = 1 là input cùng element id được thêm mới
    //isHidden - isHidden OD_ClassSchema
    //isedit - phục vụ delete input, nếu = 2 thì có dấu xóa. = 0 là khởi tạo mặc định form add, không có dấu xóa; = 1 là nhấn nút thêm mới, có dấu xóa -> remove div wrapper; = 2 là edit, có dấu xóa -> mở modal xóa
    //metadataid - ID OD_Metadata, phục vụ xóa dòng metadata khi edit
    //linkedid - LinkedClassID OD_ClassSchema, phục vụ lấy dữ liệu khi DataType = 16

    let html = ``;

    if (hid == true) {
        return html;
    };

    if (type != 1) {
        type = 0;
    };

    if (datatype == 1 && elementid == 2) {
        //string && (description) -> TextArea
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-language-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <textarea id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" maxlength="4000" ${required == true ? 'required' : ''} rows="3">${!checkEmptyBlank(value) ? value : ''}</textarea>
                            <select class="form-control language-control" data-langf="edt-${id}">
                            </select>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 1 && (elementid == 172 || elementid == 173)) {
        //string && (apiHeader|| apiBody) -> TextArea, không có nút thêm dù có repeatable
        let placeholder = `{ "Text": "123" }`;

        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <textarea id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" maxlength="4000" ${required == true ? 'required' : ''} rows="3" placeholder='${placeholder}'>${!checkEmptyBlank(value) ? value : ''}</textarea>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 1 && (elementid == 170 || elementid == 171)) {
        //string && (apiURL || apiMethod) -> Trường hợp không cần chọn ngôn ngữ, không có nút thêm dù có repeatable
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-language-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" maxlength="4000" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 2) {
        //int
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="number" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control input-int-only" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 3) {
        //nonNegativeInteger
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="number" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} min="0" class="form-control input-int-not-negative" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 4) {
        //decimal
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="number" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} min="0" class="form-control" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 5) {
        //unsignedByte
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="number" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} min="0" class="form-control input-byte" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 6) {
        //short
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="number" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control input-num-short" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 7) {
        //boolean
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <select id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" ${required == true ? 'required' : ''}>
                                <option value="1" ${Number(value) == 1 ? 'selected' : ''}>Có</option>
                                <option value="0" ${Number(value) == 1 ? '' : 'selected'}>Không</option>
                            </select>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 8 || datatype == 9) {
        //dateTime
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-datetime-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <div class="input-group date inputdatetime">
                                <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" placeholder="dd/MM/yyyy" ${!checkEmptyBlank(value) ? 'value="' + formatDate(value) + '"' : ''} ${required == true ? 'required' : ''}>
                                <div class="input-group-addon input-group-append">
                                    <div class="input-group-text">
                                        <i class="icon-fluent icon_fluent_calendar_regular"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 10) {
        //dateTime
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-datetime-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <div class="input-group date inputdatetime">
                                <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" placeholder="dd/MM/yyyy" ${!checkEmptyBlank(value) ? 'value="' + formatDate(value) + '"' : ''} ${required == true ? 'required' : ''}>
                                <div class="input-group-addon input-group-append">
                                    <div class="input-group-text">
                                        <i class="icon-fluent icon_fluent_calendar_regular"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 11) {
        //dateTime
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-datetime-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <div class="input-group date hh-mm-ss">
                                <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" placeholder="dd/MM/yyyy" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                                <div class="input-group-addon input-group-append">
                                    <div class="input-group-text">
                                        <i class="icon-fluent icon_fluent_calendar_regular"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 15) {
        //anyURI
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" maxlength="4000" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }
    else if (datatype == 16) {
        //resource
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <select id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} ${!checkEmptyBlank(linkedid) ? 'data-lid="' + linkedid + '"' : ''} class="form-control hid-dup-slt" ${required == true ? 'required' : ''} ${repeat == true ? 'multiple' : ''}>
                            </select>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 17) {
        //img
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <div class="immagePreview" id="edt-${id}-ImgEdit">
                                <img src="/assets/images/icons/imageUpload.png" class="cursor-pointer" />
                                <i class="icon-fluent icon_fluent_dismiss_circle_filled delete-command-btn d-none form-input-file-img-delete" id="edt-${id}-ImgDelete" data-parent="${id}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>
                            </div>
                            <div class="immagePreview" id="edt-${id}-ImgEditPreview">
                            </div>
                            <input type="file" class="form-control d-none" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-iid="${id}" data-type="${datatype}" accept="image/*">
                            <input type="hidden" class="form-control" id="edt-${id}-PreEdit" data-parent="edt-${id}">
                            <input type="hidden" class="form-control" id="edt-${id}-DeleteEdit" value="0" data-parent="edt-${id}"/>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 18 || datatype == 34) {
        //file, distributionFiles
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <input type="file" class="form-control" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-iid="${id}" data-type="${datatype}" ${repeat == true ? 'multiple' : ''}>
                            <div class="file-list" data-parent="edt-${id}"></div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else {
        //string
        html = `
                    ${type == 0 ? `<label for="edt-${id}" class="form-label">${label} ${required == true ? '<span class="text-red">*</span>' : ''} ${!checkEmptyBlank(description) ? `<i data-toggle="tooltip" title="${description}" class="icon-fluent icon_fluent_info_regular text-body"></i>` : ''}</label>` : ``}
                    ${type == 0 ? `<div id="edt-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item field-language-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            ${(isedit == 2 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}></i>` : ``}
                            ${(isedit == 1 && repeat == true) ? `<i class="icon-fluent icon_fluent_dismiss_filled form-input-delete-new"></i>` : ``}
                            <input type="text" id="edt-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} class="form-control" maxlength="4000" ${!checkEmptyBlank(value) ? 'value="' + value + '"' : ''} ${required == true ? 'required' : ''}>
                            <select class="form-control language-control" data-langf="edt-${id}">
                            </select>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                    ${type == 0 ? returnButtonAddInForm(`edt-${id}-wrapper`, datatype, required, repeat, elementid) : ``}
                `;
    }

    $('.form-label [data-toggle="tooltip"]').tooltip({
        "container": "div.content-wrapper"
    })

    // var inputs = document.querySelectorAll('input'), el;
    // var errorMessages = {
    // valueMissing: 'This field is mandatory'
    // };

    // for (var i = 0; i < inputs.length; i++) {
    //     el = inputs[i];
        
    //     el.oninvalid = function (event) {
    //         var target = event.target,
    //             validity = target.validity;
            
    //         target.setCustomValidity("");
            
    //         if (!validity.valid) {
    //         if (validity.valueMissing) {
    //         target.setCustomValidity(el.dataset.errorRequired || errorMessages.valueMissing);
    //         }
    //         }
    //     }
    // }

    // document.addEventListener("DOMContentLoaded", function() {
        
    // })

    // var elements = document.getElementsByTagName("input");
    // for (var i = 0; i < elements.length; i++) {
    //     elements[i].oninvalid = function(e) {
    //         e.target.setCustomValidity("");
    //         if (!e.target.validity.valid) {
    //             e.target.setCustomValidity("Vui lòng điền vào trường này.");
    //         }
    //     };
    //     elements[i].oninput = function(e) {
    //         e.target.setCustomValidity("");
    //     };
    // }

    return html;
};

function returnDetailInForm(datatype, id, label, required, repeat, value, elementid, type, hid, isedit, metadataid, linkedid) {
    //datatype
    //id - id html
    //label for input
    //required - required OD_ClassSchema
    //repeat - repeatable OD_ClassSchema
    //value - set for edit
    //elementid
    //type = 0 - input cho form gốc (có nút thêm mới input cùng element id, div nếu repeat = true). = 1 là input cùng element id được thêm mới
    //isHidden - isHidden OD_ClassSchema
    //isedit - phục vụ delete input, nếu = 2 thì có dấu xóa. = 0 là khởi tạo mặc định form add, không có dấu xóa; = 1 là nhấn nút thêm mới, có dấu xóa -> remove div wrapper; = 2 là edit, có dấu xóa -> mở modal xóa
    //metadataid - ID OD_Metadata, phục vụ xóa dòng metadata khi edit
    //linkedid - LinkedClassID OD_ClassSchema, phục vụ lấy dữ liệu khi DataType = 16

    let html = ``;

    if (hid == true) {
        return html;
    };

    if (type != 1) {
        type = 0;
    };

    if (datatype == 7) {
        //boolean
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <p id="dtl-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}>
                                ${!checkEmptyBlank(value) ? Number(value) == 1 ? 'Có' : 'Không' : ''}
                            </p>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 8 || datatype == 9 || datatype == 10 || datatype == 11) {
        //dateTime
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <p id="dtl-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}>
                                ${!checkEmptyBlank(value) ? formatDate(value) : ''}
                            </p>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 16) {
        //resource
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <div class="d-none">
                                <select id="dtl-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} ${!checkEmptyBlank(linkedid) ? 'data-lid="' + linkedid + '"' : ''} class="form-control" ${required == true ? 'required' : ''} ${repeat == true ? 'multiple' : ''}>
                                </select>
                            </div>
                            <p id="dtl-${id}-show"></p>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 17) {
        //img
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <div class="immagePreview" id="dtl-${id}-ImgEdit">
                                <img src="/assets/images/icons/imageUpload.png" class="cursor-pointer" />
                            </div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else if (datatype == 18 || datatype == 34) {
        //file, distributionFiles
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <input type="hidden" class="form-control" id="dtl-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-iid="${id}" data-type="${datatype}" ${repeat == true ? 'multiple' : ''}>
                            <div class="file-list" data-parent="dtl-${id}"></div>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }
    else {
        //string
        html = `
                    ${type == 0 ? `<label for="dtl-${id}" class="form-label">${label}:</label>` : ``}
                    ${type == 0 ? `<div id="dtl-${id}-wrapper" class="group-field">` : ``}
                        <div class="field-item" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''} data-dtype="${datatype}">
                            <p id="dtl-${id}" data-dtype="${datatype}" data-eid="${elementid}" data-rq="${required == true ? 1 : 0}" data-rp="${repeat == true ? 1 : 0}" ${!checkEmptyBlank(metadataid) ? 'data-mid="' + metadataid + '"' : ''}>${!checkEmptyBlank(value) ? value : ''}</p>
                            </select>
                        </div>
                    ${type == 0 ? `</div>` : ``}
                `;
    }

    return html;
};

$(document).on('click', '.add-field', function () {
    const id = $(this).data('location');

    const datatype = $(this).data('foidt');
    const required = $(this).data('foireq');
    const repeat = $(this).data('foirep');
    const element = $(this).data('foieid');

    if (id) {
        const random = generateString(9);
        const inputadd = returnInputInForm(datatype, random.trim(), "", required, repeat, null, element, 1, false, 1, null, null);
        
        $(`#${id}`).append(inputadd);

        initDateTimePicker();
        initSelect2();
        initLangInput(`edt-${random.trim()}`);
    };
});

$(document).on('click', '.form-input-delete-new', function () {
    $(this).closest('.field-item').remove();
});

$(document).on('blur', '.input-int-only', function () {
    const cval = $(this).val();

    if (cval != null && cval != "") {
        $(this).val(parseInt(cval));
    };
});

$(document).on('blur', '.input-int-not-negative', function () {
    const cval = $(this).val();

    if (cval != null && cval != "") {
        if (Number(cval) < 0) {
            $(this).val(0);
            showNotification(0, 'Dữ liệu phải lớn hơn 0!');
        }
        else {
            $(this).val(parseInt(cval));
        }
    };
});

$(document).on('blur', '.input-byte', function () {
    const cval = $(this).val();

    if (cval != null && cval != "") {
        if (Number(cval) < 0) {
            $(this).val(0);
            showNotification(0, 'Dữ liệu phải lớn hơn 0!');
        }
        else if (Number(cval) > 255) {
            $(this).val(255);
            showNotification(0, 'Dữ liệu phải nhỏ hơn 255!');
        }
        else {
            $(this).val(parseInt(cval));
        }
    };
});

$(document).on('blur', '.input-num-short', function () {
    const cval = $(this).val();

    if (cval != null && cval != "") {
        if (Number(cval) < -32768) {
            $(this).val(-32768);
            showNotification(0, 'Dữ liệu phải lớn hơn -32768!');
        }
        else if (Number(cval) > 32767) {
            $(this).val(32767);
            showNotification(0, 'Dữ liệu phải nhỏ hơn 32767!');
        }
        else {
            $(this).val(parseInt(cval));
        }
    };
});

function initResourceInput(form, limit, callback) {
    //id form
    //limit - id class, trường hợp thuộc class đã khai báo sẽ lọc theo ownercode của tk đăng nhập
    let arrapi = [];
    let arrfunc = [];
    let arrinput = [];

    let arralreadycall = [];
    let arrno = [];

    $(`#${form} select`).each(function (index) {
        const elementId = $(this).data('eid');
        const linked = $(this).data('lid');
        const lang = $(this).data('langf');

        if (linked) {
            const request = {
                "classID": Number(linked),
                "adminFilter": limit && limit.length > 0 && limit.includes(Number(elementId)) || false
            };

            const index = arralreadycall.indexOf(Number(linked));
            if (index != -1) {
                arrno.push(index);
            }
            else {
                arralreadycall.push(Number(linked));
                const max = arralreadycall.length;
                const stt = Number(Number(max) - 1);
                arrno.push(stt);

                arrapi.push(getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request)));
            }
            
            arrfunc.push(setResourceSelect);
            arrinput.push(this);
        }
        else if (elementId == 7) {
            //OD_CCLicense
            const request = {
                "TuKhoa": null,
            };

            const index = arralreadycall.indexOf('license');
            if (index != -1) {
                arrno.push(index);
            }
            else {
                arralreadycall.push('license');
                const max = arralreadycall.length;
                const stt = Number(Number(max) - 1);
                arrno.push(stt);

                arrapi.push(getDataWithApi('POST', `/api/CCLicenseApi/Gets`, JSON.stringify(request)));
            }

            arrfunc.push(setLicenseSelect);
            arrinput.push(this);
        }
        else if (elementId == 21) {
            //OD_Frequency
            const request = {
                "TuKhoa": null,
            };

            const index = arralreadycall.indexOf('frequency');
            if (index != -1) {
                arrno.push(index);
            }
            else {
                arralreadycall.push('frequency');
                const max = arralreadycall.length;
                const stt = Number(Number(max) - 1);
                arrno.push(stt);

                arrapi.push(getDataWithApi('POST', `/api/FrequencyApi/Gets`, JSON.stringify(request)));
            }

            arrfunc.push(setFrequencySelect);
            arrinput.push(this);
        }
        else if (elementId == 171) {
            //API Method
            setApiMethodSelect(this);
        }
        else if (lang) {
            //Language
            const index = arralreadycall.indexOf('language');
            if (index != -1) {
                arrno.push(index);
            }
            else {
                arralreadycall.push('language');
                const max = arralreadycall.length;
                const stt = Number(Number(max) - 1);
                arrno.push(stt);

                arrapi.push(getDataWithApi('GET', `/api/LanguageApi/Gets`));
            }

            arrfunc.push(setLanguageSelect);
            arrinput.push(this);
        }
    });

    if (arrapi.length > 0) {
        Promise.all(arrapi)
            .then((data) => {
                for (let i = 0; i < arrno.length; i++) {
                    arrfunc[i](arrinput[i], data[arrno[i]]);
                }
            })
            .then(() => {
                if (callback) {
                    callback();
                };
            });
    }
    else {
        if (callback) {
            callback();
        };
    }

    $(`#${form} input`).each(function (index) {
        const elementId = $(this).data('eid');

        if (elementId == 48 || elementId == 56) {
            //Img file
            const tid = $(this).data('iid');
            imgUploadForm(tid);
        }
    });
};

function initLangInput(id, callback) {
    //Khi nhấn nút thêm mới
    let arrfunc = [];
    let arrinput = [];
    $(`select[data-langf="${id}"]`).each(function (index) {
        //Language
        arrfunc.push(setLanguageSelect);
        arrinput.push(this);
    });

    getDataWithApi('GET', `/api/LanguageApi/Gets`)
        .then((data) => {
            for (let i = 0; i < arrinput.length; i++) {
                arrfunc[i](arrinput[i], data);
            }
        })
        .then(() => {
            if (callback) {
                callback();
            };
        });;
};

function setResourceSelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        let arr = [];
        data.value.forEach((el) => {
            const fil = el.data.filter(x => (x.elementID == 1) || (x.elementID == 12) || (x.elementID == 24));

            if (fil && fil.length > 0) {
                const res = findValueInData(0, el.data, fil[0].elementID, null, true);
                const show = renderDataToShow(res);

                const sl = {
                    "uri": el.resourceID,
                    "show": show
                };

                arr.push(sl);

                //$(input).append(`<option value="${el.uri}">${show}</option>`);
            }
            else {
                const filt = el.data.find(x => x.typeID == 1);
                if (filt) {
                    const res = findValueInData(0, el.data, filt.elementID, null, true);
                    const show = renderDataToShow(res);

                    const sl = {
                        "uri": el.resourceID,
                        "show": show
                    };

                    arr.push(sl);

                    //$(input).append(`<option value="${el.uri}">${show}</option>`);
                }
            }
        });

        arr.sort((a, b) => a.show.toLowerCase().localeCompare(b.show.toLowerCase()));
        
        arr.forEach((el) => {
            $(input).append(`<option value="${el.uri.toLowerCase() }">${el.show}</option>`);
        });

        $(input).trigger('change');
    }
};

function setLicenseSelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            if (el.inUse == true) {
                $(input).append(`<option value="${el.uri}">${el.name}</option>`);
            }
        });
    }
};

function setFrequencySelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            $(input).append(`<option value="${el.uri}">${el.name}</option>`);
        });
    }
};

function setApiMethodSelect(input) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    //if (Number(req) != 1 && Number(rep) != 1) {
    //    $(input).append(`<option value="">Chọn</option>`);
    //};

    const data = [
        {
            "value": "get",
            "name": "GET"
        },
        {
            "value": "post",
            "name": "POST"
        }
    ];

    data.forEach((el) => {
        $(input).append(`<option value="${el.value}">${el.name}</option>`);
    });
};

function setLanguageSelect(input, data, flag) {
    //flag - trường hợp thuộc tính dcterms:language -> cần lưu uri
    $(input).empty();

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            if (flag == true) {
                if (el.code == "vi") {
                    $(input).append(`<option value="${el.uri}" selected>${el.language}</option>`);
                }
                else {
                    $(input).append(`<option value="${el.uri}">${el.language}</option>`);
                }
            }
            else {
                if (el.code == "vi") {
                    $(input).append(`<option value="${el.code}" data-languri="${el.uri}" selected>${el.language}</option>`);
                }
                else {
                    $(input).append(`<option value="${el.code}" data-languri="${el.uri}">${el.language}</option>`);
                }
            }
        });
    }
};

function getOrgSelect(input) {
    $(input).empty();

    const request = {
        "classID": 7,
    };

    const req = $(input).data('rq');
    const rep = $(input).data('rp');
    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request))
        .then((data) => {
            if (data && data.value && data.value.length > 0) {
                data.value.forEach((el) => {
                    const res = findValueInData(0, el.data, 12);
                    const show = renderDataToShow(res);

                    $(input).append(`<option value="${el.resourceID}">${show}</option>`);
                });
            }
        });
};

function setOrgSelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            const res = findValueInData(0, el.data, 12);
            const show = renderDataToShow(res);

            $(input).append(`<option value="${el.resourceID}">${show}</option>`);
        });
    }
};

function getDatasetSelect(input) {
    $(input).empty();

    const request = {
        "classID": 2,
    };

    const req = $(input).data('rq');
    const rep = $(input).data('rp');
    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request))
        .then((data) => {
            if (data && data.value && data.value.length > 0) {
                data.value.forEach((el) => {
                    const res = findValueInData(0, el.data, 1);
                    const show = renderDataToShow(res);

                    $(input).append(`<option value="${el.resourceID}">${show}</option>`);
                });
            }
        });
};

function setDatasetSelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            const res = findValueInData(0, el.data, 1);
            const show = renderDataToShow(res);

            $(input).append(`<option value="${el.resourceID}">${show}</option>`);
        });
    }
};

function getContactSelect(input) {
    $(input).empty();

    const request = {
        "classID": 8,
    };

    const req = $(input).data('rq');
    const rep = $(input).data('rp');
    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request))
        .then((data) => {
            if (data && data.value && data.value.length > 0) {
                data.value.forEach((el) => {
                    const res = findValueInData(0, el.data, 24);
                    const show = renderDataToShow(res);

                    $(input).append(`<option value="${el.resourceID}">${show}</option>`);
                });
            }
        });
};

function setContactSelect(input, data) {
    $(input).empty();

    const req = $(input).data('rq');
    const rep = $(input).data('rp');

    if (Number(req) != 1 && Number(rep) != 1) {
        $(input).append(`<option value="">Chọn</option>`);
    };

    if (data && data.value && data.value.length > 0) {
        data.value.forEach((el) => {
            const res = findValueInData(0, el.data, 24);
            const show = renderDataToShow(res);

            $(input).append(`<option value="${el.resourceID}">${show}</option>`);
        });
    }
};

function imgUploadForm(id) {
    $(document).on('click', `#edt-${id}-ImgEdit > img`, function () {
        $(`#edt-${id}`).click();
    });

    $(document).on('change', `#edt-${id}`, function () {
        previewImgUpload(this, `edt-${id}-ImgEditPreview`, `edt-${id}-ImgEdit`);
    });

    //$(document).on('click', `#edt-${id}-ImgDelete`, function () {
    //    $(`#edt-${id}-ImgEdit img`).attr("src", "/assets/images/icons/imageUpload.png");
    //    $(`#edt-${id}-ImgEdit img`).addClass("cursor-pointer");
    //    if (!($(`#edt-${id}-ImgDelete`).hasClass('d-none'))) {
    //        $(`#edt-${id}-ImgDelete`).addClass('d-none')
    //    };

    //    $(`#edt-${id}-DeleteEdit`).val('1');
    //});
};

//------INPUT RENDER FORM

//Giáo dục -> Giao duc
function removeAccents(str) {
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

//Giáo dục -> Giao-duc
function convertToUrlTitle(str) {
    const con = str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');

    const result = con.replace(/ /g, '-');
    
    return result;
};

function renderDataToShow(data) {
    let result = '';

    if (data.isArray == true && data.data.length > 1) {
        result = data.data.join('; ');
    }
    else if (data.isArray == true && data.data.length == 1) {
        result = data.data[0];
    }
    else {
        result = data.data;
    }

    return result;
};

//Phục vụ select multiple
function convertFindDataToArray(data) {
    let arr = [];

    if (data.isArray == true) {
        arr = data.data;
    }
    else {
        arr.push(data.data);
    }

    return arr;
};

//Đưa dữ liệu vào form edit 
function appendEditDataMetadata(schema, data, form) {
    schema.forEach((el) => {
        if (el.typeID != 17 && el.typeID != 18 && el.typeID != 34) {
            //Không phải là file, img
            const fil = data.filter(x => x.elementID == el.elementID);
            if (el.repeatable == true) {
                if (el.typeID == 16) {
                    //Resource -> select
                    let arr = [];
                    if (fil && fil.length > 0) {
                        fil.forEach((ele) => {
                            arr.push(ele.value.toLowerCase())
                        });

                        const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);

                        $(input).attr('data-mid', fil[0].id);
                        $(input).val(arr).trigger('change');
                    }
                }
                else {
                    if (fil && fil.length > 0) {
                        const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
                        const id = $(input).attr('id');
                        const idwrapper = `${id}-wrapper`;

                        for (let i = 0; i < fil.length; i++) {
                            if (i == 0) {
                                let res = fil[i].value;
                                if (el.typeID == 8 || el.typeID == 9 || el.typeID == 10) {
                                    res = formatDate(fil[i].value);
                                }

                                $(input).attr('data-mid', fil[0].id);
                                $(input).closest('.field-item').attr('data-mid', fil[0].id);
                                $(input).closest('.field-item').find('.form-input-delete').attr('data-mid', fil[0].id);
                                $(input).val(res).trigger('change');

                                //set language
                                const iid = $(input).attr('id');
                                if (iid) {
                                    $(`select[data-langf="${iid}"]`).val(fil[i].language).trigger('change');
                                }
                            }
                            else {
                                let html = ``;

                                const random = generateString(9);
                                const inp = returnInputInForm(fil[i].typeID, random.trim(), !checkEmptyBlank(fil[i].elementNameVN) ? fil[i].elementNameVN : fil[i].elementName, fil[i].required, fil[i].repeatable, fil[i].value, fil[i].elementID, 1, fil[i].isHidden, 2, fil[i].id, null);

                                html = `${inp}`;

                                $(`#${idwrapper}`).append(html);

                                const iid = `edt-${random.trim()}`;

                                function setLanguageForSequeInput() {
                                    //set language
                                    if (iid) {
                                        $(`select[data-langf="${iid}"]`).val(fil[i].language).trigger('change');
                                    }
                                }

                                initSelect2();
                                initLangInput(iid, setLanguageForSequeInput);
                            }
                        };

                        initDateTimePicker();
                    }
                }
            }
            else {
                if (fil && fil.length > 0) {
                    let res = fil[0].value;
                    if (el.typeID == 8 || el.typeID == 9 || el.typeID == 10) {
                        res = formatDate(fil[0].value);
                    }

                    if (el.typeID == 16) {
                        res = fil[0].value.toLowerCase();
                    }

                    const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);

                    $(input).attr('data-mid', fil[0].id);
                    $(input).closest('.field-item').attr('data-mid', fil[0].id);
                    $(input).closest('.field-item').find('.form-input-delete').attr('data-mid', fil[0].id);
                    $(input).attr('data-preslt', res);
                    $(input).val(res).trigger('change');
                }
            }
        }
        else if (el.typeID == 17) {
            //img
            const fil = data.filter(x => x.elementID == el.elementID);

            const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
            const id = $(input).attr('id');

            if (fil && fil.length > 0) {
                $(input).attr('data-mid', fil[0].id);

                let res = fil[0].value;

                $(`#${id}-PreEdit`).val(res).trigger('change');
                if (res != null && res != "") {
                    $(`#${id}-ImgDelete`).removeClass('d-none');
                    $(`#${id}-ImgDelete`).attr('data-mid', fil[0].id);
                    $(`#${id}-ImgEdit img`).removeClass('cursor-pointer');
                    $(`#${id}-ImgEdit img`).attr("src", `${res}`);
                }
            }
            else {
                $(`#${id}-ImgEdit img`).attr("src", "/assets/images/icons/imageUpload.png");
                $(`#${id}-ImgEdit img`).addClass("cursor-pointer");
                if (!($(`#${id}-ImgDelete`).hasClass('d-none'))) {
                    $(`#${id}-ImgDelete`).addClass('d-none')
                };
            }
        }
        else if (el.typeID == 18 || el.typeID == 34) {
            //filel, destributionFiles
            const fil = data.filter(x => x.elementID == el.elementID);
            if (fil && fil.length > 0) {
                const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
                $(input).attr('data-mid', fil[0].id);

                const id = $(input).attr('id');
                const repeat = $(input).attr('data-rp');
                if (Number(repeat) == 0) {
                    $(input).attr('disabled', true);
                };

                let html = '';
                fil.forEach((el) => {
                    html += `<div class="file-item file-download" data-mid="${el.id}">
                                <a class="text-blue-light break-all" href="${el.value}" download>${getFileNameFromUrl(el.value)}</a>
                                <i class="icon-fluent icon_fluent_dismiss_filled text-red form-input-file-delete cursor-pointer" data-mid="${el.id}"></i>
                             </div>`
                });

                const list = $(`.file-list[data-parent="${id}"]`).get(0);
                $(list).append(html);
            }
        }
    });
};

function appendDetailDataMetadata(schema, data, form) {
    schema.forEach((el) => {
        if (el.typeID != 17 && el.typeID != 18 && el.typeID != 34) {
            //Không phải là file, img
            const fil = data.filter(x => x.elementID == el.elementID);

            if (el.repeatable == true) {
                if (el.typeID == 16) {
                    //Resource -> select
                    let arr = [];
                    if (fil && fil.length > 0) {
                        fil.forEach((ele) => {
                            arr.push(ele.value)
                        });

                        const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);

                        $(input).attr('data-mid', fil[0].id);
                        $(input).val(arr).trigger('change');
                        const iid = $(input).attr('id');
                        const show = $(`#${iid}-show`).get(0);

                        //let txt = $(input).children('option:selected').text();
                        let txt = $(input).find("option:selected").map((i, e) => $(e).text()).toArray();

                        let showhtml = ``;
                        if (txt.length > 0) {
                            txt.forEach((el) => {
                                showhtml += `<p class="d-block">${el}</p>`
                            });
                        };

                        $(show).html(showhtml);
                    }
                }
                else {
                    if (fil && fil.length > 0) {
                        const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
                        const id = $(input).attr('id');
                        const idwrapper = `${id}-wrapper`;

                        for (let i = 0; i < fil.length; i++) {
                            if (i == 0) {
                                let res = fil[i].value;
                                if (el.typeID == 8 || el.typeID == 9 || el.typeID == 10) {
                                    res = formatDate(fil[i].value);
                                }

                                $(input).attr('data-mid', fil[0].id);
                                $(input).closest('.field-item').attr('data-mid', fil[0].id);
                                $(input).closest('.field-item').find('.form-input-delete').attr('data-mid', fil[0].id);
                                $(input).text(res);
                            }
                            else {
                                let html = ``;

                                const random = generateString(9);
                                const inp = returnDetailInForm(fil[i].typeID, random.trim(), !checkEmptyBlank(fil[i].elementNameVN) ? fil[i].elementNameVN : fil[i].elementName, fil[i].required, fil[i].repeatable, fil[i].value, fil[i].elementID, 1, fil[i].isHidden, 2, fil[i].id, null);

                                html = `${inp}`;

                                $(`#${idwrapper}`).append(html);
                            }
                        };

                        initDateTimePicker();
                    }
                }
            }
            else {
                if (fil && fil.length > 0) {
                    let res = fil[0].value;
                    if (el.typeID == 8 || el.typeID == 9 || el.typeID == 10) {
                        res = formatDate(fil[0].value);
                    }

                    const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);

                    $(input).attr('data-mid', fil[0].id);
                    $(input).closest('.field-item').attr('data-mid', fil[0].id);
                    $(input).closest('.field-item').find('.form-input-delete').attr('data-mid', fil[0].id);

                    if (el.typeID == 16) {
                        $(input).val(res).trigger('change');
                        const iid = $(input).attr('id');
                        const show = $(`#${iid}-show`).get(0);

                        let txt = $(input).children('option:selected').text();
                        $(show).text(txt);
                    }
                    else if (el.typeID == 7) {
                        //bool
                        $(input).text(Number(res) == 1 ? 'Có' : 'Không');
                    }
                    else {
                        $(input).text(res);
                    }
                }
            }
        }
        else if (el.typeID == 17) {
            //img
            const fil = data.filter(x => x.elementID == el.elementID);

            const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
            const id = $(input).attr('id');

            if (fil && fil.length > 0) {
                $(input).attr('data-mid', fil[0].id);

                let res = fil[0].value;

                if (res != null && res != "") {
                    $(`#${id}-ImgEdit img`).removeClass('cursor-pointer');
                    $(`#${id}-ImgEdit img`).attr("src", `${res}`);
                }
            }
            else {
                $(`#${id}-ImgEdit img`).attr("src", "/assets/images/icons/imageUpload.png");
            }
        }
        else if (el.typeID == 18 || el.typeID == 34) {
            //filel, destributionFiles
            const fil = data.filter(x => x.elementID == el.elementID);
            if (fil && fil.length > 0) {
                const input = $(`#${form} [data-eid="${el.elementID}"]`).get(0);
                $(input).attr('data-mid', fil[0].id);

                const id = $(input).attr('id');
                const repeat = $(input).attr('data-rp');

                let html = '';
                fil.forEach((el) => {
                    html += `<div class="file-download" data-mid="${el.id}">
                                <a class="text-blue-light text-medium" href="${el.value}" download>${getFileNameFromUrl(el.value)} <i class="icon-fluent icon_fluent_arrow_download_filled text-blue-light"></i></a>
                             </div>`
                });

                const list = $(`.file-list[data-parent="${id}"]`).get(0);

                $(list).append(html);
            }
        }
    });
};

function convertToEditData(data, element, value) {
    //element (OD_Element - ID)
    let result = null;

    const resource = data.resourceID;
    const found = data.data.filter(x => x.elementID == element);

    if (found && found.length > 0) {
        const repeat = found[0].repeatable;
        if (repeat == true) {
            let valueList = value;
            const check = Array.isArray(value);
            if (check) {
                valueList = value.join();
            };

            const dt = found[0];
            const res = new Object();
            res.ID = dt.id;
            res.Repeatable = repeat;
            res.ResourceID = resource;
            res.ElementID = dt.elementID;
            res.ValueList = valueList;
            res.Language = dt.language;

            result = res;
        }
        else {
            const dt = found[0];
            const res = new Object();
            res.ID = dt.id;
            res.Repeatable = repeat;
            res.ResourceID = resource;
            res.ElementID = dt.elementID;
            res.ValueList = value;
            res.Language = dt.language;

            result = res;
        }
    }
    else {
        const founds = data.schema.filter(x => x.elementID == element);

        if (founds && founds.length > 0) {
            const repeat = founds[0].repeatable;
            if (repeat == true) {
                let valueList = value;
                const check = Array.isArray(value);
                if (check) {
                    valueList = value.join();
                };

                const dt = founds[0];
                const res = new Object();
                res.ID = 0;
                res.Repeatable = repeat;
                res.ResourceID = resource;
                res.ElementID = dt.elementID;
                res.ValueList = valueList;
                res.Language = "vi";

                result = res;
            }
            else {
                const dt = founds[0];
                const res = new Object();
                res.ID = 0;
                res.Repeatable = repeat;
                res.ResourceID = resource;
                res.ElementID = dt.elementID;
                res.ValueList = value;
                res.Language = "vi";

                result = res;
            }
        }
    }

    return result;
};

//function buildEditDataForMetadata(arr, data, element, value) {
//    const res = convertToEditData(data, element, value);
//    if (res != null) {
//        arr.push(res);
//    }
//};

function buildEditDataForMetadata(odata, ndata) {
    let arr = [];
    let del = [];

    const resource = odata.resourceID;

    let classID = 0;
    if (odata && odata.data && odata.data.length > 0) {
        classID = odata.data[0].classID;
    }

    if (ndata && ndata.length > 0) {
        //metadata ElementID
        const metaid = ndata.map(b => b.ElementID);
        const metaidl = [...new Set(metaid)];

        if (metaidl && metaidl.length > 0) {
            metaidl.forEach((el) => {
                //flag tồn tại dữ liệu trong khối data
                let flag = true;
                let found = odata.data.find(x => x.elementID == el);

                if (!found) {
                    found = odata.schema.find(x => x.elementID == el);
                    flag = false;
                };

                if (found) {
                    const repeat = found.repeatable;

                    if (repeat == true) {
                        const fil = ndata.filter(x => x.ElementID == el);

                        if (fil && fil.length > 0) {
                            let valueList = fil[0].Value;

                            const check = Array.isArray(fil[0].Value);
                            if (check) {
                                //Data từ select multiple
                                //valueList = fil[0].Value.join("|");

                                let arrvalue = [];

                                const findd = odata.data.filter(x => x.elementID == el);
                                
                                //Số lượng data đã chọn trong select multiple
                                const nlength = fil[0].Value.length;
                                //Số lượng data đã lưu trong db
                                const olength = findd.length;

                                if (nlength == 0) {
                                    //Không required -> bỏ chọn tất cả trong select
                                    //Xóa tất cả các dòng có cùng element id và resource id
                                    for (let i = 0; i < olength; i++) {
                                        del.push(findd[i].id);
                                    };
                                }
                                else if (nlength > 0 && nlength == olength) {
                                    //Số lượng data đã chọn hiện tại = số dòng data có trong db, chỉ edit value các dòng
                                    for (let i = 0; i < nlength; i++) {
                                        const str = `${findd[i].id != null && findd[i].id != "" && findd[i].id || 0}::${fil[0].Value[i]}::"vi"`;
                                        arrvalue.push(str);
                                    };
                                }
                                else if (nlength > 0 && nlength > olength) {
                                    //Số lượng data đã chọn hiện tại > số dòng data có trong db, edit value các dòng đã có và thêm dòng
                                    for (let i = 0; i < olength; i++) {
                                        const str = `${findd[i].id != null && findd[i].id != "" && findd[i].id || 0}::${fil[0].Value[i]}::"vi"`;
                                        arrvalue.push(str);
                                    };

                                    for (let j = olength; j < nlength; j++) {
                                        const str = `0::${fil[0].Value[j]}::"vi"`;
                                        arrvalue.push(str);
                                    };
                                }
                                else if (nlength > 0 && nlength < olength) {
                                    //Số lượng data đã chọn hiện tại < số dòng data có trong db, edit value các dòng đã có và xóa dòng dư
                                    for (let i = 0; i < nlength; i++) {
                                        const str = `${findd[i].id != null && findd[i].id != "" && findd[i].id || 0}::${fil[0].Value[i]}::"vi"`;
                                        arrvalue.push(str);
                                    };

                                    for (let j = nlength; j < olength; j++) {
                                        del.push(findd[j].id);
                                    };
                                }

                                valueList = arrvalue.join("|");
                            }
                            else {
                                let arrvalue = [];
                                fil.forEach((ele) => {
                                    //id::value||id::value
                                    const str = `${ele.MetadataID != null && ele.MetadataID != "" && ele.MetadataID || 0}::${ele.Value}::${ele.Language}`;
                                    arrvalue.push(str);
                                });

                                valueList = arrvalue.join("|");
                            }

                            const res = new Object();
                            res.ID = 0;
                            res.Repeatable = repeat;
                            res.ResourceID = resource;
                            res.ElementID = el;
                            res.ValueList = valueList;
                            res.Language = "vi";
                            res.ClassID = classID;

                            arr.push(res);
                        }
                    }
                    else {
                        const fil = ndata.find(x => x.ElementID == el);

                        if (fil) {
                            const str = `${flag == false ? 0 : found.id}::${fil.Value}::${fil.Language}`; 
                            const res = new Object();
                            res.ID = flag == false ? 0 : found.id;
                            res.Repeatable = repeat;
                            res.ResourceID = resource;
                            res.ElementID = el;
                            res.ValueList = str;
                            res.Language = "vi";
                            res.ClassID = classID;

                            arr.push(res)
                        }
                    }
                }
            })
        }
    }

    const res = {
        "Data": arr,
        "Delete": del
    };

    return res;
};

async function buildDataMetadata(type, form, classId, controller, action, schema, fixdata) {
    //type = 0 Add, 1 : Edit
    //form: formId
    let result = {
        "Resource": null,       //Resource data
        "Metadata": null,       //Metadata array
        "Files": null,          //Fiel list
        "FillAll": true,        //Flag fill all required field
        "Del": null,            //Delete metadata id
        "CallSuccess": 0,       //Check call api success - 0: no call, 1 - failed, 2 - success
        "JsonData": null,
        "ContentType": null,    //API response content type -> create file
        "DistributionRequired": 0   //Check Distribution have file/api - 0: none, 1 - file, 2 - api, 3 - both
    };

    let apiDumb = {
        "url": null,
        "method": 'GET',
        "header": null,
        "body": null
    };

    const baseUrl = getRootLink();

    let resource = {
        "ClassID": classId,
        "Name": "",
        //"URI": `${baseUrl}/${controller}/${action}?id=`,
        "URI": `${baseUrl}/${controller}/`,
    };

    let metadata = [];
    let files = [];
    let del = [];

    let checkDistributionFile = false;
    let checkDistributionApi = false;

    $(`#${form} input:not([type=file]), #${form} select, #${form} textarea`).each(function (index) {
        const id = $(this).attr('id');
        const datatype = $(this).data('dtype');
        const elementId = $(this).data('eid');
        const required = $(this).data('rq');
        const repeat = $(this).data('rp');
        const metadataid = $(this).data('mid');
        const value = $(this).val();

        if (elementId) {
            //Thêm tên cho resource khởi tạo metadata
            if ((elementId == 1 || elementId == 12 || elementId == 24) && resource.Name == "") {
                if (!checkEmptyBlank(value)) {
                    resource.Name = ConvertTitleToUrl(value);
                }
            };

            //Chọn multiple
            const checkArray = Array.isArray(value);

            //Không điền đầy đủ trường required
            if (Number(required) == 1 && checkArray == false && checkEmptyBlank(value)) {
                result.FillAll = false;
            }
            else if (Number(required) == 1 && checkArray == true && value.length == 0) {
                result.FillAll = false;
            }
            else if (Number(required) == 1 && checkArray == true && value.length == 1 && (value[0] == "-1" || value[0] == "")) {
                result.FillAll = false;
            };

            if (Number(repeat) == 1 && checkArray == true) {
                //Select multi
                if (value.length > 0) {
                    if (type == 1) {
                        let lang = "vi";
                        if (id) {
                            const langval = $(`select[data-langf="${id}"]`).val();
                            if (langval && !checkEmptyBlank(langval)) {
                                lang = langval;
                            }
                        }

                        //Edit - cần đữ liệu cùng element id trong cùng 1 dòng, value là array
                        const data = {
                            "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                            "ElementID": elementId,
                            "Value": value,
                            "Language": lang
                        };

                        metadata.push(data);
                    }
                    else {
                        let lang = "vi";
                        if (id) {
                            const langval = $(`select[data-langf="${id}"]`).val();
                            if (langval && !checkEmptyBlank(langval)) {
                                lang = langval;
                            }
                        }

                        //Add - cần đữ liệu cùng element id khác dòng, value là string
                        value.forEach((el) => {
                            if (!checkEmptyBlank(el)) {
                                const data = {
                                    "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                                    "ElementID": elementId,
                                    "Value": el,
                                    "Language": lang
                                };

                                metadata.push(data);
                            }
                        });
                    }
                }
                else {
                    //Select multi ko chọn giá trị
                    if (metadataid != null && metadataid != "") {
                        del.push(metadataid);
                    };
                }
            }
            else {
                if (!checkEmptyBlank(value)) {
                    let lang = "vi";
                    if (id) {
                        const langval = $(`select[data-langf="${id}"]`).val();
                        if (langval && !checkEmptyBlank(langval)) {
                            lang = langval;
                        }
                    }

                    let conv = value;
                    if (datatype && (datatype == 8 || datatype == 9 || datatype == 10 || datatype == 11)) {
                        conv = formatDateToSaveAsString(value);
                    }
                    else if (datatype && datatype == 11) {
                        //time, lưu như chuỗi string thường
                    }

                    const data = {
                        "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                        "ElementID": elementId,
                        "Value": conv,
                        "Language": lang
                    };

                    metadata.push(data);
                }
                else {
                    if (metadataid != null && metadataid != "") {
                        del.push(metadataid);
                    };
                }
            };

            if (elementId == 170) {
                //Api URL
                if (!checkEmptyBlank(value)) {
                    checkDistributionApi = true;   //distribution have api

                    const inurl = value;
                    const inmethod = $(`#${form} [data-eid="171"]:not([type=file])`).first().val();
                    const inheader = $(`#${form} [data-eid="172"]:not([type=file])`).first().val();
                    const inbody = $(`#${form} [data-eid="173"]:not([type=file])`).first().val();

                    apiDumb.url = inurl;

                    if (inmethod && !checkEmptyBlank(inmethod)) {
                        apiDumb.method = inmethod;
                    };

                    if (inheader && !checkEmptyBlank(inheader)) {
                        //const convHeader = JSON.parse(inheader);
                        apiDumb.header = inheader;
                    };

                    if (inbody && !checkEmptyBlank(inbody)) {
                        apiDumb.body = inbody;
                    };
                }
            }
        }
    });

    $(`#${form} input[type=file]`).each(function (index) {
        const elementId = $(this).data('eid');
        const required = $(this).data('rq');
        const repeat = $(this).data('rp');
        const metadataid = $(this).data('mid');
        const value = $(this).get(0).files;
        const type = $(this).data('type');

        const inputId = $(this).attr('id');
        const pre = $(`#${inputId}-PreEdit`).val();
        const del = $(`#${inputId}-DeleteEdit`).val();

        if (elementId) {
            //Không điền đầy đủ trường required
            if (Number(required) == 1 && !value[0]) {
                result.FillAll = false;
            };

            if (classId == 3 && value[0]) {
                //upload file in input type file
                checkDistributionFile = true;   //distribution have file
            }
            else if (classId == 3 && !value[0]) {
                //input type file empty
                const check = $(`.file-list[data-parent="${inputId}"]`).get(0).hasChildNodes();
                if (check == true) {
                    checkDistributionFile = true;   //distribution already have file previously
                }
            };

            //Chọn multiple
            if (Number(repeat) == 1) {
                for (let index = 0; index < value.length; index++) {
                    const data = {
                        "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                        "ElementID": elementId,
                        "Value": value[index],
                        "DataType": type,
                        "Pre": pre != null && pre != "" && pre || "",
                        "Delete": Number(del) == 1 ? true : false
                    };

                    files.push(data);
                }
            }
            else {
                const data = {
                    "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                    "ElementID": elementId,
                    "Value": value[0],
                    "DataType": type,
                    "Pre": pre != null && pre != "" && pre || "",
                    "Delete": Number(del) == 1 ? true : false
                };

                files.push(data);
            }

            if (pre != null && pre != "") {
                const data = {
                    "MetadataID": metadataid != null && metadataid != "" && metadataid || "",
                    "ElementID": elementId,
                    "Value": pre,
                    "Language": "vi"
                };

                metadata.push(data);
            }
        }
    });

    if (checkEmptyBlank(resource.Name)) {
        resource.Name = formatDateCurrent();
    };

    if (schema && schema.value && schema.value.length > 0) {
        //Lấy element id có trường req = true && isHidden = false, bỏ giá trị dup từ schema
        const req = schema.value.filter(x => x.required == true && x.isHidden == false);
        const reqid = req.map(a => a.elementID);
        const reqidl = [...new Set(reqid)];

        //Lấy element id từ metadata, bỏ giá trị dup
        const metaid = metadata.map(b => b.ElementID);
        const metaidl = [...new Set(metaid)];

        //Kiểm tra arrreq có mà metaarr không có -> hiện cảnh báo
        const checkreq = reqidl.filter(x => !metaidl.includes(x));
        if (checkreq && checkreq.length > 0) {
            result.FillAll = false;
        }
    };

    if (fixdata && fixdata.length > 0) {
        fixdata.forEach((el) => {
            metadata.push(el);
        })
    };

    if (apiDumb && apiDumb.url != null) {
        try {
            const call = await getDataWithApi('POST', `/api/MetadataApi/CallApi`, JSON.stringify(apiDumb));
            if (call && call.value && call.value.success == true) {
                result.JsonData = call.value.data;
                result.ContentType = call.value.contentType;
                result.CallSuccess = 2;
            }
            else {
                console.log(call);
                result.CallSuccess = 1;
            }

            //await getDataWithApiNgoaiHeader(apiDumb.method, apiDumb.url, apiDumb.body, apiDumb.header)
            //    .then((a, b, c) => {
            //        const contenttype = c.getResponseHeader('Content-Type');
            //        result.JsonData = JSON.stringify(a);
            //        result.ContentType = contenttype;
            //        result.CallSuccess = 2;
            //    })
        }
        catch (ex) {
            console.log(ex);
            result.CallSuccess = 1;
        }
    };

    result.Resource = resource;
    result.Metadata = metadata;
    result.Files = files;
    result.Del = del;

    let checkDistributionRequired = 0;
    if (checkDistributionFile == true && checkDistributionApi == false) {
        checkDistributionRequired = 1;  //-> distribution have file
    }
    else if (checkDistributionFile == false && checkDistributionApi == true) {
        checkDistributionRequired = 2;  //-> distribution have api
    }
    else if (checkDistributionFile == true && checkDistributionApi == true) {
        checkDistributionRequired = 3;  //-> distribution have both
    }

    result.DistributionRequired = checkDistributionRequired;

    return result;
};

function filterContactByOrg(initFlag) {
    $(document).on('change', 'select[data-dtype="16"][data-eid="5"]', function () {
        //input resource -> select của tổ chức thay đổi
        const slt = $(this).val();
        if (!checkEmptyBlank(slt)) {
            const request = {
                "classID": 8,
                "publisher": slt != "-1" ? slt : null,
            };

            getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request))
                .then((data) => {
                    //HIDE
                    //$(`select[data-dtype="16"][data-eid="17"] option:not([value=""])`).attr('data-s2fhid', 'true');
                    //$(`select[data-dtype="16"][data-eid="17"] option:not([value=""])`).prop('disabled', true);
                    //data.value.forEach((el) => {
                    //    //SHOW
                    //    $(`select[data-dtype="16"][data-eid="17"] option[value="${el.resourceID.toLowerCase()}" ]`).attr('data-s2fhid', 'false');
                    //    $(`select[data-dtype="16"][data-eid="17"] option[value="${el.resourceID.toLowerCase()}" ]`).prop('disabled', false);
                    //});

                    $(`select[data-dtype="16"][data-eid="17"]`).each(function () {
                        setResourceSelect(this, data);
                    });
                })
                .then(() => {
                    //set gias trị đầu mối liên hệ
                    $(`select[data-dtype="16"][data-eid="17"]`).each(function () {
                        let curr = $(this).val();
                        let pre = $(this).data('preslt');

                        if (pre) {
                            curr = pre;
                        };

                        if (curr != null) {
                            //let show = $(this).children(`option[value="${curr}"]`).attr('data-s2fhid');
                            let show = $(this).children(`option[value="${curr}"]`).get(0);
                            if (!show) {
                                //trường hợp là select bị ẩn thì chọn option hiện đầu tiên
                                $(this).val($(this).children(`option:first`).val()).trigger('change');
                            }
                            else {
                                $(this).val(curr).trigger('change');
                            }
                        }
                        else {
                            $(this).val($(this).children(`option:first`).val()).trigger('change');
                        }
                    });
                });
        }
    });
};

function accessLevelControl(resourceid) {
    if (resourceid != null && resourceid != "") {
        getDataWithApi('GET', `/api/MetadataApi/GetChild?resourceid=${resourceid}&elementid=22`)
            .then((data) => {
                if (data && data.value && data.value.length > 0) {
                    $(`select[data-dtype="7"][data-eid="60"]`).each(function () {
                        $(this).attr('disabled', false);
                    });
                }
                else {
                    $(`select[data-dtype="7"][data-eid="60"]`).each(function () {
                        $(this).val("0").trigger("change");
                        $(this).attr('disabled', true);
                    });
                }
            });
    }
    else {
        $(`select[data-dtype="7"][data-eid="60"]`).each(function () {
            $(this).val("0").trigger("change");
            $(this).attr('disabled', true);
        });
    }
};

function checkValidate(id, message) {
    $(`#${id}`).text('');
    $(`#${id}`).addClass('show');
    $(`#${id}`).text(message);
};

$(document).on('hidden.bs.modal', function() {
	if ($('.modal.show').length) {
		$('body').addClass('modal-open');
	}
});

function ConvertTitleToUrl(str) {
    
    if (str.length > 0) {
        str.trim();
        str = str.toLowerCase();
    }
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "T");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    var url = str.split(" ");
    var strUrl = []
    for (var i = 0; i < url.length; i++) {
        if (!checkEmptyBlank(url[i])) {
            strUrl.push(url[i])
        }
    }
   
    return strUrl.join('-')
};

function removeAllSpace(str) {
    return str.replace(/\s/g, '')
}


function GetClassExtension(extension) {
    var extensionClass = '';

    if (extension != null && extension != '' && extension != 'Not found') {
        if (extension == '.pdf') extensionClass = "tagfile tagfile-danger";
        else if (extension == '.doc' || extension == '.docx') extensionClass = "tagfile tagfile-info";
        else if (extension == '.xls' || extension == '.xlsx' || extension == '.csv') {
            extensionClass = "tagfile tagfile-success";
        } else if (extension == '.json' || extension == '.jpg' || extension == '.jpeg') {
            extensionClass = "tagfile tagfile-warning";
        } else if (extension == '.rdf' || extension == '.xml') {
            extensionClass = "tagfile tagfile-info-dark";
        } else {
            extensionClass = "tagfile tagfile-dark";
        }
    }

    return extensionClass;
}

function GetInputAddToForm(idElement, loai, value = null, linkedID = null, list = null, name = 'Giá trị thiết lập') {
    var id = '';
    if (idElement.indexOf('valueTS') != -1) {
        id = idElement.replace('valueTS', '');
    }
    else {
        id = idElement;
    }
    var str = ``;
    switch (loai) {
        case 2: //bool
            str = `<div class="group-check group-check-inline">
                            <div class="form-check icheck-primary form-check-inline">
                                <label class="form-label form-check-label" for="chk-${id}">${name}</label>
                                <label for="chk-${id}"></label>
                                <input class="form-check-input element-item" type="checkbox" data-type="${loai}" value="" id="chk-${id}" ${!checkEmptyBlank(value) && value == '1' ? 'checked' : ''}>
                            </div>
                        </div>`;
            break;
        case 5: //datetime
        case 6: //date
            str = `<label class="form-label">${name}</label>
                <div class="input-group date dd-mm-yyyy">
                    <input type="text" class="form-control element-item" data-type="${loai}" placeholder="dd/MM/yyyy" id="dt-${id}" value="${!checkEmptyBlank(value) ? moment(value).format('DD/MM/YYYY') : ''}" />
                    <div class="input-group-addon input-group-append">
                        <div class="input-group-text">
                            <i class="icon-fluent icon_fluent_calendar_regular"></i>
                        </div>
                    </div>
                </div>`;
            break;
        case 8: //image
            str = `<label for="edt-${id}" class="form-label">${name}</label>
                    <div id="edt-${id}-wrapper" class="group-field">
                        <div class="field-item" data-dtype="${loai}">
                            <div class="immagePreview" id="edt-${id}-ImgEdit">
                                <img src="/assets/images/icons/imageUpload.png" class="cursor-pointer" />
                                <i class="icon-fluent icon_fluent_dismiss_circle_filled delete-command-btn d-none form-input-file-img-delete" id="edt-${id}-ImgDelete" data-parent="${id}"></i>
                            </div>
                            <div class="immagePreview" id="edt-${id}-ImgEditPreview">
                            </div>
                            <input type="file" class="form-control d-none element-item" id="edt-${id}" data-dtype="${loai}"  data-iid="${id}" data-type="${loai}" accept="image/*">
                            <input type="hidden" class="form-control" id="edt-${id}-PreEdit" data-parent="edt-${id}">
                            <input type="hidden" class="form-control" id="edt-${id}-DeleteEdit" value="0" data-parent="edt-${id}" />
                            </div>
                    </div>`;
            break;
        case 9: //file
            str = `<label for="edt-File-${id}" class="form-label">${name}</label>
                <div id="edt-File-${id}-wrapper" class="group-field">
                    <div class="field-item" data-dtype="${loai}">
                       <input type="file" class="form-control element-item" id="edt-File-${id}" data-dtype="${loai}" data-iid="${id}" data-type="${loai}" title="" ${!checkEmptyBlank(value) ? 'disabled' : ''}>
                       <div class="file-list" data-parent="edt-File-${id}"></div>
                    </div>
                </div>
                <div id="fileUpload"></div>`;
            break;
        case 10: //select
            if (linkedID == 4) {
                str = `<label for="select-${id}" class="form-label">${name}</label>
                    <div class="form-control element-item" id="select-${id}" data-type="${loai}"></div>`;
            } else {
                str = `<label for="select-multiple-${id}" class="form-label">${name}</label>
                    <div class="form-control element-item" id="select-multiple-${id}" data-type="${loai}"></div>`;
            }
            break;
        case 11: //content
            str = `<label for="content-${id}" class="form-label">${name}</label>
                   <textarea class="form-control element-item" id="content-${id}" data-type="${loai}" rows="3" maxlength="500">${value != null ? value : ''}
                   </textarea>
                   <input type="hidden" id="content-${id}-value" value=""/>`;
            break;
        default:
            str = `<label for="txt-${id}" class="form-label">${name}</label>
              <input type="text" class="form-control element-item ddbx_item" id="txt-${id}" data-type="${loai}" maxlength="128" value="${value != null ? value : ''}">`;
            break;
    }
    $(`#${idElement}`).html(str);
    InputValueEvent(idElement, loai, linkedID, value, list);
    
}

function InputValueEvent(idElement, loai, linkedID = null, value = null, list = null) {
    var id = '';
    if (idElement.indexOf('valueTS') != -1) {
        id = idElement.replace('valueTS', '');
    }
    else {
        id = idElement;
    }
    if (loai == 8) {
        if (!checkEmptyBlank(value)) {
            $(`#edt-${id}-PreEdit`).val(value).trigger('change');
            $(`#edt-${id}-ImgDelete`).removeClass('d-none');
            $(`#edt-${id}-ImgEdit img`).removeClass('cursor-pointer');
            $(`#edt-${id}-ImgEdit img`).attr("src", `${value}`);
        }
        else {
            $(`#edt-${id}-ImgEdit img`).attr("src", "/assets/images/icons/imageUpload.png");
            $(`#edt-${id}-ImgEdit img`).addClass("cursor-pointer");
            if (!($(`#edt-${id}-ImgDelete`).hasClass('d-none'))) {
                $(`#edt-${id}-ImgDelete`).addClass('d-none')
            };
        }

        $(document).off('click', `#edt-${id}-ImgEdit > img`);
        $(document).off('change', `#edt-${id}`);
        $(document).off('click', `#edt-${id}-ImgDelete`);
        $(document).on('click', `#edt-${id}-ImgEdit > img`, function (e) {
            $(`#edt-${id}`).click();
        });

        $(document).on('change', `#edt-${id}`, function () {
            previewImgUpload(this, `edt-${id}-ImgEditPreview`, `edt-${id}-ImgEdit`);
        });

        $(document).on('click', `#edt-${id}-ImgDelete`, function () {
            $(`#edt-${id}-ImgEdit img`).attr("src", "/assets/images/icons/imageUpload.png");
            $(`#edt-${id}-ImgEdit img`).addClass("cursor-pointer");
            if (!($(`#edt-${id}-ImgDelete`).hasClass('d-none'))) {
                $(`#edt-${id}-ImgDelete`).addClass('d-none')
            };
            $(`#edt-${id}-DeleteEdit`).val('1');
        });
    }
    else if (loai == 9) {
        if (!checkEmptyBlank(value)) {
            var html = `<div class="file-item file-download" id="fileMedia">
                                <a class="text-blue-light break-all" href="" download>${convertToUrlTitle(value)}</a>
                                <i class="icon-fluent icon_fluent_dismiss_filled text-red form-input-file-delete cursor-pointer" data-target="#fileMedia"></i>
                                <input type="hidden" id="preFile" value="${value}" />
                             </div>`;
            $(`#fileUpload`).html(html);
        }

        $(document).off('click', `#${idElement} .form-input-file-delete`);
        $(document).on('click', `#${idElement} .form-input-file-delete`, function () {
            $('#fileMedia').remove();
            $(`#edt-File-${id}`).prop('disabled', false);
        });
    }
    else if (loai == 10) { //select

        if (linkedID != 4 && linkedID != 5) {
            getMultiDropDownBox(id, linkedID, list, value);
        }
        else {
            getSingleDropDownBox(id, list, value);
        }
    }
    else if (loai == 11) { //content
        editorNoiDungEdit = CKEDITOR.replace(`content-${id}`, {
            language: 'vi-vn',
            extraPlugins: 'confighelper',
            placeholder: 'Nhập nội dung',
            //toolbar: "Full",
            filebrowserUploadUrl: '/File/UploadAdapter?subDirectory=BaiViet',
            filebrowserImageUploadUrl: '/File/UploadAdapter?subDirectory=BaiViet&type=img',
            clipboard_handleImages: false,
        });

        if (!checkEmptyBlank(value)) {
            editorNoiDungEdit.setData(value);
        }
    }
}

function GetValueInput(idElement, loai, linked = null) {
    var id = '';
    if (idElement.indexOf('valueTS') != -1) {
        id = idElement.replace('valueTS', '');
    }
    else {
        id = idElement;
    }
    if (loai == 2) {
        return $(`#chk-${id}`).prop('checked') ? '1' : '0';
    }
    else if (loai == 5 || loai == 6) {
        return $(`#dt-${id}`).val();
    }
    else if (loai == 8) {
        return $(`#edt-${id}`).length > 0 ? $(`#edt-${id}`).get(0).files : [];
    }
    else if (loai == 9) {
        return $(`#edt-File-${id}`).length > 0 ? $(`#edt-File-${id}`).get(0).files : [];
    }
    else if (loai == 10) {
        if (linked == 4) {
            return $(`#select-${id}`).dxDropDownBox("instance").option('value').toString();
        }
        else {
            return $(`#select-multiple-${id}`).dxDropDownBox("instance").option('value').toString();
        }
    }
    else if (loai == 11) {
        var editor = CKEDITOR.instances[`#content-${id}`];
        return editor ? editor.getData() : '';
    }
    return $(`#txt-${id}`).val();

   
}
(function ($) {
    $.fn.inputFilter = function (callback, errMsg) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop focusout", function (e) {
            if (callback(this.value)) {
                // Accepted value
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    $(this).removeClass("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                $(this).addClass("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    };
}(jQuery));
$('.check-sdt').inputFilter(function (value) {
    return /^[0-9.+-\s\(\)]*$/.test(value);
}, "Số điện thoại chỉ bao gồm ký tự số, khoảng trắng và các ký tự +, - , (), dấu .");
$('.check-vido').inputFilter(function (value) {
    return (/^[0-9.]*$/.test(value) && value >= -90 && value <= 90);
}, "Vĩ độ phải có giá trị lớn hơn -90 và nhỏ hơn 90");
$('.check-kinhdo').inputFilter(function (value) {
    return (/^[0-9.]*$/.test(value) && value >= -180 && value <= 180);
}, "Vĩ độ phải có giá trị lớn hơn -180 và nhỏ hơn 180");
function checkEmail(str) {
    return true;
    // return /^(([^<>()\[\]\\.,;:\s@@"]+(\.[^<>()\[\]\\.,;:\s@@"]+)*)|(".+"))@@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str)
}
function checkURL(str) {
    var regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    return regex.test(str)
}

function getSingleDropDownBox(id, list, value = null) {
    let treeViewDropdownBox_single;
    var $element = $(`#select-${id}`);

    const itemDropdownBoxRenderedHandler = (evt) => {
        const { itemData, itemElement } = evt;
        const [htmlElement] = itemElement;
        if (!itemData.isLeaf) {
            const checkBoxItem = htmlElement.parentNode.querySelector(".dx-checkbox");
            if (checkBoxItem) checkBoxItem.classList.add("dx-state-disabled");
            const treeViewItem =
                htmlElement.parentNode.querySelector(".dx-treeview-item");
            //if (treeViewItem) treeViewItem.classList.add("dx-state-disabled");
        }
    };

    const syncTreeViewSelection_single = function (treeViewInstance, value) {
        if (!value) {
            treeViewInstance.unselectAll();
        } else {
            treeViewInstance.selectItem(value);
        }
    };

    if ($element.hasClass("dx-dropdowneditor")) {
        var dropDownBoxInstance = $element.dxDropDownBox("instance");
        dropDownBoxInstance.dispose();
    }
   
    $(`#select-${id}`).dxDropDownBox({
        dataSource: list,
        valueExpr: "id",
        displayExpr: "description",
        placeholder: "Chọn kiểu view",
        showClearButton: true,
        //inputAttr: { "aria-label": "Owner" },
        elementAttr: {
            class: "form-control",
        },
        contentTemplate(e) {
            const $treeView = $("<div>").dxTreeView({
                dataSource: e.component.getDataSource(),
                dataStructure: "plain",
                parentIdExpr: "",
                keyExpr: "id",
                displayExpr: "description",
                searchEnabled: true,
                noDataText: "Không tìm thấy dữ liệu",
                selectionMode: "single",
                showCheckBoxesMode: "none",
                selectNodesRecursive: false,
                selectByClick: true,
                onContentReady(args) {
                    const value = e.component.option("value");
                    syncTreeViewSelection_single(args.component, value);
                },
                onItemSelectionChanged(args) {
                    const selectedKeys = args.component.getSelectedNodeKeys();
                    e.component.option("value", selectedKeys);
                },
                onItemRendered: itemDropdownBoxRenderedHandler,
            });

            treeViewDropdownBox_single = $treeView.dxTreeView("instance");

            $treeView.find('.dx-treeview-search')[0].classList.add('border');
            $treeView.find('.dx-treeview-search')[0].classList.add('rounded');
            $treeView.find('.dx-searchbox.dx-editor-filled .dx-icon-search').css({
                "right": "0"
            });

            e.component.on("valueChanged", (args) => {
                syncTreeViewSelection_single(treeViewDropdownBox_single, args.value);
                e.component.close();
            });

            return $treeView;
        },
    }).dxDropDownBox("instance");

    if (!checkEmptyBlank(value)) {
        $(`#select-${id}`).dxDropDownBox("instance").option('value', Number(value));
    }
}

function getMultiDropDownBox(id, linkedID, list, value = null) {
    let treeViewDropdownBox_select;
    var $element = $(`#select-multiple-${id}`);
    var name = '';
    var parent = '';
    if (linkedID == 1) {
        name = 'tenChuyenMuc';
        parent = 'chuyenMucCapChaID';
    } else if (linkedID == 2) {
        name = 'tieuDe';
        parent = '';
    } else if (linkedID == 3) {
        name = 'tieuDe';
        parent = '';
    }

    const syncTreeViewSelection_Select = function (treeViewInstance1, value) {
        if (!value) {
            treeViewInstance1.unselectAll();
            return;
        }

        value.forEach((key) => {
            treeViewInstance1.selectItem(key);
        });
    };

    if ($element.hasClass("dx-dropdowneditor")) {
        var dropDownBoxInstance = $element.dxDropDownBox("instance");
        dropDownBoxInstance.dispose();
    }

    $(`#select-multiple-${id}`).dxDropDownBox({
        dataSource: list,
        valueExpr: 'id',
        displayExpr: name,
        placeholder: 'Chọn',
        showClearButton: true,
        //  inputAttr: { 'aria-label': 'Owner' },
        contentTemplate(e) {

            const $treeView = $('<div>').dxTreeView({
                dataSource: e.component.getDataSource(),
                dataStructure: 'plain',
                keyExpr: 'id',
                parentIdExpr: parent,
                noDataText: "Không tìm thấy dữ liệu",
                selectionMode: 'multiple',
                displayExpr: name,
                searchEnabled: true,
                selectByClick: true,
                onContentReady(args) {
                    const v = e.component.option('value');
                    syncTreeViewSelection_Select(args.component, v);
                },
                selectNodesRecursive: false,
                showCheckBoxesMode: 'normal',
                onItemSelectionChanged(args) {
                    const selectedKeys = args.component.getSelectedNodeKeys();
                    e.component.option('value', selectedKeys);
                },
            });

            treeViewDropdownBox_select = $treeView.dxTreeView('instance');

            $treeView.find('.dx-treeview-search')[0].classList.add('border');
            $treeView.find('.dx-treeview-search')[0].classList.add('rounded');
            $treeView.find('.dx-searchbox.dx-editor-filled .dx-icon-search').css({
                "right": "0"
            });

            e.component.on('valueChanged', (args) => {
                const { value } = args;
                syncTreeViewSelection_Select(treeViewDropdownBox_select, value);
            });

            return $treeView;
        },
    }).dxDropDownBox("instance");

    if (!checkEmptyBlank(value)) {
        $(`#select-multiple-${id}`).dxDropDownBox("instance").option('value', value.toLowerCase().split(","));
    }
}