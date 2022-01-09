using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Hour
    {
        public int LocationId { get; set; }
        public int DayOfWeek { get; set; }
        public int OpenTime { get; set; }
        public int CloseTime { get; set; }

        public virtual Location Location { get; set; }
    }
}
