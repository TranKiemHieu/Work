const baseUrl = getRootLink();

$(document).ready(function () {
    let dataTable = []
    let dataToChuc = []

    initSelect2();
    getRolesSelect(); 
    displayUser()
    
    
    async function buildData() {
        let tuKhoa = $('#tu-khoa').val();
        let request = {
            tuKhoa
        }
        return request;
    }
    $('#tim-kiem').on('click', async function () {
        displayUser()
    });

    $('#tat-ca').on('click', async function () {
        $('#tu-khoa').val("");
        $('#org-search').val(-1).trigger('change');
        displayUser()
    });

    $('.showPassword').on('click', function () {
		let typeInput = $(this).parent().siblings('input.field-input').attr('type')
		if (typeInput === 'password') {
			$(this).parent().siblings('input.field-input').attr('type', 'text')
			$(this).removeClass('icon_fluent_eye_off_filled')
			$(this).addClass('icon_fluent_eye_filled')
		} else {
			$(this).parent().siblings('input.field-input').attr('type', 'password')
			$(this).removeClass('icon_fluent_eye_filled')
			$(this).addClass('icon_fluent_eye_off_filled')
		}
	});

    async function displayUser() {
        var param = await buildData();
       

        const tableData = {
            url: `${baseUrl}/api/AccountApi/GetAllUsers?keyword=${param.tuKhoa}`,
            type: "Post",
            contentType: 'application/json; charset=utf-8',
            dataSrc: function (data) {
                if (data && data.length > 0) {
                    
                    for (let i = 0; i < data.length; i++) {
                        data[i].stt = i + 1
                        data[i].toChuc = ""
                    }

                    data.forEach(e => {
                        dataToChuc.forEach(org => {
                            if (e.orgUniqueCode === org.orgUniqueCode) {
                                e.toChuc = org.show
                            } 
                        })
                    });

                    dataTable = data
                    return data;
                }
                return [];
            },
        };

        const tableDefs = [
            {
                targets: 3,
                render: function (data, type, row, meta) {
                    return `<span class="break-word">${data}</span>`;
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    if (row.lockoutEnabled == 0) {
                        return `<span class='badge badge-success'>Đã xác thực</span>`;
                    } else if (row.lockoutEnabled == 1) {
                        return `<span class='badge badge-warning'>Chưa xác thực</span>`; 
                    }
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    let html = ""
                    if (permitedEdit) {
                        html += `<i data-toggle="tooltip" title="Chỉnh sửa" class="icon-fluent icon_fluent_edit_filled edit-command-btn text-yellow" id=n-"${meta.row}"></i>
                                 <i data-toggle="tooltip" title="Đổi mật khẩu" class="icon-fluent icon_fluent_key_filled change-pass-command-btn text-green" id=n-"${meta.row}"></i>`;
                    }
                    if (permitedDelete) {
                        if (row.lockoutEnabled == 0) {
                            html += `<i data-toggle="tooltip" title="Khóa" class="icon-fluent icon_fluent_lock_closed_filled lock-command-btn text-red" id=n-"${meta.row}"></i>`;
                        } else if (row.lockoutEnabled == 1){
                            html += `<i data-toggle="tooltip" title="Mở khóa" class="icon-fluent icon_fluent_lock_open_filled unlock-command-btn text-azure" id=n-"${meta.row}"></i>`;
                        }
                        
                    }
                    return html
                }
            }
        ];

        const tableCols = [
            { "data": "stt", "width": "5%", "class": "center-align" },
            { "data": "userName", "width": "20%", "class": "left-align" },
            { "data": "displayName", "width": "30%", "class": "left-align" },
            { "data": "email", "width": "25%", "class": "left-align" },
            { "data": "", "width": "10%", "class": "center-align group-icon-action" },
            { "data": "", "width": "10%", "class": "center-align group-icon-action" },
        ];

        if (!permitedEdit && !permitedDelete) {
            tableCols.pop();
            tableDefs.pop();
        }
        initDataTableConfig('dataGrid', tableData, tableDefs, tableCols)

        $('#dataGrid tbody').on('click', '.edit-command-btn', async function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            try {
                const res =  await fetch('/api/AccountApi/GetUserDetail/' + data.id, {
                    method: 'GET',
                })

                if (!res.ok) {
                    var errText = res.text();
                    throw new Error(errText);
                }

                var result = await res.json();

                $("#ttcEdit").text(result.displayName);
                $('#tenTruyCapEdit').val(result.userName);
                $('#hoTenEdit').val(result.displayName);
                $('#hopThuEdit').val(result.email);
                $('#select_vaiTroEdit').val(result.roleId != null ? result.roleId.split(',') : null).trigger('change');
               
                $('#modalEdit').modal('show');
            }
            catch (err) {
                showNotification(0, err.message)
            }
        });

        $('#dataGrid tbody').on('click', '.change-pass-command-btn', async function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();
     
            $('#ttcReset').text(data.displayName)
            $("#tenTruyCapReset").val(data.userName);

            $('#modalResetPass').modal('show');
        });

        $('#dataGrid tbody').on('click', '.lock-command-btn', async function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            $('#tenLock').text(data.displayName)
            $("#userNameLock").val(data.userName);

            $('#modalLock').modal('show');
        });
        $('#dataGrid tbody').on('click', '.unlock-command-btn', async function () {
            var id = $(this).attr("ID").match(/\d+/)[0];
            var data = $('#dataGrid').DataTable().row(id).data();

            $('#tenUnLock').text(data.displayName)
            $("#userNameUnLock").val(data.userName);

            $('#modalUnLock').modal('show');
        });

        $('#select_vaiTroEdit').on('select2:unselect', async function (e) {
            let userName = $('#tenTruyCapEdit').val();

            var roleName = e.params.data.text;
            try {
                const res = await fetch(`/api/AccountApi/RemoveRoleFromAccount/${userName}/${roleName}`, {
                    method: 'DELETE'
                })
                if (!res.ok) {
                    var errText = res.text();
                    throw new Error(errText);
                }
            } catch (err) {
                showNotification(0, err.message)
            }
           
        });

        $('#select_vaiTroEdit').on('select2:select', async function (e) {
            let userName = $('#tenTruyCapEdit').val();

            var roleName = e.params.data.text;
            try {
                const res = await fetch(`/api/AccountApi/AddRoleToAccount/${userName}/${roleName}`, {
                    method: 'PUT'
                })
                if (!res.ok) {
                    var errText = res.text();
                    throw new Error(errText);
                }
            } catch (err) {
                showNotification(0, err.message)
            }

        });

        
    }

    document.getElementById("tu-khoa").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            displayUser()
        }
    });
    
    $("#formAdd").submit(function (e) {
        e.preventDefault();
        dataAdd();
    });
    $("#formEdit").submit(function (e) {
        e.preventDefault();
        dataEdit();
    });
    $("#formResetPass").submit(function (e) {
        e.preventDefault();
        dataResetPass();
    });
    $("#formLock").submit(function (e) {
        e.preventDefault();
        dataLock();
    });
    $("#formUnLock").submit(function (e) {
        e.preventDefault();
        dataUnLock();
    });

    async function dataAdd() {
        let tenTruyCap = $('#tenTruyCapAdd').val();
        let matKhau = $('#matKhauAdd').val();
        let hoTen = $("#hoTenAdd").val()
        let hopThu = $('#hopThuAdd').val();
        let vaiTro = $('#select_vaiTroAdd').val();
        
        

        var isTrungTen = dataTable.filter(e => e.userName.toLowerCase() === tenTruyCap.trim().toLowerCase());
        if (checkEmptyBlank(tenTruyCap)) {
            $('#notifi_tenTruyCapAdd').removeClass("d-none");
            $('#notifi_tenTruyCapAdd').html('Vui lòng nhập thông tin!');
            $('#tenTruyCapAdd').focus();
            return;
        } else if (isTrungTen.length > 0) {
            $('#notifi_tenTruyCapAdd').removeClass("d-none");
            $('#notifi_tenTruyCapAdd').html('Tên truy cập đã tồn tại!');
            $('#tenTruyCapAdd').focus();
            return;
        } else {
            $('#notifi_tenTruyCapAdd').addClass('d-none');
        }

        if (checkEmptyBlank(matKhau)) {
            $('#notifi_matKhauAdd').removeClass("d-none");
            $('#notifi_matKhauAdd').html('Vui lòng nhập thông tin!');
            $('#matKhauAdd').focus();
            return;
        } else {
            $('#notifi_matKhauAdd').addClass('d-none');
        }

        if (checkEmptyBlank(hoTen)) {
            $('#notifi_hoTenAdd').removeClass("d-none");
            $('#notifi_hoTenAdd').html('Vui lòng nhập thông tin!');
            $('#hoTenAdd').focus();
            return;
        } else {
            $('#notifi_hoTenAdd').addClass('d-none');
        }

        //var isTrungEmail = dataTable.filter(e => e.email.toLowerCase() === hopThu.trim().toLowerCase());
        if (checkEmptyBlank(hopThu)) {
            $('#notifi_hopThuAdd').removeClass("d-none");
            $('#notifi_hopThuAdd').html('Vui lòng nhập thông tin!');
            $('#hopThuAdd').focus();
            return;
        }
        //else if (isTrungEmail.length > 0) {
        //    $('#notifi_hopThuAdd').removeClass("d-none");
        //    $('#notifi_hopThuAdd').html('* Hộp thư đã tồn tại');
        //    $('#hopThuAdd').focus();
        //    return;
        //}
        else {
            $('#notifi_hopThuAdd').addClass('d-none');
        }

        const dt = {
            "UserName": tenTruyCap.trim(),
            "Password": matKhau.trim(),
            "Email": hopThu.trim(),
            "DisplayName": hoTen.trim(),
            "Roles": vaiTro.toString()
        };
       
        try {
            const res = await fetch('/api/AccountApi/CreateNewAccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dt)
            })

            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Thêm mới người dùng thành công')
            $('#modalAdd').modal('hide');
            $('#dataGrid').DataTable().ajax.reload().draw();
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
    async function dataEdit() {
        let tenTruyCap = $('#tenTruyCapEdit').val();
        let hoTen = $("#hoTenEdit").val()
        let hopThu = $('#hopThuEdit').val();

      //  var isTrungEmail = dataTable.filter(e => e.email.toLowerCase() === hopThu.trim().toLowerCase());
        if (checkEmptyBlank(hoTen)) {
            $('#notifi_hoTenEdit').removeClass("d-none");
            $('#notifi_hoTenEdit').html('Vui lòng nhập thông tin!');
            $('#hoTenEdit').focus();
            return;
        } else {
            $('#notifi_hoTenEdit').addClass('d-none');
        }

        if (checkEmptyBlank(hopThu)) {
            $('#notifi_hopThuEdit').removeClass("d-none");
            $('#notifi_hopThuEdit').html('Vui lòng nhập thông tin!');
            $('#hopThuEdit').focus();
            return;
        }
        //else if (isTrungEmail.length > 0) {
        //    $('#notifi_hopThuEdit').removeClass("d-none");
        //    $('#notifi_hopThuEdit').html('* Hộp thư đã tồn tại');
        //    $('#hopThuEdit').focus();
        //    return;
        //}
        else {
            $('#notifi_hopThuEdit').addClass('d-none');
        }

        const dt = {
            "UserName": tenTruyCap.trim(),
            "Email": hopThu.trim(),
            "DisplayName": hoTen.trim()
        };

        try {
            const res = await fetch('/api/AccountApi/UpdateAccount', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dt)
            })

            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Cập nhật người dùng thành công')
            $('#modalEdit').modal('hide');
            $('#dataGrid').DataTable().ajax.reload(null  ,false);
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
    async function dataResetPass() {
        let tenTruyCap = $('#tenTruyCapReset').val();
        let matKhau = $('#matKhauReset').val();



        const dt = {
            "UserName": tenTruyCap.trim(),
            "Password": matKhau.trim(),
        };

        try {
            const res = await fetch('/api/AccountApi/UpdateAccountPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dt)
            })

            if (!res.ok) {
                var errText = await res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Đổi mật khẩu người dùng thành công')
            $('#modalResetPass').modal('hide');
            $('#dataGrid').DataTable().ajax.reload().draw();
        }
        catch (err) {
            showNotification(0, err.message)
        }
    }
    async function dataLock() {
        let userName = $('#userNameLock').val();
        try {
            const res = await fetch(`/api/AccountApi/DisableUser/${userName}`, {
                method: 'POST'
            })
            if (!res.ok) {
                var errText = res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Khóa tài khoản người dùng thành công')
            $('#modalLock').modal('hide');
            $('#dataGrid').DataTable().ajax.reload().draw();
        } catch (err) {
            showNotification(0, err.message)
        }
    }
    async function dataUnLock() {
        let userName = $('#userNameUnLock').val();
        try {
            const res = await fetch(`/api/AccountApi/ActiveUser/${userName}`, {
                method: 'POST'
            })
            if (!res.ok) {
                var errText = res.text();
                throw new Error(errText);
            }
            showNotification(1, 'Mở khóa tài khoản người dùng thành công')
            $('#modalUnLock').modal('hide');
            $('#dataGrid').DataTable().ajax.reload().draw();
        } catch (err) {
            showNotification(0, err.message)
        }
    }

    // reset modal
    $("#modalAdd").on('show.bs.modal', function () {
       
        $('#tenTruyCapAdd').val("");
        $('#hoTenAdd').val("");
        $('#hopThuAdd').val("");
        $('#matKhauAdd').val("");
        $('#select_toChucAdd').val(null).trigger('change');
        $('#select_vaiTroAdd').val(null).trigger('change');

        $('#notifi_tenTruyCapAdd').addClass('d-none');
        $('#notifi_hoTenAdd').addClass('d-none')
        $('#notifi_hopThuAdd').addClass('d-none')
        $('#notifi_matKhauAdd').addClass('d-none')
    });
    $("#modalEdit").on('hide.bs.modal', function () {
        $('#notifi_tenTruyCapEdit').addClass('d-none');
        $('#notifi_hoTenEdit').addClass('d-none')
        $('#notifi_hopThuEdit').addClass('d-none')
        $('#notifi_matKhauEdit').addClass('d-none')

        $('#select_toChucEdit').val(null).trigger('change')
        $('#select_vaiTroEdit').val(null).trigger('change')
    });
    $("#modalResetPass").on('hide.bs.modal', function () {
        $('#notifi_matKhauReset').addClass('d-none')

        $('#matKhauReset').val('')
    });
    
    $('#dataGrid tbody').on('click', '.delete-command-btn', function () {
        var id = $(this).attr("ID").match(/\d+/)[0];
        var data = $('#dataGrid').DataTable().row(id).data();

        $('#idDelete').val(data.id);
        $('#tttDelete').text(`${data.typeName}`);
        $('#modalDelete').modal('show');
    });  
    $("#formDelete").submit(function (e) {
        e.preventDefault();
        dataDelete();
    });
    function dataDelete() {
        let id = $('#idDelete').val();
        $.ajax({
            type: 'DELETE',
            async: false,
            url: `${baseUrl}/api/DataTypeApi/Delete?id=` + id,
            dataType: 'JSON',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.value != 0) {
                    showNotification(1, "Xóa kiểu dữ liệu thành công")
                    $('#modalDelete').modal('hide');
                    $('#dataGrid').DataTable().ajax.reload().draw();
                } else {
                    showNotification(3, 'Kiểu dữ liệu đang sử dụng, không thể xóa')
                }
            },
            error: function (err) {
                showNotification(0, 'Lỗi. Xóa thuộc tính thất bại')
            }
        });
    }

    async function getToChucSelect(callback) {
        $('#org-search').empty();

        $('#org-search').append(`<option value="">Tất cả</option>`);
        const request = {
            "classID": 7,
        };
        let arr = []
        await getDataWithApi('POST', `/api/MetadataApi/Gets`, JSON.stringify(request))
            .then((data) => {
               
                if (data && data.value && data.value.length > 0) {
                   
                    data.value.forEach((el) => {
                        const res = findValueInData(0, el.data, 12);
                        const orgCode = findValueInData(0, el.data, 58);

                        const show = renderDataToShow(res);
                        const sl = {
                            "orgUniqueCode": renderDataToShow(orgCode),
                            "show": show
                        };
                        arr.push(sl);

                        if (isAdmin) {
                            $('#select_toChucAdd').append(`<option value="${orgCode.data}">${show}</option>`);
                            $('#select_toChucEdit').append(`<option value="${orgCode.data}">${show}</option>`);
                            $('#org-search').append(`<option value="${orgCode.data}">${show}</option>`);
                        } else {
                            if (orgUniqueCode == orgCode.data) {
                                $('#select_toChucAdd').append(`<option value="${orgCode.data}">${show}</option>`);
                                $('#select_toChucEdit').append(`<option value="${orgCode.data}">${show}</option>`);
                                $('#org-search').append(`<option value="${orgCode.data}">${show}</option>`);
                            }
                        }
                    });
                   
                }
            })
        return arr;
    };

    function getRolesSelect() {
        getDataWithApi('GET', `/api/AccountApi/GetAllRoles`)
            .then((data) => {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (isAdmin) {
                            $('#select_vaiTroAdd').append(`<option value="${data[i].id}">${data[i].name}</option>`);
                            $('#select_vaiTroEdit').append(`<option value="${data[i].id}">${data[i].name}</option>`);
                        } else {
                            if (data[i].name.toUpperCase() != "HOST" && data[i].name.toUpperCase() != "SYSTEMADMIN") {
                                $('#select_vaiTroAdd').append(`<option value="${data[i].id}">${data[i].name}</option>`);
                                $('#select_vaiTroEdit').append(`<option value="${data[i].id}">${data[i].name}</option>`);
                            }
                        }
                        
                        
                    }
                }
            })
    };
})