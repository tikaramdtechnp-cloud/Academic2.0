using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.RE.Academic
{
    public class StudentPhoto
    {
        public int StudentId { get; set; }
        public int AutoNumber { get; set; }
        public string RegdNo { get; set; }
        public string PhotoPath { get; set; }
    }

    public class StudentPhotoCollections : System.Collections.Generic.List<StudentPhoto>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
