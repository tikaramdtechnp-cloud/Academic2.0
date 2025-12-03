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
    [PivotalERP.FilterKeyVal]
    public class ApiKeyValBaseController : ApiController
    {
        protected string hostName = "";
        protected string dbName = "";

        protected string khalti_private_key = "";
        protected string khalti_public_key = "";
        public ApiKeyValBaseController()
        {
            dbName = System.Configuration.ConfigurationManager.AppSettings["dbName"].ToString();
            hostName = System.Configuration.ConfigurationManager.AppSettings["hostName"].ToString();

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

        protected int UserId
        {
            get
            {
                return 1;
                //var identity = User.Identity as ClaimsIdentity;
                //Claim identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid);
                //return Convert.ToInt32(identityClaim.Value);
            }
        }
        protected int BranchId
        {
            get
            {
                return 1;
                //var identity = User.Identity as ClaimsIdentity;
                //Claim identityClaim = identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.GroupSid);
                //return Convert.ToInt32(identityClaim.Value);
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
            foreach (var fl in files)
            {
                System.IO.FileInfo fileInfo = new System.IO.FileInfo(fl.LocalFileName);
                Dynamic.BusinessEntity.GeneralDocument doc = new Dynamic.BusinessEntity.GeneralDocument();
                doc.Data = null;
                doc.DocPath = @"\" + fl.LocalFileName.Substring(fl.LocalFileName.IndexOf("Attachments"));
                doc.Extension = fileInfo.Extension;
                doc.Name = fl.Headers.ContentDisposition.FileName.ToString().Replace("\"", "").Replace("dynamic-", "");

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

            foreach (var v in properties)
            {
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
        protected string IsNullStr(string val)
        {
            if (string.IsNullOrEmpty(val))
                return "";
            else
                return val.Trim();
        }

    }
}
