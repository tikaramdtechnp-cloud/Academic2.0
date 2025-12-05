using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using YourNamespace.Models;

namespace AcademicLib.BL.SMS {
    public class SmsService {
        public class SmsReportApiService {
            private readonly HttpClient _httpClient;
            private readonly string _authToken;
            private readonly string _baseUrl = "https://sms.aakashsms.com";

            public SmsReportApiService()
            {
                _httpClient=new HttpClient();
                _httpClient.Timeout=TimeSpan.FromSeconds(60);
                //_httpClient.DefaultRequestHeaders.Add("User-Agent", "");

                _authToken=System.Configuration.ConfigurationManager.AppSettings["SmsApiToken"]
                            ??"fc9b16025a8b2837322f7475cd601b34a684e952860b605ada375bf7ddac5632";
            }

            public async Task<SmsApiResponse> GetSmsReportAsync(DateTime startDate, DateTime endDate,
                                                                string reportType = "logswise",
                                                                string network = "all",
                                                                int? page = null)
            {
                try
                {

                    var queryParams = BuildQueryString(startDate, endDate, reportType, network, page);
                    var requestUrl = $"{_baseUrl}/sms/v4/api-report{queryParams}";

                    var response = await _httpClient.GetAsync(requestUrl);
                    response.EnsureSuccessStatusCode();

                    var jsonContent = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<SmsApiResponse>(jsonContent);

                    return result;
                } catch(HttpRequestException ex)
                {
                    throw new Exception($"Request failed: {ex.Message}", ex);
                } catch(Exception ex)
                {
                    throw new Exception($"Error processing SMS api: {ex.Message}", ex);
                }
            }

            public async Task<List<SmsMessage>> GetAllSmsMessagesAsync(DateTime startDate, DateTime endDate)
            {
                var allMessages = new List<SmsMessage>();
                int currentPage = 1;
                bool hasMorePages = true;

                while(hasMorePages)
                {
                    var response = await GetSmsReportAsync(startDate, endDate, page: currentPage);

                    if(response.Status=="success"&&response.Data?.Result?.Data!=null)
                    {
                        allMessages.AddRange(response.Data.Result.Data);


                        if(currentPage>=response.Data.Result.Last_page||
                            string.IsNullOrEmpty(response.Data.Result.Next_page_url))
                        {
                            hasMorePages=false;
                        } else
                        {
                            currentPage++;
                        }
                    } else
                    {
                        hasMorePages=false;
                    }
                }

                return allMessages;
            }


            private string BuildQueryString(DateTime startDate, DateTime endDate,
                                           string reportType, string network, int? page)
            {
                var query = $"?start_date={startDate:yyyy-MM-dd}"+
                           $"&end_date={endDate:yyyy-MM-dd}"+
                           $"&report_type={reportType}"+
                           $"&network={network}"+
                           $"&auth_token={_authToken}";

                if(page.HasValue)
                {
                    query+=$"&page={page.Value}";
                }

                return query;
            }
        }
    }
}
