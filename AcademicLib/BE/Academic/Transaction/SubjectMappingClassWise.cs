using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BE.Academic.Transaction
{
    public class SubjectMappingClassWise : ResponeValues
    {
        public int? ClassId { get; set; }
        public int[] SectionIdColl { get; set; }
        public int? NoOfOptionalSub { get; set; }
        public int SNo { get; set; }
        public int SubjectId { get; set; }
        public int PaperType { get; set; }
        public string CodeTH { get; set; }
        public string CodePR { get; set; }
        public bool IsOptional { get; set; }
        public bool IsExtra { get; set; }
        public int? SemesterId { get; set; }
        public int? ClassYearId { get; set; }
        public int? BatchId { get; set; }

        public double CRTH { get; set; }
        public double CRPR { get; set; }
        public double CR { get; set; }

        public string FromSectionIdColl { get; set; }
        public string ToClassIdColl { get; set; }
        public string ToSectionIdColl { get; set; }

        public string SubjectName { get; set; }
    }
    public class SubjectMappingClassWiseCollections : System.Collections.Generic.List<SubjectMappingClassWise>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }

    public class CopySubjectMapping : ResponeValues
    {
        public int FromClassId { get; set; }
        public int? FromSectionIdColl { get; set; }
        public string ToClassIdColl { get; set; }
        public string ToSectionIdColl { get; set; }
        public int? AcademicYearId { get; set; }
    }
}
