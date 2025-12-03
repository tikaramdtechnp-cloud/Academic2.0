using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dynamic.DataAccess.Global;

namespace AcademicLib.DA.Academic.Transaction
{
    internal class SubjectMappingClassWiseDB
    {
        DataAccessLayer1 dal = null;
        public SubjectMappingClassWiseDB(string hostName, string dbName)
        {
            dal = new DataAccessLayer1(hostName, dbName);
        }
        public ResponeValues SaveUpdate(int AcademicYearId,BE.Academic.Transaction.SubjectMappingClassWiseCollections dataColl)
        {
            ResponeValues resVal = new ResponeValues();
            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;                       
            try
            {
                var fst = dataColl.First();
                int[] sectionIdColl = fst.SectionIdColl;
                string toClassIdColl = fst.ToClassIdColl;
                string toSectionIdColl = fst.ToSectionIdColl;
                string fromSectionIdColl = fst.FromSectionIdColl;

                if (sectionIdColl == null || sectionIdColl.Length == 0)
                {
                    sectionIdColl = new int[1];
                }

                foreach(var ss in sectionIdColl)
                {
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@ClassId", fst.ClassId);
                    cmd.Parameters.AddWithValue("@UserId", fst.CUserId);
                    cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);
                    cmd.Parameters.AddWithValue("@SectionId", ss);

                    cmd.Parameters.AddWithValue("@SemesterId", fst.SemesterId);
                    cmd.Parameters.AddWithValue("@ClassYearId", fst.ClassYearId);
                    cmd.Parameters.AddWithValue("@BatchId", fst.BatchId);
                    cmd.CommandText = "usp_DelSubjectMappingClassWise";
                    //if(ss==0)
                    //{
                    //    cmd.CommandText = "delete from tbl_SubjectMappingClassWise where ClassId=@ClassId";
                    //}                        
                    //else
                    //{
                    //    cmd.Parameters.AddWithValue("@SectionId", ss);
                    //    cmd.CommandText = "delete from tbl_SubjectMappingClassWise where ClassId=@ClassId and SectionId=@SectionId";
                    //}
                    cmd.ExecuteNonQuery();
                }
                
                foreach (var beData in dataColl)
                {
                    if (beData.SectionIdColl == null || beData.SectionIdColl.Length == 0)
                    {
                        beData.SectionIdColl = new int[1];
                    }

                    foreach (var secId in beData.SectionIdColl)
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@SNo", beData.SNo);

                        cmd.Parameters.AddWithValue("@SemesterId", beData.SemesterId);
                        cmd.Parameters.AddWithValue("@BatchId", beData.BatchId);
                        cmd.Parameters.AddWithValue("@ClassYearId", beData.ClassYearId);

                        cmd.Parameters.AddWithValue("@ClassId", beData.ClassId);

                        if(secId==0)
                            cmd.Parameters.AddWithValue("@SectionId", DBNull.Value);
                        else
                            cmd.Parameters.AddWithValue("@SectionId", secId);

                        cmd.Parameters.AddWithValue("@NoOfOptionalSub", beData.NoOfOptionalSub);
                        cmd.Parameters.AddWithValue("@SubjectId", beData.SubjectId);
                        cmd.Parameters.AddWithValue("@PaperType", beData.PaperType);
                        cmd.Parameters.AddWithValue("@CodeTH", beData.CodeTH);
                        cmd.Parameters.AddWithValue("@CodePR", beData.CodePR);
                        cmd.Parameters.AddWithValue("@IsExtra", beData.IsExtra);
                        cmd.Parameters.AddWithValue("@IsOptional", beData.IsOptional);
                        cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
                        cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);
                        cmd.Parameters.AddWithValue("@CRTH", beData.CRTH);
                        cmd.Parameters.AddWithValue("@CRPR", beData.CRPR);
                        cmd.Parameters.AddWithValue("@CR", beData.CR);
                        cmd.CommandText = "usp_AddSubjectMapClassWise";
                        cmd.ExecuteNonQuery();


                        cmd.Parameters.Clear(); 
                        cmd.Parameters.AddWithValue("@ClassId", beData.ClassId);
                        cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
                        cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);
                        cmd.Parameters.AddWithValue("@SectionId", secId);
                        cmd.Parameters.AddWithValue("@SemesterId", beData.SemesterId);
                        cmd.Parameters.AddWithValue("@ClassYearId", beData.ClassYearId);
                        cmd.Parameters.AddWithValue("@BatchId", beData.BatchId);
                        cmd.CommandText = "usp_ReUpdateSubjectMappingStudentWise";
                        cmd.ExecuteNonQuery();
                    }

                }

                cmd.Parameters.Clear();
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", fst.CUserId);
                cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);
                cmd.Parameters.AddWithValue("@ClassId", fst.ClassId);
                cmd.CommandText = "usp_ReInsertSubjectMappingStudentWise";
                cmd.ExecuteNonQuery();

                if (!string.IsNullOrEmpty(toClassIdColl))
                {
                    cmd.Parameters.Clear();

                    if (string.IsNullOrEmpty(toSectionIdColl))
                        toSectionIdColl = "";

                    cmd.Parameters.AddWithValue("@UserId", fst.CUserId);
                    cmd.Parameters.AddWithValue("@FromClassId", fst.ClassId);
                    cmd.Parameters.AddWithValue("@ToClassIdColl", toClassIdColl);
                    cmd.Parameters.AddWithValue("@FromSectionIdColl", fromSectionIdColl);
                    cmd.Parameters.AddWithValue("@ToSectionIdColl", toSectionIdColl);
                    cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);
                    cmd.CommandText = "usp_CopySubjectMappingClassWise";
                    cmd.ExecuteNonQuery();


                    cmd.Parameters.Clear();
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserId", fst.CUserId);
                    cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);            
                    cmd.CommandText = "usp_ReInsertSubjectMappingStudentWise";
                    cmd.ExecuteNonQuery();
                }



               

                dal.CommitTransaction();

                resVal.IsSuccess = true;
                resVal.ResponseMSG = "Subject Mapping ClassWise Done";
            }
            catch (System.Data.SqlClient.SqlException ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }
        public BE.Academic.Transaction.SubjectMappingClassWiseCollections getClassWiseSubjectMapping(int UserId,int AcademicYearId, int ClassId,string SectionIdColl,int? SemesterId,int? ClassYearId,int? BatchId,int? BranchId=null)
        {
            BE.Academic.Transaction.SubjectMappingClassWiseCollections dataColl = new BE.Academic.Transaction.SubjectMappingClassWiseCollections();

            dal.OpenConnection();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", UserId);
            cmd.Parameters.AddWithValue("@ClassId", ClassId);
            cmd.Parameters.AddWithValue("@AcademicYearId", AcademicYearId);

            if (string.IsNullOrEmpty(SectionIdColl) || SectionIdColl.Trim()=="0")
                cmd.Parameters.AddWithValue("@SectionIdColl", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@SectionIdColl", SectionIdColl);

            cmd.Parameters.AddWithValue("@SemesterId", SemesterId);
            cmd.Parameters.AddWithValue("@ClassYearId", ClassYearId);
            cmd.Parameters.AddWithValue("@BatchId", BatchId);
            cmd.Parameters.AddWithValue("@BranchId", BranchId);

            cmd.CommandText = "usp_GetClassWiseSubjectMapping";
            try
            {
                System.Data.SqlClient.SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    BE.Academic.Transaction.SubjectMappingClassWise beData = new BE.Academic.Transaction.SubjectMappingClassWise();
                    beData.ClassId = reader.GetInt32(0);
                    string secIdColl = "";
                    if (!(reader[1] is DBNull)) secIdColl = reader.GetString(1);
                    if (!(reader[2] is DBNull)) beData.NoOfOptionalSub = reader.GetInt32(2);
                    if (!(reader[3] is DBNull)) beData.SNo = reader.GetInt32(3);
                    if (!(reader[4] is DBNull)) beData.SubjectId = reader.GetInt32(4);
                    if (!(reader[5] is DBNull)) beData.PaperType = reader.GetInt32(5);
                    if (!(reader[6] is DBNull)) beData.CodeTH = reader.GetString(6);
                    if (!(reader[7] is DBNull)) beData.CodePR = reader.GetString(7);
                    if (!(reader[8] is DBNull)) beData.IsOptional = reader.GetBoolean(8);
                    if (!(reader[9] is DBNull)) beData.IsExtra = reader.GetBoolean(9);
                    if (!(reader[10] is DBNull)) beData.CRTH = Convert.ToDouble(reader[10]);
                    if (!(reader[11] is DBNull)) beData.CRPR = Convert.ToDouble(reader[11]);
                    if (!(reader[12] is DBNull)) beData.CR = Convert.ToDouble(reader[12]);
                    try
                    {
                        if (!(reader[13] is DBNull)) beData.SubjectName = Convert.ToString(reader[13]);
                    }
                    catch { }
                    
                    if (!string.IsNullOrEmpty(secIdColl))
                    {
                        string[] secArray = secIdColl.Split(',');
                        beData.SectionIdColl = new int[secArray.Length];                        
                        for (int i = 0; i < secArray.Length; i++)
                            beData.SectionIdColl[i] =Convert.ToInt32(secArray[i]);
                    }

                    dataColl.Add(beData);
                }
                reader.Close();
                dataColl.IsSuccess = true;
                dataColl.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dataColl.IsSuccess = false;
                dataColl.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return dataColl;
        }


        public ResponeValues copySubjectMappingClassWise(AcademicLib.BE.Academic.Transaction.CopySubjectMapping beData)
        {
            ResponeValues resVal = new ResponeValues();

            dal.OpenConnection();
            dal.BeginTransaction();
            System.Data.SqlClient.SqlCommand cmd = dal.GetCommand();
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserId", beData.CUserId);
            cmd.Parameters.AddWithValue("@FromClassId", beData.FromClassId);
            cmd.Parameters.AddWithValue("@ToClassIdColl", beData.ToClassIdColl); 
            cmd.Parameters.AddWithValue("@FromSectionIdColl", beData.FromSectionIdColl);
            cmd.Parameters.AddWithValue("@ToSectionIdColl", beData.ToSectionIdColl);
            cmd.Parameters.AddWithValue("@AcademicYearId", beData.AcademicYearId);
            cmd.CommandText = "usp_CopySubjectMappingClassWise";
            try
            {
                cmd.ExecuteNonQuery();
                dal.CommitTransaction();
                resVal.IsSuccess = true;
                resVal.ResponseMSG = GLOBALMSG.SUCCESS;

            }
            catch (Exception ee)
            {
                dal.RollbackTransaction();
                resVal.IsSuccess = false;
                resVal.ResponseMSG = ee.Message;
            }
            finally
            {
                dal.CloseConnection();
            }
            return resVal;
        }

    }
}
