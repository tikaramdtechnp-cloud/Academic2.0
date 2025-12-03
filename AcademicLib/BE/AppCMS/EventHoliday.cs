using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcademicLib.BE.AppCMS.Creation
{
    public class EventHoliday : ResponeValues
    {
        public int? EventHolidayId { get; set; }
        public int EventTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime? AtTime { get; set; }
        public string ApplicableForClass { get; set; }
    }

    public class EventHolidayCollections : System.Collections.Generic.List<EventHoliday>
    {
        public string ResponseMSG { get; set; }
        public bool IsSuccess { get; set; }
    }
}
