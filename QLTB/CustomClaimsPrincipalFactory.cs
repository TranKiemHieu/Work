using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Configuration;
using System.Security.Claims;

namespace QLTB
{
    public class CustomClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppUser>
    {
        public CustomClaimsPrincipalFactory(UserManager<AppUser> userManager, IOptions<IdentityOptions> optionsAccessor) : base(userManager, optionsAccessor)
        {
            
        }

        public async override Task<ClaimsPrincipal> CreateAsync(AppUser user)
        {
            var principal = await base.CreateAsync(user);

            //if (!string.IsNullOrEmpty(user.PhoneNumber))
            //{
            //    if (principal.Identity != null)
            //    {
            //        ((ClaimsIdentity)principal.Identity).AddClaims(
            //            new[] { new Claim("Phone", user.PhoneNumber) });
            //    }
            //}

            var lstRole = await base.UserManager.GetRolesAsync(user);
            string strRolesList = string.Join(',', lstRole);

            if (principal.Identity != null)
            {
                ((ClaimsIdentity)principal.Identity).AddClaims(
                    new[] { new Claim("OrgUniqueCode", string.IsNullOrEmpty(user.OrgUniqueCode) ? "" : user.OrgUniqueCode), new Claim("RolesList", strRolesList), new Claim("DisplayName", user.DisplayName) });

            }

            return principal;
        }
    }
}
