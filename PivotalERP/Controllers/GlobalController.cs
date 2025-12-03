using Dynamic.BusinessEntity.Global;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PivotalERP.Controllers
{
    public class GlobalController : BaseController
    {

        [HttpGet]
        [AllowAnonymous]
        public JsonNetResult GetComCountry()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (User != null)
                {
                    Dynamic.BusinessEntity.Setup.CompanyDetail retVal = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyCountry(User.UserId);

                    var retCom = new
                    {
                        Country = retVal.Country,
                    };
                    return new JsonNetResult() { Data = retCom, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

                }
                else
                {
                    Dynamic.BusinessEntity.Setup.CompanyDetail retVal = new Dynamic.DataAccess.Setup.CompanyDetailDB(hostName, dbName).getCompanyCountry(1);

                    var retCom = new
                    {
                        Country = retVal.Country,
                    };
                    return new JsonNetResult() { Data = retCom, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                }
               
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetFormEntity()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(AcademicLib.BE.Global.ENTITIES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpPost]
        public JsonNetResult GetRptFormEntity()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Global.RptFormsEntity)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetUserDetail()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                Dynamic.APIEnitity.Security.User retVal = new Dynamic.DataAccess.Security.UserDB(User.HostName, User.DBName).getUserByIdForAPI(User.UserId);

                return new JsonNetResult() { Data = retVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult CheckSession()
        {
            ResponeValues resVal = new ResponeValues();
            resVal.IsSuccess = true;
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetRunningAcademicYearId()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                resVal.IsSuccess = true;
                resVal.RId = AcademicYearId;

                return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetMonthNameList()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = new AcademicLib.BL.Global(User.UserId, User.HostName, User.DBName).usp_GetMonthNameList(this.AcademicYearId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetAcademicMonthList(int? StudentId,int? ClassId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = new AcademicLib.BL.Global(User.UserId, User.HostName, User.DBName).getAcademicYearMonthList(this.AcademicYearId,StudentId,ClassId);

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetAllLedger(int Top, string ColName, string Operator, bool ForTransaction, string OrderByCol, string ColValue, int LedgerType = 0)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
                    para.Top = Top;
                    para.ColName = ColName;
                    para.Operator = Operator;
                    para.ForTransaction = ForTransaction;
                    para.OrderByCol = OrderByCol;
                    para.ColValue = ColValue;
                    para.UserId = User.UserId;
                    Dynamic.BusinessEntity.Common.LedgerCollections dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getAllLedger(para, (Dynamic.APIEnitity.Account.LEDGERTYPES)LedgerType);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetLedgerDetail(int LedgerId, int? VoucherType, DateTime? DateFrom, DateTime? DateTo, bool ShowClosing = true)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (LedgerId == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Ledger Not Found. Pls Select Valid Ledger";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.LedgerDetails dataColl = new Dynamic.DataAccess.Common.LedgerDB(User.HostName, User.DBName).getLedgerDetails(User.UserId, LedgerId, DateFrom, DateTo, VoucherType,ShowClosing);

                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetEntityByVoucherType(int VoucherType)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var vt = (Dynamic.BusinessEntity.Account.VoucherTypes)VoucherType;
                switch (vt)
                {
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Receipt);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Payment);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Journal);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.Contra);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseQuotation);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNote);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.PurchaseReturn);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesQuotation);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DeliveryNote);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesInvoice);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesReturn);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockJournal);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.StockTransfor);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.SalesAllotment);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchOrder);
                        break;
                    case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                        resVal.RId = Convert.ToInt32(Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection);
                        break;
                }

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;

                
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        private int GetEntityId(int VoucherType)
        {
            var vt = (Dynamic.BusinessEntity.Account.VoucherTypes)VoucherType;
            switch (vt)
            {
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.Receipt);

                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.Payment);

                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.Journal);

                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.Contra);

                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.PurchaseQuotation);

                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.PurchaseOrder);

                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.ReceiptNote);

                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.PurchaseInvoice);

                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.PurchaseReturn);

                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.SalesQuotation);

                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.SalesOrder);

                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.DeliveryNote);

                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.SalesInvoice);

                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.SalesReturn);

                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                    return Convert.ToInt32(AcademicLib.BE.Global.ENTITIES.StockJournal);
                     


            }

            return 0;
        }

        [HttpGet]
        public JsonNetResult GetAllProduct(int Top, string ColName, string Operator, string OrderByCol, string ColValue)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {


                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
                    para.Top = Top;
                    para.ColName = ColName;
                    para.Operator = Operator;
                    para.OrderByCol = OrderByCol;
                    para.ColValue = ColValue;

                    para.UserId = User.UserId;
                    Dynamic.BusinessEntity.Common.ProductCollections dataColl = new Dynamic.DataAccess.Common.ProductDB(User.HostName, User.DBName).getAllProduct(para);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductDetail(int ProductId, int? LedgerId, int? VoucherType, DateTime? VoucherDate, DateTime? DateFrom, DateTime? DateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (ProductId == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Product Not Found. Pls Select Valid Product";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.ProductDetails dataColl = new Dynamic.DataAccess.Common.ProductDB(User.HostName, User.DBName).getProductDetails(User.UserId, ProductId, LedgerId, VoucherDate, DateFrom, DateTo, VoucherType, User.BranchId,null,null,null);

                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.PRODUCTTYPES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCompanyPeriodMonths()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                AcademicLib.BE.Global.CompanyPeriodMonthCollections dataColl = new AcademicLib.BL.Global(User.UserId, User.HostName, User.DBName).GetCompanyPeriodMonth();

                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCompanyPeriodMonth()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                CompanyPeriodMonthCollections dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getCompanyPeriodMonth(User.UserId, null);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetAcademicPeriod()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var aid = this.AcademicYearId;
                AcademicLib.BE.Academic.Creation.AcademicYear dataColl = new AcademicLib.BL.Academic.Creation.AcademicYear(User.UserId, User.HostName, User.DBName).getPeriod(aid);
                dataColl.AcademicYearId = aid;
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllCostCenter(int Top, string ColName, string Operator, bool ForTransaction, string OrderByCol, string ColValue, int LedgerType = 0, int? VoucherId = null, int? LedgerId = null, int? CostCenterType = 1, int? DimensionId = null)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.AutoCompletePara para = new Dynamic.BusinessEntity.Common.AutoCompletePara();
                    para.Top = Top;
                    para.ColName = ColName;
                    para.Operator = Operator;
                    para.ForTransaction = ForTransaction;
                    para.OrderByCol = OrderByCol;
                    para.ColValue = ColValue;
                    para.UserId = User.UserId;
                    para.VoucherId = VoucherId;
                    para.LedgerId = LedgerId;

                    if (!CostCenterType.HasValue)
                        CostCenterType = 1;


                    Dynamic.BusinessEntity.Common.CostCenterCollections dataColl = new Dynamic.DataAccess.Common.CostCenterDB(User.HostName, User.DBName).getAllCostCenter(para, (Dynamic.APIEnitity.Account.COSTCENTERTYPES)CostCenterType);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetCostCenterDetail(int CostCenterId, int? VoucherType, DateTime? DateFrom, DateTime? DateTo)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (CostCenterId == 0)
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "CostCenter Not Found. Pls Select Valid CostCenter";
                }
                else
                {
                    Dynamic.BusinessEntity.Common.CostCenterDetails dataColl = new Dynamic.DataAccess.Common.CostCenterDB(User.HostName, User.DBName).getCostCenterDetails(User.UserId, CostCenterId, DateFrom, DateTo, VoucherType,null);

                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]        
        public JsonNetResult GetProductCostingMethod()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.CostingMethods)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetVatTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.Transaction.TDSVATTYPES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetChequeTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.Transaction.CheckTypes)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetProductMarketValuation()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Inventory.MarketValuationMethods)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetAllStudent(int Top, string ColName, string Operator,  string OrderByCol, string ColValue,bool showLeft=false, int? classId = null, int? sectionId = null)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColValue))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {
                  
                    AcademicLib.BE.Academic.Transaction.StudentAutoCompleteCollections dataColl = new AcademicLib.BL.Academic.Transaction.Student(User.UserId, User.HostName, User.DBName).getAllStudentAutoComplete(this.AcademicYearId, ColName, Operator, ColValue, showLeft,classId,sectionId);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetAllEmployee(int Top, string ColName, string Operator, string OrderByCol, string ColValue)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColValue))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {

                    AcademicLib.BE.Academic.Transaction.EmployeeAutoCompleteCollections dataColl = new AcademicLib.BL.Academic.Transaction.Employee(User.UserId, User.HostName, User.DBName).getAllEmployeeAutoComplete(ColName, Operator, ColValue);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetAllBook(int Top, string ColName, string Operator, string OrderByCol, string ColValue, bool forReport)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (string.IsNullOrEmpty(ColName))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Name Not Define";
                }
                else if (string.IsNullOrEmpty(ColValue))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Column Value Not Define";
                }
                else
                {

                    AcademicLib.BE.Library.Transaction.BookAutoCompleteCollections dataColl = new AcademicLib.BL.Library.Transaction.BookEntry(User.UserId, User.HostName, User.DBName).getAllBookAutoComplete(ColName, Operator, ColValue,forReport);

                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
       

        [HttpGet]
        [AllowAnonymous]
        public JsonNetResult GetCompanyDetail()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (User != null)
                {
                    Dynamic.BusinessEntity.Setup.CompanyDetail dataColl = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetailsForWeb(User.UserId);
                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
                }
                else
                {
                    Dynamic.BusinessEntity.Setup.CompanyDetail dataColl = new Dynamic.DataAccess.Setup.CompanyDetailDB(hostName,dbName).getCompanyDetailsForWeb(1);
                    return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
                }
                
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetLastEntryDate(int voucherid)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var lastDate = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getLastEntryDate(voucherid);
                return new JsonNetResult() { Data = lastDate, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 1, IsSuccess = false, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCurrentDate()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var curDate = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).GetCurrentDateTime();
                return new JsonNetResult() { Data = curDate, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetCostClassPeriod(int CostClassId)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                CompanyPeriodMonthCollections dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getCompanyPeriodMonth(User.UserId, CostClassId);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
         
        [HttpGet]
        public JsonNetResult GetMonthDetails()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                MonthDetailsCollections dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getMonthDetails(User.UserId, null, null);
                return new JsonNetResult() { Data = dataColl, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SaveListState()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                var beData = Request["jsonData"].ToString();
                byte[] bytes = System.Text.Encoding.ASCII.GetBytes(beData);
                int entityId = Convert.ToInt32(Request["entityId"].ToString());
                bool isReport = Convert.ToBoolean(Request["isReport"].ToString());
                if (beData != null)
                {

                    new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).SaveListStateWeb(User.UserId, entityId, bytes, isReport);
                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

        [HttpGet]
        public JsonNetResult GetListState(int entityId, bool isReport)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                string state = "";
                var dataResult = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getListStateWeb(User.UserId, entityId, isReport);
                if (dataResult != null)
                {
                    state = System.Text.Encoding.UTF8.GetString(dataResult);
                }

                return new JsonNetResult() { Data = state, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetDate(DateTime? forDate)
        {
            AcademicLib.BE.Global.CurrentDate resVal = new AcademicLib.BE.Global.CurrentDate();
            try
            {
                resVal = new AcademicLib.BL.Global(User.UserId, User.HostName, User.DBName).GetDateDetail(forDate);               

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = "Success" };
            }
            catch (Exception ee)
            {
                resVal = null;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA};
        }

        [HttpPost]
        public JsonNetResult GetCustomColForRpt()
        {
            try
            {
                var usr = User;

                var customDataColl = DeserializeObject<List<Dynamic.BusinessEntity.Global.TY_CustomData>>(Request["customData"]);
                string qry = (Request["qry"]).ToString();
                var printData = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).getCustomColumnForRpt(usr.UserId, qry, customDataColl);
                if (printData.JsonStr == "null")
                {
                    return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };
                }
                var tmpDColl = printData.DataColl;
                return new JsonNetResult() { Data = tmpDColl, TotalCount = tmpDColl.Count, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };

            }
            catch (Exception ee)
            {
                var retVal = new
                {
                    IsSuccess = false,
                    ResponseMSG = ee.Message
                };
                return new JsonNetResult() { Data = retVal, TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };
            }
        }

        [HttpPost]
        public JsonNetResult SaveCustomColForRpt()
        {
            var usr = User;
            if (usr.UserId == 1)
            {
                var beData = DeserializeObject<Dynamic.BusinessEntity.Global.CustomRptColumn>(Request["customData"]);
                var resVal = new Dynamic.DataAccess.Global.GlobalDB(usr.HostName, usr.DBName).SaveCustomColumnForRpt(usr.UserId, beData);
                return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
            }
            else
            {
                var retVal = new
                {
                    IsSuccess = false,
                    ResponseMSG = "Access denied"
                };
                return new JsonNetResult() { Data = retVal, TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };
            }

        }
        [HttpPost]
        public JsonNetResult GetCustomColForRptSetup(int EntityId)
        {
            var usr = User;
            var resVal = new Dynamic.DataAccess.Global.GlobalDB(usr.HostName, usr.DBName).getCustomColumnForRptSetup(usr.UserId, (Dynamic.BusinessEntity.Global.RptFormsEntity)EntityId);
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }
        private AcademicLib.BE.Global.ENTITIES GetAcademicEntityFromVoucherType(Dynamic.BusinessEntity.Account.VoucherTypes voucher)
        {
            switch (voucher)
            {
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return AcademicLib.BE.Global.ENTITIES.Receipt;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return AcademicLib.BE.Global.ENTITIES.Payment;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                    return AcademicLib.BE.Global.ENTITIES.Journal;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                    return AcademicLib.BE.Global.ENTITIES.Contra;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                    return AcademicLib.BE.Global.ENTITIES.PurchaseQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return AcademicLib.BE.Global.ENTITIES.PurchaseOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return AcademicLib.BE.Global.ENTITIES.ReceiptNote;       
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return AcademicLib.BE.Global.ENTITIES.PurchaseInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return AcademicLib.BE.Global.ENTITIES.PurchaseReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                    return AcademicLib.BE.Global.ENTITIES.SalesQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return AcademicLib.BE.Global.ENTITIES.SalesOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return AcademicLib.BE.Global.ENTITIES.DeliveryNote;       
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return AcademicLib.BE.Global.ENTITIES.SalesInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return AcademicLib.BE.Global.ENTITIES.SalesReturn;             
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                    return AcademicLib.BE.Global.ENTITIES.StockJournal;             

            }
            return AcademicLib.BE.Global.ENTITIES.CompanyDetails;
        }
        private Dynamic.BusinessEntity.Global.FormsEntity GetEntityFromVoucherType(Dynamic.BusinessEntity.Account.VoucherTypes voucher)
        {
            switch (voucher)
            {
                case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Receipt;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Payment;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Journal;
                case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                    return Dynamic.BusinessEntity.Global.FormsEntity.Contra;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                    return Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNote;
                case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.ReceiptNoteReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PurchaseReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesQuotation;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DeliveryNote;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DispatchOrder;
                case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                    return Dynamic.BusinessEntity.Global.FormsEntity.DispatchSection;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesInvoice;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesReturn;
                case Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemand:
                    return Dynamic.BusinessEntity.Global.FormsEntity.PartsDemand;
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                    return Dynamic.BusinessEntity.Global.FormsEntity.StockTransfor;
                case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                    return Dynamic.BusinessEntity.Global.FormsEntity.StockJournal;
                case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAllotment:
                    return Dynamic.BusinessEntity.Global.FormsEntity.SalesAllotment;


            }
            return Dynamic.BusinessEntity.Global.FormsEntity.CompanyAlternation;
        }
        [HttpPost]
        public JsonNetResult DelAccInvTransaction(Dynamic.BusinessEntity.Account.VoucherTypes voucherType, int voucherId, int tranId, DateTime? voucherDate = null, int? CostClassId = null)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var entityAC = GetEntityFromVoucherType(voucherType);
                var entity = GetAcademicEntityFromVoucherType(voucherType);

                if (!checkAcademicSecurityEntity(Actions.Delete, (int)entity, false, tranId))
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Access denied. for delete";
                }
                else
                {
                    if (!voucherDate.HasValue)
                        voucherDate = DateTime.Today;

                    Dynamic.BusinessEntity.Global.VoucherDefaultValues voucherDefault = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).IsValidVoucher(User.UserId, Convert.ToInt32(entity), voucherId, CostClassId, voucherDate.Value, 3, false, tranId);
                    if (voucherDefault.IsSuccess)
                    {
                        switch (voucherType)
                        {
                            case Dynamic.BusinessEntity.Account.VoucherTypes.Contra:
                                resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Contra).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.DeliveryNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.DeliveryNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.Journal:
                                resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PartsDemand:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PartsDemandDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.Payment:
                                resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Payment).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PhysicalStock:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PhysicalStockDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseAdditionalInvoice:
                                resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Journal).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseInvoice:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseInvoiceDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseDebitNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseDebitNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseCreditNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseCreditNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseOrder:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseOrderDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseQuotation:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseQuotationDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.PurchaseReturn:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.PurchaseReturnDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.Receipt:
                                resVal = new Dynamic.DataAccess.Account.Transaction.JournalDB(User.HostName, User.DBName, Dynamic.BusinessEntity.Account.Transaction.TranTypes.Receipt).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.ReceiptNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesAdditionalInvoice:
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesInvoice:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesInvoiceDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesDebitNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesDebitNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesCreditNote:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesCreditNoteDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesOrder:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesOrderDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesQuotation:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesQuotationDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.SalesReturn:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.SalesReturnDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.StockJournal:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.StockJournalDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.StockTransforDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeIn:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.CannibalizeInDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.CannibalizeOut:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.CannibalizeOutDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.ManufacturingStockJournal:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.ManufacturingStockJournalDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.ReceiptNoteReturn:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.ReceiptNoteReturnDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchOrder:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.DispatchOrderDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.DispatchSection:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.DispatchSectionDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.Consumption:
                                resVal = new Dynamic.DataAccess.Inventory.Transaction.ConsumptionDB(User.HostName, User.DBName).Delete(tranId);
                                break;
                            case Dynamic.BusinessEntity.Account.VoucherTypes.ProductionOrder:
                                resVal = new Dynamic.BusinessLogic.Inventory.Transaction.ProductionOrder(User.HostName, User.DBName).DeleteById(User.UserId, tranId);
                                break;
                        }

                        if (resVal.IsSuccess)
                        {
                            Dynamic.BusinessEntity.Global.AuditLog auditLog = new Dynamic.BusinessEntity.Global.AuditLog();
                            auditLog.TranId = tranId;
                            auditLog.EntityId = entityAC;
                            auditLog.Action = Dynamic.BusinessEntity.Global.Actions.Delete;
                            auditLog.LogText = "Delete " + entity.ToString();
                            auditLog.AutoManualNo = tranId.ToString();
                            SaveAuditLog(auditLog);
                        }

                        return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

                    }
                    else
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = voucherDefault.ResponseMSG;
                    }
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult PostAccInvTransaction(Dynamic.ReportEntity.Account.DayBookCollections tranColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                resVal = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).PostPendingVoucher(tranColl, User.UserId);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult CancelAccInvTransaction(Dynamic.ReportEntity.Account.DayBookCollections tranColl,string reason)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                foreach(var tc in tranColl)
                {
                    tc.EntityId=GetEntityId((int)tc.VoucherType);
                }
                resVal = new Dynamic.Reporting.Account.DayBook(User.HostName, User.DBName).CancelVoucher(User.UserId, tranColl, reason);
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult SendSMSToStudent(List<AcademicLib.BE.Global.StudentSMS> dataColl)
        {
            string failedMSG = "";
            string steps = "1";
            ResponeValues resVal = new ResponeValues();
            try
            {
                this.GetCompanyDetail();
                if (dataColl != null)
                {
                    var comDet = new Dynamic.DataAccess.Setup.CompanyDetailDB(User.HostName, User.DBName).getCompanyDetailsForWeb(User.UserId);
                    if (comDet == null)
                        comDet = new Dynamic.BusinessEntity.Setup.CompanyDetail();

                    var apiData = System.Configuration.ConfigurationManager.AppSettings["smsAPI"];
                    string smsAPI = (apiData != null ? apiData.ToString() : "");

                    int smsUserId = 0;

                    try
                    {
                        smsUserId = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["smsUserId"].ToString());
                    }
                    catch { }

                    if (!string.IsNullOrEmpty(smsAPI) && smsUserId==0)
                    {
                        int count = 0;
                        var smsFN = new AcademicERP.Global.SMSFunction();
                        foreach (var beData in dataColl)
                        { 
                            if (!string.IsNullOrEmpty(beData.ContactNo) && !string.IsNullOrEmpty(beData.Message))
                            {                              
                                try
                                {
                                    SMSLog sms = new SMSLog();
                                    sms.Message = beData.Message.Replace("$companyname$",comDet.Name);
                                    sms.StudentId = beData.StudentId.ToString() + ":" + beData.UserId.ToString();
                                    sms.PhoneNo = beData.ContactNo.Trim();
                                    if (sms.PhoneNo.Length >= 10)
                                    { 
                                        var sRes = smsFN.SendSMS(sms, smsAPI,hostName,dbName);                                 
                                        if (!sRes.IsSuccess)
                                        {
                                            failedMSG = failedMSG + sRes.ResponseMSG;
                                            if (sRes.ResponseMSG.Contains("Credit Balance"))
                                            {                                                
                                                resVal.ResponseMSG = sRes.ResponseMSG+" "+failedMSG;
                                                resVal.IsSuccess = false;
                                                return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                                            }
                                        }
                                        else
                                            count++;
                                    }
                                }
                                catch (Exception eee)
                                {                                   
                                    resVal.IsSuccess = false;
                                    resVal.ResponseMSG = eee.Message + " " + failedMSG;

                                    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                                }
                            }
                        } 
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "SMS Send Success (" + count.ToString() + ")" + " " + failedMSG;
                    } 
                    else if (smsUserId > 0)
                    {
                        var glbFN = new PivotalERP.Global.GlobalFunction(User.UserId, hostName, dbName);
                        var usr = this.User;
                        List<dynamic> contactColl = new List<dynamic>();
                        foreach (var beData in dataColl)
                        {
                            if (!string.IsNullOrEmpty(beData.ContactNo) && !string.IsNullOrEmpty(beData.Message))
                            {
                                var newjson = new
                                {
                                    Message = beData.Message.Replace("$companyname$", comDet.Name),
                                    ContactNo = beData.ContactNo
                                };
                                contactColl.Add(newjson);
                                //string json = Newtonsoft.Json.JsonConvert.SerializeObject(newjson);

                              
                            }
                        }

                        try
                        {
                            string json = Newtonsoft.Json.JsonConvert.SerializeObject(contactColl);
                            Dynamic.BusinessEntity.Global.NotificationLog notification = new Dynamic.BusinessEntity.Global.NotificationLog();
                            notification.Content = json;
                            notification.DynamicContent = contactColl;
                            notification.ContentPath = "";
                            notification.EntityId = Convert.ToInt32(AcademicLib.BE.Global.NOTIFICATION_ENTITY.SEND_SMS);
                            notification.EntityName = AcademicLib.BE.Global.NOTIFICATION_ENTITY.SEND_SMS.ToString();
                            notification.Heading = "Send SMS";
                            notification.Subject = "Send SMS";
                            notification.UserId = usr.UserId;
                            notification.UserName = usr.UserName;
                            notification.UserIdColl = smsUserId.ToString();
                            resVal = glbFN.SendNotification(usr.UserId, notification);
                        }
                        catch (Exception eee)
                        {
                            resVal.IsSuccess = false;
                            resVal.ResponseMSG = eee.Message;

                            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                        }
                    }
                    else
                    {
                        AcademicERP.Global.SMSFunction smsFN = new AcademicERP.Global.SMSFunction();
                        SMSServer smsUser = smsFN.GetSMSUser();
                        resVal = smsFN.IsValidSMSUser(ref smsUser);

                        int count = 0;
                        if (resVal.IsSuccess)
                        { 
                            foreach (var beData in dataColl)
                            { 
                                if (!string.IsNullOrEmpty(beData.ContactNo) && !string.IsNullOrEmpty(beData.Message))
                                { 
                                    try
                                    {
                                        SMSLog sms = new SMSLog();
                                        sms.Message = beData.Message.Replace("$companyname$", comDet.Name);
                                        sms.StudentId = beData.StudentId.ToString() + ":" + beData.UserId.ToString();
                                        sms.PhoneNo = beData.ContactNo.Trim();
                                        if (sms.PhoneNo.Length >= 10)
                                        { 
                                            var sRes = smsFN.SendSMS(sms, smsUser); 
                                            if (!sRes.IsSuccess)
                                            {
                                                failedMSG = failedMSG + sRes.ResponseMSG;
                                                if (sRes.ResponseMSG.Contains("Credit Balance"))
                                                {
                                                    resVal.ResponseMSG = sRes.ResponseMSG + " " + failedMSG;
                                                    resVal.IsSuccess = false;
                                                    return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                                                }
                                            }
                                            else
                                                count++;
                                        }
                                    }
                                    catch (Exception eee)
                                    { 
                                        resVal.IsSuccess = false;
                                        resVal.ResponseMSG = eee.Message + " " + failedMSG;

                                        return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
                                    }
                                }
                            }
                            smsFN.closeConnection();
                            resVal.IsSuccess = true;
                            resVal.ResponseMSG = "SMS Send Success (" + count.ToString() + ")" + " " + failedMSG;
                        }
                    }

                     
                }
                else
                {
                    resVal.ResponseMSG = "Blank Data Can't be Accept" + " " + failedMSG;
                }

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message + " " + failedMSG;
            }

            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG  };
        }


        [HttpPost] 
        [ValidateInput(false)]
        public JsonNetResult SendEmailToStudent()
        {
            string photoLocation = "/Attachments/academic/student";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = DeserializeObject<List<Dynamic.BusinessEntity.Global.MailDetails>>(Request["jsonData"]);
                if (dataColl != null)
                {
                    var AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {                         
                        var filesColl = Request.Files;
                        int fInd = 0;
                        foreach (var v in filesColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);
                                AttachmentColl.Add
                                    (
                                     new Dynamic.BusinessEntity.GeneralDocument()
                                     {
                                         Data = att.Data,
                                         DocPath = att.DocPath,
                                         DocumentTypeId = null,
                                         Extension = att.Extension,
                                         Name = att.Name,
                                         Description = ""
                                     }
                                    );
                            }
                            fInd++;
                        }
                    }
                     

                    var usr = User;
                    var uid = usr.UserId;
                    var srvPath = System.Web.HttpContext.Current.Server.MapPath("~");
                    PivotalERP.Global.GlobalFunction globlFun = new PivotalERP.Global.GlobalFunction(User.UserId, User.HostName, User.DBName);
                    //var templatesColl = new AcademicLib.BL.Setup.SENT(User.UserId, User.HostName, User.DBName).GetSENT((int)AcademicLib.BE.Global.ENTITIES.AdmissionEnquiry, 3, 2);
                    var templatesColl = new AcademicLib.BL.Setup.SENT(User.UserId, User.HostName, User.DBName).GetSENT((int)dataColl[0].EntityId, 3, 2);
                    if (templatesColl != null && templatesColl.Count > 0)
                    {
                        #region "Send Email"
                        try
                        {
                            AcademicLib.BE.Setup.SENT templateEmail = templatesColl[0];
                            if (templateEmail != null)
                            {
                                var comDet = new Dynamic.DataAccess.Global.GlobalDB(usr.HostName, usr.DBName).getCompanyBranchDetailsForPrint(uid, 0, 0, 0);
                                //PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(CU.HostName, CU.DBName, uid, (int)(Dynamic.BusinessEntity.Global.FormsEntity.AdmissionEnquiry), 0, true);

                                PivotalERP.Global.ReportTemplate reportTemplate = new PivotalERP.Global.ReportTemplate(usr.HostName, usr.DBName, uid, dataColl[0].EntityId, 0, true);

                                if (reportTemplate.TemplateAttachments != null || reportTemplate.TemplateAttachments.Count > 0)
                                {
                                    Dynamic.BusinessEntity.Global.ReportTempletes template = null;
                                    foreach (var rT in reportTemplate.TemplateAttachments)
                                    {
                                        if (rT.ForEmail == true)
                                        {
                                            template = reportTemplate.GetTemplate(rT);
                                            break;
                                        }
                                    }

                                    if (template == null)
                                        template = reportTemplate.DefaultTemplate;

                                    if (!string.IsNullOrEmpty(template.Path))
                                    {
                                        System.Collections.Specialized.NameValueCollection paraColl = GetObjectAsKeyVal(comDet);
                                        paraColl.Add("UserId", uid.ToString());
                                        paraColl.Add("UserName", usr.UserName);
                                        foreach (var newBeData in dataColl)
                                        {

                                            string tempMSG = templateEmail.Description;
                                            string subject = templateEmail.Title;

                                            if (newBeData.ParaColl != null)
                                            {
                                                foreach (var par in newBeData.ParaColl)
                                                {
                                                    if (paraColl.AllKeys.Contains(par.Key))
                                                        paraColl.Remove(par.Key);

                                                    paraColl.Add(par.Key, par.Value);
                                                }
                                            }

                                            Dynamic.ReportEngine.RdlAsp.RdlReport _rdlReport = new Dynamic.ReportEngine.RdlAsp.RdlReport(paraColl);
                                            _rdlReport.ComDet = comDet;
                                            _rdlReport.ConnectionString = ConnectionString;
                                            _rdlReport.RenderType = "pdf";
                                            _rdlReport.NoShow = false;
                                            _rdlReport.ReportFile = reportTemplate.GetPath(template, srvPath);
                                            if (_rdlReport.Object != null)
                                            {
                                                string basePath = @"print-tran-log\" + newBeData.FileName + "-" + DateTime.Now.ToString("yyyy-dd-M--HH-mm-ss") + ".pdf";
                                                string sFile = srvPath + basePath;
                                                reportTemplate.SavePDF(_rdlReport.Object, sFile);

                                                List<string> attachmentFileColl = new List<string>();
                                                attachmentFileColl.Add(sFile);

                                                if (AttachmentColl != null && AttachmentColl.Count > 0)
                                                {
                                                    foreach (var at in AttachmentColl)
                                                        attachmentFileColl.Add(srvPath + at.DocPath);
                                                }


                                                Dynamic.BusinessEntity.Global.MailDetails mail = new Dynamic.BusinessEntity.Global.MailDetails()
                                                {
                                                    To = newBeData.To,
                                                    Cc = IsNullStr(newBeData.Cc),
                                                    BCC = IsNullStr(templateEmail.EmailBCC),
                                                    Subject = subject,
                                                    Message = tempMSG,
                                                    CUserId = uid
                                                };
                                                globlFun.SendEMailWithAttachment(mail, null, attachmentFileColl);
                                            }
                                        }
                                    }

                                }
                                else
                                {
                                    foreach (var newBeData in dataColl)
                                    {
                                        string tempMSG = templateEmail.Description;
                                        string subject = templateEmail.Title;
                                        Dynamic.BusinessEntity.Global.MailDetails mail = new Dynamic.BusinessEntity.Global.MailDetails()
                                        {
                                            To = newBeData.To,
                                            Cc = IsNullStr(newBeData.Cc),
                                            BCC = IsNullStr(templateEmail.EmailBCC),
                                            Subject = subject,
                                            Message = tempMSG,
                                            CUserId = uid
                                        };


                                        List<string> attachmentFileColl = new List<string>();
                                        if (AttachmentColl != null && AttachmentColl.Count > 0)
                                        {
                                            foreach (var at in AttachmentColl)
                                                attachmentFileColl.Add(srvPath + at.DocPath);
                                        }

                                        globlFun.SendEMailWithAttachment(mail, null, attachmentFileColl);
                                    }
                                }

                            }
                        }
                        catch (Exception exMail)
                        {

                        }


                        #endregion

                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "EMail Send";
                    }
                    else
                    {
                        foreach (var newBeData in dataColl)
                        {
                            string tempMSG = newBeData.Message;
                            string subject = newBeData.Subject;
                            Dynamic.BusinessEntity.Global.MailDetails mail = new Dynamic.BusinessEntity.Global.MailDetails()
                            {
                                To = newBeData.To,
                                Cc = IsNullStr(newBeData.Cc),
                                BCC = "",
                                Subject = subject,
                                Message = tempMSG,
                                CUserId = uid
                            };


                            List<string> attachmentFileColl = new List<string>();
                            if (AttachmentColl != null && AttachmentColl.Count > 0)
                            {
                                foreach (var at in AttachmentColl)
                                    attachmentFileColl.Add(srvPath + at.DocPath);
                            }

                            globlFun.SendEMailWithAttachment(mail, null, attachmentFileColl);
                        }
                         
                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "EMail Send";
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

        [HttpPost]
        [ValidateInput(false)]
        public JsonNetResult SendEmail()
        {
            string photoLocation = "/Attachments/academic/student";
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = DeserializeObject<List<Dynamic.BusinessEntity.Global.MailDetails>>(Request["jsonData"]);
                if (dataColl != null)
                {
                    var AttachmentColl = new Dynamic.BusinessEntity.GeneralDocumentCollections();
                    if (Request.Files.Count > 0)
                    {
                        var filesColl = Request.Files;
                        int fInd = 0;
                        foreach (var v in filesColl)
                        {
                            HttpPostedFileBase file = filesColl["file" + fInd];
                            if (file != null)
                            {
                                var att = GetAttachmentDocuments(photoLocation, file);
                                AttachmentColl.Add
                                    (
                                     new Dynamic.BusinessEntity.GeneralDocument()
                                     {
                                         Data = att.Data,
                                         DocPath = att.DocPath,
                                         DocumentTypeId = null,
                                         Extension = att.Extension,
                                         Name = att.Name,
                                         Description = ""
                                     }
                                    );
                            }
                            fInd++;
                        }
                    } 
                    var usr = User;
                    var uid = usr.UserId;
                    var srvPath = System.Web.HttpContext.Current.Server.MapPath("~");
                    PivotalERP.Global.GlobalFunction globlFun = new PivotalERP.Global.GlobalFunction(User.UserId, User.HostName, User.DBName);
                    foreach (var newBeData in dataColl)
                    {
                        string tempMSG = newBeData.Message;
                        string subject = newBeData.Subject;
                        Dynamic.BusinessEntity.Global.MailDetails mail = new Dynamic.BusinessEntity.Global.MailDetails()
                        {
                            To = newBeData.To,
                            Cc = IsNullStr(newBeData.Cc),
                            BCC = "",
                            Subject = subject,
                            Message = tempMSG,
                            CUserId = uid
                        };


                        List<string> attachmentFileColl = new List<string>();
                        if (AttachmentColl != null && AttachmentColl.Count > 0)
                        {
                            foreach (var at in AttachmentColl)
                                attachmentFileColl.Add(srvPath + at.DocPath);
                        }

                        globlFun.SendEMailWithAttachment(mail, null, attachmentFileColl);
                    }

                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "EMail Send";

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

        [HttpPost]
        public JsonNetResult SendNotificationToStudent(List<AcademicLib.BE.Global.StudentSMS> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var usr = User;
                if (dataColl != null)
                {
                    List<Dynamic.BusinessEntity.Global.NotificationLog> notificationColl = new List<Dynamic.BusinessEntity.Global.NotificationLog>();
                    foreach (var v in dataColl)
                    {
                        if (v.UserId > 0)
                        {
                            Dynamic.BusinessEntity.Global.NotificationLog notification = new Dynamic.BusinessEntity.Global.NotificationLog();
                            notification.Content = v.Message;
                            notification.EntityId = v.EntityId;
                            notification.EntityName = ((AcademicLib.BE.Global.ENTITIES)v.EntityId).ToString();
                            notification.Heading = v.Title;
                            notification.Subject = v.Title;
                            //notification.UserId = v.UserId;
                            notification.UserId = usr.UserId;
                            notification.UserName = usr.UserName;
                            notification.UserIdColl = v.UserId.ToString();
                            notification.ContentPath = IsNullStr(v.ContentPath);
                            notificationColl.Add(notification);                            
                        }                        
                    }
                    resVal = new Global.GlobalFunction(User.UserId, User.HostName, User.DBName).SendNotification(User.UserId, notificationColl);
                    //resVal.IsSuccess = true;
                    //resVal.ResponseMSG = GLOBALMSG.SUCCESS;
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

        [HttpPost]
        public JsonNetResult SendSMSFromMobileToStudent(List<AcademicLib.BE.Global.StudentSMS> dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {

                if (dataColl != null)
                {
                    int userId = 0;

                    try
                    {
                        userId= Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["smsUserId"].ToString());                        
                    }
                    catch 
                    {
                        resVal.IsSuccess = false;
                        resVal.ResponseMSG = "No SMS User Found. Pls Setup SMS User 1st";
                       
                    }

                    if (userId > 0)
                    {
                        var notificationLogColl = new List<Dynamic.BusinessEntity.Global.NotificationLog>();
                        foreach (var beData in dataColl)
                        {
                            if (!string.IsNullOrEmpty(beData.ContactNo) && !string.IsNullOrEmpty(beData.Message))
                            {
                                Dynamic.BusinessEntity.Global.NotificationLog notification = new Dynamic.BusinessEntity.Global.NotificationLog();
                                notification.Content = beData.Message;
                                notification.ContentPath = "";
                                notification.EntityId = Convert.ToInt32(AcademicLib.BE.Global.NOTIFICATION_ENTITY.SEND_SMS);
                                notification.EntityName = AcademicLib.BE.Global.NOTIFICATION_ENTITY.SEND_SMS.ToString();
                                notification.Heading = beData.Title;
                                notification.Subject = "Send SMS";
                                notification.UserId = userId;
                                notification.UserName = User.Identity.Name;
                                notification.UserIdColl = userId.ToString();
                                notificationLogColl.Add(notification);
                                //resVal = new PivotalERP.Global.GlobalFunction(User.UserId, hostName, dbName).SendNotification(userId, notification);
                            }
                        }

                        try
                        {
                           
                            resVal = new PivotalERP.Global.GlobalFunction(User.UserId, hostName, dbName).SendNotification(userId, notificationLogColl);
                        }
                        catch (Exception eee) { }

                        resVal.IsSuccess = true;
                        resVal.ResponseMSG = "SMS Send Success";
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

        [HttpPost] 
        public JsonNetResult UploadAttachments()
        {
            string photoLocation = "/Attachments/general";
            List<string> filePathColl = new List<string>();
            ResponeValues resVal = new ResponeValues();
            try
            { 
                if (Request.Files.Count > 0)
                {
                    for (int fInd = 0; fInd < Request.Files.Count; fInd++)
                    {
                        HttpPostedFileBase file = Request.Files["file" + fInd];
                        if (file != null)
                        {
                            var att = GetAttachmentDocuments(photoLocation, file);
                            filePathColl.Add(att.DocPath);
                        }
                        fInd++;
                    }
                }

                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }

            return new JsonNetResult() { Data = filePathColl, TotalCount = filePathColl.Count, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetPaymentGateway()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(AcademicLib.BE.Wallet.PAYMENTGATEWAYS)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GenerateOTP(int EntityId,string MobileNo,string EmailId)
        {
            var resVal = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).generateOTP(User.UserId, MobileNo, EmailId, EntityId);

            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }

        [HttpPost]
        public JsonNetResult IsValidOTP(int EntityId, string OTP)
        {
            var resVal = new Dynamic.BusinessLogic.Security.User(User.HostName, User.DBName).IsValidOTP(User.UserId, OTP, EntityId,"");

            return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

        }
        //private ClosedXML.Excel.XLWorkbook GenerateClosedXMLWorkbook()
        //{
        //    var wb = new ClosedXML.Excel.XLWorkbook();
        //    var ws = wb.AddWorksheet("Test");
        //    ws.FirstCell().SetValue("Hello world!");
        //    ws.FirstCell().CellBelow().FormulaA1 = "RAND()";
        //    return wb;
        //}

        //public ActionResult Download()
        //{            
        //    using (var wb = GenerateClosedXMLWorkbook())
        //    {
        //        // Add ClosedXML.Extensions in your using declarations

        //        return ClosedXML.Extensions.ResponseExtensions.DeliverWorkbook(this.HttpContext.Response, wb,"data.xls");
        //        //return response.DeliverWorkbook("generatedfile.xlsx");

        //        // or specify the content type:
        //        //return wb.Deliver("generatedFile.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        //    }
        //}


        [HttpPost]
        public JsonNetResult PrintReportData()
        {
            var jsonData = Request["jsonData"];
            RptFormsEntity entityId = (RptFormsEntity)Convert.ToInt32(Request["entityId"].ToString());
            ResponeValues resVal = new ResponeValues();
            try
            {
                var key = Guid.NewGuid().ToString().Replace("-", "");
                switch (entityId)
                {
                    case RptFormsEntity.TransportStudentList:
                        {
                            List<AcademicLib.RE.Transport.StudentSummary> paraData = DeserializeObject<List<AcademicLib.RE.Transport.StudentSummary>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;

                    case RptFormsEntity.StudentVoucher:
                        {
                            List<AcademicLib.RE.Fee.Voucher> paraData = DeserializeObject<List<AcademicLib.RE.Fee.Voucher>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.CancelVouchersList:
                    case RptFormsEntity.DayBook:
                        {
                            List<Dynamic.ReportEntity.Account.DayBook> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.DayBook>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.CostCenterVoucher:
                    case RptFormsEntity.LedgerVoucher:
                        {
                            List<Dynamic.ReportEntity.Account.LedgerVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.LedgerVoucher>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.CostCenterClosingBalance:
                    case RptFormsEntity.TrailBalanceLedgerGroupWise:
                        {
                            List<Dynamic.ReportEntity.Account.TrailBalance> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.TrailBalance>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.AccountSalesReturnRegister:
                    case RptFormsEntity.AccountSalesRegister:
                        {
                            List<Dynamic.ReportEntity.Account.NewSalesVatRegister> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.NewSalesVatRegister>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.AccountPurchaseReturnRegister:
                    case RptFormsEntity.AccountPurchaseRegister:
                        {
                            List<Dynamic.ReportEntity.Account.NewPurchaseVatRegister> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.NewPurchaseVatRegister>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.AccountConfirmationLetter:
                        {
                            List<Dynamic.ReportEntity.Account.AccountConfirmationLetter> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.AccountConfirmationLetter>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.ProductVoucher:
                        {
                            List<Dynamic.ReportEntity.Inventory.ProductVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.ProductVoucher>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.ProductDailySummary:
                        {
                            List<Dynamic.ReportEntity.Inventory.ProductMonthlySummary> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.ProductMonthlySummary>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.StockReport:
                        {
                            List<Dynamic.ReportEntity.Account.StockReport> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.StockReport>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.SalesMaterializedView:
                        {
                            List<Dynamic.ReportEntity.Inventory.SalesMaterializedView> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.SalesMaterializedView>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.SalesInvoiceDetails:
                        {
                            List<Dynamic.ReportEntity.Inventory.SalesInvoiceDetails> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.SalesInvoiceDetails>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.PartyWiseAgeingReport:
                        {
                            List<Dynamic.ReportEntity.Inventory.PartyAgeingReport> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.PartyAgeingReport>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.ListOfProduct:
                        {
                            List<Dynamic.ReportEntity.Inventory.Product> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.Product>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.FeeManualBilling:
                        {
                            List<AcademicLib.RE.Fee.ManualBillingDetails> paraData = DeserializeObject<List<AcademicLib.RE.Fee.ManualBillingDetails>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.ProfitAndLoss:
                        {
                            List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.ProfitAndLossAsTFormat:
                        {
                            List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.BalanceSheet:
                        {
                            List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                    case RptFormsEntity.BalanceSheetAsTFormat:
                        {
                            List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;
                }
                resVal.ResponseId = key;
                resVal.IsSuccess = true;

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult PrintTransactionData()
        {
            var jsonData = Request["jsonData"];
            FormsEntity entityId = (FormsEntity)Convert.ToInt32(Request["entityId"].ToString());
            ResponeValues resVal = new ResponeValues();
            try
            {
                var key = Guid.NewGuid().ToString().Replace("-", "");
                switch (entityId)
                {

                    case FormsEntity.UserWiseLog:
                        {
                            List<Dynamic.BusinessEntity.Global.AuditLog> paraData = DeserializeObject<List<Dynamic.BusinessEntity.Global.AuditLog>>(jsonData);
                            Session.Add(key, paraData);
                        }
                        break;

                }
                resVal.ResponseId = key;
                resVal.IsSuccess = true;

                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpPost]
        [ValidateInput(false)]
        public JsonNetResult PrintXlsReportData()
        {

            RptFormsEntity entityId = (RptFormsEntity)Convert.ToInt32(Request["entityId"].ToString());
            string fname = Request["RptPath"].ToString();
            string RptPath = Server.MapPath("~") + fname;
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (string.IsNullOrEmpty(fname))
                {
                    RptPath = Server.MapPath("~") + "Report\\ExcelFormat\\" + entityId.ToString() + ".xlsx";
                }
                var user = User;
                var template = new ClosedXML.Report.XLTemplate(RptPath);
                var key = Guid.NewGuid().ToString().Replace("-", "");
                var urlPath = "print-tran-log\\" + key + ".xlsx";
                string outputFile = Server.MapPath("~") + urlPath;

                var comDet = new Dynamic.DataAccess.Global.GlobalDB(user.HostName, user.DBName).getCompanyBranchDetailsForPrint(user.UserId, (int)entityId, 0, 0);
                if (comDet != null && comDet.IsSuccess || !string.IsNullOrEmpty(comDet.CompanyName))
                {
                    System.Collections.Specialized.NameValueCollection paraColl = GetObjectAsKeyVal(comDet);
                    paraColl.Add("UserId", user.UserId.ToString());
                    paraColl.Add("UserName", user.UserName);
                    paraColl.Add("UserFullName", user.FirstName + " " + user.LastName);
                    paraColl.Add("UserDesignation", user.Designation);
                    for (int i = 0; i < paraColl.Count; i++)
                    {
                        template.AddVariable(paraColl.GetKey(i), paraColl[i]);
                    }

                    var paraVariables = Request["paraData"];
                    if (!string.IsNullOrEmpty(paraVariables))
                    {
                        var allKeys = paraColl.AllKeys;
                        var jobj = DeserializeObject<JObject>(paraVariables);
                        foreach (var j in jobj)
                        {
                            if (!allKeys.Contains(j.Key))
                            {
                                template.AddVariable(j.Key, j.Value.ToString());
                            }
                        }
                    }

                    switch (entityId)
                    {
                        case RptFormsEntity.AccountSalesReturnRegister:
                        case RptFormsEntity.AccountSalesRegister:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.NewSalesVatRegister> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.NewSalesVatRegister>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.CostCenterClosingBalance:
                        case RptFormsEntity.TrailBalanceLedgerGroupWise:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.TrailBalance> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.TrailBalance>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.DayBookSummary:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.LedgerDayBook> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.LedgerDayBook>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.CancelVouchersList:
                        case RptFormsEntity.DayBook:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.DayBook> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.DayBook>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.LedgerVoucher:
                        case RptFormsEntity.CostCenterVoucher:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.LedgerVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.LedgerVoucher>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.AccountPurchaseReturnRegister:
                        case RptFormsEntity.AccountPurchaseRegister:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.NewPurchaseVatRegister> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.NewPurchaseVatRegister>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.AccountConfirmationLetter:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.AccountConfirmationLetter> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.AccountConfirmationLetter>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.ProductVoucher:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.ProductVoucher> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.ProductVoucher>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.ProductDailySummary:
                        case RptFormsEntity.ProductMonthlySummary:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.ProductMonthlySummary> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.ProductMonthlySummary>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.StockReport:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.StockReport> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.StockReport>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.SalesMaterializedView:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.SalesMaterializedView> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.SalesMaterializedView>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.SalesInvoiceDetails:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.SalesInvoiceDetails> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.SalesInvoiceDetails>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.PartyWiseAgeingReport:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.PartyAgeingReport> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.PartyAgeingReport>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.ListOfProduct:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.Product> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.Product>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.DairyPurchase:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.DairyPurchase> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.DairyPurchase>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.PartyWiseDuesBillList:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.PartyWiseDuesBillList> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.PartyWiseDuesBillList>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.ProfitAndLoss:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.ProfitAndLossAsTFormat:
                            {
                                var incomeData = Request["incomeData"];
                                var expensesData = Request["expensesData"];
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraIncomeData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(incomeData);
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraExpensesData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(expensesData);
                                template.AddVariable("IncomeDataSource", paraIncomeData);
                                template.AddVariable("ExpensesDataSource", paraExpensesData);
                            }
                            break;
                        case RptFormsEntity.BalanceSheet:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.BalanceSheetAsTFormat:
                            {
                                var assetsData = Request["assetsData"];
                                var laibilityData = Request["laibilityData"];
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraAssetsData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(assetsData);
                                List<Dynamic.ReportEntity.Account.ProfitAndLosss> paraLaibilityData = DeserializeObject<List<Dynamic.ReportEntity.Account.ProfitAndLosss>>(laibilityData);
                                template.AddVariable("AssetDataSource", paraAssetsData);
                                template.AddVariable("LaibilityDataSource", paraLaibilityData);
                            }
                            break;
                        case RptFormsEntity.AllAgentSalesSummary:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.AgentWiseSalesSummary> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.AgentWiseSalesSummary>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;
                        case RptFormsEntity.TDSSummary:
                            {
                                var jsonData = Request["jsonData"];
                                List<Dynamic.ReportEntity.Inventory.PurchaseTDS> paraData = DeserializeObject<List<Dynamic.ReportEntity.Inventory.PurchaseTDS>>(jsonData);
                                template.AddVariable("DataSource", paraData);
                            }
                            break;

                    }
                    template.Generate();
                    template.SaveAs(outputFile);
                    resVal.ResponseId = urlPath;
                    resVal.IsSuccess = true;

                }
                else
                {
                    resVal.IsSuccess = false;
                    resVal.ResponseMSG = "Unable To Get Company Details";
                }


                return new JsonNetResult() { Data = resVal, TotalCount = 1, IsSuccess = true, ResponseMSG = GLOBALMSG.SUCCESS };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpGet]
        public JsonNetResult GetStudentTypes()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(AcademicLib.BE.Academic.Creation.STUDENTTYPES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str.Replace("_"," ");
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public JsonNetResult GetMidasURL()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var usr = User;
                resVal.ResponseMSG = new Global.GlobalFunction(usr.UserId, usr.HostName, usr.DBName).GetMidasLMS(usr.BranchId);
                resVal.IsSuccess = true;
                return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };

            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = resVal, TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public string GetMidasURLOnly()
        {
            //ResponeValues resVal = new ResponeValues();
            var usr = User;
            return new Global.GlobalFunction(usr.UserId, usr.HostName, usr.DBName).GetMidasLMS(usr.BranchId);
        }

        [HttpGet]
        public JsonNetResult GetCreditRules()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Setup.CreditRulesSetup)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }
        [HttpGet]
        public JsonNetResult GetDocumentTypes()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var dataColl = new Dynamic.DataAccess.Account.DocumentTypeDB(User.HostName, User.DBName).getAllDocumentType(User.UserId);
                return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }


        [HttpGet]
        public JsonNetResult GetDataType()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 1;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Setup.DATATYPES)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }


        [AcceptVerbs(HttpVerbs.Get | HttpVerbs.Post)]
        public JsonNetResult GetCustomData(string procName, string qry, bool asParentChild, string tblNames,string colRelations, System.Collections.Generic.Dictionary<string,string> paraColl=null)
        {

            try
            {
                var usr = User;

                if (!string.IsNullOrEmpty(procName))
                {
                    procName = "usp_"+procName;
                    if (asParentChild)
                    {
                        List<string> tblNameColl = new List<string>();

                        if (!string.IsNullOrEmpty(tblNames))
                        {
                            foreach (var tN in tblNames.Split(','))
                            {
                                tblNameColl.Add(tN);
                            }
                        }


                        List<string> colRelationColl = new List<string>();

                        if (!string.IsNullOrEmpty(colRelations))
                        {
                            foreach (var tN in colRelations.Split(','))
                            {
                                colRelationColl.Add(tN);
                            }
                        }

                        if (paraColl == null)
                            paraColl = new Dictionary<string, string>();

                        var printData = new Dynamic.DataAccess.Global.GlobalDB(hostName, dbName).getCustomDataPC(usr.UserId, procName, paraColl, tblNameColl, colRelationColl);

                        if(printData.JsonStr== "null")
                        {
                            return new JsonNetResult() { Data = null, TotalCount = 0, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };
                        }

                        var tmpDColl = DeserializeObject<JObject>(printData.JsonStr);
                        return new JsonNetResult() { Data = tmpDColl, TotalCount = tmpDColl.Count, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };
                    }
                    else
                    {
                        var printData = new Dynamic.DataAccess.Global.GlobalDB(hostName, dbName).getCustomData(usr.UserId, procName, paraColl);

                        return new JsonNetResult() { Data = printData.DataColl, TotalCount = printData.DataColl.Count, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };
                    }


                }
                else
                {
                    var printData = new Dynamic.DataAccess.Global.GlobalDB(hostName, dbName).getCustomDataFromQry(usr.UserId, qry, paraColl);

                    return new JsonNetResult() { Data = printData.DataColl, TotalCount = printData.DataColl.Count, IsSuccess = printData.IsSuccess, ResponseMSG = printData.ResponseMSG };
                }


            }
            catch (Exception ee)
            {
                var retVal = new
                {
                    IsSuccess = false,
                    ResponseMSG = ee.Message
                };
                return new JsonNetResult() { Data = retVal, TotalCount = 0, IsSuccess = false, ResponseMSG = GLOBALMSG.BLANK_DATA };

            }

        }


        [HttpGet]
        public JsonNetResult GetLedgerType()
        {
            Dynamic.APIEnitity.CommonCollections dataColl = new Dynamic.APIEnitity.CommonCollections();
            try
            {
                int id = 0;
                foreach (string str in Enum.GetNames(typeof(Dynamic.BusinessEntity.Account.TypeOfDutyTaxs)))
                {
                    Dynamic.APIEnitity.Common beData = new Dynamic.APIEnitity.Common();
                    beData.Id = id;
                    beData.Text = str;
                    dataColl.Add(beData);
                    id++;
                }
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;
            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetTranDocAttachment(int TranId, Dynamic.BusinessEntity.Account.VoucherTypes VoucherType)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var tranType = GetTranTypeName(VoucherType);
                var dataColl = new Dynamic.DataAccess.Global.GlobalDB(User.HostName, User.DBName).GetTranDocAttachment(User.UserId, TranId, tranType);

                if (dataColl.Count == 0 && dataColl.IsSuccess)
                {
                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = false, ResponseMSG = "There are no attachments available for this transaction at the moment" };
                }
                else
                    return new JsonNetResult() { Data = dataColl, TotalCount = dataColl.Count, IsSuccess = dataColl.IsSuccess, ResponseMSG = dataColl.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }

        [HttpPost]
        public JsonNetResult GetSMSBalace()
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                var usr = User;
                var res= new PivotalERP.Global.GlobalFunction(usr.UserId, usr.HostName, usr.DBName).getSMSBalance_Akash();
                return new JsonNetResult() { Data = res, TotalCount = 0, IsSuccess = res.IsSuccess, ResponseMSG = res.ResponseMSG };
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;

            }
            return new JsonNetResult() { Data = "", TotalCount = 0, IsSuccess = resVal.IsSuccess, ResponseMSG = resVal.ResponseMSG };
        }



    }
}