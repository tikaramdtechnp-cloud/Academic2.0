using AcademicLib.BE.Global;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;
using PivotalERP;
using PivotalERP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static AcademicLib.BL.SMS.SmsService;

namespace AcademicERP.Areas.SMS.Controllers
{
    public class AakashSMSController : PivotalERP.Controllers.BaseController 
    {
        private readonly SmsReportApiService _smsService = new SmsReportApiService();

        public ActionResult AakashSMSAPI()
        {
            return View();
        }

        public async Task<JsonResult> GetSmsReportJson(DateTime? startDate = null, DateTime? endDate = null, int page = 1)
        {
            try
            {
                startDate=startDate??DateTime.Now.AddDays(-1);
                endDate=endDate??DateTime.Now;

                var result = await _smsService.GetSmsReportAsync(startDate.Value, endDate.Value, page: page);

                if(result.Status=="success")
                {
                    return Json(new
                    {
                        success = true,
                        data = result.Data?.Result?.Data,
                        total = result.Data?.Result?.Total,
                        currentPage = result.Data?.Result?.Current_page,
                        totalPages = result.Data?.Result?.Last_page,
                        itemsPerPage = result.Data?.Result?.Per_page
                    }, JsonRequestBehavior.AllowGet);
                } else
                {
                    return Json(new
                    {
                        success = false,
                        error = "Aakash SMS API returned non-success status"
                    }, JsonRequestBehavior.AllowGet);
                }
            } catch(Exception ex)
            {
                return Json(new
                {
                    success = false,
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        // API endpoint for getting all messages (no pagination)
        public async Task<JsonResult> GetAllSmsMessagesJson(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate=startDate??DateTime.Now.AddDays(-30);
                endDate=endDate??DateTime.Now;

                var allMessages = await _smsService.GetAllSmsMessagesAsync(startDate.Value, endDate.Value);

                return Json(new
                {
                    success = true,
                    data = allMessages,
                    total = allMessages.Count
                }, JsonRequestBehavior.AllowGet);
            } catch(Exception ex)
            {
                return Json(new
                {
                    success = false,
                    error = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }


        public async Task<ActionResult> ExportToCsv(DateTime? startDate = null, DateTime? endDate = null)
        {
            try
            {
                startDate=startDate??DateTime.Now.AddDays(-30);
                endDate=endDate??DateTime.Now;

                var allMessages = await _smsService.GetAllSmsMessagesAsync(startDate.Value, endDate.Value);


                var csvContent = "Recipient,Network,Credit,Status,Created At,Updated At,Message\n";

                foreach(var msg in allMessages)
                {
                    var cleanBody = msg.Body?.Replace("\"", "\"\"").Replace("\n", " ").Replace("\r", "");
                    csvContent+=$"\"{msg.Recipient}\",\"{msg.Network}\",\"{msg.Credit}\",\"{msg.Status}\",\"{msg.Created_at}\",\"{msg.Updated_at}\",\"{cleanBody}\"\n";
                }

                return File(System.Text.Encoding.UTF8.GetBytes(csvContent),
                          "text/csv",
                          $"sms-report-{startDate:yyyyMMdd}-to-{endDate:yyyyMMdd}.csv");
            } catch(Exception ex)
            {
                ViewBag.Error=ex.Message;
                return View("Error");
            }
        }
    }
}