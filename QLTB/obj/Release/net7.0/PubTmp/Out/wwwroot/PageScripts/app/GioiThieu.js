const baseUrl = getRootLink();

$(document).ready(function () {
    
    
    //loadContentTab1()
    //loadContentTab2()
    //loadContentTab3()
    //loadContentTab4()

    const getTitle = () => {
        $('.section-news .news_title').each(function (index) {
            // get text of title
            let title = $(this).text();

            // then set text of title to tab
            $('.nav-tabs .nav-item').eq(index).find('.nav-link').text(title);
        })
    }

    // hàm chạy sau khi dữ liệu đã được load
    const afterDataLoaded = () => {
        setTimeout(() => {
            getTitle();
        }, 300);
    }

    // gọi các hàm load dữ liệu bằng Promise.all
    Promise.all([loadContentTab1(), loadContentTab2(), loadContentTab3(), loadContentTab4()])
        .then(afterDataLoaded)
        .catch(error => console.error('Error loading data:', error));

   
    function loadContentTab1() {
        $('#section-content-tab-1').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "maViewCapCha": 55,
                "viewName": "_section_content_tab_1"
            },
            success: function (response) {
                $('#section-content-tab-1').html(response);
            }
        });
        return false;
    }
    function loadContentTab2() {
        $('#section-content-tab-2').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "maViewCapCha": 55,
                "viewName": "_section_content_tab_2"
            },
            success: function (response) {
                $('#section-content-tab-2').html(response);
            }
        });
        return false;
    }
    function loadContentTab3() {
        $('#section-content-tab-3').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "maViewCapCha": 55,
                "viewName": "_section_content_tab_3"
            },
            success: function (response) {
                $('#section-content-tab-3').html(response);
            }
        });
        return false;
    }
    function loadContentTab4() {
        $('#section-content-tab-4').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "maViewCapCha": 55,
                "viewName": "_section_content_tab_4"
            },
            success: function (response) {
                $('#section-content-tab-4').html(response);
            }
        });
        return false;
    }
})
