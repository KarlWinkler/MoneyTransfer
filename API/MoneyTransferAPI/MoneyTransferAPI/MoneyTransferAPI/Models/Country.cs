using System;
using System.Collections.Generic;

namespace MoneyTransferAPI.Models
{
    public partial class Country
    {
        public Country()
        {
            Fees = new HashSet<Fee>();
            Locations = new HashSet<Location>();
        }

        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int CurrencyId { get; set; }

        public virtual Currency Currency { get; set; }
        public virtual ICollection<Fee> Fees { get; set; }
        public virtual ICollection<Location> Locations { get; set; }
    }
}
