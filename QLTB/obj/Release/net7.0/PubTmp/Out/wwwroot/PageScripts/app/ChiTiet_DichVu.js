
$(document).ready(function () {
    let totalRow = undefined, pageSize = undefined
    const runConvertDateStringToHTML = () => {
        // get .news-date elements
        const newsDateElements = document.querySelectorAll('.news-date');
        
        // return text by convertDateStringToHTML
        newsDateElements.forEach((element) => {
            const dateString = element.textContent;
            element.innerHTML = convertDateStringToHTML(dateString);
        });
    }

    // hàm chạy sau khi dữ liệu đã được load
    const afterDataLoaded = () => {
        setTimeout(() => {
            runConvertDateStringToHTML();
        }, 300);
    }

    // gọi các hàm load dữ liệu bằng Promise.all
    Promise.all([loadChiTietBaiViet()])
        .then( afterDataLoaded )
        .catch(error => console.error('Error loading data:', error));

    function loadChiTietBaiViet() {
        $('#section-main-detail-content').empty();
        $.ajax({
            type: "POST",
            url: "/BaiViet/_ViewDetail",
            data: {
                "id": baiVietID == undefined ? null : baiVietID,
                "maViewCapCha": 105,
                "viewName": "_section_main_detail_content"
            },
            success: function (response) {
                $('#section-main-detail-content').html(response)
            }
        });

    }
 
})
$(document).ready(function () {
    // get .news-date elements
    const newsDateElements = document.querySelectorAll('.news-date');
    // return text by convertDateStringToHTML
    newsDateElements.forEach((element) => {
        const dateString = element.textContent;
        element.innerHTML = convertDateStringToHTML(dateString);
    });
});