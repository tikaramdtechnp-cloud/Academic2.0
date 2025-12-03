using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PivotalERP.Controllers
{
    [Audit]
    [Authorize]    
    public class BaseController : Controller
    {
        protected const string googleMAP_APIKEY = "AIzaSyATza0oeCAoqE5TQnccAv96xNocPF0JlbY";
        protected string hostName = "";
        protected string dbName = "";
        protected bool smsAPIUsed = false;


        public BaseController()
        {           
            dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();
            Dynamic.DataAccess.Global.DataAccessLayer1.IsWebBase = true;

            try
            {
                string smsAPI = System.Configuration.ConfigurationManager.AppSettings["smsAPI"].ToString();
                if (!string.IsNullOrEmpty(smsAPI))
                    smsAPIUsed = true;
            }
            catch { }

            try
            {
                ActiveBranch =Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["activeBranch"].ToString());                
            }
            catch { }

            try
            {
                if (HttpContext != null)
                {
                    if (HttpContext.User != null)
                    {
                        if (User != null)
                        {
                            if (!string.IsNullOrEmpty(User.DBName))
                                dbName = User.DBName;
                        }
                    }
                  
                }
                
            }
            catch { }
            
        }
        //protected string RunningURLName
        //{
        //    get
        //    {
        //        return Request.Url.Host + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port); 
        //    }
        //}

        protected string AcademicType
        {
            get
            {
                string val = "school";
                try
                {
                    val = System.Configuration.ConfigurationManager.AppSettings["academicType"].ToString();
                }
                catch {
                    val = "school";
                }

                if (string.IsNullOrEmpty(val))
                    val = "school";

                return val;
            }
        }

        public bool BranchWiseMaster
        {
            get
            {
                try
                {
                    var v = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["branchWiseMaster"]);
                    return v;
                }
                catch { }

                return false;
            }
        }

        protected bool ActiveBranch { get; set; } = false;

        protected virtual new Dynamic.BusinessEntity.Security.WebUser User
        {
            get { return HttpContext.User as Dynamic.BusinessEntity.Security.WebUser; }
        }      

        protected virtual int AcademicYearId
        {
            get
            {
                if (User != null)
                {
                    object dataObj = Session["AcademicYearId" + User.UserId.ToString()];
                    if (dataObj != null)
                    {
                        return (int)dataObj;
                    }
                    else
                        return new AcademicLib.BL.Academic.Creation.AcademicYear(User.UserId, hostName, dbName).getDefaultAcademicYearId().RId;
                }
                else
                {
                    return new AcademicLib.BL.Academic.Creation.AcademicYear(1, hostName, dbName).getDefaultAcademicYearId().RId;
                }

            }
        }
        protected ResponeValues ChangeAcademicYear(int AcademicYearId)
        {
            ResponeValues resVal = new ResponeValues();
            Session.Remove("AcademicYearId"+User.UserId.ToString());
            Session.Add("AcademicYearId" + User.UserId.ToString(), AcademicYearId);
            resVal.IsSuccess = true;
            resVal.ResponseMSG = "The Academic year has been changed.";
            return resVal;
        }

        protected ResponeValues SaveAuditLog(Dynamic.BusinessEntity.Global.AuditLog auditLog)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var user = User;
                auditLog.LogDate = DateTime.Now;
                auditLog.MacAddress = IsNullStr(LocalIPAddress());
                auditLog.UserId = user.UserId;
                auditLog.UserName = user.UserName;
                auditLog.SystemUser = user.UserName;
                auditLog.PCName = GetIp();
                new Dynamic.DataAccess.Global.GlobalDB(User.HostName,User.DBName).SaveAuditLog(auditLog);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch(Exception ee) {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }
        protected string GetIp()
        {
            string ip = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(ip))
            {
                ip = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
            }
            return ip;
        }

        protected string LocalIPAddress()
        {
            if (!System.Net.NetworkInformation.NetworkInterface.GetIsNetworkAvailable())
            {
                return "";
            }

            IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());

            return host
                .AddressList
                .FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToString();
        }
        protected string GetMacAddress(string ipAddress)
        {

            NetworkInterface[] nics = NetworkInterface.GetAllNetworkInterfaces();

            String sMacAddress = string.Empty;

            foreach (NetworkInterface adapter in nics)

            {

                if (sMacAddress == String.Empty)// only return MAC Address from first card  

                {

                    IPInterfaceProperties properties = adapter.GetIPProperties();

                    sMacAddress = adapter.GetPhysicalAddress().ToString();

                }

            }

            return sMacAddress;

        }
        protected JsonSerializerSettings DateFormatSettings
        {
            get
            {
                return new JsonSerializerSettings
                {
                    DateFormatHandling = DateFormatHandling.MicrosoftDateFormat
                };
            }
        }
        protected T DeserializeObject<T>(string jsonData)
        {
            T para = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(jsonData, DateFormatSettings);
            return para;
        }
        protected T DeserializeObjectIgnoreNull<T>(string jsonData)
        {
            var setting = new JsonSerializerSettings()
            {
                NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
                DateFormatHandling = DateFormatHandling.MicrosoftDateFormat,
                DefaultValueHandling = DefaultValueHandling.Ignore,
            };
            T para = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(jsonData, setting);
            return para;
        }
        protected string GetPath(string location)
        {            
            return Server.MapPath(location);
        }
        protected Dynamic.BusinessEntity.GeneralDocument GetAttachmentDocuments(string path, System.Web.HttpPostedFileBase file,bool ReadByte=false, string prefix = "")
        {
            
            Dynamic.BusinessEntity.GeneralDocument doc = new Dynamic.BusinessEntity.GeneralDocument();
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(file.FileName);

            string fName = Guid.NewGuid().ToString()+fileInfo.Extension;                        
            doc.Data = null; 

            doc.DocPath = path+"/"+fName;

            if(!string.IsNullOrEmpty(doc.DocPath))
            {
                doc.DocPath = doc.DocPath.Replace("/", "\\");
            }

            doc.Extension = fileInfo.Extension;
            doc.Name = file.FileName;
            doc.LogDateTime = DateTime.Now;
            string savePath = Server.MapPath("~") + doc.DocPath;
            file.SaveAs(savePath);
            
            if (ReadByte)
            {
                byte[] docByte = null;
                System.IO.BinaryReader rdr = new System.IO.BinaryReader(file.InputStream);
                docByte = rdr.ReadBytes((int)file.ContentLength);
                doc.Data = docByte;
            }

            return doc;
        }
    
        protected string IsNullStr(string val)
        {
            if (string.IsNullOrEmpty(val))
                return "";
            else
                return val.Trim();
        }
        protected byte[] GetBytesFromFile(string path)
        {

            string savePath = Server.MapPath("~") + path;

            if (System.IO.File.Exists(savePath))
            {
                byte[] fileData = null;

                using (System.IO.FileStream fs = System.IO.File.OpenRead(savePath))
                {
                    using (System.IO.BinaryReader binaryReader = new System.IO.BinaryReader(fs))
                    {
                        fileData = binaryReader.ReadBytes((int)fs.Length);
                    }
                }
                return fileData;
            }

            return null;
        }

        protected System.Collections.Specialized.NameValueCollection GetObjectAsKeyVal(object obj)
        {
            System.Collections.Specialized.NameValueCollection nvColl = new System.Collections.Specialized.NameValueCollection();
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select new
                             {
                                 Key = p.Name,
                                 Value = p.GetValue(obj, null).ToString()
                             };

            foreach (var v in properties)
            {
                nvColl.Add(v.Key, v.Value);
            }
            return nvColl;
        }
        protected System.Drawing.Bitmap getImage(byte[] buffer)
        {
            try
            {
                System.IO.MemoryStream stram = new System.IO.MemoryStream(buffer, true);
                stram.Write(buffer, 0, buffer.Length);
                System.Drawing.Bitmap bitmap = (System.Drawing.Bitmap)System.Drawing.Bitmap.FromStream(stram, true, true);

                return bitmap;
            }
            catch (Exception e)
            {
                return null;
            }
        }
         
        protected bool checkSecurityEntity(Dynamic.BusinessEntity.Global.Actions _action, int _entityId, bool _isReport, int _tranId)
        {
            var user = User;

            if (user.InBuilt)
                return true;

            if (user.UserWiseSecurity)
            {
                Dynamic.BusinessEntity.Security.UserWiseSecurityEntity allowAccess = new Dynamic.DataAccess.Security.EntityDB(user.HostName, user.DBName).getUserSecurityColl(user.UserId, _entityId, _isReport, _tranId);
                if (allowAccess != null)
                {
                    switch (_action)
                    {
                        case Dynamic.BusinessEntity.Global.Actions.View:
                            return (allowAccess.Full || allowAccess.View);
                        case Dynamic.BusinessEntity.Global.Actions.Save:
                            return (allowAccess.Full || allowAccess.Add);
                        case Dynamic.BusinessEntity.Global.Actions.Modify:
                            return (allowAccess.Full || allowAccess.Modify);
                        case Dynamic.BusinessEntity.Global.Actions.Delete:
                            return (allowAccess.Full || allowAccess.Delete);
                        case Dynamic.BusinessEntity.Global.Actions.Print:
                            return (allowAccess.Full || allowAccess.Print);
                        case Dynamic.BusinessEntity.Global.Actions.Cancel:
                            return (allowAccess.Full || allowAccess.Cancel);
                        default:
                            return false;
                    }
                }
            }
            else
            {
                Dynamic.BusinessEntity.Security.UserGroupWiseSecurityEntity allowAccess = new Dynamic.DataAccess.Security.EntityDB(user.HostName, user.DBName).getUserGroupSecurityColl(user.GroupId, _entityId, _isReport, _tranId);
                if (allowAccess != null)
                {
                    switch (_action)
                    {
                        case Dynamic.BusinessEntity.Global.Actions.View:
                            return (allowAccess.Full || allowAccess.View);
                        case Dynamic.BusinessEntity.Global.Actions.Save:
                            return (allowAccess.Full || allowAccess.Add);
                        case Dynamic.BusinessEntity.Global.Actions.Modify:
                            return (allowAccess.Full || allowAccess.Modify);
                        case Dynamic.BusinessEntity.Global.Actions.Delete:
                            return (allowAccess.Full || allowAccess.Delete);
                        case Dynamic.BusinessEntity.Global.Actions.Print:
                            return (allowAccess.Full || allowAccess.Print);
                        case Dynamic.BusinessEntity.Global.Actions.Cancel:
                            return (allowAccess.Full || allowAccess.Cancel);
                        default:
                            return false;
                    }
                }
            }

            return false;
        }



        protected bool checkAcademicSecurityEntity(Dynamic.BusinessEntity.Global.Actions _action, int _entityId, bool _isReport, int _tranId)
        {
            var user = User;

            if (user.InBuilt)
                return true;

            ResponeValues resVal = new AcademicLib.BL.Setup.EntityAccess(user.UserId, user.HostName, user.DBName).checkEntity(_entityId, (int)_action);
            return resVal.IsSuccess;

        }

        protected string ConnectionString
        {
            get
            {
                return new Dynamic.DataAccess.Global.DataAccessLayer1(User.HostName, User.DBName).ConnectionString; ;
            }
        }
        public string Flavour
        {
            get
            {
                try
                {
                    var v = Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["flavour"]);
                    return v;
                }
                catch { }

                return "";
            }
        }
        protected bool ViewExists(string name)
        {
            var result = ViewEngines.Engines.FindView(ControllerContext, name, null);
            return result.View != null;
        }

        protected string GetTranTypeName(Dynamic.BusinessEntity.Account.VoucherTypes VoucherType)
        {

            switch (VoucherType)
            {
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                    return Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                    return Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseQuotation.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseOrder.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.ReceiptNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseInvoice.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseReturn.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseDebitNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseDebitNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseCreditNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseCreditNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesQuotation.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesOrder.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.DeliveryNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesInvoice.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesReturn.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesDebitNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesDebitNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesCreditNote:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesCreditNote.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockJournal.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.StockTransfor.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesAllotment.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.DispatchOrder.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.DispatchSection.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeIn:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.CannibalizeIn.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeOut:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.CannibalizeOut.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseAdditionalInvoice:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.Journal.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotmentCancel:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesAllotmentCancel.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotmentReturn:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesAllotmentReturn.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.IndentForm:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.IndentForm.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.ReceiptNoteReturn.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceivedChallan:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.ReceivedChallan.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrderCancel:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesOrderCancel.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotationCancel:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesQuotationCancel.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrderCancel:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseOrderCancel.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotationCancel:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseQuotationCancel.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseSauda:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.PurchaseSauda.ToString();
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesSauda:
                    return Dynamic.BusinessEntity.Inventory.Transaction.TranTypes.SalesSauda.ToString();

            }

            return Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt.ToString();
        }


        #region "For CRM"

        protected string CRM_HEADER_KEY = "CRM";
        protected string CRM_HEADER_VALUE = "Crm$2023#LiveApi";
        protected string GetURL
        {
            get
            {
                return Request.Url.Host + (Request.Url.IsDefaultPort ? "" : ":" + Request.Url.Port);
                //return "erp.namasteacademy.edu.np";
                
            }
        }
        protected string CompanyCode
        {
            get
            {
                return "";
            }
        }

        protected string DBCode
        {
            get
            {
                //string dbName = (User != null ? User.DBName : (Session["DBName"] != null ? Session["DBName"].ToString() : ""));
                string dbName = User.DBName;
                if (string.IsNullOrEmpty(dbName))
                    return "";

                return dbName;
            }
        }
        protected string CrmURL
        {
            get
            {
                return "https://crm.dynamicerp.online/v1/";
            }
        }

        protected string CrmMainURL
        {
            get
            {
                return "https://crm.dynamicerp.online/";
            }
        }

        protected void getExpireDate(string userName, string dbCode)
        {
            try
            {
                AcademicERP.Models.APIRequest request = new AcademicERP.Models.APIRequest(CrmURL + "Common/GetExpireDate", "POST");
                var para = new
                {
                    CustomerCode = "",
                    UrlName = GetURL,
                    DBCode = dbCode,
                    AppUserName = userName
                };

                System.Collections.Generic.Dictionary<string, string> headers = new Dictionary<string, string>();
                headers.Add(CRM_HEADER_KEY, CRM_HEADER_VALUE);
                var response = request.ExecuteWithHeader<ResponeValues>(para, headers);
                if (response != null)
                {
                    var beData = (ResponeValues)response;
                    if (beData != null && beData.RId > 0)
                    {
                        var dbCodeName = para.DBCode + "-" + DateTime.Today.ToString("yyyyMMdd");
                        var expDT = DateTime.Parse(beData.ResponseMSG);
                        var cid = beData.RId;
                        string dtName = "ExpiredDateTime-" + dbCodeName;
                        string cidName = "CrmCustomerId-" + dbCodeName;
                        Session.Remove(dtName);
                        Session.Add(dtName, expDT.ToString("yyyy-MM-dd"));
                        Session.Remove(cidName);
                        Session.Add(cidName, cid);
                    }
                }

            }
            catch (System.Net.WebException wex)
            {

                var pageContent = new System.IO.StreamReader(wex.Response.GetResponseStream())
                                      .ReadToEnd();

            }
            catch (Exception ee)
            {

            }


        }

        protected int CrmCustomerId
        {
            get
            {
                try
                {
                    var dbCode = IsNullStr(DBCode);
                    string cidName = "CrmCustomerId-" + dbCode;
                    var cid = Session[cidName];
                    if (cid != null)
                        return Convert.ToInt32(cid);
                }
                catch (Exception e)
                {
                    return 0;
                }

                return 0;
            }
        }

        #endregion

        

        #region "Google Authenticator"
      
        public string GoogleAuthKey
        {
            get
            {
                try
                {
                    var v = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["GoogleAuthKey"]);
                    return v.ToString();
                }
                catch { }

                return "";
            }
        }

        private static byte[] ConvertSecretToBytes(string secret, bool secretIsBase32) =>
           secretIsBase32 ? Google.Authenticator.Base32Encoding.ToBytes(secret) : System.Text.Encoding.UTF8.GetBytes(secret);

        protected ResponeValues GenerateGoogleSetup(int? UId, string UserName, string Entity, string _URL)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                UserName = UserName.Trim().ToLower();
                //string googleAuthKey = GoogleAuthKey;
                var googleAuthRes = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GetGoogleAuthKey(UId, UserName);
                if (googleAuthRes.IsSuccess)
                {
                    string googleAuthKey = googleAuthRes.ResponseMSG;
                    string UserUniqueKey = (UserName + googleAuthKey + Entity);

                    UserName = UserName + "_" + Entity;
                    //Two Factor Authentication Setup
                    Google.Authenticator.TwoFactorAuthenticator TwoFacAuth = new Google.Authenticator.TwoFactorAuthenticator();
                    //var setupInfo = TwoFacAuth.GenerateSetupCode("crm.dynamicerp.online", UserName, ConvertSecretToBytes(UserUniqueKey, false), 300);
                    if (string.IsNullOrEmpty(_URL))
                        _URL = GetURL;

                    var setupInfo = TwoFacAuth.GenerateSetupCode(_URL, UserName, ConvertSecretToBytes(UserUniqueKey, false), 300);
                    resVal.ResponseMSG = setupInfo.QrCodeSetupImageUrl;
                    resVal.ResponseId = setupInfo.ManualEntryKey;
                    resVal.IsSuccess = true;
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = googleAuthRes.ResponseMSG;
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }
        protected ResponeValue IsValidGoogleAuth(string UserName, string token, string Entity, string hostName = "", string dbName = "")
        {
            ResponeValue resVal = new ResponeValue();

            try
            {
                UserName = UserName.Trim().ToLower();

                ResponeValue googleAuthRes = new ResponeValue();
                if (User != null)
                    googleAuthRes = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).GetGoogleAuthKey(null, UserName);
                else if (!string.IsNullOrEmpty(hostName) && !string.IsNullOrEmpty(dbName))
                    googleAuthRes = new Dynamic.DataAccess.Security.UserDB(hostName, dbName).GetGoogleAuthKey(null, UserName);

                if (googleAuthRes.IsSuccess)
                {
                    string googleAuthKey = googleAuthRes.ResponseMSG;
                    //string googleAuthKey = GoogleAuthKey;
                    string UserUniqueKey = (UserName + googleAuthKey + Entity);

                    Google.Authenticator.TwoFactorAuthenticator TwoFacAuth = new Google.Authenticator.TwoFactorAuthenticator();
                    bool isValid = TwoFacAuth.ValidateTwoFactorPIN(UserUniqueKey, token, false);
                    if (isValid)
                    {
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = GLOBALMSG.SUCCESS;
                    }
                    else
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "Invalid OTP";
                    }
                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = googleAuthRes.ResponseMSG;
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }

        #endregion

    }
}