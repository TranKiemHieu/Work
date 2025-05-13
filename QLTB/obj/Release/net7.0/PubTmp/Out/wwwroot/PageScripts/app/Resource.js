
const baseUrl = getRootLink();
let dtResource = null;
const iconDefault = '/assets/images/icons/iconUploadDefault.png';
const imageDefault = '/assets/images/icons/imageUploadDefault.png';
const pageSize = 10;

$(document).ready(function () {
    getDanhSachTaiNguyen();
    initSelect2();

    function getDanhSachTaiNguyen() {
        var classID = cate.toLowerCase() == 'organization' ? 7 : 1;
        let tuKhoa = $('#Keyword').val();
        var orderType = $('#sap-xep option:selected').val();
        var sapXep = orderType != null ? parseInt(orderType) : 0;

        getDataWithApi('POST', `/api/ResourceApi/GetCategoryList?ClassID=${classID}&SapXep=${sapXep}&TuKhoa=${tuKhoa}`)
            .then((data) => {
                var nameCate = cate.toLowerCase() == 'organization' ? 'tổ chức' : 'chủ đề';
                $('#totalResource').text(0 + ' ' + nameCate);
                $('#listResource').empty();
                if (data && data.value && data.value.length > 0) {
                    $('#totalResource').text(data.value.length + ' ' + nameCate);
                    var html = '';
                    data.value.forEach(res => {
                        html += `<div id='re-${res.resourceID}' class="resource-item resourceDetail" data-name="${res.resourceName}">
                                        <div class="resource-content">
                                            <div class="${cate.toLowerCase() == 'organization' ? 'resource-logo' : 'resource-icon'}">
                                                <img id="logoResource" class="resource-img" src="${res.logo != null ? res.logo : `${cate.toLowerCase() == 'organization' ? imageDefault : iconDefault}`}">
                                            </div>
                                            <h4 id="nameResource" class="resource-name">${res.name != null ? res.name : ''}</h4>
                                            <p id="descResource" class="resource-count">${res.totalRows > 0 ? res.totalRows : 0} bộ dữ liệu</p>
                                        </div>
                                    </div>`;
                    })
                    html += `</div>`;
                    $('#listResource').append(html);
                }
            });
    };

    $(document).on('click', '.resourceDetail', function () {
        var id = $(this).attr('id').replace('re-', '');
        var name = $(this).data('name');
        window.location.href = `${baseUrl}/${cate.toLowerCase()}/${name}`;
    })

    $(document).on('keypress', '#Keyword', function (event) {
        if (event.key === "Enter") {
            getDanhSachTaiNguyen();
        }
    });

    $(document).on('click', '#search-link', function () {
        /*e.preventDefault();*/
        getDanhSachTaiNguyen();
    })

    $(document).on('change', '#sap-xep', function () {
        getDanhSachTaiNguyen();
    })

    //nút xóa từ khóa
    $('.keyword-delete').tooltip();

    $(document).on('keyup', '#Keyword', function () {
        if (this.value != null && this.value != '') {
            $('.keyword-delete').removeClass('d-none');
        }
        else {
            $('.keyword-delete').addClass('d-none');
        }
    });

    $(document).on('click', '.keyword-delete', function () {
        $('#Keyword').val('');
        $(this).addClass('d-none');
        $('#Keyword').focus();
    });
})