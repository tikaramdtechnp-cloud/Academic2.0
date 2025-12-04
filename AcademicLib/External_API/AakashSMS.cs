using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.External_API {
    public class ApiResponse {
        public string Status { get; set; }
        public ResponseData Data { get; set; }
    }

    public class ResponseData {
        public object UserJobFirstRow { get; set; }
        public PagedResult Result { get; set; }
    }

    public class PagedResult {
        public int CurrentPage { get; set; }
        public List<AakashSmsResponse> Data { get; set; }
        public string FirstPageUrl { get; set; }
        public int From { get; set; }
        public int LastPage { get; set; }
        public string LastPageUrl { get; set; }
        public List<PaginationLink> Links { get; set; }
        public string NextPageUrl { get; set; }
        public string Path { get; set; }
        public int PerPage { get; set; }
        public string PrevPageUrl { get; set; }
        public int To { get; set; }
        public int Total { get; set; }
    }

    public class AakashSmsResponse {
        public string Recipient { get; set; }
        public string Network { get; set; }
        public string Body { get; set; }
        public string Credit { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class PaginationLink {
        public string Url { get; set; }
        public string Label { get; set; }
        public bool Active { get; set; }
    }
}
