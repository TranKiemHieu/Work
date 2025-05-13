using System;
using System.Security.Policy;
using Application.BaiViet;
using Application.Core;
using Aspose.Cells.Drawing;
using Azure.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Persistence;
using static Dapper.SqlMapper;

namespace QLTB.Controllers
{
    public class FileController : Controller
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;

        public string[] ImgFileTypes = { ".bmp", ".gif", ".jpeg", ".jpg", ".png" };

        public FileController(IWebHostEnvironment hostingEnvironment, IConfiguration config)
        {
            _hostingEnvironment = hostingEnvironment;
            _config = config;
        }

        [HttpPost]
        public async Task<ActionResult> UploadAdapter(IFormFile upload, string type = "", string subDirectory = "CKEditor")
        {
            string BlockFileExt = _config.GetValue<string>("BlockFileExt");

            string fileName = upload.FileName;
            //Kiểm tra là đuôi file bị chặn từ appsetting
            if (BlockFileExt != null)
            {
                bool check = IsFileTypeBlocked(fileName, BlockFileExt);
                if (check == true)
                {
                    return Json(new { error = new { message = "Định dạng file không được hỗ trợ!" } });
                }
            }

            int MaxFileSizeMB = _config.GetValue<int>("MaxFileSize");
            //Từ MB -> B
            long MaxFileSize = MaxFileSizeMB * 1024 * 1024;

            if (upload.Length <= 0)
            {
                return Json(new { error = new { message = "File rỗng, vui lòng kiểm tra lại file!" } });
            }

            if (MaxFileSize > 0 && upload.Length > MaxFileSize)
            {
                string resp = $"Kích thước file quá lớn! Tối đa {MaxFileSizeMB} MB";
                return Json(new { error = new { message = resp } });
            }

            if (type == "img")
            {
                bool check = IsFileTypeValid(ImgFileTypes, fileName);
                if (check == false)
                {
                    return Json(new { error = new { message = "Định dạng file không được hỗ trợ!" } });
                }
            }

            DateTime curr = DateTime.Now;
            int year = curr.Year;
            string yearFolder = $"{year}";

            var target = Path.Combine(_hostingEnvironment.ContentRootPath, "wwwroot", "Upload", subDirectory, yearFolder);

            if (!Directory.Exists(target))
                Directory.CreateDirectory(target);

            string pre = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString();

            int idx = fileName.LastIndexOf('.');
            string newFileName = $"{fileName.Substring(0, idx)}_{pre}{fileName.Substring(idx)}";
            var filePath = Path.Combine(target, $"{newFileName}");

            string returnPath = $"/Upload/{subDirectory}/{yearFolder}/{newFileName}";

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);

                string Url = returnPath;

                var success = new { uploaded = 1, fileName, Url };

                return Json(success);
            }
        }

        protected bool IsFileTypeValid(string[] validFileTypes, string fileName)
        {
            bool result = false;

            if (validFileTypes != null)
            {
                string ext = Path.GetExtension(fileName).ToLower();
                for (int i = 0; i < validFileTypes.Length; i++)
                {
                    if (ext.Equals(validFileTypes[i].ToLower()))
                    {
                        result = true;
                        break;
                    }
                }
            }

            return result;
        }

        protected bool IsFileTypeBlocked(string fileName, string blockedFileTypes)
        {
            bool result = false;

            if (!string.IsNullOrEmpty(blockedFileTypes))
            {
                string[] blockedArr = blockedFileTypes.Split(',');
                if (blockedArr.Count() > 0)
                {
                    string ext = Path.GetExtension(fileName).ToLower();
                    for (int i = 0; i < blockedArr.Length; i++)
                    {
                        if (ext.Equals(blockedArr[i].ToLower()))
                        {
                            result = true;
                            break;
                        }
                    }

                    return result;
                }
            }

            return result;
        }
    }
}
