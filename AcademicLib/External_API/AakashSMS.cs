using System;
using System.Collections.Generic;

namespace YourNamespace.Models {
    public class SmsApiResponse {
        public string Status { get; set; }
        public SmsResponseData Data { get; set; }
    }

    public class SmsResponseData {
        public object UserJobFirstRow { get; set; }
        public PagedSmsResult Result { get; set; }
    }

    public class PagedSmsResult {
        public int Current_page { get; set; }
        public List<SmsMessage> Data { get; set; }
        public string First_page_url { get; set; }
        public int From { get; set; }
        public int Last_page { get; set; }
        public string Last_page_url { get; set; }
        public List<PaginationLink> Links { get; set; }
        public string Next_page_url { get; set; }
        public string Path { get; set; }
        public int Per_page { get; set; }
        public string Prev_page_url { get; set; }
        public int To { get; set; }
        public int Total { get; set; }
    }

    public class SmsMessage {
        public string Recipient { get; set; }
        public string Network { get; set; }
        public string Body { get; set; }
        public string Credit { get; set; }
        public string Created_at { get; set; }
        public string Status { get; set; }
        public string Updated_at { get; set; }
    }

    public class PaginationLink {
        public string Url { get; set; }
        public string Label { get; set; }
        public bool Active { get; set; }
    }
}