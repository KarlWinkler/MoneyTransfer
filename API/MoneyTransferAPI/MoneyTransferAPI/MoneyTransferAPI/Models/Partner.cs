using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Partner
    {
        public Partner()
        {
            Locations = new HashSet<Location>();
        }

        public int AccountId { get; set; }

        public virtual ICollection<Location> Locations { get; set; }
    }
}
