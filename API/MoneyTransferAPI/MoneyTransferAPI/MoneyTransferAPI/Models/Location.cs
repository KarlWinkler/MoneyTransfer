using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Location
    {
        public Location()
        {
            Hours = new HashSet<Hour>();
        }

        public int LocationId { get; set; }
        public int AccountId { get; set; }
        public string PhoneNo { get; set; }
        public string City { get; set; }
        public int CountryId { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }

        public virtual Partner Account { get; set; }
        public virtual Country Country { get; set; }
        public virtual ICollection<Hour> Hours { get; set; }
    }
}
