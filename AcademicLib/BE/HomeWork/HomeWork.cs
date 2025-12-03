using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BE.HomeWork
{
   public class HomeWork : ResponeValues
    {
        public int? HomeWorkId { get; set; }
        public int TeacherId { get; set; }
        public int HomeworkTypeId { get; set; }
        public int ClassId { get; set; }
        public int? SectionId { get; set; }

        public string SectionIdColl { get; set; }
        public int SubjectId { get; set; }
        public string Lesson { get; set; }
        public string Topic { get; set; }
        public string Description { get; set; }
        public DateTime? DeadlineDate { get; set; }
        public DateTime? DeadlineTime { get; set; }
        public DateTime? DeadlineforRedo { get; set; }
        public DateTime? DeadlineforRedoTime { get; set; }   
        public bool IsAllowLateSibmission { get; set; }
        public bool SubmissionsRequired { get; set; }
        public Dynamic.BusinessEntity.GeneralDocumentCollections AttachmentColl { get; set; }

        //Added By Suresh
        public int? BatchId { get; set; }
        public int? SemesterId { get; set; }
        public int? ClassYearId { get; set; }
    }
public class HomeWorkCollections : List<HomeWork> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
 