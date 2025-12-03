using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BE.Exam.Transaction
{
   public class ExamwiseAttendence : ResponeValues
    {        
        public int StudentId { get; set; }
        public int ExamTypeId { get; set; }
        public int WorkingDays { get; set; }
        public int PresentDays { set; get; }
        public int AbsentDays { set; get; }
        public string Remarks { set; get; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        
    }
    public class ExamwiseAttendenceCollections : System.Collections.Generic.List<ExamwiseAttendence> {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }   
}
 