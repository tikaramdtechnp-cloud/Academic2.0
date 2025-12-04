using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;
using PivotalERP.Models;
using AcademicLib.BE.Global;
using PivotalERP;

namespace AcademicERP.Areas.SMS.Controllers
{
    public class AakashSMSController : PivotalERP.Controllers.BaseController
    {
        public ActionResult AakashSMSAPI()
        {
            return View();
        }
    }
}