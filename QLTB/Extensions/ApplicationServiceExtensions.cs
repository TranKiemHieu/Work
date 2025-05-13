using Application.AdminMenu;
using Application.BaiViet;
using Application.Core;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace QLTB.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //services.AddEndpointsApiExplorer();

            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
                });
            });

            services.AddMediatR(typeof(Application.AdminMenu.DanhSach.Handler));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddSession(options =>
            {
                // Set session timeout
                options.IdleTimeout = TimeSpan.FromMinutes(30);
            });

            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<ThemMoi>();

            return services;
        }
    }
}
