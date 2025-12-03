using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.ServiceModel.Channels;
using System.Web;
using System.Web.Http;

namespace AcademicERP.Controllers
{ 
    [Authorize]    
    public class APIBaseController : ApiController
    {
        protected const string HASH_KEY = "NewAnno@2024$#$";
        protected string hostName = "";
        protected string dbName = "";

        protected string khalti_private_key = "";
        protected string khalti_public_key = "";

        protected string PassKey = "AcademicERP@2022";
        public APIBaseController()
        {
            dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

            try
            {
                ActiveBranch = Convert.ToBoolean(System.Configuration.ConfigurationManager.AppSettings["activeBranch"].ToString());
            }
            catch { }

            try
            {
                var keysColl = System.Configuration.ConfigurationManager.AppSettings.AllKeys;
                if (keysColl.Contains("khalti-private-key"))
                    khalti_private_key = System.Configuration.ConfigurationManager.AppSettings["khalti-private-key"].ToString();

                if (keysColl.Contains("khalti-private-key"))
                    khalti_public_key = System.Configuration.ConfigurationManager.AppSettings["khalti-public-key"].ToString();
            }
            catch { }
            
        }

        //protected string RunningURLName
        //{
        //    get
        //    {
        //        return Request.RequestUri.Host + (Request.RequestUri.IsDefaultPort ? "" : ":" + Request.RequestUri.Port);
        //    }
        //}

