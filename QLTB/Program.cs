using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using QLTB;
using QLTB.Extensions;
using QLTB.Models;
using Persistence;
using QLTB.Interface;
using QLTB.Repository;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "CorsPolicy",
    policy =>
    {
        //policy.AllowAnyHeader().AllowCredentials().AllowAnyOrigin().AllowAnyMethod();

        policy.AllowAnyOrigin();
        //policy.AllowAnyHeader();

        //policy.WithOrigins("http://localhost:5500").AllowAnyHeader();
    });
});

//builder.Configuration.AddJsonFile("nav.json", optional: true, reloadOnChange: true);

// Add services to the container.
builder.Services.AddControllersWithViews();

//builder.Services.Configure<AdminNavModel>(builder.Configuration.GetSection("Navs"));

//builder.Services.AddTransient<IJsonService, JsonService>();

builder.Services.AddApplicationServices(builder.Configuration);

//builder.Services.AddInfrastructure();

builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.Password.RequireNonAlphanumeric = false;
});

builder.Services.AddIdentity<AppUser, AppRole>(config =>
{
    
})
    .AddEntityFrameworkStores<DataContext>()
    .AddErrorDescriber<OpenDataIdentityErrorDescriber>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(config =>
{
    config.Cookie.Name = "Huecit.Cookie";
    config.LoginPath = "/home/login";
    config.ExpireTimeSpan = TimeSpan.FromHours(1);
    config.SlidingExpiration = true;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppUser>, CustomClaimsPrincipalFactory>();

builder.Services.AddScoped<IConnectDB, ConnectDB>();
builder.Services.AddScoped<ITinTucRepository, TinTucRepository>();

var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//app.UseStatusCodePagesWithRedirects("/StatusCodeError/{0}");

//app.UseCors("CorsPolicy");
//app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("CorsPolicy");
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapAreaControllerRoute(
    name: "AdminTool",
    areaName: "AdminTool",
    pattern: "AdminTool/{controller=Home}/{action=Index}"
);



app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "DanhSachBaiViet",
    pattern: "{url}",
    defaults: new
    {
         controller = "BaiViet",
         action = "DanhSachBaiViet"
    });

app.MapControllerRoute(
    name: "chitiet",
    pattern: "/{urlchuyenmuc}/cid/{type}/{urlbaiviet}",
    defaults: new
    {
        controller = "BaiViet",
        action = "ChiTiet"
    });


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager, roleManager);
}
catch(System.Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "chi la ri");
    //throw;
}



app.Run();