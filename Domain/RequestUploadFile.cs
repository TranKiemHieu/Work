using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Domain
{
    public class RequestUploadFile
    {
        public string Data { get; set; }
        public List<IFormFile> AnhBieuTuong { get; set; } = new List<IFormFile>();
        public int AnhBieuTuongElementID { get; set; }
        public List<IFormFile> AnhDaiDien { get; set; } = new List<IFormFile>();
        public List<IFormFile> Thumbnail { get; set; } = new List<IFormFile>();
        public int AnhDaiDienElementID { get; set; }
        public List<IFormFile> FileMedia { get; set; } = new List<IFormFile>();
        public int TepDinhKemElementID { get; set; }
        //DistributionExt
        public string MimeType { get; set; }
        public string JsonData { get; set; }
        public bool AutoUpdate { get; set; }
        public short? Frequency { get; set; }
    }

    public class ResultUploadFile
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public string Url { get; set; }
        public string JsonData { get; set; }
        public int Star { get; set; }
        public string MimeType { get; set; }
        public long Size { get; set; }
    }
}