        protected bool ActiveBranch { get; set; } = false;
        protected string  GetBaseUrl
        {
            get
            {
                string baseUrl = Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.AbsolutePath, "").Trim().ToLower();
                baseUrl = baseUrl.Replace("https://", "").Replace("http://", "").Replace(":80","").Replace(":443","");
                return baseUrl;
            }
            
        }
        protected string GuiId
        {
            get
            {
                try
                {
                    return Guid.NewGuid().ToString() + "_" + UserId.ToString();
                }
                catch
                {
                    return Guid.NewGuid().ToString() + "_0";
                }

            }
        }
        protected int UserId
        {
            get
            {
                var identity = User.Identity as ClaimsIdentity;
                Claim identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
                return Convert.ToInt32(identityClaim.Value);
            }
        }
        protected int BranchId
        {
            get
            {
                var identity = User.Identity as ClaimsIdentity;
                Claim identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GroupSid);
                return Convert.ToInt32(identityClaim.Value);
            }
        }
        protected string BranchCode
        {
            get
            {
                try
                {
                    var identity = User.Identity as ClaimsIdentity;
                    Claim identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.PostalCode);
                    return Convert.ToString(identityClaim.Value);
                }
                catch(Exception ee)
                {
                    return "";
                }
                
            }
        }
        protected virtual int AcademicYearId
        {
            get
            {
                int _userId = 1;
                if (User.Identity.IsAuthenticated)
                    _userId = UserId;

                return new AcademicLib.BL.Academic.Creation.AcademicYear(_userId, hostName, dbName).getDefaultAcademicYearId().RId;               
            }
        }
        

        protected string GetPath(string location)
        {
            return System.Web.HttpContext.Current.Server.MapPath(location);
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

        protected Dynamic.BusinessEntity.GeneralDocumentCollections GetAttachmentDocuments(System.Collections.ObjectModel.Collection<MultipartFileData> files)
        {
            Dynamic.BusinessEntity.GeneralDocumentCollections docColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
            foreach(var fl in files)
            {
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(fl.LocalFileName);
                Dynamic.BusinessEntity.GeneralDocument doc = new Dynamic.BusinessEntity.GeneralDocument();
                doc.Data = null;
                doc.DocPath = @"\" + fl.LocalFileName.Substring(fl.LocalFileName.IndexOf("Attachments"));
                doc.Extension = fileInfo.Extension;
                doc.Name = fl.Headers.ContentDisposition.FileName.ToString().Replace("\"", "").Replace("dynamic-","");

                if (!string.IsNullOrEmpty(fl.Headers.ContentDisposition.Name))
                    doc.ParaName = fl.Headers.ContentDisposition.Name.ToString().Replace("\"", "").Replace("dynamic-", "");
                else
                    doc.ParaName = "";

                doc.LogDateTime = DateTime.Now;
                docColl.Add(doc);
            }            
            return docColl;
        }

        protected string GetQueryString(object obj)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select p.Name + "=" + System.Web.HttpUtility.UrlEncode(p.GetValue(obj, null).ToString());

            return String.Join("&", properties.ToArray());
        }

        protected NameValueCollection GetObjectAsKeyVal(object obj)
        {
            NameValueCollection nvColl = new NameValueCollection();
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select new 
                             { 
                                 Key = p.Name,
                                 Value = p.GetValue(obj, null).ToString()
                             };

            foreach(var v in properties)
            {
                nvColl.Add(v.Key, v.Value);
            }
            return nvColl;
        }

        protected NameValueCollection GetObjectAsKeyVal(object obj,string[] keys)
        {
            NameValueCollection nvColl = new NameValueCollection();
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select new
                             {
                                 Key = p.Name,
                                 Value = p.GetValue(obj, null).ToString()
                             };

            foreach (var v in properties)
            {
                if(keys.Contains(v.Key)==false)
                    nvColl.Add(v.Key, v.Value);
            }
            return nvColl;
        }
        protected string IsNullOrEmptyStr(string val)
        {
            if (string.IsNullOrEmpty(val))
                return "";
            else
                return val.Trim();
        }
        protected string GetClientIp()
        {
            try
            {
                HttpRequestMessage request = this.Request;
                if (request.Properties.ContainsKey("MS_HttpContext"))
                {
                    return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
                }
                else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
                {
                    RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                    return prop.Address;
                }
                else if (HttpContext.Current != null)
                {
                    return HttpContext.Current.Request.UserHostAddress;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ee)
            {
                return ee.Message;
            }

        }

        protected ResponeValues SaveAuditLog(Dynamic.BusinessEntity.Global.AuditLog auditLog)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var user = User;
                auditLog.LogDate = DateTime.Now;
                auditLog.MacAddress = GetClientIp();
                auditLog.UserId = UserId;
                auditLog.UserName = User.Identity.Name;
                auditLog.SystemUser = User.Identity.Name;
                auditLog.PCName = auditLog.MacAddress;
                new Dynamic.DataAccess.Global.GlobalDB(hostName, dbName).SaveAuditLog(auditLog);
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return resVal;
        }

        protected string ConnectionString
        {
            get
            {
                return new Dynamic.DataAccess.Global.DataAccessLayer1(hostName, dbName).ConnectionString; ;
            }
        }

        protected int ToInt(string paraVal)
        {
            int val = 0;
            int.TryParse(paraVal, out val);
            return val;
        }

        protected int? ToIntNull(string paraVal)
        {
            int val = 0;
            int.TryParse(paraVal, out val);

            if (val == 0)
                return null;
            else
                return val;
        }
        protected int ToInt(Newtonsoft.Json.Linq.JToken paraVal)
        {
            var strVal = "";
            if (paraVal != null)
                strVal = paraVal.ToString();

            int val = 0;
            int.TryParse(strVal, out val);
            return val;
        }


        protected int ToInt(int? val)
        {
            if (!val.HasValue)
                return 0;
            return val.Value;
        }
        protected int? ToIntNull(Newtonsoft.Json.Linq.JToken paraVal)
        {
            var strVal = "";
            if (paraVal != null)
                strVal = paraVal.ToString();

            int val = 0;
            int.TryParse(strVal, out val);

            if (val == 0)
                return null;
            else
                return val;
        }

        protected bool ToBoolean(Newtonsoft.Json.Linq.JToken paraVal)
        {
            var strVal = "";
            if (paraVal != null)
                strVal = paraVal.ToString();

            bool val = false;
            bool.TryParse(strVal, out val);
            return val;
        }
        protected string GenerateHash(string secretKey, string message)
        {
            byte[] keyBytes = System.Text.Encoding.UTF8.GetBytes(secretKey);

            using (var hmac = new System.Security.Cryptography.HMACSHA512(keyBytes))
            {
                byte[] messageBytes = System.Text.Encoding.UTF8.GetBytes(message);
                byte[] hashBytes = hmac.ComputeHash(messageBytes);
                return BytesToHex(hashBytes);
            }
        }
        private string BytesToHex(byte[] bytes)
        {
            System.Text.StringBuilder hex = new System.Text.StringBuilder(bytes.Length * 2);
            foreach (byte b in bytes)
            {
                hex.AppendFormat("{0:X2}", b);
            }
            return hex.ToString();
        }
    }
}
