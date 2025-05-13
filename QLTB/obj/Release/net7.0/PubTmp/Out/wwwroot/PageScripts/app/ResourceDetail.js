
const baseUrl = getRootLink();

let dtResource = null;

const pageSize = 10;

const DEFAULT_LANGUAGE = "vi";

$(document).ready(function () {

    initSelect2();

    if (typeof id !== 'undefined' && typeof cate !== 'undefined') {
        if (id != null && id != "" && cate != null && cate != "") {
            getChiTietTaiNguyen();
            loadDanhSachDataset(searchTxt, pageIndex);
        }
    }

    $(document).on('keypress', '#Keyword', function (event) {
        if (event.key === "Enter") {
            var dataMeta = getTotalDataset();
            loadDanhSachDataset($('#Keyword').val(), 1, (dataMeta != null && dataMeta.length > 0 ? dataMeta[0].totalRows : 10));
        }
    });

    $(document).on('click', '#search-link', function () {
        var dataMeta = getTotalDataset();
        loadDanhSachDataset($('#Keyword').val(), 1, (dataMeta != null && dataMeta.length > 0 ? dataMeta[0].totalRows : 10));
    })

    $(document).on('change', '#sap-xep', function () {
        $('#sort_order').val(this.value);
        loadDanhSachDataset($('#search_txt').val(), parseInt($('#page_id').val()), pageSize, this.value);
    })

    function loadDanhSachDataset(searchText = '', pageIndex = 1, pageSize = 10, sortOrder = '0') {
        $('#listDataset').empty();

        $.ajax({
            type: "POST",
            url: "/Resource/DanhSachBoDuLieu",
            data: {
                "cate": cate,
                "name": cateNameID,
                "searchText": searchText,
                "pageIndex": pageIndex,
                "pageSize": pageSize,
                "sortOrder": sortOrder
            },
            success: function (response) {
                $('#listDataset').html(response);
                $('#search_txt').val(searchText);
                $('#page_id').val(pageIndex);

                if (getTotalDataset().length <= pageSize) {
                    $('#listDataset').addClass('pagination-disabled');
                    $('#listDataset .pagination-wrapper').addClass('d-none');
                } else {
                    $('#listDataset').removeClass('pagination-disabled');
                    $('#listDataset .pagination-wrapper').removeClass('d-none');
                }

                var dataMeta = getTotalDataset();

                var totalDataset = dataMeta != null && dataMeta.length > 0 ? dataMeta[0].totalRows : 0;
                $('#totalDataset').text(totalDataset + ' bộ dữ liệu');
                
                var curPage = parseInt($('.pagination li.active span').text());
                var total = dataMeta != null && dataMeta.length > 0 ? Math.ceil(dataMeta[0].totalRows / pageSize) : 0;
                var firstEllipses = $('.pagination .PagedList-ellipses').first().index();
                var lastEllipses = $('.pagination .PagedList-ellipses').last().index();
                var firstPage = $('.pagination .page-item.PagedList-skipToPrevious').index();
                var lastPage = $('.pagination .page-item.PagedList-skipToNext').index();

                if ((firstPage == -1 || curPage <= 2) && $('.pagination .PagedList-ellipses').length == 1) {
                    $('.pagination').children().eq(lastPage).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)
                }
                if ((lastPage == -1 || curPage >= 3) && $('.pagination .PagedList-ellipses').length == 1) {
                    $('.pagination').children().eq(firstPage+1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                }
                
                if (firstEllipses != lastEllipses && firstPage != -1 && lastPage != -1) {
                    $('.pagination').children().eq(firstEllipses).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>`)
                    $('.pagination').children().eq(lastPage + 1).before(`<li class="page-item"><a class="page-link" href="javascript:void(0)">${total}</a></li>`)

                    if (total == 5 && curPage == 3) {
                        $('.pagination li.PagedList-ellipses').remove();
                    } else {
                        if (curPage == (total - 2)) {
                            $('.pagination').children().eq(lastEllipses + 1).remove();
                        } else if (curPage <= 3) {
                            $('.pagination li.PagedList-ellipses:lt(1)').remove();
                        }
                    }
                }
                $('.pagination li .page-link').each(function () {
                    $(this).prop('href', `javascript:void(0)`);
                })
            }
        });
        return false;
    }

    $(document).on('click', '.pagination .page-link', function () {
        if (!$(this).attr('rel')) {
            $('#page_id').val($(this).text());
            loadDanhSachDataset($('#search_txt').val(), parseInt($('#page_id').val()), pageSize, $('#sort_order').val());
        }
    })

    $(document).on('click', '.pagination .PagedList-skipToPrevious .page-link', function () {
        var id = $('.pagination li.active span').text();
        $('#page_id').val(parseInt(id)-1);
        loadDanhSachDataset($('#search_txt').val(), parseInt($('#page_id').val()), pageSize, $('#sort_order').val());
    })

    $(document).on('click', '.pagination .PagedList-skipToNext .page-link', function () {
        var id = $('.pagination li.active span').text();
        $('#page_id').val(parseInt(id) + 1);
        loadDanhSachDataset($('#search_txt').val(), parseInt($('#page_id').val()), pageSize, $('#sort_order').val());
    })

    function getChiTietTaiNguyen() {
        const data = {
            "ResourceID": id,
            "ClassID": cate.toLowerCase() == "organization"? 7 : 1
        };

        getDataWithApi('POST', `/api/MetadataApi/Get`, JSON.stringify(data))
            .then((data) => {
                if (data && data.value && data.value != null) {
                    if (data.value.data && data.value.data.length > 0) {
                        var resourceData = data.value.data;
                        var mailHtml = '', homeHtml = '', contactHtml = '';
                        $('#nameResource').empty();
                        $('#uriResource').empty();

                        var uri = `${baseUrl}/${cate.toLowerCase()}/${encodeURIComponent(resourceData[0].resourceName)}`;
                        $('#uriResource').append(`<a class="text-blue-light" href="${uri}" title="${uri}">${uri}</a>`);

                        const name = findValueInData(0, resourceData, (cate.toLowerCase() == "organization" ? 12 : 1), null, true);
                        $('#resourceName').text(name != null && name.data != '' ? name.data : '')
                        
                        if (cate.toLowerCase() == "organization") {
                            $('#mailbox').empty();
                            $('#homepage').empty();
                            var listName = [];

                            resourceData.forEach(el => {
                                if (el.elementName == "logo") $('#logoResource').attr('src', el.value);
                                else if (el.elementName == "name") {
                                    if (el.language == DEFAULT_LANGUAGE) listName.splice(0, 0, el.value);
                                    else listName.push(el.value);
                                }
                                else if (el.elementName == "OrganId") $('#idOrg').text(el.value);
                                else if (el.elementName == "phone") $('#phoneOrg').text(el.value);
                                else if (el.elementName == "mbox") {
                                    mailHtml = `<div class="form-group">
                                                    <label class="form-label homepage">Hộp thư:</label>
                                                    <div class="break-all"><a class="text-blue-light" href="mailto:${el.value}" target="_blank">${el.value}</a></div>
                                                </div>`;
                                    $('#mailbox').append(mailHtml);
                                }
                                else if (el.elementName == "homepage") {
                                    homeHtml = `<div>
                                                    <label class="form-label homepage">Trang chủ:</label>
                                                    <div class="break-all"><a id="homepageUrl" class="text-blue-light" href="javascript:void(0)">${el.value}</a></div>
                                                </div>`;
                                    $('#homepage').append(homeHtml);
                                }
                            })
                            listName.forEach(n => {
                                $('#nameResource').append(`<h4 class="text-center text-medium">${n}</h4>`);
                            })

                            ShowElement('idOrg', 2);
                            ShowElement('phoneOrg', 2);
                            ShowElement('mailbox');
                            ShowElement('homepage');
                        } else if (cate.toLowerCase() == "catalog") {
                            $('#descResource').empty();
                            $('#contactPoint').empty();
                            var listTitle = [];
                            const orgData = findValueInData(0, resourceData, 5, 10, false);
                            resourceData.forEach(el => {
                                if (el.elementName == "icon") $('#logoResource').attr('src', el.value);
                                else if (el.elementName == "title") {
                                    if (el.language == DEFAULT_LANGUAGE) listTitle.splice(0, 0, el.value);
                                    else listTitle.push(el.value);
                                } 
                                else if (el.elementName == "description") $('#descResource').append(`<div class="description-item">${el.value}</div>`);
                                else if (el.elementName == "publisher") {
                                    if (el.detail && el.detail.length > 0) {
                                        var nameOrg = el.detail.filter(x => x.elementName == "name");
                                        if (nameOrg != null && nameOrg.length > 0) {
                                            var urlOrg = `${baseUrl}/organization/${encodeURIComponent(nameOrg[0].resourceName)}`
                                            $('#nameOrg').html(`<a class="text-blue-light" href="${urlOrg}" target="_blank">${nameOrg[0].value}</a>`);
                                        }
                                    }
                                }
                                else if (el.elementName == "contactPoint") {
                                    if (el.detail && el.detail.length > 0) {
                                        var nameContact = el.detail.filter(x => x.elementName == "fn");
                                        var orgContact = el.detail.filter(x => x.elementName == "org");
                                        var mailContact = el.detail.filter(x => x.elementName == "hasEmail");
                                        var urlOrg = orgContact != null && orgContact.length > 0 ? orgContact[0].value : '';

                                        var urlMailOrg = mailContact != null && mailContact.length > 0 ? mailContact[0].value : '';
                                        if (nameContact != null && nameContact.length > 0) {
                                            contactHtml = `<div class="info-item">${nameContact[0].value}</div>`;
                                        }

                                        //if (urlOrg != null) {
                                        //    contactHtml += `<div><a class="text-blue-light" href="${urlOrg}" target="_blank">${urlOrg}</a></div>`;
                                        //}

                                        if (urlMailOrg != null) {
                                            contactHtml += `<div class="info-item"><a class="text-blue-light break-all" href="mailto:${urlMailOrg}" target="_blank" title="${urlMailOrg}">${urlMailOrg}</a></div>`;
                                        }
                                        $('#contactPoint').append(contactHtml);
                                    }
                                }
                                else if (el.elementName == "issued") {
                                    $('#dateCreate').text(el.value != null ? moment(el.value).format("DD/MM/YYYY") : '');
                                } 
                            })

                            listTitle.forEach(t => {
                                $('#nameResource').append(`<h4 class="title-base text-center">${t}</h4>`);
                            })

                            ShowElement('nameOrg', 2);
                            ShowElement('homepage', 2, 2);
                            ShowElement('dateCreate', 2);
                            ShowElement('contactPoint', 2, 2);
                        }
                    }
                }
            })
    };

    function getTotalDataset() {
        let dtDataset = [];
        let tuKhoa = $('#Keyword').val() == '' ? searchTxt : $('#Keyword').val();

        const request = {
            "resourceLinkedID": id,
            "classID": cate.toLowerCase() == 'organization' ? 7 : 1,
            "tuKhoa": tuKhoa,
            "pageIndex": 1,
            "pageSize": pageSize,
            "accessLevel": "1"
        };

        $.ajax({
            type: 'POST',
            async: false,
            url: `${baseUrl}/api/ResourceApi/DatasetPaging`,
            data: JSON.stringify(request),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (response) {
                
                if (response && response.value && response.value.length > 0) {
                    dtDataset = response.value;
                }
            }
        });
        return dtDataset;
    }

    $(document).on('click', '#homepageUrl', function () {
        if ($(this).text() != '') {
            window.open($(this).text(), '_blank');
        }
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


function ShowElement(id, level = 1, type = 1) {
    //type: 1:text/span -- 2: element in div
    //level: 1:parent -- 2: children

    if (level == 1) {
        var isShow = (type == 1 && $(`#${id}`).text() == '') || (type == 2 && $(`#${id}`).html() == '') ? false : true;
        if (isShow) $(`#${id}`).removeClass('d-none')
    } else if (level == 2) {
        var isShow = (type == 1 && $(`#${id}`).text() == '') || (type == 2 && $(`#${id}`).html() == '') ? false : true;
        if (isShow) $(`#${id}`).parent().removeClass('d-none')
    }
}