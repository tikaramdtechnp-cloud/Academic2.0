using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BL.Attendance
{
    public class LeaveOpening
    {
        DA.Attendance.LeaveOpeningDB db = null;
        int _UserId = 0;
        public LeaveOpening(int UserId, string hostName, string dbName)
        {
            this._UserId = UserId;
            db = new DA.Attendance.LeaveOpeningDB(hostName, dbName);
        }
        public ResponeValues SaveFormData(BE.Attendance.LeaveOpening beData)
        {
            bool isModify = beData.TranId > 0;
            ResponeValues isValid = IsValidData(ref beData, isModify);
            if (isValid.IsSuccess)
                return db.SaveUpdate(beData, isModify);
            else
                return isValid;
        }
        public BE.Attendance.LeaveOpeningCollections GetAllLeaveOpening(int EntityId)
        {
            return db.getAllLeaveOpening(_UserId);
        }
        public AcademicLib.BE.Attendance.LeaveOpening getLeaveOpeningById(int EmployeeId, int PeriodId)
        {
            return db.getLeaveOpeningById(_UserId, EmployeeId, PeriodId);
        }
            public ResponeValues DeleteById(int EntityId, int LeaveOpeningId)
        {
            return db.DeleteById(_UserId, EntityId, LeaveOpeningId);
        }

        public ResponeValues IsValidData(ref BE.Attendance.LeaveOpening beData, bool IsModify)
        {
            ResponeValues resVal = new ResponeValues();

            try
            {
                if (beData == null)
                {
                    resVal.ResponseMSG = GLOBALMSG.NO_DATA_FOUND;
                }
                else if (IsModify && beData.TranId == 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Modify";
                }
                else if (!IsModify && beData.TranId != 0)
                {
                    resVal.ResponseMSG = GLOBALMSG.INVALID_DATA + " For Save";
                }
                else if (beData.CUserId == 0)
                {
                    resVal.ResponseMSG = "Invalid User for CRUD";
                }
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
