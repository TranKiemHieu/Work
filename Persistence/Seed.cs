using Domain;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                var roleList = new List<AppRole>
                {
                    new AppRole
                    {
                        Name = "Host"
                    },
                    new AppRole
                    {
                        Name = "Admin"
                    }
                };

                foreach (var role in roleList)
                {
                    await roleManager.CreateAsync(role);
                }
            }

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "kdc",
                        UserName = "kdc",
                        Email = "kdc@email.com",
                        LockoutEnabled = false,
                        LockoutEnd = new DateTime(9999,12,31)
                    },
                    new AppUser
                    {
                        DisplayName = "host",
                        UserName = "host",
                        Email = "host@email.com",
                        LockoutEnabled = false,
                        LockoutEnd = new DateTime(9999,12,31)
                    }
                };

                foreach(var user in users)
                {
                    await userManager.CreateAsync(user, "Abc@12345");
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }

            //if (context.Activity.Any()) return;
            //var activity = new List<Activity>
            //{
            //    new Activity
            //    {
            //        Title = "kdc",
            //        Content = "kdc"
            //    },
            //    new Activity
            //    {
            //        Title = "hth",
            //        Content = "hth"
            //    }
            //};

            //await context.Activity.AddRangeAsync(activity);
            await context.SaveChangesAsync();
        }
    }
}
