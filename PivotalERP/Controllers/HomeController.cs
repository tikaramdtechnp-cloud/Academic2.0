using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace PivotalERP.Controllers
{
    //[FilterIp]
    public class HomeController : BaseController
    {
        Dynamic.BusinessLogic.Security.User userBL;
        public HomeController()
        {
            string dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            string hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

            userBL = new Dynamic.BusinessLogic.Security.User(hostName, dbName);
        }

        private bool checkExpiry = false;
        //[LicenseCheck]
        public ActionResult CIndex()
        {
            var aId = new AcademicLib.BL.Academic.Creation.AcademicYear(User.UserId, User.HostName, User.DBName).getDefaultAcademicYearId();
            if (aId.IsSuccess)
            {
                Session.Remove("AcademicYearId" + User.UserId.ToString());
                Session.Add("AcademicYearId" + User.UserId.ToString(), aId.RId);
            }

            ViewBag.API_KEY = googleMAP_APIKEY;

            Dynamic.BusinessEntity.Setup.CompanyDetail comDet = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetails();
            return View(comDet);
        }

        //[LicenseCheck]
        public ActionResult Index()
        {
         
            string uname = User.UserName.Trim().ToLower();
            string pwd = User.Password.Trim().ToLower();
            if (User.Password.Trim().ToLower() == "admin" || User.Password.Trim().ToLower() == "123" || !Global.GlobalFunction.IsStrongPassword(User.Password) || pwd.Contains(uname))
                return RedirectToAction("ChangePassword", "Setup/Security", new { rd = 1 });

            if (AcademicType=="college")
                return RedirectToAction("CIndex", "Home");

            //RedirectToAction("Index", "Common", "DashBoard");

            //return RedirectToAction("Index", "Common", new { area = "DashBoard" });

            var aId = new AcademicLib.BL.Academic.Creation.AcademicYear(User.UserId,User.HostName, User.DBName).getDefaultAcademicYearId();
            if (aId.IsSuccess)
            {
                Session.Remove("AcademicYearId" + User.UserId.ToString());
                Session.Add("AcademicYearId" + User.UserId.ToString(), aId.RId);
            }

            ViewBag.API_KEY = googleMAP_APIKEY;

            Dynamic.BusinessEntity.Setup.CompanyDetail comDet = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetails();

            string flv = Flavour;
            if (string.IsNullOrEmpty(flv))
                return View(comDet);
            else
            {
                flv = "Index_" + flv;
                if (ViewExists(flv))
                    return View(flv, comDet);
                else
                    return View(comDet);

            } 
        }

        [AllowAnonymous]       
        public ActionResult Registration()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpPost]
        //[FilterIp]
        public JsonNetResult SaveReg()
        {
            string photoLocation = "/Attachments/academic/student";
            ResponeValues resVal = new ResponeValues();
            try
            {
                
                var beData = DeserializeObject<AcademicLib.BE.FrontDesk.Transaction.AddmissionEnquiry>(Request["jsonData"]);
                if (beData != null)
                {                    
                    beData.Sourse = "Online";


                    if (beData.AttachmentColl == null)
                        beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

                    var tmpAttachmentColl = beData.AttachmentColl;

                    beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        var photo = filesColl["photo"];
                        
                        if (photo != null)
                        {
                            var photoDoc = GetAttachmentDocuments(photoLocation, photo, true);
                           //beData.Photo = photoDoc.Data;
                            beData.PhotoPath = photoDoc.DocPath;

                        }

                        int fInd = 0;
                        foreach (var v in tmpAttachmentColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);
                                beData.AttachmentColl.Add
                                    (
                                     new Dynamic.BusinessEntity.GeneralDocument()
                                     {
                                         Data = att.Data,
                                         DocPath = att.DocPath,
                                         DocumentTypeId = v.DocumentTypeId,
                                         Extension = att.Extension,
                                         Name = v.Name,
                                         Description = v.Description
                                     }
                                    );
                            }
                            fInd++;
                        }
                    }


                    if (!string.IsNullOrEmpty(beData.PhotoPath) && beData.Photo == null)
                    {
                        if (beData.PhotoPath.StartsWith(photoLocation))
                        {
                            beData.Photo = GetBytesFromFile(beData.PhotoPath);
                        }
                    }

                    foreach (var v in tmpAttachmentColl)
                    {
                        if (!string.IsNullOrEmpty(v.DocPath) && v.Data == null)
                        {
                            if (v.DocPath.StartsWith(photoLocation))
                            {
                                v.Data = GetBytesFromFile(beData.PhotoPath);
                            }
                        }
                    }
                    beData.EnquiryId = 0;

                    beData.CUserId = 1;
                    beData.EnquiryDate = DateTime.Now;
                    beData.Address = beData.PA_FullAddress;
                    beData.IsAnonymous = true;
                    beData.IPAddress = GetIp();
                    beData.Agent = Request.UserAgent;
                    beData.Browser = Request.Browser.Browser;
                    resVal = new AcademicLib.BL.FrontDesk.Transaction.AddmissionEnquiry(1, hostName, dbName).SaveFormData(this.AcademicYearId, beData);
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [AllowAnonymous]
        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public JsonNetResult GetAboutComp()
        {
            var dataColl = new AcademicLib.BL.AppCMS.Creation.AboutUs(1, hostName, dbName).getAbout(null);
            return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [AllowAnonymous]
        public ActionResult Login(string returnUrl = "")
        {
            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");
            
            var user = new Dynamic.BusinessEntity.Security.User() { ResponseMSG = returnUrl,DBName=companyList[0].datatype };

            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");

            user.ResponseMSG = "";

            string flv = Flavour;
            if (string.IsNullOrEmpty(flv))
                return View(user);
            else
            {
                flv = "Login_" + flv;
                if (ViewExists(flv))
                    return View(flv, user);
                else
                    return View(user);

            } 
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login(Dynamic.BusinessEntity.Security.User beData)
        {

            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
            {
               
                
                return RedirectToAction("Index", "Home");
            }

            else
            {
                string pwd= beData.Password;
                beData.ResponseMSG = "";
                beData.PublicIP = GetIp();

                if (!string.IsNullOrEmpty(beData.DBName))
                    userBL = new Dynamic.BusinessLogic.Security.User(hostName, beData.DBName);

                Dynamic.BusinessEntity.Security.User loginUser = userBL.IsValidUser(beData);

                if (loginUser.IsValid)
                {
                    if(loginUser.GroupName== "employee" || loginUser.GroupName == "student" || loginUser.GroupName=="rstudent")
                    {
                        loginUser.ResponseMSG = "student/teachers are not allow to login";
                        loginUser.IsValid = false;
                    }

                    if (loginUser.SMS_OTP || loginUser.Email_OTP || loginUser.Google_OTP)
                    {
                        loginUser.OTPRequired = true;
                        beData.OTPRequired = true;
                        beData.UserId = loginUser.UserId;

                        if (loginUser.Google_OTP)
                        {
                            var otp = IsValidGoogleAuth(beData.UserName, beData.OTP, Dynamic.BusinessEntity.Global.FormsEntity.Login.ToString(), hostName, dbName);
                            if (!otp.IsSuccess)
                            {
                                loginUser.ResponseMSG = otp.ResponseMSG;
                                loginUser.IsValid = false;
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(beData.OTP))
                            {
                                var otp = userBL.IsValidOTP(loginUser.UserId, beData.OTP, (int)AcademicLib.BE.Global.ENTITIES.Login, "");
                                if (!otp.IsSuccess)
                                {
                                    loginUser.ResponseMSG = otp.ResponseMSG;
                                    loginUser.IsValid = false;
                                }
                            }
                            else
                            {
                                if (!loginUser.FrizeSelected)
                                {
                                    userBL.generateOTP(loginUser.UserId, "", "", (int)AcademicLib.BE.Global.ENTITIES.Login);
                                    loginUser.FrizeSelected = true;
                                }

                                loginUser.Password = pwd;
                                beData.Password = pwd;
                                loginUser.ResponseMSG = "OTP Required";
                                loginUser.IsValid = false;
                            }
                        }
                       
                    }
                }
                 

                if (loginUser.IsValid)
                {
                    var aId = new AcademicLib.BL.Academic.Creation.AcademicYear(loginUser.UserId, hostName, beData.DBName).getDefaultAcademicYearId();
                    if (aId.IsSuccess)
                    {
                        Session.Remove("AcademicYearId" + loginUser.UserId.ToString());
                        Session.Add("AcademicYearId" + loginUser.UserId.ToString(), aId.RId);

                        loginUser.Password = beData.Password;
                        Dynamic.BusinessEntity.Security.LoginLog lLog = new Dynamic.BusinessEntity.Security.LoginLog();
                        lLog.MacAddress = GetMacAddress(beData.PublicIP);
                        lLog.UserId = loginUser.UserId;
                        lLog.UserName = loginUser.UserName;
                        lLog.LogDateTime = DateTime.Now;
                        lLog.LocalDateTime = DateTime.Now;
                        lLog.AppVersion = "2.0.0.0";
                        lLog.InOut = 1;
                        lLog.LastUpdated = DateTime.Now;
                        lLog.PCName = Request.Headers.Get("User-Agent");
                        lLog.SystemUser = System.Environment.UserName;
                        lLog.LocalIP = LocalIPAddress();
                        lLog.PublicIP = beData.PublicIP;

                        if (!string.IsNullOrEmpty(beData.DBName))
                            loginUser.DBName = beData.DBName;
                        else
                            loginUser.DBName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();

                        loginUser.HostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

                        var resVal = new Dynamic.DataAccess.Global.GlobalDB(loginUser.HostName, loginUser.DBName).SaveLoginLog(lLog);

                        if (resVal.IsSuccess)
                        {
                            try
                            {
                                var globalBL = new Global.GlobalFunction(loginUser.UserId, loginUser.HostName, loginUser.DBName);
                                var apiData = new AcademicLib.BL.Global(loginUser.UserId, loginUser.HostName, loginUser.DBName).getNoOfDataForCRM();
                                apiData.DBName = loginUser.DBName;
                                apiData.DBServer = loginUser.HostName;
                                apiData.UrlName = Request.Url.Host + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
                                apiData.LoginAt = DateTime.Now;
                                apiData.LoginFrom = "Web";
                                apiData.LoginIP = beData.PublicIP;
                                apiData.UserName = loginUser.UserName;
                                globalBL.CustomerLoginLog( apiData);
                            }
                            catch { }
                             
                            SessionContext sessContext = new SessionContext();
                            sessContext.SetAuthenticationToken(loginUser.UserName, false, loginUser);

                            Session.Remove("AcademicYearId" + loginUser.UserId.ToString());
                            Session.Add("AcademicYearId" + loginUser.UserId.ToString(), aId.RId);

                            string dbCode = loginUser.DBName.ToLower();
                           
                            if (checkExpiry)
                                getExpireDate(loginUser.UserName, dbCode);

                            return RedirectToAction("Index", "Home");
                        }
                        else
                        {
                            ModelState.AddModelError("", "Unable To Login Pls Try Again");
                        }
                    }
                    else
                    {
                        ModelState.AddModelError("", "pls 1st setup academic year");
                        beData.ResponseMSG = "pls 1st setup academic year";
                        beData.IsValid = false;
                        loginUser.ResponseMSG = "pls 1st setup academic year";
                        loginUser.IsValid = false;
                    }
                    
                }
                else
                {
                    beData.ResponseMSG = loginUser.ResponseMSG;
                    ModelState.AddModelError("", loginUser.ResponseMSG);
                }
            }

            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            string flv = Flavour;
            if (string.IsNullOrEmpty(flv))
                return View(beData);
            else
            {
                flv = "Login_" + flv;
                if (ViewExists(flv))
                    return View(flv, beData);
                else
                    return View(beData);

            }
             
        }


        [AllowAnonymous]
        [HttpPost]
        public void GenerateOTP(Dynamic.BusinessEntity.Security.User beData)
        {

            string pwd = beData.Password;
            beData.ResponseMSG = "";
            beData.PublicIP = GetIp();

            if (!string.IsNullOrEmpty(beData.DBName))
                userBL = new Dynamic.BusinessLogic.Security.User(hostName, beData.DBName);

            Dynamic.BusinessEntity.Security.User loginUser = userBL.IsValidUser(beData);

            if (loginUser.IsValid)
            {
                if (loginUser.GroupName == "employee" || loginUser.GroupName == "student")
                {
                    loginUser.ResponseMSG = "student/teachers are not allow to login";
                    loginUser.IsValid = false;
                }

                if (loginUser.SMS_OTP || loginUser.Email_OTP || loginUser.Google_OTP)
                {
                    loginUser.OTPRequired = true;
                    beData.OTPRequired = true;
                    beData.UserId = loginUser.UserId;
                    //userBL.generateOTP(loginUser.UserId);
                    userBL.generateOTP(loginUser.UserId, "", "", (int)AcademicLib.BE.Global.ENTITIES.Login);
                    loginUser.FrizeSelected = true;
                    loginUser.Password = pwd;
                    beData.Password = pwd;
                    loginUser.ResponseMSG = "OTP Required";
                    loginUser.IsValid = false;
                }
            }

            beData.ResponseMSG = loginUser.ResponseMSG;
            ModelState.AddModelError("", loginUser.ResponseMSG);
            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            
             
        }

        [AllowAnonymous]
        public ActionResult ResetPwd(string token)
        {
            if(string.IsNullOrEmpty(token))
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

                List<SelectListItem> tmpList = new List<SelectListItem>();
                foreach (var com in companyList)
                {
                    tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
                }
                ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

                var user = new Dynamic.BusinessEntity.Security.User() { Token = token, ResponseMSG = "", DBName = companyList[0].datatype };

                var resVal = new Dynamic.BusinessLogic.Security.User(hostName, user.DBName).IsValidForgetPwdToken(token);
                if (resVal.IsSuccess)
                    user.ResponseMSG = "";
                else
                    user.ResponseMSG = resVal.ResponseMSG;

                return View(user);
            }
            
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult ResetPwd(Dynamic.BusinessEntity.Security.User beData)
        {
            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            else
            {
                if(string.IsNullOrEmpty(beData.Password) || string.IsNullOrEmpty(beData.RePwd))
                {
                    beData.ResponseMSG = "Please ! Enter New Pwd and Confirm Pwd.";                
                }else if (beData.Password != beData.RePwd)
                {
                    beData.ResponseMSG = "Password and Re-Password does not matched.";
                }
                else
                {
                    beData.ResponseMSG = "";
                    beData.PublicIP = GetIp();

                    if (!string.IsNullOrEmpty(beData.DBName))
                        userBL = new Dynamic.BusinessLogic.Security.User(hostName, beData.DBName);

                    var forgetPwd = userBL.ResetForgotPwd(beData.Password, beData.Token);
                    if (forgetPwd.IsSuccess)
                    {
                        return RedirectToAction("Login", "Home");
                    }
                    else
                        beData.ResponseMSG = forgetPwd.ResponseMSG;
                }
                

            }

            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            return View(beData);
        }
        public ActionResult RdlcViewer()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult ForgotPwd(string returnUrl = "")
        {
            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            var user = new Dynamic.BusinessEntity.Security.User() { ResponseMSG = returnUrl, DBName = companyList[0].datatype };

            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
                return RedirectToAction("Index", "Home");

            user.ResponseMSG = "";

            return View(user);
        }


        [AllowAnonymous]
        [HttpPost]
        public ActionResult ForgotPwd(Dynamic.BusinessEntity.Security.User beData)
        {
            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }else
            {
                beData.ResponseMSG = "";
                beData.PublicIP = GetIp();

                if (!string.IsNullOrEmpty(beData.DBName))
                    userBL = new Dynamic.BusinessLogic.Security.User(hostName, beData.DBName);

                Dynamic.BusinessEntity.Security.ForgetPwd forgetPwd = userBL.ForgotPwd(beData.UserName, beData.PublicIP);
                if (forgetPwd.IsSuccess)
                {
                    var baseurl = Request.Url.AbsoluteUri.Replace("ForgotPwd","ResetPwd?token="+forgetPwd.Token);

                    #region "Send Email"

                    if(!string.IsNullOrEmpty(forgetPwd.EmailId))
                    {
                        Dynamic.BusinessEntity.Global.MailDetails email = new Dynamic.BusinessEntity.Global.MailDetails();
                        string path = Server.MapPath("~") + "//" + "wwwroot/Email Temp.htm";
                        string msg = System.IO.File.ReadAllText(path);
                        msg = msg.Replace("$$datetime$$", DateTime.Now.ToLongDateString());
                        msg = msg.Replace("$$companyname$$", forgetPwd.CompanyName);
                        msg = msg.Replace("$$username$$", forgetPwd.UserName);
                        msg = msg.Replace("$$baseurl$$", baseurl);
                        email.Message = msg;
                        email.Subject = "Reset Password Link";

                        string toEmail = forgetPwd.EmailId;

                        if (string.IsNullOrEmpty(toEmail))
                            email.To = "support@dynamic.net.np";

                        email.To = toEmail;
                        email.Cc = "support@dynamic.net.np";
                        email.BCC = "";
                        email.UserName = "Dynamic-Alert";
                        email.From = "Dynamic-Alert@mydynamicerp.com";
                        email.Password = "Nepal$20202080";
                        email.Smtp = "smtp.gmail.com";
                        email.Port = 587;
                        email.Use_SSL = true;

                        string logopath = Server.MapPath("~") + "wwwroot/logoo.png";
                        System.Net.Mail.LinkedResource Img = new LinkedResource(logopath, MediaTypeNames.Image.Jpeg);
                        Img.ContentId = "dlogo";
                        AlternateView AV = AlternateView.CreateAlternateViewFromString(msg, null, MediaTypeNames.Text.Html);
                        AV.LinkedResources.Add(Img);

                        try
                        {
                            new Global.GlobalFunction(1, hostName, beData.DBName, "").SendEMail(email, AV);
                        }
                        catch { }
                    }
                    
                    #endregion

                    return RedirectToAction("Login", "Home");
                }                    
                else
                    beData.ResponseMSG = forgetPwd.ResponseMSG;

            }

            List<Dynamic.BusinessEntity.Global.CommonClass> companyList = new Global.GlobalFunction(0, "", "","").GetCompanyList();

            List<SelectListItem> tmpList = new List<SelectListItem>();
            foreach (var com in companyList)
            {
                tmpList.Add(new SelectListItem() { Text = com.text, Value = com.datatype });
            }
            ViewBag.CompanyList = new SelectList(tmpList, "Value", "Text");

            return View(beData);
        }

        [HttpGet]
        public ActionResult LogOff()
        {
            Dynamic.BusinessEntity.Security.LoginLog lLog = new Dynamic.BusinessEntity.Security.LoginLog();
            lLog.MacAddress = GetMacAddress(User.PublicIP);
            lLog.UserId = User.UserId;
            lLog.UserName = User.UserName;
            lLog.LogDateTime = DateTime.Now;
            lLog.LocalDateTime = DateTime.Now;
            lLog.AppVersion = System.Reflection.Assembly.GetExecutingAssembly().Location;
            lLog.InOut = 2;
            lLog.LastUpdated = DateTime.Now;
            lLog.PCName = System.Environment.MachineName;
            lLog.SystemUser = System.Environment.UserName;
            lLog.LocalIP = LocalIPAddress();
            lLog.PublicIP = User.PublicIP;

            var resVal = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveLoginLog(lLog);

            if(resVal.IsSuccess)
                FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public ActionResult UnAuthorizeAccess()
        {
            return View();
        }

        //[HttpGet] 
        //public ActionResult UnAuthorizeAccess()
        //{
        //    Response.Status = "401 Access denied. Insufficient Permissions.";
        //    Response.StatusCode = 401;
        //    Response.StatusDescription = "Access denied. Insufficient Permissions.";

        //    return View();            

        //}

        [HttpGet]
        public JsonNetResult GetSplash()
        {
            AcademicLib.API.Splash resVal = new AcademicLib.API.Splash();
            try
            {
                var urlName= Request.Url.Host + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
                resVal = new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).getSplash("", urlName);
                // resVal=new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).getSplash("", "ghpschool.mydynamicerp.com");

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetKYC()
        {
            AcademicLib.API.CRM.Kyc resVal = new AcademicLib.API.CRM.Kyc();
            try
            {
                var urlName = Request.Url.Host + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
                resVal = new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).getKYC("", urlName);
                // resVal=new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).getSplash("", "ghpschool.mydynamicerp.com");

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        [PermissionsAttribute(Actions.Save, (int)AcademicLib.BE.Global.ENTITIES.KYC, false, 0, (int)AcademicLib.BE.Global.ENTITIES.KYC)]
        public JsonNetResult UpdateKyc()
        {
            
            ResponeValues resVal = new ResponeValues();
            try
            {
                var beData = DeserializeObject<AcademicLib.API.CRM.Kyc>(Request["jsonData"]);
                if (beData != null)
                {
                    beData.KYCUpdateBy = User.UserName;
                    beData.AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();

                    try
                    {
                        var jsonbeData = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(beData);

                        string url = "https://crm.dynamicerp.online/v1/Common/UpdateKyc";
                        var method = new System.Net.Http.HttpMethod("POST");
                        System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
                        //client.DefaultRequestHeaders.Add("ContentType", "JSON");
                        client.DefaultRequestHeaders.Add("CRM", "Crm$2023#LiveApi");
                        System.Net.Http.MultipartFormDataContent form = new System.Net.Http.MultipartFormDataContent();

                        System.Net.Http.HttpContent content1 = new System.Net.Http.StringContent(jsonbeData);
                        form.Add(content1, "paraDataColl");
                        if (Request.Files.Count > 0)
                        {
                            var filesColl = Request.Files;
                            var logo = filesColl["LogoImg"];
                            var reg = filesColl["RegImg"];
                            var pan = filesColl["PanImg"];
                            var tax = filesColl["TaxImg"];

                            if (logo != null)
                            {
                                content1 = new System.Net.Http.StreamContent(logo.InputStream);
                                content1.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
                                {
                                    FileName = logo.FileName,
                                    Name="LogoImg"
                                }; //  //form-data
                                form.Add(content1,"LogoImg");
                            }

                            if (reg != null)
                            {
                                content1 = new System.Net.Http.StreamContent(reg.InputStream);
                                content1.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
                                {
                                    FileName = reg.FileName,
                                    Name = "RegImg"
                                }; //  //form-data
                                form.Add(content1, "RegImg");
                            }

                            if (pan != null)
                            {
                                content1 = new System.Net.Http.StreamContent(pan.InputStream);
                                content1.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
                                {
                                    FileName = pan.FileName,
                                    Name = "PanImg"
                                }; //  //form-data
                                form.Add(content1, "PanImg");
                            }

                            if (tax != null)
                            {
                                content1 = new System.Net.Http.StreamContent(tax.InputStream);
                                content1.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("form-data")
                                {
                                    FileName = tax.FileName,
                                    Name = "TaxImg"
                                }; //  //form-data
                                form.Add(content1, "TaxImg");
                            }
                        }                         
                        var response = (client.PostAsync(url, form)).Result;
                        if (response.IsSuccessStatusCode)
                        {
                            var resStr = response.Content.ReadAsStringAsync().Result;
                            if (!string.IsNullOrEmpty(resStr))
                            {
                                resVal = Newtonsoft.Json.JsonConvert.DeserializeObject<ResponeValues>(resStr);                                
                            }
                        }
                        else
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = "Unable To Update KYC ";
                        }
                    }
                    catch (Exception ex1)
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = ex1.Message;
                    }
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


    }
}