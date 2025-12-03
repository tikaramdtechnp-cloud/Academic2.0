using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BL.FrontDesk.Transaction
{
    public class Visitor
    {
        DA.FrontDesk.Transaction.VisitorDB db = null;
        int _UserId = 0;

        public Visitor(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.FrontDesk.Transaction.VisitorDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.FrontDesk.Transaction.Visitor beData)
        {
            bool isModify = beData.VisitorId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.FrontDesk.Transaction.VisitorCollections GetAllVisitor(int EntityId, DateTime? dateFrom, DateTime? dateTo)
        {
            return db.getAllVisitor(_UserId, EntityId,dateFrom,dateTo);
        }
        public BE.FrontDesk.Transaction.Visitor GetVisitorById(int EntityId, int VisitorId)
        {
            return db.getVisitorById(_UserId, EntityId, VisitorId);
        }
        public ResponeValues DeleteById(int EntityId, int VisitorId)
        {
            return db.DeleteById(_UserId, EntityId, VisitorId);
        }
        public ResponeValues UpdateInTime( int VisitorId, DateTime InTime)
        {
            return db.UpdateInTime(_UserId, VisitorId, InTime);
        }
            public ResponeValues IsValidData(ref BE.FrontDesk.Transaction.Visitor beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();
            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.VisitorId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.VisitorId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
                else if (string.IsNullOrEmpty(beData.Name))
                {
                    resVal.ResponseMSG = "Please ! Enter Name";
                }
                //else if (beData.ShiftId == 0)
                //{
                //    resVal.ResponseMSG = "Please ! Enter Shift ";
                //}

                else
                {

                    resVal.IsSuccess = true;
                    resVal.ResponseMSG = "Valid";
                }
            }
            catch (Exception ee)
            {
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            return resVal;
        }

    }
}
