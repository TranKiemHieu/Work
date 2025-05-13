using Application.OD_AppUser;
using Domain;
using Domain.RequestDtos;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using SkiaSharp;
using System.Linq;
using System.Runtime.InteropServices;
using static System.Runtime.InteropServices.JavaScript.JSType;
//using static System.Runtime.InteropServices.JavaScript.JSType;

namespace QLTB.Controllers
{
    public class AccountApiController : AdminController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IMediator _mediator;

        public AccountApiController(IWebHostEnvironment hostingEnvironment, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IConfiguration config, IMediator mediator) : base(hostingEnvironment, config)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var result = await _roleManager.Roles.Where(r => r.Name != "Host").ToListAsync();
            return Ok(result);
        }

        [HttpPost]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers(string keyword="")
        {
            var perm = getPermission();
          
            var result = await _userManager.Users.Where(o => (o.UserName.Contains(keyword) || o.DisplayName.Contains(keyword))).ToListAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetUserDetail/{userId}")]
        public async Task<IActionResult> GetUserDetail(Int64 userId)
        {
            var result = await Mediator.Send(new Application.Account.ChiTiet.Query { UserId = userId });
            return HandleResult(result);
        }

        [HttpPost]
        [Route("CreateNewAccount")]
        public async Task<IActionResult> CreateNewAccount([FromBody] CreateAccountRequestDto _request)
        {
            AppUser newUser = new AppUser
            {
                UserName = _request.UserName,
                DisplayName = _request.DisplayName,
                Email = _request.Email,
                LockoutEnabled = false,
                LockoutEnd = new DateTime(9999,12,31)
            };

            var createResult = await _userManager.CreateAsync(newUser, _request.Password);

            if (!createResult.Succeeded)
            {
                List<string> errors = new List<string>();
                foreach(var error in createResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }
            List<string> lstRoles = _request.Roles.Split(',').ToList();
            await _userManager.AddToRolesAsync(newUser, lstRoles);

            return Ok();
        }

        [HttpPut]
        [Route("UpdateAccount")]
        public async Task<IActionResult> UpdateAccount([FromBody] CreateAccountRequestDto _request)
        {
            AppUser appUser = await _userManager.FindByNameAsync(_request.UserName);

            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {_request.UserName}");
            }

            appUser.DisplayName = _request.DisplayName;
            appUser.Email = _request.Email;
            appUser.OrgUniqueCode = _request.UniqueOrgCode;
            var updateResult = await _userManager.UpdateAsync(appUser);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult);
            }

            return Ok();
        }

        [HttpPut]
        [Route("UpdateAccountPassword")]
        public async Task<IActionResult> UpdateAccountPassword([FromBody] CreateAccountRequestDto _request)
        {
            AppUser appUser = await _userManager.FindByNameAsync(_request.UserName);

            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {_request.UserName}");
            }

            var pToken = await _userManager.GeneratePasswordResetTokenAsync(appUser);
            var updateResult = await _userManager.ResetPasswordAsync(appUser, pToken, _request.Password);
            if (!updateResult.Succeeded)
            {
                List<string> errors = new List<string>();
                foreach (var error in updateResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }

            return Ok();
        }

        [HttpPut]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto _request)
        {
            AppUser appUser = await _userManager.FindByNameAsync(_request.username);

            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {_request.username}");
            }
            var updateResult = await _userManager.ChangePasswordAsync(appUser, _request.oldpassword, _request.newpassword);

            if (!updateResult.Succeeded)
            {
                List<string> errors = new List<string>();
                foreach (var error in updateResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }

            return Ok();
        }

        [HttpPut]
        [Route("AddRoleToAccount/{username}/{rolename}")]
        public async Task<IActionResult> AddRoleToAccount(string username, string rolename)
        {
            AppUser appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {username}");
            }
            var updateResult = await _userManager.AddToRoleAsync(appUser, rolename);
            if (!updateResult.Succeeded)
                return BadRequest(updateResult);

            return Ok();
        }

        [HttpDelete]
        [Route("RemoveRoleFromAccount/{username}/{rolename}")]
        public async Task<IActionResult> RemoveRoleFromAccount(string username, string rolename)
        {
            AppUser appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {username}");
            }
            var updateResult = await _userManager.RemoveFromRoleAsync(appUser, rolename);
            if (!updateResult.Succeeded)
                return BadRequest(updateResult);

            return Ok();
        }

        [HttpPost]
        [Route("DisableUser/{username}")]
        public async Task<IActionResult> DisableUser(string username)
        {
            AppUser appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {username}");
            }

            var disableResult =  await _userManager.SetLockoutEnabledAsync(appUser, true);
            List<string> errors = new List<string>();

            if (!disableResult.Succeeded)
            {
                foreach (var error in disableResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }

            return Ok();
        }

        [HttpPost]
        [Route("ActiveUser/{username}")]
        public async Task<IActionResult> ActiveUser(string username)
        {
            AppUser appUser = await _userManager.FindByNameAsync(username);
            if (appUser == null)
            {
                return BadRequest($"Không tìm thấy tài khoản có tên đăng nhập là {username}");
            }

            List<string> errors = new List<string>();

            var disableResult = await _userManager.SetLockoutEnabledAsync(appUser, false);

            if (!disableResult.Succeeded)
            {
                foreach (var error in disableResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }

            return Ok();
        }

        [HttpPost]
        [Route("AddRole")]
        public async Task<IActionResult> AddRole(AppRole appRole)
        {
            AppRole newRole = new AppRole
            {
                Name = appRole.Name,
                NormalizedName = appRole.Name.ToUpper(),
                RoleDescription = appRole.RoleDescription
            };
            var role = await _roleManager.FindByNameAsync(appRole.Name);
            if (role != null)
            {
                return BadRequest("Vai trò đã tồn tại");
            }
            var createResult = await _roleManager.CreateAsync(newRole);

            if (!createResult.Succeeded)
            {
                List<string> errors = new List<string>();
                foreach (var error in createResult.Errors)
                {
                    errors.Add(error.Description);
                }
                return BadRequest(string.Join(". ", errors));
            }
            return Ok(createResult);
        }
        [HttpPost]
        [Route("UpdateRole")]
        public async Task<IActionResult> UpdateRole(AppRole appRole)
        {
            AppRole newRole = new AppRole
            {
                Id = appRole.Id,
                Name = appRole.Name,
                NormalizedName = appRole.Name.ToUpper(),
                RoleDescription = appRole.RoleDescription
            };

            var role = await _roleManager.Roles.Where(e => e.Id != appRole.Id && e.Name == appRole.Name).ToListAsync();
           
            if(role.Count > 0)
            {
                return BadRequest("Vai trò đã tồn tại");
            }

            var result = await Mediator.Send(new Application.Role.CapNhat.Command { Entity = appRole });
            if(result.IsSuccess && result.Value != null)
            {
                return Ok();
            }
            return BadRequest(result.Error);
        }

        [HttpDelete]
        [Route("DeleteRole")]
        public async Task<IActionResult> DeleteRole(string id)
        {
          
            var role = await _roleManager.FindByIdAsync(id);
            if(role == null)
            {
                return BadRequest("Không tìm thấy vai trò");
            }
            
            var result = await Mediator.Send(new Application.Role.Xoa.Command { Id = long.Parse(id) });
            if (result.IsSuccess && result.Value != 0)
            {
                return Ok();
            }
            return BadRequest(result.Error);
        }
    }
}
