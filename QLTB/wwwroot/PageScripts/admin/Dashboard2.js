const baseUrl = getRootLink();
const pageSize = 10;

$(document).ready(function () {

    // call API promise.all
    Promise.all([
        getDataWithApi('POST', '/BaiVietApi/ThongKe', null),
        getDataWithApi('POST', '/api/BaiVietApi/ThongKeTheoNgay', null),
        getDataWithApi('POST', '/api/ChuyenMucApi/TopChuyenMuc?soLuong=10', null),
        getDataWithApi('POST', '/api/BaiVietApi/BaiVietGanDay?soLuong=10', null)
    ])
        .then(([dataThongKe, dataThongKeTheoNgay, dataTopChuyenMuc, dataBaiVietGanDay]) => {
            console.log(dataThongKe);
            console.log(dataThongKeTheoNgay);
            console.log(dataTopChuyenMuc);
            console.log(dataBaiVietGanDay);

            let ngayCongBo = [], tongSoChuyenMuc = [], tongSoBaiViet = [], tongSoLuotTai = []

            let chartData = dataThongKeTheoNgay.value;
            let dataTableThongke = dataBaiVietGanDay.value;
            let dataTableChuyenMuc = dataTopChuyenMuc.value;

            chartData.forEach(item => {
                ngayCongBo.push(moment(item.ngayCongBo).format('DD/MM/YYYY'));
                tongSoChuyenMuc.push(item.tongSoChuyenMuc);
                tongSoBaiViet.push(item.tongSoBaiViet);
                tongSoLuotTai.push(item.tongSoLuotTai);
            }); 

            const loadHighcharts = (tc, sl, lx, lt) => {
                let series = []
                let plotOptions = {}

                if (tc.length > 1) {
                    plotOptions = {
                        column: {
                            borderRadius: '4px',
                        }
                    }

                    series = [
                        {
                            name: 'Tổng số chuyên mục',
                            type: 'column',
                            data: sl,
                            color: '#0074E8'
                        },
                        {
                            name: 'Tổng số bài viết',
                            type: 'spline',
                            yAxis: 1,
                            data: lx,
                            color: '#0AB175',
                            marker: {
                                lineWidth: 2,
                                lineColor: '#0AB175',
                                fillColor: '#fff'
                            }
                        }, {
                            name: 'Tổng số lượt tải',
                            type: 'spline',
                            yAxis: 1,
                            data: lt,
                            color: '#0B4DCE',
                            marker: {
                                lineWidth: 2,
                                lineColor: '#0B4DCE',
                                fillColor: '#fff'
                            }
                        }
                    ]
                } else {
                    plotOptions = {
                        column: {
                            borderRadius: '4px',
                        },
                        series: {
                            groupPadding: 0.3
                        }
                    }

                    series = [
                        {
                            name: 'Tổng số chuyên mục',
                            type: 'column',
                            data: sl,
                            color: '#0074E8',
                        },
                        {
                            name: 'Tổng số bài viết',
                            type: 'column',
                            yAxis: 1,
                            data: lx,
                            color: '#0AB175',
                        }, {
                            name: 'Tổng số lượt tải',
                            type: 'column',
                            yAxis: 1,
                            data: lt,
                            color: '#F1B314',
                        }
                    ]
                }

                $('#containerStatistics').highcharts({
                    chart: {
                        style: {
                            fontFamily: 'Inter Regular'
                        },
                        scrollablePlotArea: {
                            minWidth: 110 * tc.length,
                        }
                    },
                    title: false,
                    xAxis: [{
                        categories: tc,
                        crosshair: true,
                        labels: {
                            style: {
                                fontFamily: 'Inter Medium',
                                color: '#020F1F',
                                fontSize: '16px',
                                lineHeight: '24px',
                                fontWeight: '500',
                                textAlign: 'center',
                                textOverflow: 'none',
                            },
                            //autoRotation: 0,
                            //useHTML: true
                        },
                        lineWidth: 0,
                    }],
                    yAxis: [{ // Primary yAxis
                        min: 0,
                        labels: {
                            style: {
                                color: '#7A93B3',
                                fontSize: '16px',
                                lineHeight: '24px',
                                textOverflow: 'none'
                            }
                        },
                        title: {
                            text: 'Tổng số chuyên mục',
                            style: {
                                color: '#7A93B3',
                                fontSize: '16px',
                                lineHeight: '24px',
                            },
                            margin: 10
                        },
                    }, { // Secondary yAxis
                        min: 0,
                        title: {
                            text: 'Tổng số bài viết/Tổng số lượt tải',
                            style: {
                                color: '#7A93B3',
                                fontSize: '16px',
                                lineHeight: '24px',
                            },
                            margin: 10
                        },
                        labels: {
                            style: {
                                color: '#7A93B3',
                                fontSize: '16px',
                                lineHeight: '24px',
                                textOverflow: 'none'
                            }
                        },
                        opposite: true
                    }],
                    plotOptions: plotOptions,
                    tooltip: {
                        shared: true,
                        style: {
                            fontSize: '14px',
                            lineHeight: '22px',
                            fontWeight: '400',
                            color: '#020F1F'
                        },
                        backgroundColor: "#fff",
                        borderWidth: 0,
                        borderRadius: 4,
                        padding: 10,
                        formatter: function () {
                            var tooltipCustomize = '<span class="text-semibold">' + this.x + '</span>';
                            $.each(this.points, function () {
                                let valueSuffixPoint = this.series.tooltipOptions.valueSuffix;
                                if (valueSuffixPoint != undefined && valueSuffixPoint != null && valueSuffixPoint != '') {
                                    tooltipCustomize += '<br/><span style="color:' + this.point.color + '">\u25CF</span>&nbsp;' + this.series.name + ': <span class="text-semibold" style="color: var(--body);">' + this.y + this.series.tooltipOptions.valueSuffix + '</span>';
                                } else {
                                    tooltipCustomize += '<br/><span style="color:' + this.point.color + '">\u25CF</span>&nbsp;' + this.series.name + ': <span class="text-semibold" style="color: var(--body);">' + this.y + '</span>';
                                }
                            });
                            return tooltipCustomize;
                        },
                    },
                    legend: {
                        itemStyle: {
                            fontSize: '16px',
                            lineHeight: '24px',
                            fontWeight: '400',
                            color: '#020F1F',
                            marginRight: '15'
                        },
                        itemHoverStyle: {
                            'text-decoration': "none"
                        },
                        margin: 16,
                        itemDistance: 32,
                        symbolPadding: 8,
                        symbolRadius: 4,
                        symbolWidth: 33
                    },
                    exporting: false,
                    credits: {
                        enabled: false
                    },
                    series: series
                });
            }

            // Load chart
            loadHighcharts(ngayCongBo, tongSoChuyenMuc, tongSoBaiViet, tongSoLuotTai);

            // Add STT
            dataTableThongke.forEach((item, index) => {
                item.STT = index + 1;
            });

            // khởi tạo dataTable
            let dataGridStatistic = $('#dataGridStatistic').dataTable({
                contentType: 'application/json; charset=utf-8',
                data: dataTableChuyenMuc,
                language: {
                    "lengthMenu": "Hiển thị _MENU_ bản ghi",
                    "zeroRecords": "Không tìm thấy bản ghi nào",
                    "info": "Hiển thị trang _PAGE_ của _PAGES_",
                    "infoEmpty": "Không có bản ghi nào",
                    "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
                    "search": "",
                    "searchPlaceholder": "Nhập từ khóa tìm kiếm...",
                    "paginate": {
                        "first": "Đầu",
                        "last": "Cuối",
                        "next": '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                        "previous": '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
                    }
                },
                searching: false,
                ordering: false,
                lengthChange: false,
                info: false,
                scrollY: "300px",
                scrollCollapse: true,
                paging: false,
                columnDefs: [
                    {
                        targets: [0],
                        render: function (data, type, row, meta) {
                            if (data != null) {
                                return '<a id="n-' + meta.row + '" class="detail-command-btn cursor-pointer" href="' + baseUrl + '/Admin/BaiViet/ChiTiet/' + row.id + '"><span>' + data + '</span></a>';
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        }
                    },
                    {
                        targets: [2],
                        render: function (data, type, row, meta) {
                            if (data) {
                                return '<i data-toggle="tooltip" class="icon-fluent icon_fluent_checkmark_filled text-green" id="n-&quot;0&quot;" data-original-title="" title=""></i>';
                            } else {
                                return '<i data-toggle="tooltip" class="icon-fluent icon_fluent_dismiss_filled text-red" id="n-&quot;0&quot;" data-original-title="" title=""></i>';
                            }
                        }
                    }
                ],
                columns: [
                    { data: "tenChuyenMuc", "width": "", "class": "left-align text-medium" },
                    { data: "tongSoBaiViet", "width": "200px", "class": "left-align text-medium" },
                    { data: "suDung", "width": "100px", "class": "center-align text-medium" },
                ],
            });

            let dataGridDatasetUpdateRecent = $('#dataGridDatasetUpdateRecent').dataTable({
                contentType: 'application/json; charset=utf-8',
                data: dataTableThongke,
                language: {
                    "lengthMenu": "Hiển thị _MENU_ bản ghi",
                    "zeroRecords": "Không tìm thấy bản ghi nào",
                    "info": "Hiển thị trang _PAGE_ của _PAGES_",
                    "infoEmpty": "Không có bản ghi nào",
                    "infoFiltered": "(Lọc từ _MAX_ bản ghi)",
                    "search": "",
                    "searchPlaceholder": "Nhập từ khóa tìm kiếm...",
                    "paginate": {
                        "first": "Đầu",
                        "last": "Cuối",
                        "next": '<i class="icon-fluent icon_fluent_chevron_right_filled"></i>',
                        "previous": '<i class="icon-fluent icon_fluent_chevron_left_filled"></i>'
                    }
                },                
                ordering: false,
                lengthChange: false,
                info: false,
                columnDefs: [
                    { targets: [0], className: 'stt-text center-align' },
                    {
                        targets: [1],
                        render: function (data, type, row, meta) {
                            if (data != null) {
                                return '<a id="n-' + meta.row + '" class="detail-command-btn cursor-pointer" href="' + baseUrl + '/Admin/BaiViet/ChiTiet/' + row.id + '"><span>' + data + '</span></a>';
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        }
                    },
                    { targets: [2], className: 'left-align' },
                    {
                        targets: [3],
                        render: function (data, type, row) {
                            // check if data is null
                            if (data != null) {
                                // return formatted date
                                return moment(data).format('DD/MM/YYYY');
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        } },
                    {
                        targets: [4],
                        render: function (data, type, row) {
                            // check if data is null
                            if (data != null) {
                                // return formatted date
                                return moment(data).format('DD/MM/YYYY');
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        }
                    },
                    {
                        targets: [5],
                        render: function (data, type, row) {
                            // check if data is null
                            if (data != null) {
                                // return formatted date
                                return moment(data).format('DD/MM/YYYY');
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        }
                    },
                    {
                        targets: [6],
                        render: function (data, type, row) {
                            // check if data is null
                            if (data != null) {
                                return data;
                            } else {
                                return 'Chưa có dữ liệu';
                            }
                        }
                    },
                    {
                        targets: [7],
                        render: function (data, type, row) {
                            // check if data is null
                            if (data != null && data === 1) {
                                return '<i data-toggle="tooltip" class="icon-fluent icon_fluent_checkmark_filled text-green" id="n-&quot;0&quot;" data-original-title="" title=""></i>';
                            } else {
                                return '<i data-toggle="tooltip" class="icon-fluent icon_fluent_dismiss_filled text-red" id="n-&quot;0&quot;" data-original-title="" title=""></i>';
                            }
                        }
                    }
                ],
                columns: [
                    { data: "STT", "width": "5%", "class": "stt-text center-align" },
                    { data: "tieuDe", "width": "35%", "class": "left-align text-medium" },
                    { data: "tenChuyenMuc", width: "200px", class: "left-align" },
                    { data: "createdOnDate", width: "200px", class: "center-align" },
                    { data: "ngayCongBo", width: "200px", class: "center-align" },
                    { data: "ngayCapNhat", width: "200px", class: "center-align" },
                    { data: "tenNguoiCapNhat", width: "200px", class: "center-align" },
                    { data: "trangThai", width: "200px", class: "center-align" }
                ],
            });

        })
        .catch(err => console.error(err));
});
